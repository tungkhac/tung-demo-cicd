// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const get = require("lodash/get");
const groupBy = require("lodash/groupBy");
const isArray = require("lodash/isArray");

const { PuppeteerException } = require("../../model");

const isNotEmptyString = (str) =>
  str && typeof str === "string" && str.length > 0;

const getGender = (gender) => {
  return gender == 1 || gender == 2 ? gender : undefined;
};

const parseJSONString = (str, defaultValue) => {
  try {
    if (isNotEmptyString(str)) {
      return JSON.parse(str);
    }
  } catch (error) {}
  return defaultValue;
};

const getBirthday = (birthday) => {
  if (isNotEmptyString(birthday)) {
    const date = birthday.trim().replace(/\//g, "-");
    if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return date;
    }
  }
  return undefined;
};

const formatDate = (date) => {
  const convertedDate = new Date(date);
  let month = "" + (convertedDate.getMonth() + 1);
  let day = "" + convertedDate.getDate();
  const year = convertedDate.getFullYear();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return [year, month, day].join("-");
};

const getTrueValue = (val) => {
  try {
    if (val) {
      const val2String = val.toString().trim().toLowerCase();
      if (val2String === "true" || val2String === "1") return true;
    }
  } catch (err) {}
  return undefined;
};

const isObject = (object) => object && typeof object === "object";

const getFrequencyId = (body) => {
  if (isObject(body)) {
    const { regular_course_id, frequency_id, distribution_courses_ids } = body;
    if ((regular_course_id || distribution_courses_ids) && frequency_id)
      return frequency_id;
  }
};

const getProductGroups = (product_id, groups) => {
  if (!product_id || !groups) return;
  const productGroups = get(groups, product_id) || undefined;
  if (!isArray(productGroups)) return;
  let i = 0;
  for (i = 0; i < productGroups.length; i++) {
    const variants = productGroups[i].variants;
    if (isArray(variants)) {
      productGroups[i].variants = variants.filter((v) => v.quantity != 0);
    }
  }

  return productGroups;
};

const getSetProductsOrderItems = (
  set_products_ids,
  temporary_id,
  quantity,
  groups
) => {
  const products = [];
  const ids = set_products_ids.toString().trim().split(",");
  const quantities = quantity.toString().trim().split(",");
  if (isArray(ids) && isArray(quantities) && ids.length === quantities.length) {
    for (let i = 0; i < ids.length; i++) {
      products.push({
        id: ids[i],
        temporary_id,
        quantity: quantities[i],
        variant_id: 0,
        groups: getProductGroups(ids[i], groups),
      });
    }
  }
  return products;
};

const getOrderItems = (body) => {
  const {
    product_id,
    temporary_id,
    quantity,
    variant_id,
    regular_course_id,
    distribution_courses_ids,
    set_products_ids,
  } = body;
  const dump_variant_id = 0;
  const groups = parseJSONString(get(body, "groups_with_quantities"), {});
  if (regular_course_id && isNotEmptyString(`${regular_course_id}`)) {
    return {
      regular_courses: [
        {
          id: regular_course_id,
          quantity,
          products: [
            {
              id: product_id,
              variant_id,
            },
          ],
        },
      ],
    };
  }
  if (distribution_courses_ids) {
    const distribution_courses = [];
    const ids = distribution_courses_ids.toString().trim().split(",");
    const quantities = (quantity || "").toString().trim().split(",");
    if (
      isArray(ids) &&
      isArray(quantities) &&
      ids.length === quantities.length
    ) {
      for (let i = 0; i < ids.length; i++) {
        distribution_courses.push({
          id: ids[i],
          quantity: quantities[i],
        });
      }
    }
    return { distribution_courses };
  }
  if (set_products_ids) {
    const setProductsOrderItems = getSetProductsOrderItems(
      set_products_ids,
      temporary_id,
      quantity,
      groups
    );
    return { products: setProductsOrderItems };
  }
  const products = [];
  const ids = product_id.toString().trim().split(",");
  const quantities = quantity.toString().trim().split(",");
  const variants = variant_id.toString().trim().split(",");
  if (
    isArray(ids) &&
    isArray(quantities) &&
    isArray(variants) &&
    ids.length === quantities.length &&
    ids.length === variants.length
  ) {
    for (let i = 0; i < ids.length; i++) {
      products.push({
        id: ids[i],
        temporary_id,
        quantity: quantities[i],
        variant_id: variants[i],
      });
    }
  }
  return { products };
};

