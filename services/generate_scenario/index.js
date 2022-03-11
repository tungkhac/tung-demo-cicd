// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { URL } = require('url');

const axios = require("axios").default;
const cheerio = require('cheerio');
// const iconv = require("iconv-lite");
const config = require("config");
const model = require('../../model');
// const detectCharset = require("detect-character-encoding");
// const axiosCookieJarSupport = require('axios-cookiejar-support').default;
// const tough = require('tough-cookie');
const BotMessage = model.BotMessage;
const Connect = model.Connect;
const ConnectPage = model.ConnectPage;
const Scenario = model.Scenario;
const ScenarioGenerateLog = model.ScenarioGenerateLog;
const Variable = model.Variable;

// axiosCookieJarSupport(axios);

const USER_ID = config.has('autoGenerateUserId') ? config.get('autoGenerateUserId') : "";
const AI_API = config.has('autoGenerateAIAPI') ? config.get('autoGenerateAIAPI') : "";
const REGISTER_URL_BASE = config.has('registerURLBase') ? config.get('registerURLBase') : "https://admin.botchan.chat/v2/auth/register";


// const fetchHtml = async (url) => {
//   const cookieJar = new tough.CookieJar();
//   const { data } = await axios.get(url, {
//     jar: cookieJar,
//     withCredentials: true,
//     responseType: 'arraybuffer'
//   });
//   const detected = detectCharset(data);
//   const charset = (detected && detected.encoding) || "utf8";
//   const txt = iconv.decode(data, charset);
//   return txt;
// }

// const loadCherrio = async (pageURL) => {
//   const html = await fetchHtml(pageURL);
//   const $ = cheerio.load(html);
//   return $;
// }

const url2company = (url) => {
  let company = new URL(url).host;
  company = company.replace(".co.jp", "");
  company = company.replace(".ne.jp", "");
  company = company.replace(".or.jp", "");
  company = company.replace(".com", "");
  company = company.replace(".net", "");
  company = company.replace(".org", "");
  company = company.replace(".jp", "");
  const spl = company.split(".");
  company = spl[spl.length - 1];
  return company;
}

