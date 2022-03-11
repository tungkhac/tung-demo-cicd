# guideline escrit
## Note
- 

## 1 API getTotal
- **Description**
 
- **URL**

  http://api.botchan.chat/api/escrit/getTotal

- **Method:**

  `POST`

- **Data Params**
  + area  ( 'ハワイ' | 'グアム'  | 'バリ'  | 'オーストラリア' | 'ヨーロッパ' | '沖縄'  )
  + style  ( 1 | 2  | 3  )
  + type ( 1 | 2  | 3  | 4)


- **Success Response:**
    **Code:** 
    + 200
    **Content:** 
    ```
     {
        "total": 601000,
        "message": ""
    }
    ```

