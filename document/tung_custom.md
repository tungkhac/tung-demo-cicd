## **EFO / Webchat API return custom data**
## 1. EFO: Api return Fjnext pulldown job data
Returns json data about Fjnext pulldown job.

- **URL**

  /api/custom/fjnext/pulldown/job

- **Method:**

  `GET`

- **Data Params**

- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "type": "006",
        "default_value": [
            "0"
        ],
        "data": [
            {
                "value": 1,
                "text": "会社員"
            },
            {
                "value": 1,
                "text": "会社役員"
            },
            {
                "value": 1,
                "text": "公務員"
            },
            {
                "value": 1,
                "text": "自営業・経営者"
            },
            {
                "value": 1,
                "text": "士師族"
            },
            {
                "value": 1,
                "text": "その他"
            }
        ]
    }

## 2. Webchat: Api return Webchat textarea data
Returns json data about Webchat textarea.

- **URL**

  /api/custom/webchat/textarea

- **Method:**

  `POST`

- **Data Params**
  + scenario_id
  + variable_id
  + required_flg
  + placeholder
  + title
  + btn_next


- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "type" : "010",
        "variable" : "5992abfe9a892046be0cbd0e",
        "required_flg" : 1,
        "message" : {
            "scenario_id" : "5dfdb05efdce273d537aa84f",
            "placeholder" : "placeholder text",
            "title" : "ccc"
        }
    }

## 3. Api return Dlighted calculate time data
Returns json data about Dlighted calculate time.

- **URL**

  /api/custom/dlighted/calculateTimes

- **Method:**

  `POST`

- **Data Params**
  + time
  + employees_number


- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        "currentReceptionTime": "60",
        "notConcentrated": "400",
        "reductionTime": "-1,200",
        "reductionCost": "-30,000"
    }

## 4. EFO: Api return pulldown autocomplete data
Returns json data about pulldown autocomplete data.

- **URL**

  /api/custom/pulldown/autocomplete

- **Method:**

  `GET`

- **Data Params**
  + search_type


- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        type : "006",
        auto_complete_name : "bank",
        data: [],
    }

## 5. EFO: Api return pulldown autocomplete search options data
Returns json data about pulldown autocomplete search options data.

- **URL**

  /api/custom/pulldown/autocomplete/search

- **Method:**

  `POST`

- **Data Params**
  + keyword
  + connect_page_id
  + user_id
  + search_type


- **Success Response:**

  - **Code:** 200
  - **Content:** 

    ```yaml
    {
        list :  [
          {
            id: "0525",
            text: "東日本銀行"
          }, 
          {
            id: "0000", 
            text: "日本銀行"
          }
        ]
    }