// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const get = require("lodash/get");
const first = require("lodash/first");
const moment = require("moment");

const { formatTaxInclude, formatNull } = require("../format-data");
const { API, defaultErrorMessage } = require("../constants");
const { apiRequest } = require("../base");
const { SHA256 } = require("../../../util");

const getSearchingProducts = (products) => {
  if (typeof products === "string") {
    return [{ product_id: products }];
  }
  return products.map((productId) => ({ product_id: productId }));
};

const getSearchingProductData = (body) => {
  const products = get(body, "product_id");
  const data = {
    search_list: getSearchingProducts(products),
    auth_text: SHA256(get(body, "api-key")),
  };
  return JSON.stringify(data);
};

const getProducts = async (req, res) => {
  try {
    const searchingProductData = getSearchingProductData(req.body);
    console.log(
      `【${moment()}】>>/repeat-plus/product::request.body<<`,
      searchingProductData
    );

    const products = await apiRequest(
      `${get(req.body, "request_url")}${API.searchProduct}`,
      searchingProductData
    );
    const productId = [];
    const productsDetail = [];
    products.map((p) => {
      productId.push(get(p.product, "product_id"));
      productsDetail.push({
        product_id: get(p.product, "product_id"),
        name: get(p.product, "name"),
        variation_id: get(p.product_stock, "variation_id"),
        ...p,
      });
    });
    res
      .status(200)
      .json({ productId, productsDetail: JSON.stringify(productsDetail) });
  } catch (error) {
    console.log(
      `【${moment()}】>>/repeat-plus/product::ERROR<<`,
      get(error, "error.response.data")
        ? JSON.stringify(get(error, "error.response.data"))
        : error
    );
    res.status(500).json({ error_message: defaultErrorMessage });
  }
};

const getProductDetail = async (req, res) => {
  try {
    const url = `${get(req.body, "request_url")}${API.searchProduct}`;
    const searchingProductData = getSearchingProductData(req.body);
    console.log(
      `【${moment()}】>>/repeat-plus/product/detail::request.body<<`,
      searchingProductData
    );

    const product = await apiRequest(url, searchingProductData);
    const data = first(
      product.map((p) => ({
        product_id: get(p.product, "product_id"),
        name: get(p.product, "name"),
        variation_id: get(p.product_stock, "variation_id"),
        display_price: get(p.product, "display_price"),
        tax_included_flg: formatTaxInclude(get(p.product, "tax_included_flg")),
        display_special_price: formatNull(
          get(p.product, "display_special_price")
        ),
        tax_rate: formatNull(get(p.product, "tax_rate")),
        tax_round_type: formatNull(get(p.product, "tax_round_type")),
        price_pretax: formatNull(get(p.product, "price_pretax")),
        price_shipping: formatNull(get(p.product, "price_shipping")),
        fixed_purchase_firsttime_price: formatNull(
          get(p.product, "fixed_purchase_firsttime_price")
        ),
        fixed_purchase_price: formatNull(
          get(p.product, "fixed_purchase_price")
        ),
      }))
    );
    data.productsDetail = JSON.stringify(product);
    res.status(200).json(data);
  } catch (error) {
    console.log(
      `【${moment()}】>>/repeat-plus/product/detail::ERROR<<`,
      get(error, "error.response.data")
        ? JSON.stringify(get(error, "error.response.data"))
        : error
    );
    res.status(500).json({ error_message: defaultErrorMessage });
  }
};

module.exports = {
  getProducts,
  getProductDetail,
};