const logException = (
  requestBody,
  error,
  param = undefined,
  status = 3,
  index = 0
) => {
  if (isObject(requestBody)) {
    new PuppeteerException({
      cpid: requestBody.cpid,
      user_id: requestBody.user_id,
      status,
      error_message: error,
      index,
      request_body: {
        ...requestBody,
        request_url: undefined,
        client_id: undefined,
        client_secret: undefined,
        password: undefined,
        email: undefined,
        tel: undefined,
      },
      param,
    }).save((err) => {});
  }
};

const jpSplash = "／";
const jpNotSpecified = "指定なし";

const appendWithSlash = (toString, fromString) => {
  if (isNotEmptyString(toString)) {
    return `${toString}${jpSplash}${fromString}`;
  }
  return fromString;
};

const getFrequenciesFromResponse = (response) => {
  const frequencies = get(response, "data.frequencies");
  const data = [];
  if (isArray(frequencies)) {
    const groups = groupBy(frequencies, "period_kind");
    let groupedFrequencies = [];
    ["daily", "weekly", "monthly"].forEach((period_kind) => {
      if (isArray(groups[period_kind])) {
        groupedFrequencies = groupedFrequencies.concat(
          groups[period_kind].sort((f1, f2) => {
            return f1.id - f2.id;
          })
        );
      }
    });
    groupedFrequencies.forEach((frequency) => {
      const value = get(frequency, "id");
      let text = "";
      [
        "month_or_week_or_day_period",
        "week_period",
        "date_or_week_day_period",
      ].forEach((key) => {
        const name = get(frequency, `${key}.name`);
        if (isNotEmptyString(name)) {
          text = appendWithSlash(text, name);
        }
      });
      const period_kind = get(frequency, "period_kind");
      if (
        ("weekly" === period_kind || "monthly" === period_kind) &&
        text.indexOf(jpSplash) < 0
      ) {
        text = appendWithSlash(text, jpNotSpecified);
      }
      if (value && isNotEmptyString(text)) {
        data.push({ value, text });
      }
    });
  }
  return data;
};

const getVariantsFromResponse = (response) => {
  const products = get(response, "data.products");
  const data = [];
  if (isArray(products)) {
    products.forEach((product) => {
      const value = get(product, "variant.id");
      let text = "";
      const types = get(product, "variant.option_types_and_values");
      if (isArray(types)) {
        types.forEach((type) => {
          text = `${get(type, "option_type.name", "")}: ${get(
            type,
            "option_value.name",
            ""
          )}`;
        });
      }
      if (value && isNotEmptyString(text)) {
        data.push({ value, text });
      }
    });
  }
  return data;
};

const productVariantsFromResponse = (ids, response) => {
  let variant_id = undefined;
  const _ids = ids.trim().split(",");
  const products = get(response.data, "products");
  if (isArray(products) && isArray(_ids) && _ids.length > 0) {
    if (_ids.length === 1) {
      variant_id = get(response.data, "products[0].variants[0].id");
    } else {
      const variantIds = {};
      products.forEach((product) => {
        if (get(product, "id") && get(product, "variants[0].id")) {
          variantIds[get(product, "id")] = get(product, "variants[0].id");
        }
      });
      variant_id = [];
      _ids.forEach((id) => {
        // console.log("==> id: ", id);
        if (get(variantIds, id) && variant_id) {
          variant_id.push({
            value: get(variantIds, id),
            text: get(variantIds, id),
          });
        } else {
          variant_id = undefined;
        }
      });
    }
  }
  return variant_id;
};

const getCustomerDetailFromResponse = (response, user_login_id, user_token) => {
  return {
    login_flag: 1,
    user_token: user_token,
    user_login_id: user_login_id,
    user_uid: get(response.data, "uid"),
    point_balance: get(response.data, "available_point"),
    point_expiration_date: get(response.data, "point_scheduled_expired_on"),
    is_campaign_accepted:
      get(response.data, "is_campaign_accepted") == true ? 1 : 0,
    rank_name: get(response.data, "rank.name", ""),
    customer_name: get(
      get(response.data, "user_addresses").find((adr) => adr.is_default),
      "name"
    ),
  };
};

const getOrderItemsName = (course) => {
  const items = get(course, "course_order_items", []);
  if (!Array.isArray(items)) return "";
  return items
    .filter((item) => item.name)
    .map((item) => item.name)
    .join(", ");
};

const getRegularCourseListFromResponse = (response) => {
  const courseOrders = get(response.data, "course_orders");
  if (!isArray(courseOrders)) return [];
  return courseOrders
    .filter((course) => course.status == 1)
    .map((course) => ({
      value: get(course, "id"),
      text: `${getOrderItemsName(
        course
      )}<br><span style="font-size: 12px;">お届け頻度: ${get(
        course.frequency,
        "text"
      )}</span> 
      <br> <span style="font-size: 12px;"> 次回お届け予定日: ${get(
        course,
        "next_scheduled_delivery_on"
      )}　</span>`,
    }));
};

