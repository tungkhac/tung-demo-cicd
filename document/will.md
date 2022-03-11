## **EFOウィルコーポレーション**
## 1. Api validate booklet
Returns json data about a status.

- **URL**

  /api/will/validation

- **Method:**

  `POST`

- **Data Params**
    + category
    + booklet_number
    + validation_type
    
- **Success Response:**

  - **Code:** 200
    **Content:** 
    
    `{
         "status":"valid"
     }`
     
## 2. Api validate page
Returns json data about a time.

- **URL**

  /api/will/validation

- **Method:**

  `POST`

- **Data Params**
      + category
      + booklet_number
      + validation_type

- **Success Response:**

  - **Code:** 200
    **Content:**

    `{
         "status":"valid"
     }`

## 3. Api get price
Returns json data about a time.

- **URL**

  /api/will/getPrice

- **Method:**

  `POST`

- **Data Params**
  + format
  + category
  + page_number
  + booklet_number
  + cover_color_number
  + paper_color_number
  + cover_type
  + paper_type
  + cover_surface_treatment

- **Success Response:**

  - **Code:** 200
    **Content:**

    `{
         price1: 0,
         price2: 0,
         option_price: 0,
         product_name: ''
     }`