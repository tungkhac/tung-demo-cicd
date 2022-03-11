## **EFO API return Point Town data Version 2**
## 1. Api return Point Town category Version 2
Returns json data about Point Town categories.

- **URL**

  /api/pointTown/v2/carouselList

- **Method:**

  `POST`

- **Data Params**
  + cpid
  + adId

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "type": "012",
        "data": [
            {
                "title": "獲得ポイント：70,000 pt</br>サービス名：auひかり(販売代理店：株式会社NEXT)</br>",
                "subtitle": "★当社限定！auひかりお申し込みキャンペーン★【選べる特典】</br>当社からauひかりに新規加入されたお客様限定で</br>どちらかお好きな方を選べるキャンペーン実施中です！</br></br>【特典1】</br></br>◎「ネットと電話」お申し込みの方</br>50,000円高額キャッシュバック！",
                "item_url": "",
                "image_url": "https://ad.atown.jp/adserver/banner/b?id=28619&mid=6847",
                "button": {
                    "title": "詳しく見る",
                    "type": "postback",
                    "payload": "CAROUSEL_POINTTOWN_5d96afc697e06bdc47a2714e"
                }
            }
        ]
    }

## 2. Api return Point Town item detail Version 2
Returns json data about Point Town item detail.

- **URL**

  /api/pointTown/v2/item

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
                            "title": "■獲得条件：</br>その他（初めて「GMOとくとくBB」のサービスに申込される方で、</br>GMOとくとくBB WiMAX2+ キャッシュバックキャンペーンお申込み完了後、</br>WiMAX端末の到着が確認完了でポイント対象となります。）",
                            "type": "label"
                        },
                        {
                            "title": "■注意事項：</br>※下記該当の申込はポイント対象外となります。</br>・WiMAX端末の到着が確認できない場合</br>・60日以内にご解約されている場合</br>・料金未納</br>・その他不備・不正・虚偽・重複・いたずら・キャンセルと思われる申込み</br>・他キャンペーンでの申込み・。",
                            "type": "label"
                        },
                        {
                            "title": "ポイントを貯める（クリックすると外部サービスに移動します）",
                            "type": "link",
                            "url": "https://st.botchan.chat/W3Y0dFMCK"
                        }
                    ]
                }
            ]
        }
    }

#
## **EFO API return Point Town data Version 1**
## 1. Api return Point Town category
Returns json data about Point Town categories.

- **URL**

  /api/pointTown/getCategory

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

## 2. Api return Point Town project type count
Returns json data about Point Town project type count.

- **URL**

  /api/pointTown/getProjectTypeTotal

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
        "project_type_total": 4
    }

## 3. Api return Point Town project type
Returns json data about Point Town project types.

- **URL**

  /api/pointTown/getProjectType

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

## 4. Api return Point Town carousel list
Returns json data about Point Town carousel list.

- **URL**

  /api/pointTown/carouselList

- **Method:**

  `POST`

- **Data Params**
  + cpid
  + category
  + project_type
  + get_point
  + search_type
  + rank_point_flg

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "type": "012",
        "data": [
            {
                "title": "獲得ポイント：3500pt株式会社グッドラック/モバレコAir キャッシュバックキャンペーン",
                "subtitle": "工事不要、速度制限なしでWi-Fi使い放題。モバイルWiFiインターネットのモバレコエアーです！</br>掲載メディアも少なく、今が掲載にあたっての絶好の機会です！</br>是非、ご掲載くださいませ！",
                "item_url": "",
                "image_url": "https://ad.atown.jp/b?id=29765&mid=4232",
                "button": {
                    "title": "詳しく見る",
                    "type": "postback",
                    "payload": "CAROUSEL_GMO_5d260bdefdce2769702b0a13"
                }
            },
            {
                "title": "獲得ポイント：6000ptトラスト株式会社/ソネット光プラス</br>",
                "subtitle": "ソネット光プラスキャンペーン（So-net光プラス）を今だけ限定で実施中！</br>当サイト限定50,000円キャッシュバック受付中！さらにお友達ご紹介で30,000円進呈！",
                "item_url": "",
                "image_url": "https://ad.atown.jp/adserver/banner/b?id=25713&mid=4232",
                "button": {
                    "title": "詳しく見る",
                    "type": "postback",
                    "payload": "CAROUSEL_GMO_5c85dc1bfdce274d863c9051"
                }
            },
            ...
        ]
    }

## 5. Api return Point Town carousel item detail
Returns json data about Point Town carousel item detail.

- **URL**

  /api/pointTown/item

- **Method:**

  `POST`

- **Data Params**
  + cpid
  + item_id
  + u1
  + rank_point_flg

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
                            "title": "注意事項（次の場合はポイントを付与しない場合があります）：</br>新規契約／機種変更の場合</br>スマホ以外（ガラケー・ガラホ）へのMNPの場合</br>Y!mobile、LINEモバイルなどSoftBank回線から乗り換えの場合  </br>リスティング違反の場合</br>不正・重複・乗換え未完了",
                            "type": "label"
                        },
                        {
                            "title": "ポイントを貯める（クリックすると外部サービスに移動します）",
                            "type": "link",
                            "url": "https://st.botchan.chat/pu6siH7q9?bcgmopoint=5c87d7bafdce270cdd7856b2"
                        }
                    ]
                }
            ]
        }
    }