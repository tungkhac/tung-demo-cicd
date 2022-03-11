## **EFO API return Decollte data**
## 1. Api return Decollte price data
Returns json data about price data.

- **URL**

  /api/decollte/getPrice

- **Method:**

  `POST`

- **Data Params**
  + ceremony_content
  + number_people
  + clothing_type
  + upsell
  + photographing

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "price1": "217,800",
        "price2": "0",
        "price3": "220,000",
        "price4": "83,160",
        "total_price": "520,960"
    }
