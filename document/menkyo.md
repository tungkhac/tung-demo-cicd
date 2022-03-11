## **EFO パルプランニング**
## 1. Api pulldown area
Returns json data about a area.

- **URL**

  /api/menkyo/pulldownArea

- **Method:**

  `POST`

- **Data Params**
    + current_url_title
- **Success Response:**

  - **Code:** 200
    **Content:**

    `{
        type: "006",
        data: [
            {
                value: '',
                text: ''
            },
            ...
        ],
        default_value: [area_default],
        name:"pulldown_area"
    }`

## 2. Api pulldown pref
Returns json data about a pref.

- **URL**

  /api/menkyo/pulldownPref

- **Method:**

  `POST`

- **Data Params**
    + current_url_title
    + area
- **Success Response:**

  - **Code:** 200
    **Content:**

    `{
        type: "006",
        data: [
            {
                value: '',
                text: ''
            },
            ...
        ],
        default_value: [pref_default],
        name:"pulldown_pref"
    }`

## 3. Api pulldown school name
Returns json data about a schol.

- **URL**

  /api/menkyo/pulldownSchool

- **Method:**

  `POST`

- **Data Params**
    + current_url_title
    + pref

- **Success Response:**

  - **Code:** 200
    **Content:**

    ` {
        type: "006",
        data: [
             {
                value: '',
                text: ''
            },
            ...
        ],
        default_value: [school_default],
        name:"pulldown_school"
    }`

## 4. Api pulldown room type
 Returns json data about a room type.

 - **URL**

   /api/menkyo/pulldownRoomType

 - **Method:**

   `POST`

 - **Data Params**
    + school_name
 - **Success Response:**

   - **Code:** 200
     **Content:**

     `{
        type: "006",
        data: [
            {
                value: '',
                text: ''
            },
            ...
        ]
    }`
