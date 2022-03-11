## **Line customize MatchWatch**
## 1. Api async Queue
- **URL**
  /api/matchwatch/webhookAsyncQueue
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
## 2. Api validate nickname
- **URL**
  /api/matchwatch/validateNickname
- **Method:**
  `POST`
- **Data Params**
    + nickname
- **Request api to matchwatch**
    + **URL（GET）** "https://matchwatch.cybozu.com/k/v1/records.json?totalCount=true&app={user_app_id}&query=Nickname={nickname}"
- **Success Response:**
  - **Code:** 200
    **Content:**
    `{}`
## 3. Api validate wrist
- **URL**
  /api/matchwatch/validateWrist
- **Method:**
  `POST`
- **Data Params**
    + Wrist
- **Success Response:**
  - **Code:** 200
    **Content:**
    `{"status" : 1, "tmp_wrist": new_wrist}`
## 4. Api validate wrist line
- **URL**
  /api/matchwatch/validateWristLine
- **Method:**
  `POST`
- **Data Params**
    + Wrist
- **Success Response:**
  - **Code:** 200
    **Content:**
    `{"status" : 1, "tmp_wrist": new_wrist}`
## 5. Api validate nickname update
- **URL**
  /api/matchwatch/validateNicknameUpdate
- **Method:**
  `POST`
- **Data Params**
    + nickname
    + liff_user_id
- **Request api to matchwatch**
    + **URL（GET）** "https://matchwatch.cybozu.com/k/v1/records.json?totalCount=true&app={user_app_id}&query=Nickname={nickname} and LINE_ID != {liff_user_id}",
- **Success Response:**
  - **Code:** 200
    **Content:**
    `{}`
## 6. Api get watch ID
- **URL**
  /api/matchwatch/getWatchId
- **Method:**
  `POST`
- **Data Params**
    + text
- **Success Response:**
  - **Code:** 200
    **Content:**
    `{"WatchID" : ...}`
## 7. Api add Auth Log
- **URL**
  /api/matchwatch/AddAuthLog
- **Method:**
  `POST`
- **Data Params**
    + user_id
    + email
- **Request api to matchwatch**
    1. **URL（GET）** "https://matchwatch.cybozu.com/k/v1/records.json?app={user_app_id}&query=LINE_ID = '{liff_user_id}'"
    2. **URL（GET）** "https://matchwatch.cybozu.com/k/v1/records.json?app={auth_log_app_id}&query=UserID = ' {user_record_id}'"
    3. **URL（PUT）** "https://matchwatch.cybozu.com/k/v1/record.json"
    4. **URL（POST）** "https://matchwatch.cybozu.com/k/v1/record.json"
- **Success Response:**
  - **Code:** 200
    **Content:**
    `{
        message: {
            "type": "text",
            "text": ...
        }
    }`
## 8. Api validate line ID form line
- **URL**
  /api/matchwatch/validateLineIdFromLine
- **Method:**
  `POST`
- **Data Params**
    + user_id
- **Request api to matchwatch**
    1. **URL（GET）** "https://matchwatch.cybozu.com/k/v1/records.json?totalCount=true&app={user_app_id}&query=LINE_ID=liff_user_id"
- **Success Response:**
  - **Code:** 200
    **Content:**
    `{"user_record_id": .., "user_create_flg": "1"}`
    OR
    `{"user_create_flg": "0"}`
## 9. Api update user
- **URL**
  /api/matchwatch/updateUser
- **Method:**
  `POST`
- **Data Params**
    + LastName
    + FirstName
    + Nickname
    + LastNamePhonetic
    + FirstNamePhonetic
    + Wrist
    + ZIP_Code
    + Prefecture
    + City
    + StreetNumber
    + ApartmentRoomNumber
    + Phone
    + LINE_DISPLAY_NAME
    + Comment
- **Request api to matchwatch**
    1. **URL（GET）** "https://matchwatch.cybozu.com/k/v1/records.json?app={user_app_id}&query=LINE_ID={line_id}"
    2. **URL（PUT）** "https://matchwatch.cybozu.com/k/v1/record.json"
- **Success Response:**
  - **Code:** 200
    **Content:**
    `{}`
## 10. Api update write
- **URL**
  /api/matchwatch/updateWrist
- **Method:**
  `POST`
- **Data Params**
    + Wrist
