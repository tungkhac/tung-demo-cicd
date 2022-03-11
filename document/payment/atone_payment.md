## **ATONE PAYMENT [COD]**
## 1. Api payment
- **URL**
  /api/atone/payment-create
- **Method:**
  `POST`
- **Data Params**
    + cpid
    + uid
    + name
    + address
    + email
    + tel_num
    + zipcode
    + dest_name
    + dest_zipcode
    + dest_address
    + dest_tel_num
    + name_kana
    + dest_name_kana

- **Create data Payment**
    + **送信パラメータ一覧**

        | パラメータ名 | 備考 |
        | ------ | ------ |
        | amount | |
        | sales_settled | |
        | livemode | |
        | customer | |
        | dest_customers | |
        | items | |
        | checksum | |
        | shop_transaction_no | |
        | transaction_options | |

- **Response:**

  - **Code:** 200 [Success]
    **Content:**

    `{
        atone_np_data: ...,
        atone_pub_key: ...,
        success: true
    }`

  - **Code:** 400 [Fail]
      **Content:**

      `{
        error_message: 'Error messsage'
      }`