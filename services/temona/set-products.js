// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const axios = require("axios");
const { get, isArray } = require("lodash");
const {
  logException,
  parseJSONString,
  isNotEmptyString,
  toInt,
} = require("./common");
const { getToken } = require("./controller");
const {
  httpsAgent,
  responseType,
  headers,
  api,
  defaultErrorMessage,
} = require("./constants");

const Log4js = require("log4js");
const logger = Log4js.getLogger("temona");

const getDetail = async (req, res, next) => {
  try {
    const { id, request_url } = req.body;
    const token = await getToken(req.body);
    if (!token) {
      logException(req.body, "authentication_token expired");
      res.status(500).json({ error_message: "Authentication Token Expired" });
      return;
    }
    axios
      .get(`${request_url}${api.set_products}/${id}`, {
        headers: { ...headers, Authorization: `Bearer ${token}` },
        httpsAgent,
        responseType,
      })
      .then((response) => {
        res.status(200).json(response.data);
      })
      .catch((error) => {
        logException(req.body, error);
        res.status(500).json({ error_message: defaultErrorMessage });
      });
  } catch (err) {
    logException(req.body, err);
    res.status(500).json({ error_message: err });
  }
};

const getProductGroups = (product) => {
  const groups = get(product, "groups");
  const id = get(product, "id");
  if (!id || !isArray(groups) || groups.length < 1) return;
  const formattedGroups = [];
  groups.forEach((group) => {
    const groupId = get(group, "id");
    const variants = get(group, "variants");
    const selection_items_per_group = get(group, "selection_items_per_group");
    if (groupId && isArray(variants) && variants.length > 0) {
      const formattedVariants = [];
      variants.forEach((variant) => {
        if (get(variant, "id")) {
          const variantId = get(variant, "id");
          const foundVariants = formattedVariants.filter(
            (variant) => variant.id == variantId
          );
          if (isArray(foundVariants) && foundVariants.length == 0) {
            formattedVariants.push({ id: variantId });
          }
        }
      });
      formattedGroups.push({
        id: groupId,
        selection_items_per_group,
        variants: formattedVariants,
      });
    }
  });
  return {
    id,
    groups: formattedGroups,
  };
};

const productGroupsFromResponse = (response) => {
  let groups = {};
  const products = get(response.data, "products");
  if (isArray(products) && products.length > 0) {
    products.forEach((product) => {
      const group = getProductGroups(product);
      if (group) groups[group.id] = group.groups;
    });
  }
  return groups;
};

const productGroups = async (req, res, next) => {
  const { cpid, user_id } = req && req.body ? req.body : {};
  logger.info(
    `start /set-products/groups with cpid - userid: ${cpid} - ${user_id}`
  );
  try {
    const { ids, request_url } = req.body;
    const token = await getToken(req.body);
    if (!token) {
      logException(req.body, "authentication_token expired");
      logger.error(
        `end /set-products/groups 500 with cpid - userid: ${cpid} - ${user_id}. Error: Authentication Token Expired`
      );
      res.status(500).json({ error_message: "Authentication Token Expired" });
      return;
    }
    axios
      .get(`${request_url}${api.set_products}`, {
        params: { ids },
        headers: { ...headers, Authorization: `Bearer ${token}` },
        httpsAgent,
        responseType,
      })
      .then((response) => {
        const groups = productGroupsFromResponse(response);
        logger.info(
          `end /set-products/groups 200 with cpid - userid: ${cpid} - ${user_id}`
        );
        res
          .status(200)
          .json({ groups: JSON.stringify(groups), original_groups: groups });
      })
      .catch((error) => {
        logException(req.body, error);
        logger.error(
          `end /set-products/groups 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${defaultErrorMessage}`
        );
        res.status(500).json({ error_message: defaultErrorMessage });
      });
  } catch (err) {
    logException(req.body, err);
    logger.error(
      `end /set-products/groups 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${err}`
    );
    res.status(500).json({ error_message: err });
  }
};

