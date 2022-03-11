## **EFO order history**
## 1. Api return order history data
Returns json about order history data.

- **URL**

  /api/efo/orderHistory/detail

- **Method:**

  `GET`

- **Data Params**
  + cpid
  + uid

- **Success Response:**

  - **Code:** 200
    **Content:** 

    ```yaml
    {
      "gmo_status" : "s:7:"Forward";s:7:"2a99662";s:7:"Approve";s:7:"6931685";",
      "cv_date" : "2020-03-05",
      "order_date" : "2020-03-05 07:30:33",
      "order_id" : "5e5fe0ecfdce2763992814a2"
    }
