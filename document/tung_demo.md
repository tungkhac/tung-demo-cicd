## **EFO / Webchat API return demo data**
## 1. EFO: Api return loopup pulldown data
Returns json data about loopup pulldown.

- **URL**

  /api/demo/loopup/pulldown

- **Method:**

  `GET`

- **Data Params**

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "type": "200",
        "list": [
            {
                "value": "001",
                "text": "LE THANH HAI",
                "related": [
                    {
                        "name": "Công ty",
                        "value": "Miyatsu"
                    },
                    {
                        "name": "Bộ phận",
                        "value": "Developer"
                    },
                    {
                        "name": "Nhóm",
                        "value": "Wevnal"
                    }
                ]
            },
            {
                "value": "002",
                "text": "Nguyen Khac Tung",
                "related": [
                    {
                        "name": "Công ty",
                        "value": "Miyatsu"
                    }
                ]
            },
            {
                "value": "003",
                "text": "Vu Thi My Linh",
                "related": [
                    {
                        "name": "Công ty",
                        "value": "Miyatsu"
                    },
                    {
                        "name": "Bộ phận",
                        "value": "Developer"
                    }
                ]
            },
            {
                "value": "004",
                "text": "Bui Viet An"
            }
        ]
    }

## 2. EFO: Api return pulldown sample data
Returns json data about pulldown sample.

- **URL**

  /api/demo/sample/pulldown

- **Method:**

  `GET`

- **Data Params**

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "type": "006",
        "first_option_remove_flg": 1,
        "default_value": [
            "3"
        ],
        "data": [
            {
                "value": "0",
                "text": "Option 1"
            },
            {
                "value": "2",
                "text": "Option 2"
            },
            {
                "value": "3",
                "text": "Option 3"
            },
            {
                "value": "4",
                "text": "Option 4"
            }
        ]
    }

## 3. EFO: Api return calendar unavailable sample data
Returns json data about calendar unavailable sample.

- **URL**

  /api/demo/sample/calendar1

- **Method:**

  `GET`

- **Data Params**

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "mode": "unavailable",
        "date": [
            "2020-03-14",
            "2020-03-16",
            "2020-03-18"
        ]
    }

## 4. EFO: Api return calendar available sample data
Returns json data about calendar available sample.

- **URL**

  /api/demo/sample/calendar2

- **Method:**

  `GET`

- **Data Params**

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "mode": "available",
        "date": [
            "2020-03-14",
            "2020-03-16",
            "2020-03-18"
        ]
    }

## 5. EFO: Api return checkbox sample data
Returns json data about checkbox sample.

- **URL**

  /api/demo/sample/checkbox

- **Method:**

  `GET`

- **Data Params**

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "data": [
            {
                "value": "001",
                "text": "text1"
            },
            {
                "value": "002",
                "text": "text2"
            },
            {
                "value": "003",
                "text": "text3"
            }
        ]
    }

## 6. EFO: Api return checkbox error sample data
Returns json data about checkbox error sample.

- **URL**

  /api/demo/sample/checkbox2

- **Method:**

  `GET`

- **Data Params**

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "error_message": "該当データーがありません",
        "data": []
    }

## 7. Webchat: Api return checkbox sample data
Returns json data about Webchat checkbox sample.

- **URL**

  /api/demo/sample/webchat/Checkbox

- **Method:**

  `GET`

- **Data Params**

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "data": [
            {
                "value": "001",
                "text": "text1"
            },
            {
                "value": "002",
                "text": "text2"
            },
            {
                "value": "003",
                "text": "text3"
            }
        ],
        "btn_next": "Next custom"
    }

## 8. EFO: Api return radio sample data
Returns json data about radio sample.

- **URL**

  /api/demo/sample/radio

- **Method:**

  `GET`

- **Data Params**

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "data": [
            {
                "value": "001",
                "text": "text1"
            },
            {
                "value": "002",
                "text": "text2",
                "default_select_flg": 1
            },
            {
                "value": "003",
                "text": "text3"
            }
        ]
    }

## 9. EFO: Api return radio image sample data
Returns json data about radio image sample.

- **URL**

  /api/demo/sample/radioImage

- **Method:**

  `GET`

- **Data Params**

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "template_type": "002",
        "data": [
            [
                {
                    "image_url": "https://botchancms.blob.core.windows.net/tungnk/uploads/5c60e2a9fdce27064636f363/5c205bfd1cc24.jpeg",
                    "value": "",
                    "text": "1"
                },
                {
                    "image_url": "https://botchancms.blob.core.windows.net/tungnk/uploads/5c60e2a9fdce27064636f363/5bc4509e18a3c.jpeg",
                    "value": "",
                    "text": "2",
                    "default_select_flg": 1
                }
            ],
            [
                {
                    "image_url": "https://botchancms.blob.core.windows.net/tungnk/uploads/5c60e2a9fdce27064636f363/5c205beab1b80.jpeg",
                    "value": "",
                    "text": "3"
                }
            ],
            [
                {
                    "image_url": "https://botchancms.blob.core.windows.net/tungnk/uploads/5c60e2a9fdce27064636f363/5bc4509e18a3c.jpeg",
                    "value": "",
                    "text": "4"
                }
            ]
        ]
    }