const getGroupsOfProduct = (groups, product_id) => {
  return get(groups, product_id);
};

const stringToArray = (string) => {
  if (isNotEmptyString(string)) {
    string = string.trim();
    return string.split(",");
  }
  return [];
};

const getGroupInGroups = (groups, group_id) => {
  /* istanbul ignore if */
  if (!isArray(groups)) return;
  return groups.find((g) => g.id == group_id);
};

const getTotalQuantity = (groups, group_id) => {
  const group = getGroupInGroups(groups, group_id);
  /* istanbul ignore if */
  if (!group) return 0;
  const variants = get(group, "variants");
  /* istanbul ignore if */
  if (!isArray(variants)) return 0;
  let total = 0;
  variants.forEach((v) => {
    /* istanbul ignore else */
    total += toInt(get(v, "quantity")) || 0;
  });
  return total;
};

const getMaxQuantity = (groups, group_id) => {
  const group = getGroupInGroups(groups, group_id);
  /* istanbul ignore if */
  if (!group) return 0;
  /* istanbul ignore next */
  return toInt(get(group, "selection_items_per_group")) || 0;
};

const setQuantityForVariant = async (req, res, next) => {
  const { cpid, user_id } = req && req.body ? req.body : {};
  logger.info(
    `start /set-products/set-quantity with cpid - userid: ${cpid} - ${user_id}`
  );
  try {
    const { product_id, group_id, variant_id, checking_total } = req.body;
    const cleared_variants = stringToArray(get(req, "body.cleared_variants"));
    const quantity = toInt(get(req, "body.quantity")) || 0;
    const groups_with_quantities = parseJSONString(
      get(req, "body.groups_with_quantities"),
      {}
    );
    const groups = parseJSONString(get(req, "body.groups"), {});
    const productGroups =
      getGroupsOfProduct(groups_with_quantities, product_id, group_id) ||
      getGroupsOfProduct(groups, product_id, group_id);
    if (!productGroups) {
      return res.status(400).json({ error_message: defaultErrorMessage });
    }
    let saved = false;
    let i = 0;
    for (i = 0; i < productGroups.length; i++) {
      /* istanbul ignore else */
      if (group_id == productGroups[i].id) {
        const variants = productGroups[i].variants;
        /* istanbul ignore else */
        if (isArray(variants)) {
          let j = 0;
          for (j = 0; j < variants.length; j++) {
            if (variants[j].id == variant_id) {
              productGroups[i].variants[j].quantity = quantity;
            } else {
              cleared_variants.forEach((id) => {
                if (id == variants[j].id) {
                  productGroups[i].variants[j].quantity = 0;
                }
              });
            }
          }
        }
      }
    }
    const total = getTotalQuantity(productGroups, group_id);
    const max = getMaxQuantity(productGroups, group_id);
    if (total > max) {
      return res
        .status(400)
        .json({ error_message: `商品を最大で${max}しか選べません。` });
    }
    if (checking_total == 1 && total != max) {
      return res
        .status(400)
        .json({ error_message: `注文を続行するには、さらに商品を${max}つ選択してください。` });
    }
    groups_with_quantities[product_id] = productGroups;

    logger.info(
      `end /set-products/set-quantity 200 with cpid - userid: ${cpid} - ${user_id}`
    );
    res.status(200).json({
      groups_with_quantities: JSON.stringify(groups_with_quantities),
      original_groups_with_quantities: groups_with_quantities,
      total,
    });
  } catch (err) {
    logException(req.body, err);
    logger.error(
      `end /set-products/set-quantity 500 with cpid - userid: ${cpid} - ${user_id}. Error: ${err}`
    );
    res.status(400).json({ error_message: err });
  }
};

module.exports = {
  productGroups,
  getDetail,
  setQuantityForVariant,
};