const getProductCategory = (courseCode, categories) => {
  if (!categories || categories.length == 0) return "その他";
  const category = categories[0];
  const propertyNames = Object.getOwnPropertyNames(category);
  for (let i = 0; i < propertyNames.length; i++) {
    if (courseCode.includes(propertyNames[i])) {
      return category[propertyNames[i]];
    }
  }
  return "その他";
};

const getPossibleEcoPeriodic = (productCode, ecoRegulars) => {
  if (!ecoRegulars || ecoRegulars.length == 0) return 0;
  for (let i = 0; i < ecoRegulars.length; i++) {
    if (productCode.includes(ecoRegulars[i])) {
      return 1;
    }
  }
  return 0;
};

const getRegularCourseDetailFromResponse = (
  response,
  categories,
  ecoRegulars,
  tags
) => {
  const countOfPeriodic = get(response.data, "latest_continuation_times");
  const shopShippingMethod = get(response.data, "shop_shipping_method");
  const courseOrderItems = get(response.data, "course_order_items");
  const courseCode = get(courseOrderItems, "[0].course_code", "");
  const nextDeliveryOn = get(response.data, "next_scheduled_delivery_on");
  const tagsSet = get(response.data, "tags", []);

  let delivery_within_7_days = 0;
  try {
    delivery_within_7_days =
      Date.parse(nextDeliveryOn) - Date.now() < 7 * 24 * 3600 * 1000 ? 1 : 0;
  } catch (error) {
    delivery_within_7_days = 0;
  }

  const tagsFlg = {};
  if (Array.isArray(tags)) {
    tags.forEach((t) => {
      tagsFlg[`is_set_${t}`] = tagsSet.find((ts) => ts.name === t) ? 1 : 0;
    });
  }

  return {
    course_id: get(courseOrderItems, "[0].course_id", ""),
    uid: get(response.data, "uid", ""),
    course_code: courseCode,
    course_name: get(courseOrderItems, "[0].name", ""),
    product_name: get(courseOrderItems, "[0].product_name", ""),
    product_category: getProductCategory(courseCode, categories),
    count_of_periodic: countOfPeriodic,
    count_periodic_from_5_times_flag: countOfPeriodic < 5 ? 0 : 1,
    possible_eco_periodic: getPossibleEcoPeriodic(courseCode, ecoRegulars),
    continue_use_point_flag: get(
      response.data,
      "is_use_point_as_much_as_available"
    )
      ? 1
      : 0,
    can_set_delivery_date_flag: get(
      shopShippingMethod,
      "is_scheduled_delivery_on_available"
    )
      ? 1
      : 0,
    can_set_delivery_time_flag: get(
      shopShippingMethod,
      "is_time_zone_available"
    )
      ? 1
      : 0,
    delivery_within_7_days,
    num_of_courses: get(courseOrderItems, "length", 0),
    ...tagsFlg,
  };
};

const getPeriodicListFromResponse = (response, periodicType) => {
  let frequencies = get(response, "data.frequencies");
  const data = [];
  if (isArray(frequencies)) {
    switch (periodicType) {
      case "monthly": {
        frequencies = frequencies.filter((frequency) => {
          return (
            frequency.period_kind == "monthly" &&
            frequency.indicator_kind == "normal"
          );
        });
        break;
      }
      case "monthly_weekday": {
        frequencies = frequencies.filter((frequency) => {
          return (
            frequency.period_kind == "monthly" &&
            frequency.indicator_kind == "the_week_day"
          );
        });
        break;
      }
      case "daily": {
        frequencies = frequencies.filter((frequency) => {
          return (
            frequency.period_kind == "daily" &&
            frequency.indicator_kind == "normal"
          );
        });
        break;
      }
    }
    const groups = groupBy(frequencies, "period_kind");
    let groupedFrequencies = [];
    ["daily", "weekly", "monthly"].forEach((period_kind) => {
      if (isArray(groups[period_kind])) {
        groupedFrequencies = groupedFrequencies.concat(
          groups[period_kind].sort((f1, f2) => {
            return f1.id - f2.id;
          })
        );
      }
    });
    groupedFrequencies.forEach((frequency) => {
      const value = get(frequency, "id");
      let text = "";
      [
        "month_or_week_or_day_period",
        "week_period",
        "date_or_week_day_period",
      ].forEach((key) => {
        const name = get(frequency, `${key}.name`);
        if (isNotEmptyString(name)) {
          text = appendWithSlash(text, name);
        }
      });
      const periodKind = get(frequency, "period_kind");
      if (
        ("weekly" === periodKind || "monthly" === periodKind) &&
        text.indexOf(jpSplash) < 0
      ) {
        text = appendWithSlash(text, jpNotSpecified);
      }
      if (value && isNotEmptyString(text)) {
        data.push({ value, text });
      }
    });
  }
  if (data.length > 0) {
    data.sort((f1, f2) => {
      if (f1.text.length != f2.text.length) {
        return f1.text.length - f2.text.length;
      } else {
        const dayJP = [
          "日曜日",
          "月曜日",
          "火曜日",
          "水曜日",
          "木曜日",
          "金曜日",
          "土曜日",
        ];
        const d1 = dayJP.find((day) => {
          if (f1.text.includes(day)) return day;
        });
        const d2 = dayJP.find((day) => {
          if (f2.text.includes(day)) return day;
        });
        if (
          !(
            d1 &&
            d2 &&
            f1.text.indexOf(d1) == f2.text.indexOf(d2) &&
            f1.text.replace(d1, "") == f2.text.replace(d2, "")
          )
        ) {
          return f1.text.localeCompare(f2.text, "ja", { numeric: true });
        } else return dayJP.indexOf(d1) - dayJP.indexOf(d2);
      }
    });
  }
  return data;
};