## 10. EFO: Api return radio error sample data
Returns json data about radio error sample.

- **URL**

  /api/demo/sample/radioError

- **Method:**

  `GET`

- **Data Params**

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "error_message": "該当データーがありません",
        "data": []
    }

## 11. EFO: Api return input/input error sample data
Returns json data about input/input error sample.

- **URL**

  /api/demo/sample/validation

- **Method:**

  `GET`

- **Data Params**

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "status": "valid"
    }

    {
        "status": "invalid",
        "message": "重複しています。別のメールアドレスを使ってください。"
    }

    {
        "status": "invalid",
        "message": "重複しています。別のユーザー名を使ってください。"
    }

## 12. Api return check resource sample data
Returns json data about check resource sample.

- **URL**

  /api/demo/check/resourceIp

- **Method:**

  `GET`

- **Data Params**

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "error_message": "該当データーがありません",
        "data": []
    }

## 13. EFO: Api return carousel sample data
Returns json data about carousel sample.

- **URL**

  /api/demo/sample/carousel

- **Method:**

  `GET`

- **Data Params**

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "type": "012",
        "data": [
            {
                "title": "Carousel API item 1",
                "subtitle": "sub tittle item 1",
                "item_url": "https://admin.botchan.chat/demo/5c10c42aa24a6109ed6bf92f",
                "image_url": "https://botchancms.blob.core.windows.net/tungnk/uploads/5a5449d5059408c5f50f0bb3/5bc4509e18a3c.jpeg",
                "button": {
                    "title": "Detail",
                    "link": "https://www.google.com/",
                    "type": "link"
                }
            },
            {
                "title": "Carousel API item 2",
                "subtitle": "sub tittle item 2",
                "item_url": "https://admin.botchan.chat/demo/5c10c42aa24a6109ed6bf92f",
                "image_url": "https://botchancms.blob.core.windows.net/tungnk/uploads/5a5449d5059408c5f50f0bb3/5c205bfd1cc24.jpeg",
                "button": {
                    "title": "",
                    "type": "select"
                }
            },
            {
                "title": "Carousel API item 3",
                "subtitle": "sub tittle item 3",
                "item_url": "",
                "image_url": "https://botchancms.blob.core.windows.net/tungnk/uploads/5a5449d5059408c5f50f0bb3/5c205beab1b80.jpeg",
                "button": {
                    "title": "",
                    "type": "select"
                }
            }
        ]
    }

## 14. Line: Api return carousel sample data
Returns json data about Line carousel sample.

- **URL**

  /api/demo/line/carousel

- **Method:**

  `GET`

- **Data Params**

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "data": [
            {
                "type": "003",
                "message": {
                    "type": "template",
                    "altText": "carousel demo a",
                    "template": {
                        "type": "carousel",
                        "columns": [
                            {
                                "text": "This is demo carousel message a",
                                "thumbnailImageUrl": "https://botchancms.blob.core.windows.net/develop/uploads/5b55a87609c6331127501cb4/399d58558728942d110f.jpeg",
                                "title": "carousel demo a",
                                "actions": [
                                    {
                                        "type": "uri",
                                        "label": "Button URL (google)",
                                        "uri": "https://www.google.com/"
                                    },
                                    {
                                        "type": "message",
                                        "label": "Button message",
                                        "text": "Have a nice day!"
                                    },
                                    {
                                        "type": "postback",
                                        "label": "Other scenario",
                                        "data": "BSCENARIO_5b88f15009c6335c990ee844_5b55a88109c6332ca420a2cc_Other scenario"
                                    }
                                ]
                            },
                            {
                                "text": "This is demo carousel message b",
                                "thumbnailImageUrl": "https://botchancms.blob.core.windows.net/develop/uploads/5b55a87609c6331127501cb4/62c3f65d6942c82eec6c.jpeg",
                                "title": "carousel demo b",
                                "actions": [
                                    {
                                        "type": "uri",
                                        "label": "Button link chatwork",
                                        "uri": "https://www.chatwork.com"
                                    },
                                    {
                                        "type": "uri",
                                        "label": "Button link youtube",
                                        "uri": "https://www.youtube.com/"
                                    },
                                    {
                                        "type": "uri",
                                        "label": "Button link (acebook",
                                        "uri": "http://www.facebook.com/"
                                    }
                                ]
                            },
                            {
                                "text": "This is demo carousel message c",
                                "thumbnailImageUrl": "https://botchancms.blob.core.windows.net/develop/uploads/5b55a87609c6331127501cb4/3c8b1e06f0e0fa9e01ab.png",
                                "title": "carousel demo c",
                                "actions": [
                                    {
                                        "type": "uri",
                                        "label": "Button link youtube",
                                        "uri": "https://www.youtube.com/"
                                    },
                                    {
                                        "type": "uri",
                                        "label": "Button link youtubeutube",
                                        "uri": "https://www.youtube.com/"
                                    },
                                    {
                                        "type": "uri",
                                        "label": "Button link youtube",
                                        "uri": "https://www.youtube.com/"
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
        ]
    }

## 15. Line: Api return carousel sample data
Returns json data about Line carousel sample.

- **URL**

  /api/demo/line/carousel2

- **Method:**

  `GET`

- **Data Params**

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "message": {
            "type": "template",
            "altText": "carousel demo a",
            "template": {
                "type": "carousel",
                "columns": [
                    {
                        "text": "This is demo carousel message a",
                        "thumbnailImageUrl": "https://botchancms.blob.core.windows.net/develop/uploads/5b55a87609c6331127501cb4/399d58558728942d110f.jpeg",
                        "title": "carousel demo a",
                        "actions": [
                            {
                                "type": "uri",
                                "label": "Button URL (google)",
                                "uri": "https://www.google.com/"
                            },
                            {
                                "type": "message",
                                "label": "Button message",
                                "text": "Have a nice day!"
                            },
                            {
                                "type": "postback",
                                "label": "Other scenario",
                                "data": "BSCENARIO_5b88f15009c6335c990ee844_5b55a88109c6332ca420a2cc_Other scenario"
                            }
                        ]
                    },
                    {
                        "text": "This is demo carousel message b",
                        "thumbnailImageUrl": "https://botchancms.blob.core.windows.net/develop/uploads/5b55a87609c6331127501cb4/62c3f65d6942c82eec6c.jpeg",
                        "title": "carousel demo b",
                        "actions": [
                            {
                                "type": "uri",
                                "label": "Button link chatwork",
                                "uri": "https://www.chatwork.com"
                            },
                            {
                                "type": "uri",
                                "label": "Button link youtube",
                                "uri": "https://www.youtube.com/"
                            },
                            {
                                "type": "uri",
                                "label": "Button link (acebook",
                                "uri": "http://www.facebook.com/"
                            }
                        ]
                    },
                    {
                        "text": "This is demo carousel message c",
                        "thumbnailImageUrl": "https://botchancms.blob.core.windows.net/develop/uploads/5b55a87609c6331127501cb4/3c8b1e06f0e0fa9e01ab.png",
                        "title": "carousel demo c",
                        "actions": [
                            {
                                "type": "uri",
                                "label": "Button link youtube",
                                "uri": "https://www.youtube.com/"
                            },
                            {
                                "type": "uri",
                                "label": "Button link youtubeutube",
                                "uri": "https://www.youtube.com/"
                            },
                            {
                                "type": "uri",
                                "label": "Button link youtube",
                                "uri": "https://www.youtube.com/"
                            }
                        ]
                    }
                ]
            }
        }
    }

## 16. EFO: Api return Levtech button link data
Returns json data about Levtech button link sample.

- **URL**

  /api/demo/buttonLinkLevtech

- **Method:**

  `POST`

- **Data Params**
    + url1
    + url2
    + url3
    + type

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "message_radio": [
          {
              "type": "uri",
              "label": "エンジニアの方はこちら",
              "uri": "https://domain1.com"
          },
          {
              "type": "uri",
              "label": "クリエイターの方はこちら",
              "uri": "https://domain2.com"
          },
          {
              "type": "uri",
              "label": "未経験の方はこちら",
              "uri": "https://domain3.com"
          }
        ],
    }

## 17. EFO: Api return button link sample data
Returns json data about button link sample.

- **URL**

  /api/demo/buttonLink

- **Method:**

  `GET`

- **Data Params**

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "message_radio": [
            {
                "type": "uri",
                "label": "テスト1",
                "uri": "https://vnexpress.net"
            },
            {
                "type": "uri",
                "label": "テスト2",
                "uri": "https://dantri.com.vn"
            },
            {
                "type": "uri",
                "label": "テスト3",
                "uri": "https://news.zing.vn"
            }
        ]
    }

## 18. EFO: Api return product purchase sample data
Returns json data about product purchase sample.

- **URL**

  /api/demo/sample/productPurchase

- **Method:**

  `GET`

- **Data Params**

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "data": [
            [
                {
                    "image_url": "https://botchancms.blob.core.windows.net/tungnk/uploads/5c60e2a9fdce27064636f363/5c205beab1b80.jpeg",
                    "unit_price": "1000",
                    "text": "Product 1",
                    "product_code": "001",
                    "default_select_flg": 0,
                    "quantity_max": "2",
                    "set_quantity_flg": 1,
                    "custom_price_text": ""
                }
            ],
            [
                {
                    "image_url": "https://botchancms.blob.core.windows.net/tungnk/uploads/5c60e2a9fdce27064636f363/5c205bfd1cc24.jpeg",
                    "unit_price": "2000",
                    "text": "Product 2",
                    "product_code": "002",
                    "default_select_flg": 1,
                    "quantity_max": "",
                    "set_quantity_flg": 0,
                    "custom_price_text": "Contact"
                }
            ],
            [
                {
                    "image_url": "https://botchancms.blob.core.windows.net/tungnk/uploads/5c60e2a9fdce27064636f363/5bc4509e18a3c.jpeg",
                    "unit_price": "3000",
                    "text": "Product 3",
                    "product_code": "003",
                    "default_select_flg": 0,
                    "quantity_max": "",
                    "set_quantity_flg": 0,
                    "custom_price_text": "Contact"
                }
            ]
        ]
    }

## 19. EFO: Api return product purchase error sample data
Returns json data about product purchase error sample.

- **URL**

  /api/demo/sample/productPurchaseError

- **Method:**

  `GET`

- **Data Params**

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "error_message": "該当データーがありません",
        "data": []
    }

## 20. EFO: Api return textarea readonly sample data
Returns json data about textarea readonly sample.

- **URL**

  /api/demo/sample/textareaReadonly

- **Method:**

  `GET`

- **Data Params**

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "template_type": "002",
        "data": "This is demo Textarea readonly API message \nDemo variable: {{variable 01}}"
    }

