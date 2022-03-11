## **EFO API return Katsuden data**
## 1. Api return mail from zip code data
Returns json data about mail from zip code data.

- **URL**

  /api/katsuden/getEmailFromZipcode

- **Method:**

  `GET`

- **Data Params**
  + zipcode

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "to_email": "test@gmail.com",
        "cc_email": "test1@gmail.com"
    }

## 2. Api return abuot insert Digima data
Returns json data about insert Digima data.

- **URL**

  /api/katsuden/insertDigima

- **Method:**

  `POST`

- **Data Params**
  + username
  + username_kana
  + _api_key
  + address
  + _website_code
  + _page_url
  + _page_title
  + _group_name
  + email
  + contact_field_3
  + contact_field_4
  + contact_field_13
  + contact_field_14
  + company_name
  + work_telephone

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {}