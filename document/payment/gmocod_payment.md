## **GMO PAYMENT [COD]**
## 1. Api payment
- **URL**
  /api/gmo-cod/payment
- **Method:**
  `POST`
- **Data Params**
    + cpid
	+ uid
	+ ship_ymd
	+ name
	+ address
	+ send_name
	+ send_address
	+ tel_num
	+ email
	+ payment_type
	+ delivery_company_code
	+ name_kana
	+ send_tel_num

- **Request Api Payment**
    1. Create orrder
    + **テスト環境 URL（POST）**
        https://testshop.gmo-ab.com/auto/transaction.do
    + **本番環境 URL（POST）**
        https://shop.gmo-ab.com/auto/transaction.do
    2. Update orrder
    + **テスト環境 URL（POST）**
        https://testshop.gmo-ab.com/auto/modifycanceltransaction.do
    + **本番環境 URL（POST）**
        https://shop.gmo-ab.com/auto/modifycanceltransaction.do
    + **Request body**
        `{
            shopInfo: {
				authenticationId: ...,
				shopCode: ...,
				connectPassword: ...,
			},
			buyer: {
				shopTransactionId: ...,
				shopOrderDate: ...,
				fullName: ...,
				fullKanaName: ...,
				zipCode: '',
				address: '',
				tel1: ...,
				email1: ...,
				billedAmount: '',
				paymentType: ...,
			},
			deliveries: {
				delivery: {
					deliveryCustomer: {
						fullName: ...,
						fullKanaName: ...,
						zipCode: '',
						address: '',
						tel1: ...,
					},
					details: {
						detail: [
							{
								detailName: '',
								detailPrice: '',
								detailQuantity: '',
							},
						],
					},
				},
			},
        }`
    3. Get invoice
     + **テスト環境 URL（POST）**
        https://testshop.gmo-ab.com/auto/pdrequest.do
    + **本番環境 URL（POST）**
        https://shop.gmo-ab.com/auto/pdrequest.do
    + **Request body**
    `{
		shopInfo: {
			authenticationId: ...,
			shopCode: ...,
			connectPassword: ...,
		},
		transaction: {
			gmoTransactionId: ...,
			pdcompanycode: ...,
			slipno: ...,
		},
	}`

    *Convert request body to xml format*
- **Response Api Payment**
        | パラメータ名 | 備考 |
        | ------ | ------ |
        | result | |

- **Response:**

  - **Code:** 200 [Success]
    **Content:**

    `{}`

  - **Code:** 400 [Fail]
      **Content:**

      `{
        error_message: 'Error messsage'
      }`