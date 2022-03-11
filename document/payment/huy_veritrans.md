## **VERITRANS PAYMENT**
## 1. Api payment
- **URL**
  /api/veritrans/payment
- **Method:**
  `POST`
- **Data Params**
    + cpid
    + uid
    + ship_ymd
    + name
    + address
    + send_name
    + send_address
    + tel_num
    + email
    + payment_type
    + delivery_company_code
    + name_kana
    + send_tel_num
    + card_token

- **using VeriTrans4G-MDK**
    + **link get VeriTrans4G-MDK** 
    + https://www.veritrans.co.jp/trial/4g/download/mdk.html
    + ** Call function ** transaction.execute(request, CardAuthorizeResponseDto_1.CardAuthorizeResponseDto)
    + **parameter**

        | パラメータ名 | 備考 |
        | ------ | ------ |
        | request | amount , token , order_id  |
        | CardAuthorizeResponseDto | Authentication|
        

- **Response:**

  - **code:** 200 
  - **status:** '1' [^Success]

      `{
        status: '1'
      }`
  - **code:** 200 
      **status:** 0 [^Fail]

      `{
        status: '0'
      }`
## 2. Api test infor card
- **URL**
  /api/veritrans/test_infor_card
- **Method:**
  `POST`
- **Data Params**
    + merchant_id
    + merchant_authentication_key
- **using VeriTrans4G-MDK**
    + **link get VeriTrans4G-MDK** 
    + https://www.veritrans.co.jp/trial/4g/download/mdk.html
    + ** Call function ** transaction.execute(request, CardAuthorizeResponseDto_1.CardAuthorizeResponseDto)
    + **parameter**

        | パラメータ名 | 備考 |
        | ------ | ------ |
        | request | orderId (random) , cardNumber (4111111111111111) , cardExpire(random)  |
        | CardAuthorizeResponseDto | Authentication|
        

- **Response:**

  - **code:** 200 
  - **status:** '1' [^Success]

      `{
        status: '1'
      }`
  - **code:** 200 
      **status:** 0 [^Fail]

      `{
        status: '0'
      }`
