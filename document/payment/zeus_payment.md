## **ZEUS PAYMENT**
- **URL**

  /api/zeus/payment

- **Method:**

  `POST`

- **Data Params**
    + connect_page_id
    + user_id
    + user_tel
    + user_email
    + payment_token

- **Request Api Payment**
    + **接続先ＵＲＬ（POST）** !https://linkpt.cardservice.co.jp/cgi-bin/secure.cgi
    + **送信パラメータ一覧**

        | パラメータ名 | 備考 |
        | ------ | ------ |
        | clientip | |
        | token_key | |
        | money | |
        | send | [mall（固定）] |
        | telno | |
        | email | |

- **Response Api Payment**

    | パラメータ名 | 備考 |
    | ------ | ------ |
    | Success_order | [成功] |
    | failure_order | [失敗] |
    | Invalid | [ゼウスが指定する値の条件以外でパラメータを送信している場合、このレスポンスが返ります。Invalid ～でお返ししますので、「～」のパラメータ値を確認してください。 例）invalid clientip] |
    | maintenance | [メンテナンス中] |
    | connect | [決済処理失敗] |
- **Response:**

  - **Code:** 200 [^Success]
    **Content:** 
    
    `{}`

  - **Code:** 400 [^Fail]
      **Content:**

      `{
        error_message: 'Error messsage'
      }`