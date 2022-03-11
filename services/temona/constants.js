// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const https = require("https");

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  ecdhCurve: "secp384r1",
});

const responseType = "json";

const headers = {
  "Content-Type": "application/json",
};

const states = {
  北海道: 1,
  青森県: 2,
  岩手県: 3,
  宮城県: 4,
  秋田県: 5,
  山形県: 6,
  福島県: 7,
  茨城県: 8,
  栃木県: 9,
  群馬県: 10,
  埼玉県: 11,
  千葉県: 12,
  東京都: 13,
  神奈川県: 14,
  新潟県: 15,
  富山県: 16,
  石川県: 17,
  福井県: 18,
  山梨県: 19,
  長野県: 20,
  岐阜県: 21,
  静岡県: 22,
  愛知県: 23,
  三重県: 24,
  滋賀県: 25,
  京都府: 26,
  大阪府: 27,
  兵庫県: 28,
  奈良県: 29,
  和歌山県: 30,
  鳥取県: 31,
  島根県: 32,
  岡山県: 33,
  広島県: 34,
  山口県: 35,
  徳島県: 36,
  香川県: 37,
  愛媛県: 38,
  高知県: 39,
  福岡県: 40,
  佐賀県: 41,
  長崎県: 42,
  熊本県: 43,
  大分県: 44,
  宮崎県: 45,
  鹿児島県: 46,
  沖縄県: 47,
};

const api = {
  access_tokens: "/api/v1/external_cooperation/access_tokens",
  available_user: "/api/v1/users/available_user",
  user: "/api/v1/users",
  products: "/api/v1/products",
  set_products: "/api/v1/set_products",
  get_preferred_delivery_day: "/api/v1/purchase/get_preferred_delivery_day",
  create_order: "/api/v1/purchase/create_order",
  confirm_order: "/api/v1/purchase/confirm_order",
  regular_courses: "/api/v1/regular_courses",
  distribution_courses: "/api/v1/distribution_courses",
  login: "/api/v1/users/login",
  user_course_orders: "/api/v1/each_user/course_orders",
  course_orders: "/api/v1/course_orders",
};

const defaultErrorMessage = "エラーが発生しました。再度お試しください。";
const loginErrorMessage = `メールアドレスかパスワードが正しくない可能性があります。もう一度ご確認のうえ、再度入力してください。<br>
パスワードを忘れた方は<a href="https://shop.aster-one.com/password/new" target="_blank">こちら</a><br>
定期コースの変更・停止はお電話（<a target="_parent" href="tel:0120-39-0596">0120-39-0596</a>）でも承ります。`;

module.exports = {
  httpsAgent,
  responseType,
  states,
  api,
  defaultErrorMessage,
  loginErrorMessage,
};
