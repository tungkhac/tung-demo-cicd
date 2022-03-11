## **EFO API return GMO point data**
## 1. Api return GMO category
Returns json data about GMO categories.

- **URL**

  /api/gmopoint/getCategory

- **Method:**

  `POST`

- **Data Params**
  + cpid

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "type": "005",
        "data": [
            {
                "value": "IT・Webサービス",
                "text": "IT・Webサービス"
            },
            {
                "value": "エンタメ",
                "text": "エンタメ"
            },
            {
                "value": "カーライフ",
                "text": "カーライフ"
            }
            ...
        ],
        "error_message": ""
    }

## 2. Api return GMO project type
Returns json data about GMO project types.

- **URL**

  /api/gmopoint/getProjectType

- **Method:**

  `POST`

- **Data Params**
  + cpid
  + category

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "type": "005",
        "data": [
            {
                "value": "その他",
                "text": "その他"
            },
            {
                "value": "キャンペーン",
                "text": "キャンペーン"
            },
            {
                "value": "無料会員登録",
                "text": "無料会員登録"
            },
            ...
        ],
        "error_message": ""
    }

## 3. Api return GMO carousel list
Returns json data about GMO carousel list.

- **URL**

  /api/gmopoint/carouselList

- **Method:**

  `POST`

- **Data Params**
  + cpid
  + category
  + project_type
  + get_point

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "type": "012",
        "data": [
            {
                "title": "獲得ポイント：6000ptGMOとくとくBB／ドコモ光接続サービス",
                "subtitle": "",
                "item_url": "",
                "image_url": "https://ad.atown.jp/adserver/banner/b?id=16172&mid=4232",
                "button": {
                    "title": "詳しく見る",
                    "type": "postback",
                    "payload": "CAROUSEL_GMO_5c85dc1bfdce274d863c905a"
                }
            },
            {
                "title": "獲得ポイント：3500pt日本企業開発支援株式会社／おとくケータイ.net</br>",
                "subtitle": "累計申し込み件数17万件突破！ソフトバンクに乗り換え(MNP)で機種変更よりも40000円お得！来店不要。さらに今なら、どこよりも高いキャッシュバックでさらにお得！",
                "item_url": "",
                "image_url": "https://ad.atown.jp/adserver/banner/b?id=18479&mid=4232",
                "button": {
                    "title": "詳しく見る",
                    "type": "postback",
                    "payload": "CAROUSEL_GMO_5c87d7bafdce270cdd7856b2"
                }
            },
            ...
        ]
    }

## 4. Api return GMO carousel item detail
Returns json data about GMO carousel item detail.

- **URL**

  /api/gmopoint/item

- **Method:**

  `POST`

- **Data Params**
  + cpid
  + item_id
  + u1

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "message_type": "002",
        "type": "111",
        "conversation_not_end_flg": 1,
        "data": {
            "message": [
                {
                    "type": "111",
                    "list": [
                        {
                            "title": "獲得条件：</br>キャンペーン（・ソフトバンクのスマホへの乗り換え（MNP）完了確認・複数台を同時契約でも1申込みカウント）",
                            "type": "label"
                        },
                        {
                            "title": "注意事項（次の場合はポイントを付与しない場合があります）：</br>新規契約／機種変更の場合</br>スマホ以外（ガラケー・ガラホ）へのMNPの場合",
                            "type": "label"
                        },
                        {
                            "title": "ポイントを貯める（クリックすると外部サービスに移動します）",
                            "type": "link",
                            "url": "https://st.botchan.chat/LdXQy5pCu"
                        }
                    ]
                }
            ]
        }
    }