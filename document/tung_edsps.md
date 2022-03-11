## **EFO API return Edsps data**
## 1. Api return Edsps data
Returns json data about some prices.

- **URL**

  /api/edsps/getPrice

- **Method:**

  `POST`

- **Data Params**
  + cpid
  + maker
  + car
  + rank
  + distance

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
      "price1": "37,180",
      "price2": "57,610"
    }
