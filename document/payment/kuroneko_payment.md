## **KURONEKO PAYMENT**
## 1. Api payment
- **URL**
  /api/kuroneko/payment
- **Method:**
  `POST`
- **Data Params**
    + connect_page_id
    + user_id
    + user_name
    + user_tel
    + user_email
    + payment_token

- **Request Api Payment**
    + **テスト環境 URL（POST）** https://ptwebcollect.jp/test_gateway/creditToken.api
    + **本番環境 URL（POST）** https://api.kuronekoyamato.co.jp/api/creditToken
    + **送信パラメータ一覧**

        | パラメータ名 | 備考 |
        | ------ | ------ |
        | function_div | A08 |
        | trader_code | |
        | device_div | |
        | order_no | Auto gen |
        | settle_price | |
        | buyer_name_kanji | |
        | buyer_tel | |
        | buyer_email | |
        | pay_way | |
        | token | |

- **Response Api Payment**

    | パラメータ名 | 備考 |
    | ------ | ------ |
    | return | (親要素) |
    | returnCode | 0：正常終了  1：異常終了 |
    | errorCode | |
    | returnDate | |

- **Response:**

  - **Code:** 200 [^Success]
    **Content:**

    `{}`

  - **Code:** 400 [^Fail]
      **Content:**

      `{
        error_message: 'Error messsage'
      }`
## 2. Api get maximum amount [COD]
- **URL**
  /api/kuroneko/getMaximumAmount
- **Method:**
  `POST`
- **Data Params**
    + cpid
    + uid
- **Success Response:**

  - **Code:** 200
    **Content:**

    `{
        cod_max_flg: 1,
        include_invoice_flg: 0
    }`
## 3. Api get fee [COD]
Update fee to variable
- **URL**
  /api/kuroneko/getFee
- **Method:**
  `POST`
- **Data Params**
    + cpid
    + uid
- **Success Response:**

  - **Code:** 200
    **Content:**
    `{}`
## 4. Api payment [COD]
- **URL**
  /api/kuroneko/payment-cod
- **Method:**
  `POST`
- **Data Params**
    + cpid
    + uid
    + include_invoice_flg
    + name
    + address
    + mail
    + tel_num
    + ship_ymd
    + send_name
    + send_address
    + name_kana
    + send_tel_num

- **Request Api Payment**
    + **テスト環境 URL（POST）** https://demo.yamato-credit-finance.jp/kuroneko-atobarai-api/KAARA0010APIAction_execute.action
    + **本番環境 URL（POST）** https://yamato-credit-finance.jp/kuroneko-atobarai-api/KAARA0010APIAction_execute.action
    + **送信パラメータ一覧**

        | パラメータ名 | 備考 |
        | ------ | ------ |
        | ycfStrCode | |
        | password | |
        | fraudbuster | |
        | orderNo | Auto gen |
        | orderYmd | |
        | requestDate | |
        | email | |
        | name | |
        | telNum | |
        | shipYmd | |
        | nameKana | |
        | itemName{index product} | |
        | itemCount{index product} | |
        | unitPrice{index product} | |
        | subTotal{index product} | |
        | totalAmount | |

- **Response Api Payment**

    | パラメータ名 | 備考 |
    | ------ | ------ |
    | return | (親要素) |
    | returnCode | 0：正常終了  1：異常終了 |
    | errorCode | |
    | returnDate | |

- **Response:**

  - **Code:** 200 [Success]
    **Content:**

    `{}`

  - **Code:** 400 [Fail]
      **Content:**

      `{
        error_message: 'Error messsage'
      }`
## 5. Api payment status [COD]
- **URL**
  /api/kuroneko/payment-status
- **Method:**
  `POST`
- **Data Params**
    + connect_page_id
    + user_id
    + order_no
- **Request Api Payment**
    + **テスト環境 URL（POST）** https://demo.yamato-credit-finance.jp/kuroneko-atobarai-api/KAAST0010APIAction_execute.action
    + **本番環境 URL（POST）** https://yamato-credit-finance.jp/kuroneko-atobarai-api/KAAST0010APIAction_execute.action
    + **送信パラメータ一覧**

        | パラメータ名 | 備考 |
        | ------ | ------ |
        | ycfStrCode | |
        | password | |
        | orderNo | |
        | requestDate | Now Format: YYYYMMDDHHmmss |

- **Response Api Payment**

    | パラメータ名 | 備考 |
    | ------ | ------ |
    | return | (親要素) |
    | returnCode | 0：正常終了  1：異常終了 |
    | errorCode | |
    | returnDate | |

- **Success Response:**

  - **Code:** 200
    **Content:**
    `{
        order_status: '',
        success: true
    }`