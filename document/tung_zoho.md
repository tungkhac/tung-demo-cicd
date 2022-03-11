## **EFO API return Zoho data**
## 1. Api return Zoho field ID from field name
Returns json data about Zoho field ID from field name.

- **URL**

  /api/zoho/getFieldIdByName

- **Method:**

  `POST`

- **Data Params**
  + cid
  + uid
  + zoho_module_code
  + zoho_sandbox
  + field_{zoho_field_name}

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "id": "field_001"
    }