## **ノジマ**
## 1. Api get shop
Returns json data about a shop.

- **URL**

  /api/nojima/getShop

- **Method:**

  `POST`

- **Data Params**
    + sns_type
    + lat
    + lng
    + detail_btn_title
    + no_shop_message
    + city_name
    
- **Success Response:**

  - **Code:** 200
    **Content:** 
    
    `{
         "message": {
             "attachment": {
                 "payload": {
                     "template_type": "generic",
                     "elements": [
                         {
                             "title": "イオンスタイル検見川浜店 | <a href='tel:043-278-3431' target='_parent'>043-278-3431</a>",
                             "subtitle": "千葉県千葉市美浜区真砂4-2-6　イオンスタイル検見川浜3階",
                             "image_url": "https://www.nojima.co.jp/wp-content/uploads/2017/11/photo_kenmigawa_00-300x200.jpg",
                             "buttons": [
                                 {
                                     "url": "https://www.nojima.co.jp/shop/chiba/aeonstyle_kemigawahama/",
                                     "title": "店舗詳細ページ",
                                     "type": "web_url"
                                 }
                             ],
                             "default_action": {
                                 "url": "https://www.nojima.co.jp/shop/chiba/aeonstyle_kemigawahama/",
                                 "type": "web_url"
                             }
                         },
     					...
                     ]
                 },
                 "type": "template"
             }
         },
         "message1": {
             "text": "4件見つかりました！"
         },
         "count": 4
     }`
     
## 2. Api get shop by address
Returns json data about a shop.

- **URL**

  /api/nojima/getShopByAddress

- **Method:**

  `POST`

- **Data Params**
     + address
     + no_shop_message
     + count
     + sns_type

- **Success Response:**

  - **Code:** 200
    **Content:**

    `{
         "message": {
             "attachment": {
                 "payload": {
                     "template_type": "generic",
                     "elements": [
                         {
                             "title": "イオンスタイル検見川浜店 | <a href='tel:043-278-3431' target='_parent'>043-278-3431</a>",
                             "subtitle": "千葉県千葉市美浜区真砂4-2-6　イオンスタイル検見川浜3階",
                             "image_url": "https://www.nojima.co.jp/wp-content/uploads/2017/11/photo_kenmigawa_00-300x200.jpg",
                             "buttons": [
                                 {
                                     "url": "https://www.nojima.co.jp/shop/chiba/aeonstyle_kemigawahama/",
                                     "title": "店舗詳細ページ",
                                     "type": "web_url"
                                 }
                             ],
                             "default_action": {
                                 "url": "https://www.nojima.co.jp/shop/chiba/aeonstyle_kemigawahama/",
                                 "type": "web_url"
                             }
                         },
                        ...
                     ]
                 },
                 "type": "template"
             }
         },
         "message1": {
             "text": "4件見つかりました！"
         },
         "count": 4
     }`

## 3. Api view more shop by address
Returns json data about a shop.

- **URL**

  /api/nojima/getShopByAddress

- **Method:**

  `POST`

- **Data Params**
     + address
     + load_more
     + sns_type
     + no_shop_message

- **Success Response:**

  - **Code:** 200
    **Content:**

    `{
         "message": {
             "attachment": {
                 "payload": {
                     "template_type": "generic",
                     "elements": [
                         {
                             "title": "イオンスタイル検見川浜店 | <a href='tel:043-278-3431' target='_parent'>043-278-3431</a>",
                             "subtitle": "千葉県千葉市美浜区真砂4-2-6　イオンスタイル検見川浜3階",
                             "image_url": "https://www.nojima.co.jp/wp-content/uploads/2017/11/photo_kenmigawa_00-300x200.jpg",
                             "buttons": [
                                 {
                                     "url": "https://www.nojima.co.jp/shop/chiba/aeonstyle_kemigawahama/",
                                     "title": "店舗詳細ページ",
                                     "type": "web_url"
                                 }
                             ],
                             "default_action": {
                                 "url": "https://www.nojima.co.jp/shop/chiba/aeonstyle_kemigawahama/",
                                 "type": "web_url"
                             }
                         },
     					...
                     ]
                 },
                 "type": "template"
             }
         },
         "message1": {
             "text": "4件見つかりました！"
         },
         "count": 4
     }`

## 4. Api switch chat
Returns json data about a switch status.

- **URL**

  /api/nojima/switch

- **Method:**

  `POST`

- **Data Params**
     + destinationId
     + userId
     + cpid
     + from_time_of_message

- **Success Response:**

  - **Code:** 200
    **Content:**

    `{
        success: true,
        from_time_of_message: 1584158885829
    }`
