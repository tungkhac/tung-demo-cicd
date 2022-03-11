## **LINE Custom BIYO**
## 1. Api remove email
- **URL**
  /api/biyo/removeEmail
- **Method:**
  `POST`
- **Data Params**
    + cpid
    + uid

## 2. Api validate email
- **URL**
   /api/biyo/validateEmail
- **Method:**
  `POST`
- **Data Params**
    + email
- **Success Response:**
  - **Code:** 200
    **Content:**
    `{}`

## 3. Api validate Line ID
- **URL**
  /api/biyo/validateLineId
- **Method:**
  `POST`
- **Data Params**
    + liff_user_id
- **Success Response:**
  - **Code:** 200
    **Content:**
    ` {}`

## 4. Api validate Line ID
 - **URL**
   /api/biyo/validateLineIdFromLine
 - **Method:**
   `POST`
 - **Data Params**
    + user_id
 - **Success Response:**
   - **Code:** 200
     **Content:**
     `{"user_record_id": user_record_id, "user_create_flg": "1"}`

## 5. Api register user webhook
 - **URL**
   /api/biyo/userWebhook
 - **Method:**
   `POST`
 - **Data Params**
    + record
 - **Success Response:**
   - **Code:** 200
     **Content:**
     `{}`

## 6. Api update user
 - **URL**
   /api/biyo/updateUser
 - **Method:**
   `POST`
 - **Data Params**
    + LINE_ID
    + 免許
    + 性別
    + 姓
    + 名
    + 生年月日
    + email
    + 都道府県
    + 市区町村
    + 番地
    + 建物名
    + 種類
    + salon_name
    + staff_num
    + gender_rate
    + store_num
    + area
    + store_type
 - **Success Response:**
   - **Code:** 200
     **Content:**
     `{}`

## 7. Api check user id
 - **URL**
   /api/biyo/checkUserIdForLiff
 - **Method:**
   `POST`
 - **Data Params**
    + liff_user_id
 - **Success Response:**
   - **Code:** 200
     **Content:**
     `{}`

## 8. Api get user profile
 - **URL**
   /api/biyo/getUserProfile
 - **Method:**
   `POST`
 - **Data Params**
    + user_id
 - **Success Response:**
   - **Code:** 200
     **Content:**
     `{
        first_name: ...,
        last_name: ...,
        gender: ...,
        email: ...,
        birthday: ...,
        license: ...,
        zipcode: ...,
        pref: ...,
        city: ...,
        stress: ...,
        building: ...,
        status: ...,
        current_point: ...,
        user_record_id: ...,
        amazon_gift_flg: ...,
        salon_name:  ...,
        staff_num:  ...,
        gender_rate: ...
        store_num: ...,
        area: ...,
        store_type: ...
        type: ...,
     }`

## 9. Api add point
 - **URL**
   /api/biyo/addPointFromEfo
 - **Method:**
   `POST`
 - **Data Params**
    + liff_user_id
    + inquiry_master_id

## 10. Api check answer
 - **URL**
   /api/biyo/checkAnswer
 - **Method:**
   `POST`
 - **Data Params**
    + liff_user_id
    + inquiry_master_id
 - **Success Response:**
   - **Code:** 200
     **Content:**
     `{}`

## 11. Api get remain anket
 - **URL**
   /api/biyo/getRemainAnket
 - **Method:**
   `POST`
 - **Data Params**
    + user_id
    + line_user_id
 - **Success Response:**
   - **Code:** 200
     **Content:**
     `{
        remain: ...,
        total: ...
    }`

## 12. Api get new anket
 - **URL**
   /api/biyo/getNewAnket
 - **Method:**
   `POST`
 - **Data Params**
    + user_id
    + user_record_id
 - **Success Response:**
   - **Code:** 200
     **Content:**
     `{
        remain: ...,
        total: ...
    }`

## 13. Api async history
 - **URL**
   /api/biyo/webhookAsyncHistory
 - **Method:**
   `POST`
 - **Data Params**
    + app
    + type
    + record
    + recordId
 - **Success Response:**
   - **Code:** 200
     **Content:**
     `{}`

## 14. Api async answer anket
 - **URL**
   /api/biyo/webhookAsyncAnswerAnket
 - **Method:**
   `POST`
 - **Data Params**
    + app
    + type
    + record
 - **Success Response:**
   - **Code:** 200
     **Content:**
     `{}`

## 15. Api async answer user
 - **URL**
   /api/biyo/webhookAsyncUser
 - **Method:**
   `POST`
 - **Data Params**
    + app
    + type
    + record
    + recordId
 - **Success Response:**
   - **Code:** 200
     **Content:**
     `{}`

## 16. Api async master anket
 - **URL**
   /api/biyo/webhookAsyncMasterAnket
 - **Method:**
   `POST`
 - **Data Params**
    + app
    + type
    + record
    + recordId
 - **Success Response:**
   - **Code:** 200
     **Content:**
     `{}`

## 17. Api get campain anket
 - **URL**
   /api/biyo/getCampaignAnket
 - **Method:**
   `POST`
 - **Data Params**
    + user_id
    + user_record_id
 - **Success Response:**
   - **Code:** 200
     **Content:**
   `{
        message: //message type carousel,
        count: //count all item
    }`

## 18. Api push message
 - **URL**
   /api/biyo/pushMessage
 - **Method:**
   `POST`
 - **Data Params**
    + liff_user_id
    + line_token
    + message
    + setting_rich_menu
 - **Success Response:**
   - **Code:** 200
     **Content:**
   `{}`

## 19. Api anket confirm
 - **URL**
   /api/biyo/anketConfirm
 - **Method:**
   `POST`
 - **Data Params**
    + inquiry_master_id
    + session
    + ..."_"...
 - **Success Response:**
   - **Code:** 200
     **Content:**
   `{
        template_type: '002',
        data: ...
    }`