const getCourseConditionFromResponse = (response, countOfPeriodic) => {
  const min_continuation = get(response, "data.min_continuation_times", 0);
  return {
    min_continuation,
    unable_to_stop: (min_continuation > countOfPeriodic ? 1 : 0),
  }
};

const getUpdatedRegularCourseData = (body) => {
  const {
    next_preferred_delivery_time_zone_id,
    next_scheduled_delivery_on,
    frequency_id,
    continue_use_point_flag,
    is_send_mail,
  } = body;
  const course_order = {
    frequency_id: frequency_id,
    next_preferred_delivery_time_zone_id: next_preferred_delivery_time_zone_id
      ? next_preferred_delivery_time_zone_id
      : undefined,
    next_scheduled_delivery_on: next_scheduled_delivery_on
      ? next_scheduled_delivery_on
      : undefined,
    is_use_point_as_much_as_available: continue_use_point_flag
      ? continue_use_point_flag == 1
        ? true
        : false
      : undefined,
    is_send_mail: getTrueValue(is_send_mail),
  };
  return { course_order };
};

const getStopRegularCourseData = (body) => {
  const pause_reasons = [];
  const reasonMasterData = JSON.parse(
    get(body, "定期停止理由_優先1_master_data")
  );
  const reasons = get(body, "reason_for_regular_suspension_priority_1").split(
    ","
  );
  if (Array.isArray(reasons) && reasons.length > 0) {
    reasonMasterData.forEach((reason) => {
      if (reasons.includes(reason.code)) {
        pause_reasons.push({ id: reason.id, name: reason.name });
      }
    });
  }
  return {
    course_order: {
      status: 2,
      pause_reasons,
      is_send_mail: getTrueValue(get(body, "is_send_mail")),
    },
  };
};

const getTimeZoneListFromResponse = (response) => {
  const shopShippingMethod = get(response.data, "shop_shipping_method");
  const timeZones = get(
    shopShippingMethod,
    "preferred_delivery_time_zone_options"
  );
  if (!isArray(timeZones)) return [];
  return timeZones.map((timeZone) => ({
    value: timeZone.id,
    text: timeZone.time_zone,
  }));
};

const uniqBy = (array, key) => {
  const seen = {};
  return array.filter((item) => {
    const k = key(item);
    return seen.hasOwnProperty(k) ? false : (seen[k] = true);
  });
};

const isInt = (value) => {
  return (
    !isNaN(value) &&
    parseInt(Number(value)) == value &&
    !isNaN(parseInt(value, 10))
  );
};

const toInt = (value) => {
  if (isInt(value)) {
    return parseInt(Number(value));
  }
};

module.exports = {
  isObject,
  getGender,
  getBirthday,
  getFrequencyId,
  getOrderItems,
  logException,
  isNotEmptyString,
  uniqBy,
  getFrequenciesFromResponse,
  getVariantsFromResponse,
  productVariantsFromResponse,
  getTrueValue,
  getCustomerDetailFromResponse,
  getProductCategory,
  getPossibleEcoPeriodic,
  getRegularCourseListFromResponse,
  getRegularCourseDetailFromResponse,
  getUpdatedRegularCourseData,
  getStopRegularCourseData,
  getPeriodicListFromResponse,
  getTimeZoneListFromResponse,
  getCourseConditionFromResponse,
  getOrderItemsName,
  parseJSONString,
  getProductGroups,
  toInt,
};