const generateScenario = async (connect_page_id, scenario_id, url, formType, log) => {
  try {
    let titles;
    let $;
    const useAI = true;
    if (useAI) {
      console.log(`calling api ${AI_API}`);
      const { data } = await axios.get(AI_API, { params: { url } });
      // const { data } = await axios.get('http://20.69.67.121:8080', { params: { url } });
      if (data.error) {
        console.log(`AI API error: ${data.error}`);
        return;
      }
      titles = JSON.parse(data.result.replace(/'/g, "\""))
      $ = cheerio.load(data.source);
        
    } else {
      // Currently it cannot work without AI API
      return;
    }    

    log.category_result = titles;
    await log.save();

    console.log("---- titles");
    console.log(titles);

    // const charset = await getCharset(pageURL);
    // const html = await fetchHtml(pageURL, charset);
    // // console.log('----', html)
    // const $ = cheerio.load(html);
    const res = getBlocks(0, $, titles);
    const blocks = res.blocks;
    titles = res.titles;

    let messages = [];   
    if(blocks) {
      for (let i = 0; i < blocks.length; i++) {
        messages.push(blockExtraction0($, blocks[i], titles[i]));
      }
      messages = filterMessage(messages);
    }
    if (messages.length > 0) {
      log.messages = messages.map((m) => {
        return {
          blockTitle: m.blockTitle,
          component: m.component,
        }
      });
      await log.save();

      let position = 0;

      {
        const company = url2company(url);

        let message;
        if (formType === "document_request") {
          message = `この度は、${company}のホームページをご覧いただき、ありがとうございます！こちらのチャットにて、資料請求を受け付けております。`;
        } else {
          message = `この度は、${company}のホームページをご覧いただき、ありがとうございます！こちらのチャットにて、ご連絡をお願いします。`;
        }
        const botMessage = new BotMessage({
          scenario_id,
          cpid: connect_page_id,
          position,
          data: [
                  {
                      "message" : [
                        {
                          "type": "001",
                          "content": message
                        }
                      ]
                  }
              ],
          message_type: '002',
          block_name: "Try with real 0",
          auto_generate: 1,
        });

        await botMessage.save().catch(error => {
          throw new Error("Bot message can not save");
        })

        position++;
      }

      for (const message of messages) {
        position = await blockExtraction($, message, position, connect_page_id, scenario_id);
      }

      const registerURL = `${REGISTER_URL_BASE}?auto_generated=${connect_page_id}`;
      {
          const botMessage = new BotMessage({
            scenario_id,
            cpid: connect_page_id,
            position,
            data: [
                    {
                        "message" : [
                          {
                            "type" : "010",
                            "content" : "（個人情報の取り扱いのご案内については、管理画面より文言の設定をお願いします。もしくは、プライバシーポリシーと利用規約のURLを管理画面より設定をお願いします。）",
                            "title_flg" : "001",
                            "title" : "",
                            "template_type" : "001",
                            "text_confirm" : "個人情報の取り扱いに同意する",
                            "required_flg" : 1
                          }
                        ]
                    }
                ],
            message_type: '001',
            block_name: "Try with real 1",
            auto_generate: 1,
          });

          await botMessage.save().catch(error => {
            throw new Error("Bot message can not save");
          })

          position++;
      }
      {
          const botMessage = new BotMessage({
            scenario_id,
            cpid: connect_page_id,
            position,
            data: [
                    {
                        "message" : [
                          {
                            "type": "001",
                            "content": "生成したシナリオは以上です。チャットフォームのイメージはできましたでしょうか？BOTCHAN EFOは30日間無料でお試しいただけます！下のボタンから早速開始してみましょう！"
                          }
                        ]
                    }
                ],
            message_type: '002',
            block_name: "Try with real 2",
            auto_generate: 1,
          });

          await botMessage.save().catch(error => {
            throw new Error("Bot message can not save");
          })

          position++;
      }
      {
          const botMessage = new BotMessage({
            scenario_id,
            cpid: connect_page_id,
            position,
            data: [
                    {
                        "message" : [
                            {
                                "type" : "012",
                                "list" : [
                                    {
                                        "title" : "",
                                        "subtitle" : "",
                                        "item_url" : registerURL,
                                        "image_url" : "https://botchan.chat/efo-demo/img/chatbanner.png",
                                    }
                                ],
                                "title_flg" : "002",
                                "title" : "",
                                "template_type" : "001",
                                "short_link_flg" : 0,
                                "variable_id" : "",
                                "required_flg" : 0
                            }
                        ]
                    }
                ],
            message_type: '001',
            block_name: "Try with real",
            btn_next: "新規登録",
            auto_generate: 1,
          });

          await botMessage.save().catch(error => {
            throw new Error("Bot message can not save");
          })

          position++;
      }
      {
          const botMessage = new BotMessage({
            scenario_id,
            cpid: connect_page_id,
            position,
            data: [
                    {
                        "message" : [
                          {
                            "type": "006",
                            "content": `location.href = "${registerURL}";`
                          }
                        ]
                    }
                ],
            message_type: '002',
            block_name: "Try with real 3",
            auto_generate: 1,
          });

          await botMessage.save().catch(error => {
            throw new Error("Bot message can not save");
          })

          position++;
      }
    }
  } catch (error) {
    throw error;
  }
};

function escapeRegex(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

const getBlocks = (pos, $, titles) => {
  $('header').remove();
  $('input[type=hidden]').remove();
  $('[class^="search"]').remove(); //検索フォームを除去する
  $('br').remove();
  $('hr').remove();

  //ここでtitleのキーワードマッチで分類
  //defaultになるか、select, radio, checkboxをみつけたらoptionふくめた要素をかえす
　// parentで次のtitleが含まれてたらそこで停止して応答する

  const return_array = new Array();
  const titles_array = new Array();
  for( j = 0; j < titles.length; j ++) {
 
    const check = new RegExp(escapeRegex(titles[j]));

    let items;
    if ($("dt:contains('"+titles[j]+"')").toArray().length > 0) {
      items = $("dt:contains('"+titles[j]+"')").toArray();  
    } else if ( $("p:contains('"+titles[j]+"')").toArray().length > 0) {
      items = $("p:contains('"+titles[j]+"')").toArray();  
    } else if ( $("label:contains('"+titles[j]+"')").toArray().length > 0) {
      items = $("label:contains('"+titles[j]+"')").toArray();  
    } else if ( $("th:contains('"+titles[j]+"')").toArray().length > 0) {
      items = $("th:contains('"+titles[j]+"')").toArray();  
    } else if ( $("td:contains('"+titles[j]+"')").toArray().length > 0) {
      items = $("td:contains('"+titles[j]+"')").toArray();  
    } else if ( $("li:contains('"+titles[j]+"')").toArray().length > 0) {
      items = $("li:contains('"+titles[j]+"')").toArray();  
    } else if ( $("h4:contains('"+titles[j]+"')").toArray().length > 0) {
      items = $("h4:contains('"+titles[j]+"')").toArray();  
    } else if ( $("h3:contains('"+titles[j]+"')").toArray().length > 0) {
      items = $("h3:contains('"+titles[j]+"')").toArray();  
    } else if ( $("h2:contains('"+titles[j]+"')").toArray().length > 0) {
      items = $("h2:contains('"+titles[j]+"')").toArray();  
    } else if ( $("legend:contains('"+titles[j]+"')").toArray().length > 0) {
      items = $("legend:contains('"+titles[j]+"')").toArray();  
    } else if ( $("span:contains('"+titles[j]+"')").toArray().length > 0) {
      items = $("span:contains('"+titles[j]+"')").toArray();  
    } else {
      console.log("div");
      items = $("div:contains('"+titles[j]+"')").toArray();  
    }
    
    
    console.log(items.length);
    console.log($(items[0]));
    console.log("====");
    let hit = false;      
    for(var i=0; i< items.length; i++){
    //  console.log($(items[i]).html())
      if (hit) {
        break;
      }
      const blockTitle = $(items[i]).html()
      //console.log(blockTitle);
      // まず探す
      if (check.exec(blockTitle)){
        console.log("check:true");

        // 弟を探索
        const n = $(items[i]).next();
        console.log($(n));
        let c = false;
        if ($('input,select,textarea', n).toArray().length > 0) c = true;
        if (c) {
          console.log("hit-n1 input");
         // console.log($(items[i]).html());
          //console.log($(n).html());
          return_array.push($("<div>" + $(items[i]).prop('outerHTML') + $(n).prop('outerHTML') + "</div>"));  
          titles_array.push(titles[j]);        
          hit = true;
          continue;
        }
        // 親を探索
        let p = $(items[i]).parent();
        c = false;

        // 親がthだったら、next(td)を渡す
        if ($('th', p).toArray().length > 0) {
          console.log("hit parent th");
          p = $(p).next();
        }

        if ($('input,select,textarea', p).toArray().length > 0) c = true;
        if (c) {
          console.log("hit-p1 input");
          console.log($(p).html());
          return_array.push(p);
          titles_array.push(titles[j]);      
          hit = true;
          continue;
        }else {
          console.log("unhit-p1 input"+titles[j]);
          const pp = $(p).parent();
          const check2 = /.*(input|select|textarea).*/gm;  
          if (check2.exec(pp.html())) {
            console.log("hit parent.parent");
            return_array.push(pp);
            titles_array.push(titles[j]);      
            hit = true;
            continue;
          } else {
            console.log("no hit");
          }
        }
      } else {
        console.log("check:false");
      }
      
    }
  }

  console.log("~~~~~~~~~");
  return { pos: 1, blocks: return_array, titles: titles_array };
};

const blockExtraction0 = ($, block, title) => {

  const inputTexts = $("input:not([type]), input[type='text'], input[type='tel'], input[type='password'], input[type='email']", block).toArray();
  const radioButtons = $("input[type='radio']", block).toArray();
  const checkBoxes = $("input[type='checkbox']", block).toArray();
  const blockSelect = $('select', block).toArray();
  const textAreas = $('textarea[disabled!="disabled"]', block).toArray();

  let blockTitle = title;
  let blockOption = [];
  let component0 = matchKeyword(blockTitle);
  let component = matchKeyword(blockTitle);

  const botchan = /.*(botchan).*/gm;
  console.log(component);

  if (!botchan.exec(component)) {
    if (blockSelect.length>0 && !botchan.exec(component0)) {
      blockSelect.forEach(select => {
        const options = $('option', select).toArray();
        options.forEach(option => {        
          if($(option).text().trim() !== ''){
            blockOption.push({text: $(option).text(), value: ''});
          }
        });      
      });
      console.log(`SELECT: ${blockTitle}`);
      component = "default_select";    
    }

    if(checkBoxes.length > 0 && !botchan.exec(component0)) {
      const list = [];
      checkBoxes.forEach(checkbox => {
        const checkboxId = $(checkbox).attr('id');
        const label = $(`label[for="${checkboxId}"]`, block).text() ? $(`label[for="${checkboxId}"]`, block).text() : $(checkbox).parent().text();
        blockOption.push({value: '', text: label, default_select_flg: 0});
      });
      console.log(`CHECKBOX: ${blockTitle}`);
      component = "default_checkbox";
    }

    if(radioButtons.length > 0 && !botchan.exec(component0)) {
      const list = [];
      radioButtons.forEach(radio => {
        const radioId = $(radio).attr('id');
        const label = $(`label[for="${radioId}"]`, block).text() ? $(`label[for="${radioId}"]`, block).text() : $(radio).parent().text();;
        blockOption.push({value: '', text: label, default_select_flg: 0});
      });
      console.log(`RADIO: ${blockTitle}`);
      component = "default_radio";
    }

    if (textAreas.length>0 && !botchan.exec(component0)) {
      component = "default_textarea"; 
      blockOption = [];
    }
  }

  blockTitle = blockTitleFormat(blockTitle);
  blockTitle = blockTitle.replace(/^\s+/,  '').replace(/\s+$/, '').replace(/\s+/g, ' ');

  const message = {
    blockTitle,
    component,
    blockOption,
    inputTexts,
    textAreas,
    hasAddress: false,
    hasPref: false,
  };

  //都道府県をbotchan_pref_componentにする
  const pref = /.*(都道府県).*/gm;
  if (pref.exec(blockTitle)){
    console.log(">>>"+blockTitle);
    message.hasPref = true;
    message.component = "botchan_pref_component";
  }
  //住所は強制的にbotchan_address_componentにする>>>シナリオでは住所ブロックを出す
  const address = /.*(住所|所在地|郵便番号|郡|市区町村|市町村|建物名|番地|号室).*/gm;
  if (address.exec(blockTitle)){
    console.log(">>>"+blockTitle);
    message.hasAddress = true;
    message.component = "botchan_address_component";
  }

  // console.log("blockExtraction0: {");
  // console.log(message.blockTitle);
  // console.log(message.component);
  // console.log("}");

  return message;
}

const filterMessage = (items) => {
    //address check
  //住所項目が存在するか 都道府県が存在するか
  let hasAddress = false;
  let hasPref = false;
  for(let i = 0 ; i < items.length; i++) {
    if (items[i].hasAddress) {
      hasAddress = true;
    }
    if (items[i].hasPref) {
      hasPref = true;
    }  
  } 

  //cleaning
  const pref = /.*(都道府県).*/gm;
  let pushedAddress = false;
  const return_items = [];
  for(let i = 0 ; i < items.length; i++) {     
    //カッコのescapeをはずす
    items[i].blockTitle = items[i].blockTitle.replace(/(\\)/gm, "");

    //結局項目名がわからなかったものは配列から取り除く  項目名が明らかに長いのも怪しいので取り除く
    if (items[i].blockTitle != "" && items[i].blockTitle.length<40) {
      if (items[i].blockTitle == "()" ) {
        continue; //除外する
      }

      //住所項目がある場合は、郵便番号と都道府県など関連するブロックを除去し、botchan_address_componentひとつにする
      //「botchan_address_component」があったら、シナリオに住所ブロックをいれてください。
      if (hasAddress) {
        if (pushedAddress && (items[i].component == "botchan_address_component" || items[i].component == "botchan_pref_component" || items[i].component == "botchan_addr_etc_component" )){
            continue; //除外する
        }
        if (!pushedAddress && items[i].component == "botchan_address_component"){
          const address2 = /.*(住所|所在地).*/gm;  
          if (!address2.exec(items[i].blockTitle)){
            items[i].blockTitle = "住所";
          } 
          pushedAddress = true; //住所ひとつ登録する
        }
        return_items.push(items[i]);
      } else { //住所なし
        return_items.push(items[i]);
      }
    }
  }

  for (const message of return_items) {
    console.log("blockExtraction0+filter: {");
    console.log(message.blockTitle);
    console.log(message.component);
    console.log("}");
  }
  return return_items;
}

const blockExtraction = async ($, message, position, connect_page_id, scenario_id) => {
  const { blockTitle, component, blockOption, inputTexts, textAreas } = message;
  let variable;
  let variable_name;
  let variable_id;

  const messages = [];
  let selectCount = 0;
  switch (component) {
    case 'botchan_name_and_name_kana_component':
      variable_name = blockTitle;
      variable = await createVariable(connect_page_id,variable_name);
      variable_id = variable ? variable._id.toString() : undefined;
      messages.push({ type: "002", template_type: "001", title_flg: "002", title: "氏名", list: [{ placeholder: "姓"}, { placeholder: "名"}], variable_id, required_flg: 0})
      messages.push({ type: "002", template_type: "001", title_flg: "002", title: "ふりがな", list: [{ placeholder: "せい"}, { placeholder: "めい"}], variable_id, required_flg: 0});
      break;
    case 'botchan_name_component':
      variable_name = blockTitle;
      variable = await createVariable(connect_page_id, variable_name);
      variable_id = variable ? variable._id.toString() : undefined;
      messages.push({ type: "002", template_type: "001", title_flg: "002", title: blockTitle, list: [{ placeholder: "姓"}, { placeholder: "名"}], variable_id, required_flg: 0});
      break;
    case 'botchan_name_kana_component':
      variable_name = blockTitle;
      variable = await createVariable(connect_page_id,variable_name);
      variable_id = variable ? variable._id.toString() : undefined;
      messages.push({ type: "002", template_type: "001", title_flg: "002", title: blockTitle, list: [{ placeholder: "せい"}, { placeholder: "めい"}], variable_id, required_flg: 0});
      break;
    case 'botchan_name_katakana_component':
      variable_name = blockTitle;
      variable = await createVariable(connect_page_id,variable_name);
      variable_id = variable ? variable._id.toString() : undefined;
      messages.push({ type: "002", template_type: "001", title_flg: "002", title: blockTitle, list: [{ placeholder: "セイ"}, { placeholder: "メイ"}], variable_id, required_flg: 0});
      break;
    case 'botchan_birth_day_component':
      variable_name = blockTitle;
      variable = await createVariable(connect_page_id,variable_name);
      variable_id = variable ? variable._id.toString() : undefined;
      messages.push({type: "006", template_type: "003", title_flg: "002", title: "生年月日", list: [], variable_id, required_flg: 0, years_start: "1945", years_end: "2021"});
      break;
    case 'botchan_tel_component':
      variable_name = blockTitle;
      variable = await createVariable(connect_page_id,variable_name);
      variable_id = variable ? variable._id.toString() : undefined;
      if(inputTexts.length > 1) {
        messages.push({
            type: "002",
            tel_input_type: "002",
            template_type: "004",
            title_flg: "002",
            title: blockTitle,
            list: [
                {
                  placeholder: "090"
                },
                {
                  placeholder: "1122"
                },
                {
                  placeholder: "3344"
                }
            ],
            variable_id: variable_id,
            required_flg: 0
        })
      } else {
        messages.push({type: '002', template_type: '001', title_flg: '002', title: blockTitle, list: [{placeholder: '09011223344'}], variable_id, required_flg: 0})
      }
      break;
    case 'botchan_address_component':
      variable_name = blockTitle;
      variable = await createVariable(connect_page_id,variable_name);
      variable_id = variable ? variable._id.toString() : undefined;
      messages.push({
                    type : "007",
                    list : [
                        {
                            type : "postal_code",
                            "placeholder" : "例）1234567"
                        },
                        {
                            type : "prefectures",
                            "placeholder" : ""
                        },
                        {
                            type : "municipality",
                            "placeholder" : "例）〇〇市△△区□町"
                        },
                        {
                            type : "street_number",
                            "placeholder" : "例）1-4-1"
                        },
                        {
                            type : "building_name",
                            "placeholder" : "例）〇〇マンション101号室"
                        }
                    ],
                    pref_use_pulldown : 1,
                    split_post_code_flg : 0,
                    variable_id : variable_id,
                    required_flg : 0
                })
      break;
    case 'botchan_pref_component':
      variable_name = blockTitle;
      variable = await createVariable(connect_page_id,variable_name);
      variable_id = variable ? variable._id.toString() : undefined;
      messages.push({
                    type : "007",
                    list : [
                        {
                            type : "prefectures",
                            "placeholder" : ""
                        }
                    ],
                    pref_use_pulldown : 1,
                    split_post_code_flg : 0,
                    variable_id,
                    required_flg : 0
                })
      break;
    case 'botchan_zip_component':
      variable_name = blockTitle;
      variable = await createVariable(connect_page_id,variable_name);
      variable_id = variable ? variable._id.toString() : undefined;
      messages.push({
                    type : "007",
                    list : [
                        {
                            type : "postal_code",
                            "placeholder" : "例）1234567"
                        },
                    ],
                    pref_use_pulldown : 1,
                    split_post_code_flg : 0,
                    variable_id,
                    required_flg : 0
                })
      break;
    case 'default_radio':  
      variable_name = blockTitle;
      variable = await createVariable(connect_page_id,variable_name);
      variable_id = variable ? variable._id.toString() : undefined;
      messages.push({type: '004', template_type: '001', title_flg: '002', title: blockTitle, list: blockOption, variable_id, required_flg: 0})
      selectCount++;
      break;
    case 'default_checkbox':
      variable_name = blockTitle;
      variable = await createVariable(connect_page_id,variable_name);
      variable_id = variable ? variable._id.toString() : undefined;
      messages.push({type: '005', template_type: '001', title_flg: '002', title: blockTitle, list: blockOption, variable_id, required_flg: 0})
      selectCount++;
      break;
    case 'default_select':
      variable_name = blockTitle;
      variable = await createVariable(connect_page_id,variable_name);
      variable_id = variable ? variable._id.toString() : undefined;
      const defaultOption = blockOption[0] && blockOption[0].text;
      messages.push({type: '006', default_option_text: defaultOption, first_title: '', last_title: '', template_type: '001', title_flg: '002', title: blockTitle, variable_id, list: [blockOption], required_flg: 0})
      selectCount++;
      break;
    case 'botchan_password_component':
      variable_name = blockTitle;
      variable = await createVariable(connect_page_id,variable_name);
      variable_id = variable ? variable._id.toString() : undefined;
      messages.push({type: '002', template_type: '005', title_flg: '002', title: blockTitle, list: [{placeholder: ""}], variable_id, required_flg: 0});
      break;
    case 'default_textarea':
      variable_name = blockTitle;
      variable = await createVariable(connect_page_id,variable_name);
      variable_id = variable ? variable._id.toString() : undefined;
      messages.push({type: '003', template_type: '001', title_flg: '002', title: blockTitle, variable_id, required_flg: 0});
      break;
    case 'botchan_email_component':
      variable_name = blockTitle;
      variable = await createVariable(connect_page_id,variable_name);
      variable_id = variable ? variable._id.toString() : undefined;
      messages.push({type: '002', template_type: '001', title_flg: '002', title: blockTitle, variable_id, list: [{placeholder: "メールアドレス"}], required_flg: 0});
      break;
    case 'botchan_email_confirm_component':
      variable_name = blockTitle;
      variable = await createVariable(connect_page_id,variable_name);
      variable_id = variable ? variable._id.toString() : undefined;
      messages.push({type: '002', template_type: '001', title_flg: '002', title: blockTitle, variable_id, list: [{placeholder: "メールアドレス(確認)"}], required_flg: 0});
      break;
    case 'botchan_date_component':
      variable_name = blockTitle;
      variable = await createVariable(connect_page_id,variable_name);
      variable_id = variable ? variable._id.toString() : undefined;
      messages.push({type: "009", template_type: "002", title_flg: "002", title: blockTitle, variable_id, start_date: "", end_date: "", enable_start: "", enable_end: "", required_flg: 0});
      break;
    case 'botchan_datetime_component':
      variable_name = blockTitle;
      variable = await createVariable(connect_page_id,variable_name);
      variable_id = variable ? variable._id.toString() : undefined;
      messages.push({type: "009", template_type: "002", title_flg: "002", title: blockTitle, variable_id, start_date: "", end_date: "", enable_start: "", enable_end: "", required_flg: 0});
      messages.push({type: "006", template_type: "002", title_flg: "002", title: blockTitle, variable_id, hours_start: "", hours_end: "", spacing_minute: "", list: [], required_flg: 0});
      break;
    default:
      console.log(`[blockExtraction] other component: ${component}`);
      variable_name = blockTitle;
      variable = await createVariable(connect_page_id,variable_name);
      variable_id = variable ? variable._id.toString() : undefined;
      if(inputTexts.length > 0) {
        inputTexts.forEach(inputText => {
          const placeholder = $(inputText).attr('placeholder') || '';
          messages.push({type: '002', template_type: '001', title_flg: '002', title: blockTitle, list: [{placeholder: placeholder}], variable_id, required_flg: 0});
        });
      }
      if(textAreas.length > 0){
        textAreas.forEach(textarea => {
          const placeholder = $(textarea).attr('placeholder') || '';
          messages.push({type: '003', template_type: '001', title_flg: '002', title: blockTitle, variable_id, required_flg: 0});
        });
      }
      if (inputTexts.length === 0 && textAreas.length === 0) {
        messages.push({type: '002', template_type: '001', title_flg: '002', title: blockTitle, list: [{placeholder: ""}], variable_id, required_flg: 0});
      }
      break;
  }

  {
    let botmessage;
    if (selectCount > 0) {
      botmessage = `${blockTitle}を選択してください`;
    } else {
      botmessage = `${blockTitle}を入力してください`;
    }
    const botMessage = new BotMessage({
      scenario_id,
      cpid: connect_page_id,
      position,
      data: [
              {
                  "message" : [
                      {
                        "content": botmessage,
                        "type": "001"
                      }
                  ]
              }
          ],
      message_type: '002',
      block_name: `label ${blockTitle}`,
      auto_generate: 1,
    });

    await botMessage.save().catch(error => {
      throw new Error("Bot message can not save");
    })

    position += 1;
  }
  if(messages.length > 0) {
    const botMessage = new BotMessage({
      scenario_id,
      cpid: connect_page_id,
      position,
      data: [{message: messages}],
      message_type: '001',
      block_name: blockTitle,
      auto_generate: 1,
    });
    await botMessage.save().catch(error => {
      console.log('------errrr:', err);
      throw new Error("Can not extract input blocks");
    });
    position += 1;
  }
  return position;
  // console.log('---------botMessage', JSON.stringify(botMessage));
}

const blockTitleFormat = (string) => {
  return string.replace(/(\r\n|\n|\r|\t| |　|\*|※|必須|任意|【|】)/gm, "");
}

const matchKeyword = blockTitle => {
  const blockTitleFormated = blockTitleFormat(blockTitle);
  // const nameAndNameKana = /.*(氏名（フリガナ）).*/gm;
  const name = /.*(名前|氏名).*/gm;
  const nameKana = /.*(ふりがな|かな).*/gm;
  const nameKataKana = /.*(フリガナ|カナ).*/gm;
  const birthDay = /.*(生年月日).*/gm;
  const tel = /.*(電話|携帯|mobile|tel).*/gm;
  const address = /.*(住所|所在地).*/gm;
  const email = /.*(?!メールマガジン|メール配信)(メール|mail).*/gm;
  const emailc = /.*(確認).*/gm;
  const password = /.*(パスワード|password).*/gm;  
  const zip = /.*(郵便番号|〒).*/gm;
  const pref = /.*(都道府県).*/gm;
  const p_date = /.*(希望日|日付).*/gm;
  const p_datetime = /.*(日時).*/gm;
  const addr_etc = /.*(市区町村|郡|マンション|番地|号室|建物名|ビル).*/gm;

  //if (nameAndNameKana.exec(blockTitleFormated)){
  //  return 'botchan_name_and_name_kana_component';
  //} else if(name.exec(blockTitleFormated)) {
  if(nameKana.exec(blockTitleFormated)) {    
    return 'botchan_name_kana_component';
  } else if(nameKataKana.exec(blockTitleFormated)) {    
    return 'botchan_name_katakana_component';
  } else if(name.exec(blockTitleFormated)) {
    return 'botchan_name_component';
  } else if(birthDay.exec(blockTitleFormated)) {
    return 'botchan_birth_day_component';
  } else if(tel.exec(blockTitleFormated)) {
    return 'botchan_tel_component';
  } else if(p_datetime.exec(blockTitleFormated)) {
    return 'botchan_datetime_component';
  } else if(p_date.exec(blockTitleFormated)) {
    return 'botchan_date_component';
  } else if(address.exec(blockTitleFormated)) {
    return 'botchan_address_component';
  } else if(password.exec(blockTitleFormated)) {
    return 'botchan_password_component';  
  } else if(zip.exec(blockTitleFormated)) {
    return 'botchan_zip_component';  
  } else if(pref.exec(blockTitleFormated)) {
    return 'botchan_pref_component';  
  } else if(addr_etc.exec(blockTitleFormated)) {
    return 'botchan_addr_etc_component';
  } else if(email.exec(blockTitleFormated)) {
    if (emailc.exec(blockTitleFormated)) {
      return 'botchan_email_confirm_component';        
    } else {
      return 'botchan_email_component';    
    }
  }
  return 'default';
}
// generateScenario(pageURL);

const generateBotBase = async (user_id, url) => {
    try {
    let connect = await Connect.findOne({user_id: user_id});
        if(!connect) {
            connect = await new Connect({
                user_id,
                email : "",
                sns_id : "",
                sns_name : "EFO WebEmbed",
                type : "006",
                valid_flg : 1,
            }).save();
        }
        const company = url2company(url);

        const connectPage = await new ConnectPage({
            connect_id: connect._id,
            sns_type: "006",
            encrypt_flg: 0,
            page_name: `自動生成ボット（${company}）`,
            picture: "auto_bot.png",
            timezone_value: "Asia/Tokyo",
            timezone_code: "021",
            status: "デモ",
            setting: {
                lang: "ja",
                title: "チャットで簡単30秒お申込み",
                sp_title: "",
                sub_title: "Botchan DEMO",
                color_code: "001",
                width: "375",
                height: "640",
                design_type: "004",
                show_onload: 0,
                time_show_onload: "0",
                close_to_hide: 0,
                show_chat_avatar: 1,
                custom_css: ".chat-header { background-color: #449CD3;} .wc-close .chat-header { height: 70px;}",
                custom_css_sp: ".chat-header { background-color: #449CD3; }",
                sp_display_position: "001",
                pc_icon_type: "001",
                sp_icon_type: "001",
                baloon_text: "",
                animation_start_time: "5",
                animation_setting: 0,
                cv_complete_hide_flg: 0,
                cv_complete_time: 1,
                conversation_end_close: 0,
                conversation_end_close_time: "",
                pc_icon_display_type: "001",
                pc_display_position: "001",
                pc_icon_left_right: "10",
                pc_icon_bottom: "10",
                sp_icon_display_type: "002",
                sp_icon_left_right: "10",
                sp_icon_bottom: "10",
                design_type_v2: "003",
                start_button_icon: "auto_bot.png",
            },
            secret_key: "CH4WrVHo3CZuseAVRFLaqkaJxJN1XKfi",
            bot_version: 2,
            pulldown_default_flg: 1,
            auto_generate: 1,
            efo_version : 2
        }).save();

        const scenario = await new Scenario({
            connect_page_id: connectPage._id,
            page_id: null,
            group_id: "",
            position: 2,
            name: uuidv4(),
            start_flg: 1,
            filter: [],
            library: [],
            attach_variable: [],
            auto_generate: 1
        }).save()
        return { connect_page_id: connectPage._id, scenario_id: scenario._id };
    } catch (error) {
        console.log("--------ERROR:", error);
        throw new Error("Can not create bot demo");
    }
};

const formClassification = ($) => {
  try {
    const title = $("title").text();
    console.log('----TITLE', title);
    if(title && title.includes("応募")) return "register_account";
    if(title && title.includes("資料請求")) return "document_request";
    if(title && title.includes("来店予約")) return "visit_reservation";

    const header1 = $("h1").text();
    console.log('----H1', header1);
    if(header1 && header1.includes("応募")) return "register_account";
    if(header1 && header1.includes("資料請求")) return "document_request";
    if(header1 && header1.includes("来店予約")) return "visit_reservation";

    const header2 = $("h2").text();
    console.log('----header2', header2);
    if(header2 && header2.includes("来店予約")) return "visit_reservation";

    return "unknown"
  } catch (error) {
    throw new Error("Can not detect form type");
  }

//   const submitButtons = $("input[type='submit']").text();
//      console.log('----submitButtons', submitButtons);
//   const buttons = $("button").text();
//          console.log('----buttons', buttons);
};

const createVariable = async (connect_page_id, variable_name) => { 
  try {
    const position = await Variable.count({connect_page_id: connect_page_id});
    if(variable_name.length == 0) {
      variable_name = "変数"+ position;
    }
    const now = new Date();
    const variable = await new Variable({
      connect_page_id: connect_page_id,
      variable_name: variable_name,
      position: position,
      created_at:  now,
      updated_at: now,
    }).save();
    return variable;
  }
  catch (error) {
    console.log("---error: ", error);
    throw new Error ("Cant not create variable");
  }
}


router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods","POST");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

router.options('/generate-scenarios', async (req, res) => {
  res.send("ok");
});

router.post('/generate-scenarios', async (req, res) => {
  if(!USER_ID || !AI_API) {
    res.status(200).json({
      form_type: 'unknown',
      error_message: "User id is empty"
    })
    return;
  }

  try {
    const { page_url } = req.body;
    console.log("page url", page_url);
    if(page_url) {
      const log = new ScenarioGenerateLog({
        page_url,
        created_at: new Date()
      });
      await log.save();

      const formType = "unknown";
      const botBase = await generateBotBase(USER_ID, page_url);
      await generateScenario(botBase.connect_page_id, botBase.scenario_id, page_url, formType, log);
      const bot_messages_count = await BotMessage.count({scenario_id: botBase.scenario_id});
      if(bot_messages_count > 1) {
        log.cpid = botBase.connect_page_id
        await log.save()

        console.log('--------------1', formType, botBase.connect_page_id)
        res.status(200).json({form_type: formType, connect_page_id: botBase.connect_page_id});
      } else {
        console.log('--------------2')
        res.status(200).json({
          form_type: formType || 'unknown',
          // error_message: "Can not generate scenarios"
          error_message: "Bot message is empty"
        })
      }
    } else {
      console.log('--------------3')
      res.status(200).json({
        form_type: formType || 'unknown',
        error_message: "Can not generate scenarios"
      })
    }
  } catch (error) {
    console.log('----errr', error);
    res.status(500).json({
      form_type: "unknown",
      error_message: "Error"
    })
  }
});

module.exports = router;
