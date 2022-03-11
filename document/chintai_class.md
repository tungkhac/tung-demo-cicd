# guideline chintail
## Note
- Using 3rd party API http://www.able.co.jp/api/bkn/api/2.0/

## 1 API inquiry
- **Description**
 
- **URL**

  http://api.botchan.chat/api/chintai/inquiry

- **Method:**

  `POST`

- **Data Params**
  + currentUrl (current_url)
  + inquiryContent1　お困りごと
  + inquiryContent2　お問い合わせ内容
  + useDevice
  + name
  + mail
  ```
  {
    "inquiryContents1":  "物件情報",
    "inquiryContents2":  "「ユーザーが入力したコメント」",
    "userDevice":"mobile",
    "name": "田中康介",
    "mail":"k-tanaka@chintai.co.jp"
    "currentUrl": "https://www.able.co.jp/detail/Detail.do?    bk=000000018789331001&prefkey=tokyo&e=101019&cf=0&ct=0&sf=0&st=0&b=1&b=2&b=3&k=1&n=B&sidesFlg=1"
        }
  ```

- **Success Response:**
    **Code:** 
    + 200
    **Content:** 
    ```
     {
        "uuid": null,
        "wrongAccountFlg": "0",
        "transactionId": "2019061312200412567082",
        "shopCd": "000000018",
        "bkCd": "000000000789331",
        "roomNo": "0001",
        "printing": "1",
        "message_error": ""
    }
    ```

## 2 API rentproperty
- **Description**

- **URL**

  http://api.botchan.chat/api/chintai/rentproperty

- **Method:**

  `POST`

- **Data Params**
  + currentUrl (current_url)
  ```
    {
        "currentUrl": "https://www.able.co.jp/detail/Detail.do?bk=000000018789331001&prefkey=tokyo&e=101019&cf=0&ct=0&sf=0&st=0&b=1&b=2&b=3&k=1&n=B&sidesFlg=1"
    }
  ```


- **Success Response:**
    **Code:** 
    + 200

    **Content:** 
    ```
    {
        "printing": "1",
        "agencyShopCd": "000000656",
        "agencyBkCd": "205556",
        "agencyRoomNo": "000",
        "agencyImgCnt": 29,
        "agencyImgCategoryCnt": 12,
        "agencyUketsukeCd": "656205556401",
        "shopName":"王子店";
        "init_price":"0円";
    }
    ```
    
    
## 3 API visit-reserve
- **Description**

- **URL**

  http://api.botchan.chat/api/chintai/visit-reserve

- **Method:**

  `POST`

- **Data Params**
    + currentUrl (current_url)
    + visitTimeMinus　来店希望時間M
    + visitTimeHour　来店希望時間H
    + visitDay　予約日程
    + userDevice　user_device
    + name　お名前
    + mail        　メールアドレス
    + rent　家賃の目安
    + hopeComment　希望条件
  ```
    {
       "visitTimeMinus":"00",
        "visitTimeHour":"19",
        "visitDay": "20-05-2019",
        "userDevice":"pc",
        "name": "田中康介",
         "mail":"k-tanaka@chintai.co.jp"
        "currentUrl": "https://www.able.co.jp/detail/Detail.do?bk=000000018789331001&prefkey=tokyo&e=101019&cf=0&ct=0&sf=0&st=0&b=1&b=2&b=3&k=1&n=B&sidesFlg=1"
        "rent":"30",
       "hopeComment":"ユーザーが入力した希望条件コメント"
    }
  ```


- **Success Response:**
    **Code:** 
    + 200

    **Content:** 
    ```
    {
        "uuid": null,
        "wrongAccountFlg": "0",
        "transactionId": "2019061312271871398614",
        "shopCd": "000000018",
        "bkCd": "000000000789331",
        "roomNo": "0001",
        "printing": "1",
        "message_error": ""
    }
    ```

    
## 4 API holiday
- **Description**
 show list holiday japan

- **URL**

  http://api.botchan.chat/api/chintai/holiday

- **Method:**

  `POST`

- **Data Params**
  + currentUrl (current_url)
  ```
    {
        "currentUrl": "https://www.able.co.jp/detail/Detail.do?bk=000000018789331001&prefkey=tokyo&e=101019&cf=0&ct=0&sf=0&st=0&b=1&b=2&b=3&k=1&n=B&sidesFlg=1"
    }
  ```


- **Success Response:**
    **Code:** 
    + 200

    **Content:** 
    ```
   {
        "mode": "unavailable ",
        "date": [
            "2019-08-07",
            "2019-12-27",
            "2019-12-28",
            "2019-12-29",
            "2019-12-30",
            "2019-12-31",
            "2020-01-01",
            "2020-01-02"
        ],
       "message_error": ""
    }
    ```
    