- **Request api to matchwatch**
    1. **URL（GET）** "https://matchwatch.cybozu.com/k/v1/records.json?app={user_app_id}&query=LINE_ID={line_id}
    2. **URL（PUT）** "https://matchwatch.cybozu.com/k/v1/record.json"
- **Success Response:**
  - **Code:** 200
    **Content:**
    `{"status" : "0"}`
## 11. Api add Rent
- **URL**
  /api/matchwatch/addRent
- **Method:**
  `POST`
- **Data Params**
    + UserID
    + WatchID
    + order_dur
- **Request api to matchwatch**
    1. **URL（GET）** "https://matchwatch.cybozu.com/k/v1/record.json?app={user_app_id}&id={user_id},
    2. **URL（GET）** "https://matchwatch.cybozu.com/k/v1/records.json?app={watch_state_app_id}&query=WatchID = {WatchID} and WatchStatus in ("InStock") "
    3. **URL（GET）** "https://matchwatch.cybozu.com/k/v1/records.json?app={point_app_id}&query=UserID={UserID} order by LastUpdate desc limit 1"
    4. **URL（PUT）** "https://matchwatch.cybozu.com/k/v1/record.json"
    5. **URL（POST）** "https://matchwatch.cybozu.com/k/v1/record.json"
- **Success Response:**
  - **Code:** 200
    **Content:**
    `{"success" : 1}`
## 12. Api add Preference
- **URL**
  /api/matchwatch/addPreference
- **Method:**
  `POST`
- **Data Params**
    + liff_user_id
    + GenderFor
    + AvilableWatchOnly
    + WristFit
- **Request api to matchwatch**
    1. **URL（GET）** "https://matchwatch.cybozu.com/k/v1/records.json?app={user_app_id}&query=LINE_ID={liff_user_id}",
    2. **URL（GET）** "https://matchwatch.cybozu.com/k/v1/records.json?app={preference_app_id}&query=UserID = {user_record_id}"
    3. **URL（PUT）** "https://matchwatch.cybozu.com/k/v1/record.json"
    5. **URL（POST）** "https://matchwatch.cybozu.com/k/v1/record.json"
- **Success Response:**
  - **Code:** 200
    **Content:**
    `{}`
## 13. Api check user id for liff
- **URL**
  /api/matchwatch/checkUserIdForLiff
- **Method:**
  `POST`
- **Data Params**
    + liff_user_id
- **Request api to matchwatch**
    1. **URL（GET）** "https://matchwatch.cybozu.com/k/v1/records.json?app={user_app_id}&query=LINE_ID={user_id}"
- **Success Response:**
  - **Code:** 200
    **Content:**
    `{}`
## 14. Api check add Rent
- **URL**
  /api/matchwatch/checkAddRent
- **Method:**
  `POST`
- **Data Params**
    + BorrowerID
- **Request api to matchwatch**
    1. **URL（GET）** "https://matchwatch.cybozu.com/k/v1/records.json?app={rent_app_id}&query=BorrowerID={BorrowerID} and ApplicationStatus in ("Requested", "InRent")"
- **Success Response:**
  - **Code:** 200
    **Content:**
    `{"rent_available_flg" : 1}`
## 15. Api get Rent
- **URL**
  /api/matchwatch/getRent
- **Method:**
  `POST`
- **Data Params**
    + BorrowerID
- **Request api to matchwatch**
    1. **URL（GET）** "https://matchwatch.cybozu.com/k/v1/records.json?app={rent_app_id}&query=BorrowerID={BorrowerID} and ApplicationStatus in ("Requested", "InRent")"
- **Success Response:**
  - **Code:** 200
    **Content:**
    `{
        message: flex message
    }`
## 16. Api get Watch State
- **URL**
  /api/matchwatch/getWatchState
- **Method:**
  `POST`
- **Data Params**
    + BorrowerID
- **Request api to matchwatch**
    1. **URL（GET）** "https://matchwatch.cybozu.com/k/v1/records.json?app={watch_state_app_id}&query=WatchID={WatchID}"
- **Success Response:**
  - **Code:** 200
    **Content:**
    `{
        Rent4w: ...,
        Rent8w: ...,
        Rent12w: ...,
    }`
## 17. Api watch state message
- **URL**
  /api/matchwatch/getWatchState2
- **Method:**
  `POST`
- **Data Params**
    + BorrowerID
    + current_scenario
    + connect_scenario
    + variable_id
- **Request api to matchwatch**
    1. **URL（GET）** "https://matchwatch.cybozu.com/k/v1/records.json?app={watch_state_app_id}&query=WatchID={WatchID}"
