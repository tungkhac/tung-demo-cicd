# guideline
## Note
- This file has the function of retrieving survey information from api https://jabs41.cybozu.com/k/v1 then convert information survey to data chat bot message and save it to the database mongodb  whenever receiving changes from webhook
- Token authen using : const app_token_root = {
    'botchan': "dCxCytU1jvB3hmV3uop31P7i8HbSdBYqvo4TXLN2",
}
## 1 API checkMasterInquiry
- **Description**
  Get event from webhook --> Get information from 3rd party API provided(https://jabs41.cybozu.com/k/v1) --> convert data to data message bot --> save to database mongodb 
- **URL**

  http://api.botchan.chat/api/biyobot/checkMasterInquiry

- **Method:**

  `POST`

- **Data Params**
  {}

- **Success Response:**

  - **Code:** 200
    **Content:** 
    
    Data message bot 
