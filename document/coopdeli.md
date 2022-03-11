## **EFO API return Coopdeli data**
## 1. Api return Coopdeli data
Returns json data about some shiryous.

- **URL**

  /api/coopdeli/shiryou

- **Method:**

  `POST`

- **Data Params**
  + shiryou

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "shiryou1": [
            {
                "value": "1",
                "text": "資料請求する"
            }
        ],
        "shiryou2": [
            {
                "value": "1",
                "text": "資料請求する"
            }
        ]
    }

## 2. Api return GmoPG data
Returns json data about GmoPG info.

- **URL**

  /api/coopdeli/getGmoPG

- **Method:**

  `POST`

- **Data Params**
  + token
  + pref_name
  + mode

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "shop_name": "コープダイレクト（みらい）",
        "shop_id": "9100070838551",
        "shop_password": "f5d8md3b",
        "mode": "production",
        "provider": "004"
    }

## 3. Api return Gmo price data
Returns json data about Gmo price.

- **URL**

  /api/coopdeli/getPrice

- **Method:**

  `GET`

- **Data Params**
  + total_price

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "order_tax": 37037,
        "order_sub_total": 462963
    }