- **Success Response:**
  - **Code:** 200
    **Content:**
    `{
        message: flex message
    }`
## 18. Api get user ID
- **URL**
  /api/matchwatch/getUserId
- **Method:**
  `POST`
- **Data Params**
    + user_id
    + auth_log_status
- **Request api to matchwatch**
    1. **URL（GET）** "https://matchwatch.cybozu.com/k/v1/records.json?app={user_app_id}&query=LINE_ID={user_id}"
    2. **URL（GET）** "https://matchwatch.cybozu.com/k/v1/records.json?app={auth_log_app_id}&query=UserID={user_id}"
- **Success Response:**
  - **Code:** 200
    **Content:**
    `{
        user_record_id: -1;
        ZIP_Code: "";
        ZIP_Code_hyphen: "";
        Prefecture: "";
        City: "";
        StreetNumber: "";
        ApartmentRoomNumber: "";
        auth_log_status: 0;
        LastName: "";
        FirstName: "";
        Nickname: "";
        Wrist: "";
        Phone: "";
        EMailAddress: "";
        Black: "False"
    }`
## 19. Api check Wrisr
- **URL**
  /api/matchwatch/checkWrist
- **Method:**
  `POST`
- **Data Params**
    + checkWrist
    + WatchID
- **Request api to matchwatch**
    1. **URL（GET）** "https://matchwatch.cybozu.com/k/v1/records.json?app={user_app_id}&query=LINE_ID={user_id}"
- **Success Response:**
  - **Code:** 200
    **Content:**
    `{
        meet_flg: ...
    }`
## 20. Api check Borrower Insurance
- **URL**
  /api/matchwatch/checkBorrowerInsurance
- **Method:**
  `POST`
- **Data Params**
    + UserID
- **Request api to matchwatch**
    1. **URL（GET）** "https://matchwatch.cybozu.com/k/v1/records.json?app={borrower_insurance_app_id}&query=UserID={user_id}"
- **Success Response:**
  - **Code:** 200
    **Content:**
    `{
        status: ...
    }`
## 21. Api remove favorites
- **URL**
  /api/matchwatch/removeFavorites
- **Method:**
  `POST`
- **Data Params**
    + UserID
    + WatchID
- **Request api to matchwatch**
    1. **URL（GET）** "https://matchwatch.cybozu.com/k/v1/records.json?app={favorite_app_id}&query=UserID={user_id} and WatchID={WatchID}"
    2. . **URL（DELETE）** "https://matchwatch.cybozu.com/k/v1/records.json"
- **Success Response:**
  - **Code:** 200
    **Content:**
    `{
        message: {
            "type": "text",
            "text": ...
        }
    }`
## 22. Api add favorites
- **URL**
  /api/matchwatch/addFavorites
- **Method:**
  `POST`
- **Data Params**
    + UserID
    + WatchID
- **Request api to matchwatch**
    1. **URL（GET）** "https://matchwatch.cybozu.com/k/v1/records.json?app={favorite_app_id}&query=UserID={user_id} and WatchID={WatchID}"
    2. . **URL（POST）** "https://matchwatch.cybozu.com/k/v1/records.json"
- **Success Response:**
  - **Code:** 200
    **Content:**
    `{
        message: {
            "type": "text",
            "text": ...
        }
    }`
## 23. Api get favorites
- **URL**
  /api/matchwatch/getFavorites
- **Method:**
  `POST`
- **Data Params**
    + UserID
    + current_scenario
    + connect_scenario_yes
    + liff_url
    + offset
- **Request api to matchwatch**
    1. **URL（GET）** "https://matchwatch.cybozu.com/k/v1/records.json?app={favorite_app_id}&query=UserID={user_id}"
- **Success Response:**
  - **Code:** 200
    **Content:**
    `{
        message: carousel message,
        count: 0
    }`
## 24. Api get item by brand
- **URL**
  /api/matchwatch/getItemByBrand
- **Method:**
  `POST`
- **Data Params**
    + BrandID
    + offset
    + current_scenario
    + connect_scenario_yes
    + connect_scenario_no
    + liff_url
- **Request api to matchwatch**
    1. **URL（GET）** "https://matchwatch.cybozu.com/k/v1/records.json?app={model_app_id}&query=BrandID={BrandID}"