## 21. Api return test timeout sample data
Returns json data about test timeout sample.

- **URL**

  /api/demo/testTimeout

- **Method:**

  `GET`

- **Data Params**

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {}

## 22. Webchat: Api return menu sample data
Returns json data about menu sample.

- **URL**

  /api/demo/menuApi1

- **Method:**

  `GET`

- **Data Params**

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "content": "<p>2019/3/22 <span>In sem convallis vitae ullamcorper 1</span></p><p>2019/3/22 <span>In sem convallis vitae ullamcorper 2</span></p><p>2019/3/22 <span>In sem convallis vitae ullamcorper 3</span></p><p>2019/3/22 <span>In sem convallis vitae ullamcorper 4</span></p><p>2019/3/22 <span>In sem convallis vitae ullamcorper 5</span></p><p>2019/3/22 <span>In sem convallis vitae ullamcorper 6</span></p><p>2019/3/22 <span>In sem convallis vitae ullamcorper 7</span></p><p>2019/3/22 <span>In sem convallis vitae ullamcorper 8</span></p><p>2019/3/22 <span>In sem convallis vitae ullamcorper 9</span></p>"
    }

## 23. Webchat: Api return menu 2 sample data
Returns json data about menu 2 sample.

- **URL**

  /api/demo/menuApi2

- **Method:**

  `GET`

- **Data Params**

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "content": "<p>In nec massa aliquam eu libero in purus mollis ultrices et vel nunc integer aliquet libero praesent fermentum 1</p><p>In nec massa aliquam eu libero in purus mollis ultrices et vel nunc integer aliquet libero praesent fermentum 2</p><p>In nec massa aliquam eu libero in purus mollis ultrices et vel nunc integer aliquet libero praesent fermentum 3</p><p>In nec massa aliquam eu libero in purus mollis ultrices et vel nunc integer aliquet libero praesent fermentum 4</p><p>In nec massa aliquam eu libero in purus mollis ultrices et vel nunc integer aliquet libero praesent fermentum 5</p><p>In nec massa aliquam eu libero in purus mollis ultrices et vel nunc integer aliquet libero praesent fermentum 6</p><p>In nec massa aliquam eu libero in purus mollis ultrices et vel nunc integer aliquet libero praesent fermentum 7</p><p>In nec massa aliquam eu libero in purus mollis ultrices et vel nunc integer aliquet libero praesent fermentum 8</p><p>In nec massa aliquam eu libero in purus mollis ultrices et vel nunc integer aliquet libero praesent fermentum 9</p><p>In nec massa aliquam eu libero in purus mollis ultrices et vel nunc integer aliquet libero praesent fermentum 10</p><p>In nec massa aliquam eu libero in purus mollis ultrices et vel nunc integer aliquet libero praesent fermentum 11</p><p>In nec massa aliquam eu libero in purus mollis ultrices et vel nunc integer aliquet libero praesent fermentum 12</p><p>In nec massa aliquam eu libero in purus mollis ultrices et vel nunc integer aliquet libero praesent fermentum 13</p>"
    }