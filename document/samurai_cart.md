## **samurai_cart SERVICE** (api connect to ec-cart service)
## 1. get Auth Token
Returns json success status 200.

- **URL**

  /api/efo-ec/auth

- **Method:**

  `POST`

- **Data Params**
  + cpid(connect page id)
  + user_id
  + request_url(shop url)
  + client_id
  + client_secret
   
- **Success Response:**
  - **Code:** 200
  - **Content:** 
    
    `
        {
            "result": "OK",
            "authentication_token": "5e7c2d0e83a543.34090343"
        }
    `

## 2. Login
Returns json success status 200.

- **URL**

  api/efo-ec/login

- **Method:**

  `POST`

- **Data Params**
  + user_id
  + cpid
  + request_url
  + password
  + mail_address
  + client_id
  + client_secret

- **Success Response:**

  - **Code:** 200
  - **Content:** 
    
    `{
         "result": "OK",
         "user_id": "9"
    }`
   
     
## 3. Get-Address
Returns json success status 200.

- **URL**

  api/efo-ec/get-address

- **Method:**

  `POST`

- **Data Params**
  + cpid
  + user_id
  + request_url
  + mail
  + client_id
  + client_secret

- **Success Response:**
  - **Code:** 200
  - **Content:** 
    
    `{
         "result": "OK",
         "addresses": [
             {
                 "address_id": "4",
                 "first_name": "テスト",
                 "last_name": "テスト",
                 "first_name_kana": "テスト",
                 "last_name_kana": "テスト",
                 "postal_code": "1500002",
                 "pref": "東京都",
                 "address1": "渋谷区渋谷",
                 "address2": "1-11-8",
                 "phone": "09000000000"
             }
         ]
    }`
    
## 4. Order
Returns json success status 200.

- **URL**

  /api/efo-ec/order

- **Method:**

  `POST`

- **Data Params**
  + first_name 
  + last_name 
  + furigana_first 
  + furigana_last 
  + zipcode 
  + pref 
  + address 
  + address2 
  + address3 
  + mail_address 
  + user_id 
  + cpid 
  + payment_method 
  + delivery_date 
  + phone 
  + shipping_type 
  + shipping_first_name 
  + shipping_last_name 
  + shipping_furigana_first 
  + shipping_furigana_last 
  + shipping_zipcode 
  + shipping_pref 
  + shipping_address1 
  + shipping_address2 
  + shipping_phone_number 
  + shipping_address3 
  + request_url 
  + login_value 
  + password 
  + item_code 
  + item_num 
  + payment_token 
  + payment_token1 
  + client_id
  + client_secret

- **Success Response:**
  - **Code:** 200
  - **Content:** 
   
     + if user login
     
         `
            {
                "result":"OK",
                "order_id":"747-25219-60",
                "user_id":"15"
            }
         `
         
     + if user register
     
        `
            {
                "result":"OK",
                "order_id":"747-25219-60"
            }
        `
    
    