- **Success Response:**
  - **Code:** 200
    **Content:**
    `{
        message: carousel message,
        count: ...
    }`
## 25. Api get new item
- **URL**
  /api/matchwatch/getNewItem
- **Method:**
  `POST`
- **Data Params**
    + offset
    + current_scenario
    + connect_scenario_yes
    + connect_scenario_no
    + liff_url
- **Request api to matchwatch**
    1. **URL（GET）** "https://matchwatch.cybozu.com/k/v1/records.json?totalCount=true&app={profile_app_id}&query=order by RegistrationDate desc limit 5 offset {offset}"
- **Success Response:**
  - **Code:** 200
    **Content:**
    `{
        message: carousel message,
        count: ...
    }`
## 26. Api get new item by Line ID
- **URL**
  /api/matchwatch/getNewItemApi
- **Method:**
  `POST`
- **Data Params**
    + offset
    + current_scenario
    + connect_scenario_yes
    + connect_scenario_no
    + liff_url
- **Request api to matchwatch**
    1. **URL（POST）** "https://appdev01.matchwatch.jp/api/v1/new_list"
- **Success Response:**
  - **Code:** 200
    **Content:**
    `{
        message: carousel message,
        count: ...
    }`
## 27. Api get recomend item
- **URL**
  /api/matchwatch/getRecomendItem
- **Method:**
  `POST`
- **Data Params**
    + offset
    + current_scenario
    + connect_scenario_yes
    + connect_scenario_no
    + liff_url
- **Request api to matchwatch**
    1. **URL（GET）** "https://matchwatch.cybozu.com/k/v1/records.json?totalCount=true&app={profile_app_id}&query=Recommend in ("True") order by RegistrationDate desc limit 5 offset {offset}"
- **Success Response:**
  - **Code:** 200
    **Content:**
    `{
        message: carousel message,
        count: ...
    }`
## 28. Api get brand
- **URL**
  /api/matchwatch/getBrand
- **Method:**
  `POST`
- **Data Params**
    + offset
    + current_scenario
    + connect_scenario_yes
    + connect_scenario_no
    + variable_id
    + connect_scenario
- **Request api to matchwatch**
    1. **URL（GET）** "https://matchwatch.cybozu.com/k/v1/records.json?totalCount=true&app={brand_app_id}&query=order by BrandID asc limit 5 offset {offset}"
- **Success Response:**
  - **Code:** 200
    **Content:**
    `{
        message: carousel message,
        count: ...
    }`
## 29. Api add Insurance
- **URL**
  /api/matchwatch/addInsurance
- **Method:**
  `POST`
- **Data Params**
    + line_access_token
    + media_id
    + username
    + password
    + UserID
- **Request api to matchwatch**
    1. **URL（GET）** "https://api.line.me/v2/bot/message/{media_id}/content"
    2. **URL（POST）** "https://matchwatch.cybozu.com/k/v1/file.json"
- **Success Response:**
  - **Code:** 200
    **Content:**
    `{}`
## 30. Api get user setting
- **URL**
  /api/matchwatch/getUserSetting
- **Method:**
  `POST`
- **Data Params**
    + user_id
- **Request api to matchwatch**
    1. **URL（GET）** "https://matchwatch.cybozu.com/k/v1/records.json?app={user_app_id}&query=LINE_ID={user_id}"
    2. **URL（GET）** "https://matchwatch.cybozu.com/k/v1/records.json?app={auth_log_app_id}&query=UserID={user_id}"
- **Success Response:**
  - **Code:** 200
    **Content:**
    `{
        rent_change_address_flg: 0,
        user_record_id: -1,
        ZIP_Code: "",
        ZIP_Code_hyphen: "",
        Prefecture: "",
        City: "",
        StreetNumber: "",
        ApartmentRoomNumber: "",
        auth_log_status: 0,
        LastName: "",
        FirstName: "",
        Nickname: "",
        Wrist: "",
        Phone: "",
        EMailAddress: "",
        Black: "False"
    }`
## 31. Api validate prefectures
- **URL**
  /api/matchwatch/validatePref
- **Method:**
  `POST`
- **Data Params**
    + zipcode
- **Success Response:**
  - **Code:** 200
    **Content:**
    `{}`
## 32. Api validate birthday
- **URL**
  /api/matchwatch/validateBirthDay
- **Method:**
  `POST`
- **Data Params**
    + birth_day
- **Success Response:**
  - **Code:** 200
    **Content:**
    `{"success" : "success"}`