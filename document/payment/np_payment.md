## **NP PAYMENT [COD]**
## 1. Api payment
- **URL**
  /api/np/payment-cod
- **Method:**
  `POST`
- **Data Params**
    + cpid
    + uid
    + include_invoice_flg
    + name
    + address
    + email
    + tel_num
    + dest_name
    + dest_address
    + dest_tel_num
    + name_kana
    + dest_name_kana

- **Request Api Payment**
    + **テスト環境 URL（POST）**
        https://ctcp.np-payment-gateway.com/v1/transactions
    + **本番環境 URL（POST）**
        https://cp.np-payment-gateway.com/v1/transactions
    + **送信パラメータ一覧**

        | パラメータ名 | 備考 |
        | ------ | ------ |
        | orderNo | |
        | shop_order_date | Now Format: YYYY-MM-DD |
        | goods | |
        | billed_amount | |

- **Response Api Payment**
        | パラメータ名 | 備考 |
        | ------ | ------ |
        | results | |

- **Response:**

  - **Code:** 200 [Success]
    **Content:**

    `{}`

  - **Code:** 400 [Fail]
      **Content:**

      `{
        error_message: 'Error messsage'
      }`
## 2. Api get maximum amount [COD]
- **URL**
  /api/np/getMaximumAmount
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
  /api/np/getFee
- **Method:**
  `POST`
- **Data Params**
    + cpid
    + uid
- **Success Response:**

  - **Code:** 200
    **Content:**
    `{}`