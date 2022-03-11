# guideline okurahome
## 1 API getBukken
- **Description**
  + Convert bukken name from input title
- **URL**

  http://api.botchan.chat/api/okurahome/getBukken

- **Method:**

  `POST`

- **Data Params**
  + title
   ```
   {
        "title":"オークラホーム泉田｜オークラホーム岡山支店"
    }
   ```


- **Success Response:**
    **Code:** 
    + 200
    **Content:** 
    ```
   {
        "bukken_name": "オークラホーム泉田"
    }

    ```

## 2 API getBukkenName
- **Description**
   + Get bukken name from input title
- **URL**

  http://api.botchan.chat/api/okurahome/getBukkenName

- **Method:**

  `POST`

- **Data Params**
  + "current_url_title"
  ```
      {
        "current_url_title": オークラホーム西大宮高木,
      }
  ```


- **Success Response:**
    **Code:** 
    + 200

    **Content:** 
    ```
     {
        "bukken_name": "オークラホーム泉田"
    }
    ```
    
    
## 3 API getBukkenTest
- **Description**
    + Return list bukken name from data test
- **URL**

   http://api.botchan.chat/api/okurahome/getBukkenTest

- **Method:**

  `GET`

- **Data Params**
    ```
     {}
    ```
- **Success Response:**
    **Code:** 
    + 200

    **Content:** 
  ```
    オークラホーム折立
    <br />《公式》オークラホーム折立｜宮城県仙台市青葉区折立 | 株式会社大倉の分譲住宅
    <br />
    <br />
    <br />
    <br />オークラホーム名取愛島台
    <br />《公式》オークラホーム名取愛島台｜宮城県名取市愛島台 | 株式会社大倉の分譲住宅
    <br />
    <br />
    <br />
    <br />オークラホームさいたま八王子
    <br />《公式》オークラホームさいたま八王子｜埼玉県さいたま市 | 株式会社大倉の分譲住宅
    <br />
    <br />
    <br />
    <br />オークラホーム六町
    <br />《公式》オークラホーム六町｜東京都足立区 | 株式会社大倉の分譲住宅
    <br />
    <br />
    <br />
    <br />オークラホーム習志野藤崎
    <br />《公式》オークラホーム習志野藤崎｜千葉県佐倉市 | 株式会社大倉の分譲住宅
    <br />
    <br />
    <br />
    <br />オークラホームユーカリが丘
    <br />《公式》オークラホームユーカリが丘｜千葉県佐倉市 | 株式会社大倉の分譲住宅
    <br />
    <br />
    <br />
    <br />オークラホーム七里東宮下
    <br />《公式》オークラホーム七里東宮下｜埼玉県さいたま市 | 株式会社大倉の分譲住宅
    <br />
    <br />
    <br />
    <br />オークラホーム浦和美園　6
    <br />《公式》オークラホーム浦和美園｜埼玉県さいたま市岩槻区尾ヶ崎新田 | 株式会社大倉の分譲住宅
    <br />
    <br />
    <br />
    <br />オークラホーム西大宮高木
    <br />《公式》オークラホーム西大宮高木 ラ・プリエール｜埼玉県さいたま市西区高木 | 株式会社大倉の分譲住宅
    <br />
    <br />
    <br />
    <br />オークラホーム　鶴瀬 ～希望の街～
    <br />【公式】オークラホーム　鶴瀬 ～希望の街～ | 株式会社大倉の新築分譲住宅
    <br />
    <br />
    <br />
    <br />オークラホーム北上尾
    <br />《公式》オークラホーム北上尾｜埼玉県上尾市 | 株式会社大倉の分譲住宅
    <br />
    <br />
    <br />
    <br />オークラホームひばりヶ丘
    <br />《公式》オークラホームひばりヶ丘｜埼玉県新座市 | 株式会社大倉の新築一戸建て・分譲住宅
    <br />
    <br />
    <br />
    <br />オークラホーム武豊
    <br />公式｜OKURA HOME TAKETOYO4 | オークラホーム 武豊4 株式会社大倉の新築分譲住宅
    <br />
    <br />
    <br />
    <br />オークラホームガーデンズ鶉
    <br />公式｜OKURA HOME Gardens UZURA2 | オークラホームガーデンズ　鶉Ⅱ 株式会社大倉の新築分譲住宅
    <br />
    <br />
    <br />
    <br />オークラホーム愛西
    <br />公式｜OKURA HOME AISAI2 | オークラホーム 愛西2 株式会社大倉の新築分譲住宅
    <br />
    <br />
    <br />
    <br />オークラホーム羽島福寿町
    <br />公式｜OKURA HOME HASHIMAMASAKICHOⅣ | オークラホーム 羽島福寿町Ⅳ 株式会社大倉の新築分譲住宅
    <br />
    <br />
    <br />
    <br />オークラホームガーデンズ大垣河間
    <br />公式｜OKURA HOME Gardens OGAKIGAMA | オークラホームガーデンズ 大垣河間 株式会社大倉の新築分譲住宅
    <br />
    <br />
    <br />
    <br />オークラホーム江南
    <br />公式｜OKURA HOME KONAN2 | オークラホーム 江南2 株式会社大倉の新築分譲住宅
    <br />
    <br />
    <br />
    <br />オークラホームガーデンズ奥町
    <br />公式｜OKURA HOME Gardens OKUCHO2 | オークラホームガーデンズ 奥町2 株式会社大倉の新築分譲住宅
    <br />
    <br />
    <br />
    <br />オークラホーム半田
    <br />公式｜OKURA HOME HANDA5 | オークラホーム 半田5 株式会社大倉の新築分譲住宅
    <br />
    <br />
    <br />
    <br />オークラホーム則武
    <br />公式｜OKURA HOME NORITAKE6| オークラホーム 則武6 株式会社大倉の新築分譲住宅
    <br />
    <br />
    <br />
    <br />オークラホーム宇治木幡
    <br />オークラホーム 宇治木幡Ⅱ
    <br />
    <br />
    <br />
    <br />オークラホーム吹田山田西
    <br />オークラホーム吹田山田西
    <br />
    <br />
    <br />
    <br />オークラホーム山科椥辻
    <br />オークラホーム 山科椥辻
    <br />
    <br />
    <br />
    <br />オークラホーム六地蔵
    <br />オークラホーム六地蔵
    <br />
    <br />
    <br />
    <br />オークラホーム西向日
    <br />オークラホーム 西向日
    <br />
    <br />
    <br />
    <br />オークラホーム山科勧修寺
    <br />オークラホーム 山科勧修寺
    <br />
    <br />
    <br />
    <br />オークラホーム宇多野
    <br />オークラホーム宇多野
    <br />
    <br />
    <br />
    <br />オークラホーム醍醐寺
    <br />オークラホーム 醍醐寺
    <br />
    <br />
    <br />
    <br />オークラホーム宇治三室戸
    <br />オークラホーム 宇治三室戸
    <br />
    <br />
    <br />
    <br />オークラホーム醍醐古道
    <br />オークラホーム 醍醐古道
    <br />
    <br />
    <br />
    <br />オークラホーム高槻奧天神
    <br />オークラホーム 高槻奧天神
    <br />
    <br />
    <br />
    <br />オークラホーム甲陽園　10
    <br />オークラホーム甲陽園 閑静な文教地区 甲陽園アドレス、誕生。
    <br />
    <br />
    <br />
    <br />オークラホーム池田旭丘
    <br />オークラホーム 池田旭丘
    <br />
    <br />
    <br />
    <br />オークラホーム田口II
    <br />オークラホーム 田口II
    <br />
    <br />
    <br />
    <br />オークラホーム池田渋谷
    <br />オークラホーム 池田渋谷 自由設計の家
    <br />
    <br />
    <br />
    <br />オークラホーム吹田藤が丘
    <br />オークラホーム吹田藤が丘
    <br />
    <br />
    <br />
    <br />ガーデンタウンさつき台
    <br />ガーデンタウンさつき台 | 和歌山県橋本市の新築一戸建て分譲住宅｜御幸辻駅から徒歩6分の自然豊かな街
    <br />
    <br />
    <br />
    <br />三田ガーデンタウンつつじヶ丘
    <br />三田ガーデンタウンつつじヶ丘
    <br />
    <br />
    <br />
    <br />【兵庫県三木市】みなぎ台の注文住宅用分譲地
    <br />【兵庫県三木市】みなぎ台の注文住宅用分譲地 | 子育て家族にオススメ
    <br />
    <br />
    <br />
    <br />オークラホーム泉田
    <br />オークラホーム泉田｜オークラホーム岡山支店
    <br />
    <br />
    <br />
    <br />オークラホーム雄町
    <br />オークラホーム雄町Ⅲ｜オークラホーム岡山支店
    <br />
    <br />
    <br />
    <br />オークラホーム大島
    <br />オークラホーム大島｜オークラホーム岡山支店
    <br />
    <br />
    <br />
    <br />オークラホーム西大寺中野
    <br />オークラホーム西大寺中野Ⅱ｜オークラホーム岡山支店
    <br />
    <br />
    <br />
    <br />オークラホーム藤崎
    <br />オークラホーム藤崎Ⅱ｜オークラホーム岡山支店
    <br />
    <br />
    <br />
    <br />オークラホーム瀬戸町瀬戸
    <br />オークラホーム瀬戸町瀬戸III｜オークラホーム岡山支店
    <br />
    <br />
    <br />
    <br />オークラホーム浜ノ茶屋
    <br />オークラホーム浜ノ茶屋｜オークラホーム岡山支店
    <br />
    <br />
    <br />
  ```


    
