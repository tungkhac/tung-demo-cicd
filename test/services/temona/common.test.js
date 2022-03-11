// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
describe("temona/common", () => {
  test("getGender", async () => {
    jest.doMock("../../../model", () => {
      return {};
    });
    const { getGender } = require("../../../services/temona/common");

    expect(getGender()).toEqual(undefined);
    expect(getGender(1)).toEqual(1);
    expect(getGender(2)).toEqual(2);
    expect(getGender("1")).toEqual("1");
    expect(getGender("2")).toEqual("2");
    expect(getGender("test")).toEqual(undefined);
  });

  test("getBirthday", async () => {
    jest.doMock("../../../model", () => {
      return {};
    });
    const { getBirthday } = require("../../../services/temona/common");

    expect(getBirthday()).toEqual(undefined);
    expect(getBirthday(1)).toEqual(undefined);
    expect(getBirthday("2020/01/01")).toEqual("2020-01-01");
    expect(getBirthday("abcd/01/01")).toEqual(undefined);
    expect(getBirthday("abcd-01-01")).toEqual(undefined);

    expect(getBirthday("2020-01-01")).toEqual("2020-01-01");
    expect(getBirthday(" 2020-01-01")).toEqual("2020-01-01");
    expect(getBirthday("test")).toEqual(undefined);
  });

  test("getFrequencyId", async () => {
    jest.doMock("../../../model", () => {
      return {};
    });
    const { getFrequencyId } = require("../../../services/temona/common");

    expect(getFrequencyId()).toEqual(undefined);
    expect(getFrequencyId({ regular_course_id: "test" })).toEqual(undefined);
    expect(
      getFrequencyId({ regular_course_id: "test", frequency_id: "test" })
    ).toEqual("test");
    expect(
      getFrequencyId({ distribution_courses_ids: "test", frequency_id: "test" })
    ).toEqual("test");
    expect(getFrequencyId({ frequency_id: "test" })).toEqual(undefined);
  });

  test("getOrderItems", async () => {
    jest.doMock("../../../model", () => {
      return {};
    });
    const { getOrderItems } = require("../../../services/temona/common");
    expect(
      getOrderItems({
        regular_course_id: "test",
        quantity: "1",
        product_id: "product_id",
        variant_id: "variant_id",
      })
    ).toEqual({
      regular_courses: [
        {
          id: "test",
          products: [{ id: "product_id", variant_id: "variant_id" }],
          quantity: "1",
        },
      ],
    });
    expect(
      getOrderItems({
        distribution_courses_ids: "test",
        quantity: "1",
      })
    ).toEqual({ distribution_courses: [{ id: "test", quantity: "1" }] });
    expect(
      getOrderItems({
        distribution_courses_ids: "test,test2",
      })
    ).toEqual({ distribution_courses: [] });
    expect(
      getOrderItems({
        temporary_id: "test",
        product_id: "1,2",
        quantity: "1,2",
        variant_id: "1,2",
      })
    ).toEqual({
      products: [
        {
          id: "1",
          quantity: "1",
          temporary_id: "test",
          variant_id: "1",
        },
        {
          id: "2",
          quantity: "2",
          temporary_id: "test",
          variant_id: "2",
        },
      ],
    });
    expect(
      getOrderItems({
        temporary_id: "test",
        product_id: "1,2",
        quantity: "1",
        variant_id: "",
      })
    ).toEqual({
      products: [],
    });
    expect(
      getOrderItems({
        temporary_id: "test",
        set_products_ids: "test",
        quantity: "1",
        variant_id: "",
      })
    ).toEqual({
      products: [
        { id: "test", quantity: "1", temporary_id: "test", variant_id: 0 },
      ],
    });
    expect(
      getOrderItems({
        temporary_id: "test",
        set_products_ids: "test,test",
        quantity: "0",
      })
    ).toEqual({
      products: [],
    });
  });

  test("getFrequenciesFromResponse", async () => {
    jest.doMock("../../../model", () => {
      return {};
    });
    const {
      getFrequenciesFromResponse,
    } = require("../../../services/temona/common");
    expect(getFrequenciesFromResponse({})).toEqual([]);
    expect(
      getFrequenciesFromResponse({
        data: {
          frequencies: [
            {
              id: 1,
              period_kind: "monthly",
              month_or_week_or_day_period: {
                id: 1,
                name: "1ヶ月ごと",
              },
              week_period: null,
              date_or_week_day_period: {
                id: "test1",
                name: "1日",
              },
            },
            {
              id: 2,
              period_kind: "monthly",
              month_or_week_or_day_period: {
                id: 2,
                name: "2ヶ月ごと",
              },
              week_period: null,
            },
            {
              id: "",
              period_kind: "monthly",
              month_or_week_or_day_period: {
                id: 3,
                name: "1ヶ月ごと",
              },
              week_period: null,
            },
          ],
        },
      })
    ).toEqual([
      { text: "1ヶ月ごと／1日", value: 1 },
      { text: "2ヶ月ごと／指定なし", value: 2 },
    ]);
  });

  test("getVariantsFromResponse", async () => {
    jest.doMock("../../../model", () => {
      return {};
    });
    const {
      getVariantsFromResponse,
    } = require("../../../services/temona/common");
    expect(getVariantsFromResponse({})).toEqual([]);
    expect(
      getVariantsFromResponse({
        data: {
          products: [
            {
              variant: {
                id: "id",
              },
            },
            {
              variant: {
                id: "id2",
                option_types_and_values: [
                  {
                    option_type: {
                      name: "test",
                    },
                    option_value: {
                      name: "test",
                    },
                  },
                ],
              },
            },
          ],
        },
      })
    ).toEqual([{ text: "test: test", value: "id2" }]);
  });

  test("productVariantsFromResponse", async () => {
    jest.doMock("../../../model", () => {
      return {};
    });
    const {
      productVariantsFromResponse,
    } = require("../../../services/temona/common");
    expect(productVariantsFromResponse("1,2", {})).toEqual(undefined);
    expect(
      productVariantsFromResponse("1,2", { data: { products: [] } })
    ).toEqual(undefined);
    expect(
      productVariantsFromResponse("1", {
        data: { products: [{ variants: [{ id: "test" }] }] },
      })
    ).toEqual("test");
    expect(
      productVariantsFromResponse("1,2", {
        data: {
          products: [
            { id: "1", variants: [{ id: "1" }] },
            { id: "2", variants: [{ id: "2" }] },
            {},
          ],
        },
      })
    ).toEqual([
      { text: "1", value: "1" },
      { text: "2", value: "2" },
    ]);
  });

  test("uniqBy", async () => {
    jest.doMock("../../../model", () => {
      return {};
    });
    const { uniqBy } = require("../../../services/temona/common");
    expect(uniqBy([1, 2, 3, 4, 1], (item) => item)).toEqual([1, 2, 3, 4]);
  });

  test("getTrueValue", async () => {
    jest.doMock("../../../model", () => {
      return {};
    });
    const { getTrueValue } = require("../../../services/temona/common");
    expect(getTrueValue()).toEqual(undefined);
    expect(getTrueValue(1)).toEqual(true);
    expect(getTrueValue("1")).toEqual(true);
    expect(getTrueValue(" 1")).toEqual(true);
    expect(getTrueValue("true")).toEqual(true);
    expect(getTrueValue("TRUe")).toEqual(true);
    expect(getTrueValue("false")).toEqual(undefined);
    expect(getTrueValue("0")).toEqual(undefined);
  });

  test("getCustomerDetailFromResponse", async () => {
    const {
      getCustomerDetailFromResponse,
    } = require("../../../services/temona/common");
    expect(
      getCustomerDetailFromResponse({
        data: {
          uid: "test",
          available_point: "test",
          point_scheduled_expired_on: "test",
          is_campaign_accepted: false,
          rank: {
            name: "test",
          },
          user_addresses: [{ name: "test", is_default: true }],
        },
      })
    ).toEqual({
      login_flag: 1,
      user_token: undefined,
      user_login_id: undefined,
      user_uid: "test",
      point_balance: "test",
      point_expiration_date: "test",
      is_campaign_accepted: 0,
      rank_name: "test",
      customer_name: "test",
    });
    expect(
      getCustomerDetailFromResponse(
        {
          data: {
            uid: "test",
            available_point: "test",
            point_scheduled_expired_on: "test",
            is_campaign_accepted: false,
            rank: {
              name: "test",
            },
            user_addresses: [{ name: "test", is_default: true }],
          },
        },
        "test",
        "test"
      )
    ).toEqual({
      login_flag: 1,
      user_token: "test",
      user_login_id: "test",
      user_uid: "test",
      point_balance: "test",
      point_expiration_date: "test",
      is_campaign_accepted: 0,
      rank_name: "test",
      customer_name: "test",
    });
  });

  test("getProductCategory", async () => {
    const { getProductCategory } = require("../../../services/temona/common");
    expect(getProductCategory("test")).toEqual("その他");
    expect(getProductCategory("test", "test")).toEqual("その他");
    expect(getProductCategory("test", ["test"])).toEqual("その他");
    expect(getProductCategory("test", [{ test: "test" }])).toEqual("test");
    expect(getProductCategory("test1", [{ test: "test" }])).toEqual("test");
  });

  test("getPossibleEcoPeriodic", async () => {
    const {
      getPossibleEcoPeriodic,
    } = require("../../../services/temona/common");
    expect(getPossibleEcoPeriodic("test")).toEqual(0);
    expect(getPossibleEcoPeriodic("test", "test")).toEqual(1);
    expect(getPossibleEcoPeriodic("test", [])).toEqual(0);
    expect(getPossibleEcoPeriodic("test", ["test"])).toEqual(1);
    expect(getPossibleEcoPeriodic("test1", ["test"])).toEqual(1);
  });

  test("getRegularCourseListFromResponse", async () => {
    const {
      getRegularCourseListFromResponse,
    } = require("../../../services/temona/common");
    expect(getRegularCourseListFromResponse({})).toEqual([]);
    expect(
      getRegularCourseListFromResponse({
        data: {
          course_orders: [
            {
              id: 1,
              status: 2,
              course_order_items: [
                {
                  name: "test",
                },
              ],
              frequency: {
                text: "test",
              },
              next_scheduled_delivery_on: "test",
            },
          ],
        },
      })
    ).toEqual([]);
    expect(
      getRegularCourseListFromResponse({
        data: {
          course_orders: [
            {
              id: 1,
              status: 1,
              course_order_items: [
                {
                  name: "test",
                },
                {
                  name: "test1",
                },
              ],
              frequency: {
                text: "test",
              },
              next_scheduled_delivery_on: "test",
            },
          ],
        },
      })
    ).toEqual([
      {
        value: 1,
        text: `test, test1<br><span style=\"font-size: 12px;\">お届け頻度: test</span> 
      <br> <span style=\"font-size: 12px;\"> 次回お届け予定日: test　</span>`,
      },
    ]);
  });

  test("getRegularCourseDetailFromResponse", async () => {
    const {
      getRegularCourseDetailFromResponse,
    } = require("../../../services/temona/common");
    expect(
      getRegularCourseDetailFromResponse(
        {
          data: {
            uid: "test",
            latest_continuation_times: 3,
            shop_shipping_method: {
              is_scheduled_delivery_on_available: true,
              is_time_zone_available: true,
            },
            course_order_items: [
              {
                course_id: "test",
                name: "test",
                product_name: "test",
                course_code: "test",
              },
            ],
            next_scheduled_delivery_on: new Date(),
            is_use_point_as_much_as_available: true,
          },
        },
        [],
        [],
        []
      )
    ).toEqual({
      course_id: "test",
      uid: "test",
      course_code: "test",
      course_name: "test",
      product_name: "test",
      product_category: "その他",
      count_of_periodic: 3,
      count_periodic_from_5_times_flag: 0,
      possible_eco_periodic: 0,
      continue_use_point_flag: 1,
      can_set_delivery_date_flag: 1,
      can_set_delivery_time_flag: 1,
      delivery_within_7_days: 1,
      num_of_courses: 1,
    });
    expect(
      getRegularCourseDetailFromResponse(
        {
          data: {
            uid: "test",
            latest_continuation_times: 5,
            shop_shipping_method: {
              is_scheduled_delivery_on_available: true,
              is_time_zone_available: true,
            },
            course_order_items: [
              {
                course_id: "test",
                name: "test",
                product_name: "test",
                course_code: "test",
              },
            ],
            next_scheduled_delivery_on: new Date(),
            is_use_point_as_much_as_available: true,
            tags: [
              {
                id: 100,
                name: "test",
              }
            ],
          },
        },
        [
          {
            test: "test",
          },
        ],
        ["test"],
        ["test", "test2"]
      )
    ).toEqual({
      course_id: "test",
      uid: "test",
      course_code: "test",
      course_name: "test",
      product_name: "test",
      product_category: "test",
      count_of_periodic: 5,
      count_periodic_from_5_times_flag: 1,
      possible_eco_periodic: 1,
      continue_use_point_flag: 1,
      can_set_delivery_date_flag: 1,
      can_set_delivery_time_flag: 1,
      delivery_within_7_days: 1,
      num_of_courses: 1,
      is_set_test: 1,
      is_set_test2: 0,
    });
  });

  test("getStopRegularCourseData", async () => {
    //test getStopRegularCourseData function
  });

  test("getUpdateRegularCourseData", async () => {
    const {
      getUpdatedRegularCourseData,
    } = require("../../../services/temona/common");
    expect(
      getUpdatedRegularCourseData({
        frequency_id: "test",
        continue_use_point_flag: 0,
        is_send_mail: 1,
      })
    ).toEqual({
      course_order: {
        frequency_id: "test",
        next_preferred_delivery_time_zone_id: undefined,
        next_scheduled_delivery_on: undefined,
        is_use_point_as_much_as_available: undefined,
        is_send_mail: true,
      },
    });
    expect(
      getUpdatedRegularCourseData({
        next_preferred_delivery_time_zone_id: "test",
        next_scheduled_delivery_on: "test",
        frequency_id: "test",
        continue_use_point_flag: 1,
        is_send_mail: 1,
      })
    ).toEqual({
      course_order: {
        frequency_id: "test",
        next_preferred_delivery_time_zone_id: "test",
        next_scheduled_delivery_on: "test",
        is_use_point_as_much_as_available: true,
        is_send_mail: true,
      },
    });
  });

  test("getPeriodicListFromResponse", async () => {
    const {
      getPeriodicListFromResponse,
    } = require("../../../services/temona/common");
    expect(getPeriodicListFromResponse({})).toEqual([]);
    expect(
      getPeriodicListFromResponse({
        data: {
          frequencies: [
            {
              id: 1,
              period_kind: "monthly",
              indicator_kind: "normal",
              month_or_week_or_day_period: {
                id: 1,
                name: "1ヶ月ごと",
              },
              week_period: null,
              date_or_week_day_period: {
                id: "test1",
                name: "1日",
              },
            },
            {
              id: 2,
              period_kind: "monthly",
              indicator_kind: "the_week_day",
              month_or_week_or_day_period: {
                id: 2,
                name: "2ヶ月ごと",
              },
              week_period: null,
            },
            {
              id: "",
              period_kind: "daily",
              indicator_kind: "normal",
              month_or_week_or_day_period: {
                id: 3,
                name: "1ヶ月ごと",
              },
              week_period: null,
            },
          ],
        },
      })
    ).toEqual([
      { text: "1ヶ月ごと／1日", value: 1 },
      { text: "2ヶ月ごと／指定なし", value: 2 },
    ]);
    expect(
      getPeriodicListFromResponse({
        data: {
          frequencies: [
            {
              id: 1,
              period_kind: "monthly",
              indicator_kind: "normal",
              month_or_week_or_day_period: {
                id: 1,
                name: "1ヶ月ごと",
              },
              week_period: null,
              date_or_week_day_period: {
                id: "test",
                name: "1日",
              },
            },
            {
              id: 2,
              period_kind: "monthly",
              indicator_kind: "normal",
              month_or_week_or_day_period: {
                id: 2,
                name: "2ヶ月ごと",
              },
              week_period: null,
              date_or_week_day_period: {
                id: "test1",
                name: "1日",
              },
            },
            {
              id: "",
              period_kind: "daily",
              indicator_kind: "normal",
              month_or_week_or_day_period: {
                id: 3,
                name: "1ヶ月ごと",
              },
              week_period: null,
            },
          ],
        },
      })
    ).toEqual([
      { text: "1ヶ月ごと／1日", value: 1 },
      { text: "2ヶ月ごと／1日", value: 2 },
    ]);
    expect(
      getPeriodicListFromResponse(
        {
          data: {
            frequencies: [
              {
                id: 1,
                period_kind: "monthly",
                indicator_kind: "normal",
                month_or_week_or_day_period: {
                  id: 1,
                  name: "1ヶ月ごと",
                },
                week_period: null,
                date_or_week_day_period: {
                  id: "test1",
                  name: "1日",
                },
              },
              {
                id: 2,
                period_kind: "monthly",
                indicator_kind: "the_week_day",
                month_or_week_or_day_period: {
                  id: 2,
                  name: "2ヶ月ごと",
                },
                week_period: null,
              },
              {
                id: "",
                period_kind: "daily",
                indicator_kind: "normal",
                month_or_week_or_day_period: {
                  id: 3,
                  name: "1ヶ月ごと",
                },
                week_period: null,
              },
            ],
          },
        },
        "monthly"
      )
    ).toEqual([{ text: "1ヶ月ごと／1日", value: 1 }]);

    expect(
      getPeriodicListFromResponse(
        {
          data: {
            frequencies: [
              {
                id: 1,
                period_kind: "monthly",
                indicator_kind: "the_week_day",
                month_or_week_or_day_period: {
                  id: 1,
                  name: "1ヶ月ごと",
                },
                week_period: {
                  id: 10,
                  name: "第3週",
                },
                date_or_week_day_period: {
                  id: "test1",
                  name: "火曜日",
                },
              },
              {
                id: 2,
                period_kind: "monthly",
                indicator_kind: "the_week_day",
                month_or_week_or_day_period: {
                  id: 2,
                  name: "1ヶ月ごと",
                },
                week_period: {
                  id: 10,
                  name: "第3週",
                },
                date_or_week_day_period: {
                  id: "test1",
                  name: "月曜日",
                },
              },
              {
                id: 3,
                period_kind: "daily",
                indicator_kind: "the_week_day",
                month_or_week_or_day_period: {
                  id: 3,
                  name: "1ヶ月ごと",
                },
                week_period: {
                  id: 8,
                  name: "第1週",
                },
                date_or_week_day_period: {
                  id: 2,
                  name: "月曜日",
                },
              },
              {
                id: 4,
                period_kind: "daily",
                indicator_kind: "the_week_day",
                month_or_week_or_day_period: {
                  id: 3,
                  name: "1ヶ月ごと",
                },
                week_period: {
                  id: 8,
                  name: "第1週",
                },
                date_or_week_day_period: {
                  id: 2,
                  name: "火曜日",
                },
              },
            ],
          },
        },
        ""
      )
    ).toEqual([
      { text: "1ヶ月ごと／第1週／月曜日", value: 3 },
      { text: "1ヶ月ごと／第1週／火曜日", value: 4 },
      { text: "1ヶ月ごと／第3週／月曜日", value: 2 },
      { text: "1ヶ月ごと／第3週／火曜日", value: 1 },
    ]);
  });

  test("getTimeZoneListFromResponse", async () => {
    const {
      getTimeZoneListFromResponse,
    } = require("../../../services/temona/common");
    expect(getTimeZoneListFromResponse({})).toEqual([]);
    expect(
      getTimeZoneListFromResponse({
        data: {
          shop_shipping_method: {
            preferred_delivery_time_zone_options: [
              {
                id: 1,
                time_zone: "test",
              },
              {
                id: 2,
                time_zone: "test1",
              },
            ],
          },
        },
      })
    ).toEqual([
      { value: 1, text: "test" },
      { value: 2, text: "test1" },
    ]);
  });

  test("getOrderItemsName", async () => {
    jest.doMock("../../../model", () => {
      return {};
    });
    const { getOrderItemsName } = require("../../../services/temona/common");
    expect(getOrderItemsName()).toEqual("");
    expect(getOrderItemsName({})).toEqual("");
    expect(getOrderItemsName({ course_order_items: "test" })).toEqual("");
    expect(
      getOrderItemsName({
        course_order_items: [{ name: "" }, { name: "test" }],
      })
    ).toEqual("test");
    expect(
      getOrderItemsName({ course_order_items: [{ name: "test" }] })
    ).toEqual("test");
    expect(
      getOrderItemsName({
        course_order_items: [{ name: "test" }, { name: "test" }],
      })
    ).toEqual("test, test");
  });

  test("parseJSONString", async () => {
    jest.doMock("../../../model", () => {
      return {};
    });
    const { parseJSONString } = require("../../../services/temona/common");
    expect(parseJSONString()).toEqual();
    expect(parseJSONString("", {})).toEqual({});
    expect(parseJSONString('{"test":"test"}', {})).toEqual({ test: "test" });
  });

  test("getProductGroups", async () => {
    jest.doMock("../../../model", () => {
      return {};
    });
    const { getProductGroups } = require("../../../services/temona/common");
    expect(getProductGroups()).toEqual();
    expect(getProductGroups("test", {})).toEqual();
    expect(getProductGroups("test", { id: "test" })).toEqual();
    expect(getProductGroups("test", { test: [{ variants: "test" }] })).toEqual([
      { variants: "test" },
    ]);
    expect(getProductGroups("test", { test: [{ variants: [] }] })).toEqual([
      { variants: [] },
    ]);
    expect(
      getProductGroups("test", {
        test: [
          {
            variants: [
              { id: "test", quantity: 0 },
              { id: "test", quantity: 1 },
            ],
          },
        ],
      })
    ).toEqual([{ variants: [{ id: "test", quantity: 1 }] }]);
  });

  test("toInt", async () => {
    jest.doMock("../../../model", () => {
      return {};
    });
    const { toInt } = require("../../../services/temona/common");
    expect(toInt()).toEqual();
    expect(toInt(1)).toEqual(1);
    expect(toInt(0)).toEqual(0);
    expect(toInt("1")).toEqual(1);
  });
});
