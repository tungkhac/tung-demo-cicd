## **EFO API return convert data**
## 1. Api return convert data for the Umusic bot
Returns json data about convert data for the Umusic bot.

- **URL**

  /api/umusic/convertData

- **Method:**

  `POST`

- **Data Params**
  + username
  + username_kana
  + username_aite
  + username_kana_aite
  + address

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "lastName": "",
        "firstName": "",
        "lastName_kana": "Name",
        "firstName_kana": "kana",
        "lastName_aite": "Name",
        "firstName_aite": "aite",
        "lastName_kana_aite": "",
        "firstName_kana_aite": "",
        "zipcode": "0600000",
        "pref": "北海道",
        "city": "札幌市中央区以下に掲載がない場合",
        "other_address": ""
    }