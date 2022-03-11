## **LINEリッチメニューの作成**
## 1. Api set rich menu for user
Returns json data about a setting flash.

- **URL**

  /api/line-menu/set-by-user

- **Method:**

  `POST`

- **Data Params**
    + connect_page_id
    + user_id
    + rich_menu_id
    
- **Success Response:**

  - **Code:** 200
    **Content:** 
    
    `{setting_flg: true}`
     
## 2. Api unset rich menu for user
Returns json data about a setting flash.

- **URL**

  /api/karubi/unlinkMenu

- **Method:**

  `POST`

- **Data Params**
     + connect_page_id
     + user_id

- **Success Response:**

  - **Code:** 200
    **Content:**

    `{setting_flg: true}`
