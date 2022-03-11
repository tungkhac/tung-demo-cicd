## **PAYGENT PAYMENT [COD]**
## 1. Api payment
- **URL**
  /api/paygent/payment
- **Method:**
  `POST`
- **Data Params**
    + domain
    + salt_value
    + company_id
    + customer_id
    + transition_id
    + request_number
    + bank_code
    + branch_code
    + account_type
    + account_number
    + beneficiary_customer_name

- **Request Api Payment**
    + **接続先ＵＲＬ（POST）**
         https://{domain}/payment-agent/api/chatbot/instruct_payment
    + **Request body**
    `{
        "allianceCompanyId": ...,
        "customerTranInfo":{
            "customerId": ...
            "customerTranId": ...
            "requestNumber": ...,
            "transferToInfo":{
                "bankCode": ...,
                "branchCode": ...,
                "accountType": ...,
                "accountNumber": ...,
                "beneficiaryCustomerName": ...
            }
        },
        "hash": hash,
    }`
    *Create hash value sample:*
    ```var str = company_id + customer_id + transition_id + request_number + bank_code + branch_code + account_type + account_number + beneficiary_customer_name;```
    ```var hash = crypto.createHmac('sha256', salt_value).update(str.toString()).digest('hex');```
- **Response Api Payment**
        | パラメータ名 | 備考 |
        | ------ | ------ |
        | statusCode | |

- **Response:**

  - **Code:** 200 [Success]
    **Content:**

    `{}`

  - **Code:** 400 [Fail]
      **Content:**

      `{
        error_message: 'Error messsage'
      }`
## 2. Api pulldown bank
Returns json data about a bank.

- **URL**

  /api/paygent/bank

- **Method:**
  `POST`
- **Data Params**

- **Request Api Payment**
    + **ＵＲＬ（GET）**
        https://bankcode-api.appspot.com/api/bank/JP

- **Success Response:**

  - **Code:** 200
    **Content:**

    ` {
        type: "006",
        name: 'pulldown_bank',
        data: [
            {
                value: 0001,
                text: 'ABC'
            },
            ...
        ]
    }`
## 3. Api pulldown branch
Returns json data about a branch.

- **URL**

  /api/paygent/branch

- **Method:**
  `POST`
- **Data Params**
    + bank_code

- **Request Api Payment**
    + **ＵＲＬ（GET）**
        https://bankcode-api.appspot.com/api/bank/JP/{bank_code}

- **Success Response:**

  - **Code:** 200
    **Content:**

    ` {
        type: "006",
        name: 'pulldown_branch',
        data: [
            {
                value: 0001,
                text: 'ABC'
            },
            ...
        ]
    }`