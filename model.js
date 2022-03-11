// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
/**
 * Created by le.thanh.hai on 17/02/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseRandom = require('mongoose-simple-random');

var config = require('config');

mongoose.Promise = global.Promise;

const ZipcodeSchema = new Schema({
    zipcode: String,
    jiscode: Number,
    pref: String,
    city: String,
    street: String
}, { collection: 'zipcodes', read: 'secondary'});
ZipcodeSchema.index({ zipcode: 1});

var ZipcodeChinasSchema = new Schema({
    pref: String,
    pref_name: String,
    city: String,
    postal : Number,
}, {collection: 'zipcode_chinas' });

var ExceptionSchema = new Schema({
    err: Schema.Types.Mixed,
    cpid: String,
    type: String,
    sub_type: String,
    push_chatwork_flg: Number,
    created_at: Date,
    updated_at: Date
});

var ApiPalSchoolSchema = new Schema({
    area: String,
    pref: String,
    school_name: String,
    school_type: String,
    created_at: Date,
    updated_at: Date
}, { collection: 'api_pal_schools'});
ApiPalSchoolSchema.index({ pref: 1, area: 1});

var ApiPalSchoolStartTimeSchema = new Schema({
    school_name: String,
    license_type: String,
    start_time: String,
    end_time: String,
    start_m: String,
    start_y: String,
    created_at: Date,
    updated_at: Date
}, { collection: 'api_pal_school_start_times'});
ApiPalSchoolStartTimeSchema.index({ school_name: 1, license_type: 1, start_time: 1});

var ApiPalSchoolPriceSchema = new Schema({
    school_name: String,
    room_name: String,
    price: Number,
    price_total: Number,
    mt_fee: Number,
    season_start: String,
    season_end: String,
    created_at: Date,
    updated_at: Date
}, { collection: 'api_pal_prices'});
ApiPalSchoolPriceSchema.index({ school_name: 1, room_name: 1});

var ApiPaTimeSchema = new Schema({
    area: String,
    store: String,
    date_type: String,
    time: String,
    created_at: Date,
    updated_at: Date
}, { collection: 'api_pa_times'});
ApiPaTimeSchema.index({ store: 1, time: 1});

var ApiRakushouTimeSchema = new Schema({
    clinic_name: String,
    date_type: String,
    time: String,
    created_at: Date,
    updated_at: Date
}, { collection: 'api_rakushou_times'});
ApiRakushouTimeSchema.index({ clinic_name: 1, date_type: 1, time: 1});

var ApiOtsukaSchema = new Schema({
    store_name: String,
    department: String,
    month: String,
    date: String,
    time: String,
    working_flg: Number,
    created_at: Date,
    updated_at: Date
}, { collection: 'api_otsuka_work_times'});
ApiOtsukaSchema.index({ time: 1, date: 1, working_flg: 1});

var ApiAcneSchema = new Schema({
    month: String,
    date: String,
    time: String,
    working_flg: Number,
    created_at: Date,
    updated_at: Date
}, { collection: 'api_acne_work_times'});
ApiAcneSchema.index({ time: 1, date: 1, working_flg: 1});

var ApiOkurahomeSchema = new Schema({
    bukken_name: String,
    title: String
}, { collection: 'api_okurahome_bukkens'});
ApiOkurahomeSchema.index({ bukken_name: 1, title: 1});

var ApiNikibicSchema = new Schema({
    store_name: String,
    month: String,
    date: String,
    time: String,
    working_flg: Number,
    created_at: Date,
    updated_at: Date
}, { collection: 'api_nikibic_work_times'});
ApiNikibicSchema.index({ time: 1, date: 1, working_flg: 1});

const GmoPointSchema = new Schema({
    points: Number,
    description: String,
    title: String,
    introduction: String,
    url: String,
    category: String,
    adId: String,
    conversion: String,
    project_type: String,
    reject: String,
    adEndDate: String,
    image: String,
    rank_point: Number
}, { collection: 'gmopoints'});
GmoPointSchema.index({ category: 1, project_type: 1});
GmoPointSchema.plugin(mongooseRandom);

const PointTownSchema = new Schema({
    points: Number,
    description: String,
    title: String,
    introduction: String,
    url: String,
    category: String,
    adId: String,
    conversion: String,
    project_type: String,
    reject: String,
    adEndDate: String,
    image: String,
    rank_point: Number
}, { collection: 'pointtowns'});
PointTownSchema.index({ category: 1, project_type: 1});
PointTownSchema.index({ category: 1, adId: 1});
PointTownSchema.plugin(mongooseRandom);

const SpreadsheetEdspsSchema = new Schema({
    maker: String,
    car: String,
    rank: String,
    distance: String,
    price: String,
    price_premium: String
}, { collection: 'spreadsheet_edsps'});
SpreadsheetEdspsSchema.index({ maker: 1, car: 1});

var options = {
    //useMongoClient: true,
    auth: {
        user: config.get('dbuser'),
        password: config.get('dbpass')
    },
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    socketTimeoutMS: 0,
    keepAlive: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
};

if(config.get('dbuser').length == 0 ){
    options = {
        //useMongoClient: true,
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        socketTimeoutMS: 0,
        keepAlive: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000,
    };
}

const urlShortenSchema = new Schema({
    cpid: String,
    sid: String,
    originalUrl: String,
    path: String,
    urlCode: String,
    shortUrl: String,
    updated_at: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now }
}, { collection: "url_shortens"});
urlShortenSchema.index({cpid: 1, originalUrl: 1});

const puppeteerRequestSchema = new Schema({
    cpid: String,
    user_id: String,
    url: String,
    status: Number,
    prev_payment_method: String,
    user_token: String,
    error_message: String,
    index: Number,
    request_body: Schema.Types.Mixed,
    response_body: Schema.Types.Mixed,
    param: Schema.Types.Mixed,
    cookie: Schema.Types.Mixed,
    action: String,
    updated_at: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now }
}, { collection: "puppeteer_requests"});
puppeteerRequestSchema.index({cpid: 1, user_id: 1, index: 1});

const puppeteerExceptionSchema = new Schema({
    cpid: String,
    user_id: String,
    url: String,
    status: Number,
    error_message: String,
    index: Number,
    request_body: Schema.Types.Mixed,
    param: Schema.Types.Mixed,
    updated_at: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now }
}, { collection: "puppeteer_exceptions"});
puppeteerExceptionSchema.index({cpid: 1, user_id: 1, index: 1});

const UserProfileSchema = new Schema({
    connect_page_id: String,
    page_id: String,
    user_id: String,
    current_url: String,
    user_display_name: String,
    user_status_message: String,
    user_first_name : String,
    user_last_name : String,
    user_full_name : String,
    user_name: String,
    user_screen_name: String,
    followers_count: Number,
    friends_count: Number,
    statuses_count: Number,
    profile_pic : String,
    user_locale : String,
    user_browser: String,
    user_os: String,
    user_agent: String,
    user_timezone : Number,
    user_device: String,
    user_gender : String,
    user_referral: String,
    user_referral_all: Schema.Types.Mixed,
    user_email: String,
    user_lat: Number,
    user_long: Number,
    user_address: String,
    user_ip_address: String,
    user_country: String,
    user_city: String,
    number_index: Number,
    is_payment_enabled : String,
    last_active_at: Number,
    get_session_flg: Number,
    unfollow_at: Number,
    start_flg: Number,
    new_flg: Number,
    unread_cnt: Number,
    last_time_at: Number,
    scenario_id: String,
    preview_flg: Number,
    user_token: String,
    campaign_current: String,
    cv_count: Number,
    cv_date: Schema.Types.Mixed,
    last_cv_date: Date,
    rich_menu_id: String,
    created_at : Date,
    updated_at : Date
}, { collection: 'user_profiles' });
UserProfileSchema.index({ connect_page_id: 1, user_token: 1});

var UserPositionSchema = new Schema({
    connect_page_id: String,
    page_id: String,
    user_id: String,
    scenario_id: { type: String, ref: 'Scenario' },
    position: Number,
    required_flg: Number,
    quick_reply_flg: Number,
    slot_id: Number,
    preview_flg: Number,
    created_at : Date ,
    updated_at : Date
}, { collection: 'user_positions' });

var EfoPOrderHistorySchema = new Schema({
    user_id: String,
    connect_page_id: String,
    order_id: String,
    p_order_id: String,
    amount: Number,
    price_tax: Number,
    settlement_fee: Number,
    shipping_fee: Number,
    data: Schema.Types.Mixed,
    mode: String,
    order_status: String,
    payment_status: String,
    created_at : Date,
    updated_at : Date,
    is_crawled : Boolean
}, {collection: 'efo_p_order_histories' });

var EfoPOrderSettingSchema = new Schema({
    cpid: String,
    tax_type: String,
    rounding: String,
    tax: String,
    shipping_fee_type: String,
    shipping_fee: Schema.Types.Mixed,
    variable_address: String,
    settlement_fee_type: String,
    settlement_fee: Schema.Types.Mixed,
    variable_settlement: String,
    payment_gateway_setting: String,
    variable_payment_method: String,
    gateway_setting: Schema.Types.Mixed,
    created_at : Date,
    updated_at : Date
}, { collection: 'efo_p_order_settings' });

var PGatewaySchema = new Schema({
    user_id: String,
    provider: String,
    gateway_name: String,
    mode: String,
    pgcard_shop_id: String,
    pgcard_shop_pass: String,
    pgcard_site_id: String,
    pgcard_site_pass: String,
    gmo_cod_shop_id: String,
    gmo_cod_shop_code: String,
    gmo_cod_shop_pass: String,
    trader_code: String,
    kuroneko_access_key: String,
    paidy_pub_key: String,
    paidy_secret_key: String,
    aftee_pub_key: String,
    aftee_secret_key: String,
    atone_pub_key: String,
    atone_secret_key: String,
    merchant_code: String,
    kuroneko_password: String,
    np_merchant_code: String,
    sp_code: String,
    terminal_id: String,
    merchant_id: String,
    merchant_authentication_key: String,
    token_key: String,
    clientip: String,
    contract_code: String,
    default_flg: Number,
    created_at: Date,
    updated_at: Date,
  }, { collection: 'p_gateways' });
PGatewaySchema.index({ user_id: 1, default_flg: 1});

var EfoCartSchema = new Schema({
    cid: String,
    uid: String,
    p_id: String,
    log_message_id: String,
    type: String,
    data : Schema.Types.Mixed,
    status: String,
    order_id: String,
    created_at : Date,
    updated_at : Date
}, {collection: 'efo_carts' });
EfoCartSchema.index({cid: 1, uid: 1, updated_at: 1});
EfoCartSchema.index({cid: 1, uid: 1, p_id: 1});

var ConnectSchema = new Schema({
    user_id: String,
    delete_flg: Number
});

var ConnectPageSchema = new Schema({
    page_id: String,
    connect_id: { type: String, ref: 'Connect' },
    picture: String,
    page_access_token : String,
    channel_access_token: String,
    origin_page_access_token: String,
    my_app_flg: Number,
    channel_id: String,
    sns_type: String,
    setting: Schema.Types.Mixed,
    log_not_save_flg: Number,
    log_cv_keep_flg: Number,
    get_token_only_flg: Number,
    session_time: String,
    validate_token: String,
    channel_secret: String,
    start_message: String,
    greeting_message: String,
    page_name: String,
    scenario_type: String,
    list_option: Schema.Types.Mixed,
    webhook_url: String,
    secret_key: String,
    app_url_iframe: String,
    chatwork_account_id: Number,
    conversion_setting: Schema.Types.Mixed,
    user_input_disabled: Number,
    disable_flg: Number,
    restart_change_ref_flg: Number,
    tracking_cv_name_flg: Number,
    liff_setting: Schema.Types.Mixed,
    user_restart_convo_flg: Number,
    show_close_btn_flg: Number,
    header_comment: String,
    max_cv_month: Number,
    cv_redirect_url: String,
    cv_redirect_after_second: String,
    app_secret: String,
    app_id: String,
    consumer_api_secret: String,
    consumer_api_key: String,
    access_token: String,
    access_token_secret: String,
    zoom_percentage: Schema.Types.Mixed,
    ref_flg: Number,
    client_param_url: Schema.Types.Mixed,
    variable_report: Schema.Types.Mixed,
    encrypt_flg: Number,
    allow_ip: Schema.Types.Mixed,
    katakana_not_space_flg: Number,
    mobile_click_padding_flg: Number,
    deleted_at: Date,
    include_system_variable: Number,
    client_send_variable: Schema.Types.Mixed,
    client_import_file: Schema.Types.Mixed,
    iframe_import_file: Schema.Types.Mixed,
    client_custom_list: Schema.Types.Mixed,
    liff_mention_flg: Number,
    pulldown_default_flg: Number,
    get_card_info_flg: Number,
    get_token_number: Number,
    current_url_param_save_variable_flg: Number,
    default_delay_time: Number,
    position_not_cv: Number,
    currency_code: String,
    ref_variable_bot_id: String,
    chatbox_hide_time: Schema.Types.Mixed,
    client_viewport: Schema.Types.Mixed,
    multi_lang_flg: String,
    multi_lang_setting: Schema.Types.Mixed,
    input_message_placeholder: Schema.Types.Mixed,
    bot_version: Number,
    scroll_message_bottom_flg: Number,
    step_flg: Number,
    conversation_setting: Schema.Types.Mixed,
    auth: Schema.Types.Mixed,
    auto_generate: Number,
    efo_version: Number,
    status: String,
}, { collection: 'connect_pages', read: 'secondary'});
ConnectPageSchema.index({ connect_id: 1, deleted_at: 1});
ConnectPageSchema.index({ validate_token: 1, deleted_at: 1});
ConnectPageSchema.index({ public_flg: 1, template_flg: 1, deleted_at: 1});

var EfoCvSchema = new Schema({
    connect_page_id: String,
    user_id: String,
    scenario_id: String,
    answer_count: Number,
    position: Number,
    cv_flg: Number,
    cv_time: Number,
    cv_minute: Number,
    date: String,
    browser: String,
    device: String,
    os: String,
    lang: String,
    preview_flg: Number,
    page_start_url: String,
    page_cv_url: String,
    page_start_title: String,
    page_cv_title: String,
    country: String,
    region: String,
    test_tracking_flg: Number,
    test_tracking_flg2: Number,
    order_id: String,
    created_at: Date,
    updated_at: Date
}, {collection: 'efo_cvs' });
EfoCvSchema.index({connect_page_id: 1, user_id: 1});

const CampaignSchema  = new Schema({
    cid: String,
    name: String,
    created_at : Date,
    updated_at : Date,
    deleted_at: Date
}, { collection: 'campaigns' });
CampaignSchema.index({cid: 1});

const ReportCampaignSchema  = new Schema({
    cid: String,
    uid: String,
    campaign_id: String,
    cv_flg: Number,
    current_url: String,
    ymd: String,
    created_at : Date,
    updated_at : Date
}, { collection: 'report_campaigns' });
ReportCampaignSchema.index({cid: 1, uid: 1, campaign_id: 1});

var PulldownMasterSchema  = new Schema({
    group: String,
    code: String,
    active_flg: Number,
    name_ja : String,
}, { collection: 'pulldown_masters' });
PulldownMasterSchema.index({code: 1, name_ja: 1});

var VariableSchema = new Schema({
    connect_page_id: String,
    variable_name: String,
    default_value: String,
    position: String,
    created_at : Date,
    updated_at : Date,
    deleted_at: Date
}, {read: 'secondary'});
VariableSchema.index({ connect_page_id: 1});

var ScenarioSchema = new Schema({
    connect_page_id: String,
    page_id: String,
    name: String,
    start_flg: Number,
    filter : [],
    library : [],
    attach_variable : [],
    created_at : { type: 'Date', default: Date.now, required: true },
    updated_at : { type: 'Date', default: Date.now, required: true },
    auto_generate: Number,
}, { read: 'secondary' });
ScenarioSchema.index({ connect_page_id: 1, name:1});

var ApiSchema = new Schema({
    connect_page_id: String,
    name: String,
    method: String,
    url: String,
    api_type: String,
    request: [],
    response: [],
    authentication: {},
    service_type : String,
    store_name : String,
    app_url : String,
    created_at : { type: 'Date', default: Date.now, required: true },
    updated_at : { type: 'Date', default: Date.now, required: true }
}, { read: 'secondary' });

var BotMessageSchema = new Schema({
    scenario_id: String,
    cpid: String,
    position: Number,
    data: [],
    message_type : String,
    filter : [],
    btn_next : String,
    block_name : String,
    error_flg: Number,
    input_requiment_flg: Number,
    disable_requiment_flg: Number,
    auto_generate: Number,
    created_at : { type: 'Date', default: Date.now, required: true },
    updated_at : { type: 'Date', default: Date.now, required: true }

}, { collection: 'bot_messages' });

var TestCvTrackingSchema = new Schema({
    source: String,
    type: String,
    referer: String,
    headers: Schema.Types.Mixed,
    query: Schema.Types.Mixed,
    ymd: String,
    order_id : String,
    created_at : { type: 'Date', default: Date.now, required: true },
    updated_at : { type: 'Date', default: Date.now, required: true }

}, { collection: 'test_cv_trackings' });

var EfoUserProfileSchema = new Schema({
    connect_page_id: String,
    user_id: String,
    number_index: Number,
    last_active_at: String,
    liff_user_id: String,
    unread_cnt: Number,
    start_flg: Number,
    new_flg: Number,
    preview_flg: Number,
    created_at : { type: 'Date', default: Date.now, required: true },
    updated_at : { type: 'Date', default: Date.now, required: true },
    cv_flg: Number,
    scenario_id: String,
    last_time_at: String
}, { collection: 'efo_user_profiles' });

var MasterSchema = new Schema({
    group: String,
    code: String,
    active_flg: Number,
    display_order: Number,
    filter_flg: Number,
    greeting_mess_flg: Number,
    sns_type: String,
    name_vn: String,
    name_en: String,
    name_ja: String,
}, { collection: 'masters' });


var EfoMessageVariableSchema = new Schema({
    connect_page_id: String,
    user_id: String,
    page_id: String,
    variable_id: String,
    type: String,
    sub_type: String,
    default_flg: Number,
    variable_value: Schema.Types.Mixed,
    created_at : Date,
    updated_at : Date
}, {collection: 'efo_message_variables' });
EfoMessageVariableSchema.index({connect_page_id: 1, user_id: 1, variable_id: 1});

var UserCryptKeySchema  = new Schema({
    user_id: String,
    connect_page_id: String,
    salt: String,
    created_at : Date,
    updated_at : Date
}, { collection: 'user_crypt_keys' });

var PCodSettingSchema = new Schema({
    cpid: String,
    settlement_variable_id: String,
    provider: String,
    include_invoice_flg: Number,
    max_order_total: Number,
    settlement_fee: Schema.Types.Mixed,
    created_at : Date,
    updated_at : Date
}, { collection: 'p_cod_settings' });
PCodSettingSchema.index({ cpid: 1});


const PuppeteerOrderClickSchema = new Schema({
    cpid: String,
    uid: String,
    status_puppeteer: String,
    status_order: String,
    timeout_flg: Number,
    error_message: String,
    thank_url: String,
    cookie: String,
    ebis_complete_url: String,
    response: Schema.Types.Mixed,
    order_id: String,
    order_status_flg: Number,
    created_at : Date,
    updated_at : Date
}, { collection: 'puppeteer_order_clicks' });
PuppeteerOrderClickSchema.index({ cpid: 1});

var MessageVariableSchema = new Schema({
    connect_page_id: String,
    user_id: String,
    page_id: String,
    variable_id: String,
    variable_value: Schema.Types.Mixed,
    created_at : Date,
    updated_at : Date
}, { collection: 'message_variables' });
MessageVariableSchema.index({ connect_page_id: 1, user_id: 1});

const PuppeteerEmailRegisterSchema = new Schema({
    cpid: String,
    uid: String,
    email: String,
    registered_flg: Number,
    updated_flg: Number,
    old_password: String,
    data: Schema.Types.Mixed,
    cookie: Schema.Types.Mixed,
    request: Schema.Types.Mixed,
    response: Schema.Types.Mixed,
    created_at : Date,
    updated_at : Date
}, { collection: 'puppeteer_email_registers' });
PuppeteerEmailRegisterSchema.index({ cpid: 1});


const PinCodeAuthSchema  = new Schema({
    cpid: String,
    uid: String,
    code: Number,
    email: String,
    created_at : Date,
    updated_at : Date
}, { collection: 'pin_code_auths' });
PinCodeAuthSchema.index({cpid: 1, uid: 1});

var NojimaSchema = new Schema({
    postal_code: String,
    url: String,
    address: String,
    shop_name: String,
    shop_tel: String,
    zipcode: String,
    address1: String,
    address2: String,
    city : String,
    sublocality : String,
    state : String,
    image1 : String,
    lat: Number,
    long: Number,
    get_latlong_flg: Number
}, {collection: 'nojimas' });

var ApiMenkyoSchema = new Schema({
    area: String,
    pref: String,
    school_name: String,
    room_type: String,
    created_at: Date,
    updated_at: Date
}, { collection: 'api_menkyos'});
ApiMenkyoSchema.index({ pref: 1, area: 1, school_name: 1});

var LogChatMessageSchema = new Schema({
    connect_page_id: String,
    scenario_id: String,
    page_id: String,
    user_id: String,
    room_id: String,
    send_time: Number,
    message_type: String,
    type : Number,
    message : Schema.Types.Mixed,
    message_id: String,
    payload: String,
    notification_id: String,
    error_flg: Number,
    background_flg: Number,
    error_message : Schema.Types.Mixed,
    created_at : Date,
    updated_at : Date,
    start_flg: Number,
    user_said: String,
    time_of_message : Date,
    question_count: Number,
    bid: String,
    b_position: Number,
    user_hide_flg: Number,
    time_of_message2: Number,
    content: Schema.Types.Mixed
}, { collection: 'log_chat_messages' });
LogChatMessageSchema.index({ connect_page_id: 1, user_id: 1, created_at: -1});

var BiyoHistorySchema = new Schema({
    record_id: Number,
    user_id: Number,
    anket_master_id: Number,
    last_update: Date
}, { collection: 'biyo_histories' });
BiyoHistorySchema.index({ user_id: 1, anket_master_id: 1});


var BiyoUserSchema = new Schema({
    record_id: Number,
    line_id: String,
    email: String,
    data : Schema.Types.Mixed
}, { collection: 'biyo_users' });
BiyoUserSchema.index({record_id: 1, line_id: 1});

var BiyoMasterAnketSchema = new Schema({
    record_id: Number,
    start_date: String,
    end_date: String,
    public_status: String,
    campaign_flg: String,
    liff_url: String,
    formName: String,
    point: Number,
    data : Schema.Types.Mixed
}, { collection: 'biyo_master_ankets' });
BiyoMasterAnketSchema.index({record_id: 1});

//travel
var CustomTravelTourSchema = new Schema({
    tour_id: Number,
    type: String, //area or topic
    name_topic_area: String,
    link_page: String,
    link_tour: String,
    link_image: String,
    title: String,
    price: String,
    price_note: String,
    created_at : { type: 'Date', default: Date.now, required: true },
    updated_at : { type: 'Date', default: Date.now, required: true }
}, { collection: 'custom_travel_tour' });

var CustomTravelGuideSchema = new Schema({
    guide_id: Number,
    type:String,
    title: String,
    link: String,
    link_page: String,
    link_image: String,
    created_at : { type: 'Date', default: Date.now, required: true },
    updated_at : { type: 'Date', default: Date.now, required: true }
}, { collection: 'custom_travel_guide' });

var CustomTravelStatusSchema = new Schema({
    line_id: String,
    type:String,
    offset: Number,
    created_at : { type: 'Date', default: Date.now, required: true },
    updated_at : { type: 'Date', default: Date.now, required: true }
}, { collection: 'custom_travel_status' });

var CustomTravelCrawlDataHistorySchema = new Schema({
    type: String,
    time_start : String,
    time_end : String,
    time : String,
    count: Number,
    status : Boolean,
    created_at : { type: 'Date', default: Date.now, required: true },
    updated_at : { type: 'Date', default: Date.now, required: true }
}, { collection: 'custom_travel_crawl_data_history' });

var CustomMynaviRecommendSchema = new Schema({
    id_number: Number,
    id:String,
    name:String,
    producturl:String,
    bigimage:String,
    price:String,
    categoryid1:String,
    categoryid2:String,
    categoryid3:String,
    categoryid4:String,
    extrabadge:String,
    description:String,
    bigimage2: String,
    created_at : { type: 'Date', default: Date.now, required: true },
    updated_at : { type: 'Date', default: Date.now, required: true }
}, { collection: 'custom_mynavi_recommend' });
CustomMynaviRecommendSchema.index({ id: 1 });

var CustomMynaviPointSchema = new Schema({
    id:String,
    name:String,
    pref:String,
    area:String,
    home_style:Number,
    original_style:Number,
    simple_style:Number,
    format_style:Number,
    princess_style:Number,
    luxury_style:Number,
    created_at : { type: 'Date', default: Date.now, required: true },
    updated_at : { type: 'Date', default: Date.now, required: true }
}, { collection: 'custom_mynavi_point' });
CustomMynaviPointSchema.index({ id: 1 });

var CustomMynaviConditionSchema = new Schema({
    condition:String,
    id:String,
    name:String,
    producturl:String,
    bigimage:String,
    price:String,
    categoryid1:String,
    categoryid2:String,
    categoryid3:String,
    categoryid4:String,
    extrabadge:String,
    description:String,
    bigimage2: String,
    id_number: Number,
    current_index:Number,
    created_at : { type: 'Date', default: Date.now, required: true },
    updated_at : { type: 'Date', default: Date.now, required: true }
}, { collection: 'custom_mynavi_condition' });
CustomMynaviConditionSchema.index({ condition:1, id: 1 });

var CustomMynaviCrawlDataHistorySchema = new Schema({
    current_index: Number,
    time_start : String,
    time_end : String,
    time : String,
    count: Number,
    status : Boolean,
    created_at : { type: 'Date', default: Date.now, required: true },
    updated_at : { type: 'Date', default: Date.now, required: true }
}, { collection: 'custom_mynavi_crawl_data_history' });

var CustomMynaviFavoritesSchema = new Schema({
    line_id : String,
    cpid : String,
    id_page: String,
    status: Boolean,
    created_at : { type: 'Date', default: Date.now, required: true },
    updated_at : { type: 'Date', default: Date.now, required: true }
}, { collection: 'custom_mynavi_favorites' });
CustomMynaviFavoritesSchema.index({ line_id: 1, cpid:1, id_page: 1 });

var CustomMynaviStatusSchema = new Schema({
    line_id : String,
    cpid : String,
    type: String,
    count: Number,
    created_at : { type: 'Date', default: Date.now, required: true },
    updated_at : { type: 'Date', default: Date.now, required: true }
}, { collection: 'custom_mynavi_status' });
CustomMynaviStatusSchema.index({ type: 1, line_id: 1, cpid: 1 });

var CustomMynaviPageNullSchema = new Schema({
    list_null : String,
    status : Boolean,
    created_at : { type: 'Date', default: Date.now, required: true },
    updated_at : { type: 'Date', default: Date.now, required: true }
}, { collection: 'custom_mynavi_page_null' });
CustomMynaviPageNullSchema.index({status:1});

var CustomMynaviReportSchema = new Schema({
    store_id : String,
    store_name : String,
    area : String,
    ym : String,
    count : Number,
    created_at : { type: 'Date', default: Date.now, required: true },
    updated_at : { type: 'Date', default: Date.now, required: true }
}, { collection: 'custom_mynavi_reports' });
CustomMynaviReportSchema.index({count:1});

const AnalyticPageviewSchema = new Schema({
    cpid: String,
    uid: String,
    ymd: String,
    pageview_count: Number,
    title: String,
    current_url: String,
    referer: String,
    user_agent: String,
    last_active_at: Schema.Types.Mixed,
    created_at : Date,
    updated_at : Date
}, { collection: 'analytic_pageviews' });
// AnalyticPageviewSchema.index({cpid: 1});

const AnalyticCvSchema = new Schema({
    cpid: String,
    uid: String,
    ymd: String,
    cv_count: Number,
    current_url: String,
    referer: String,
    last_active_at: Schema.Types.Mixed,
    created_at : Date,
    updated_at : Date
}, { collection: 'analytic_cvs' });
// AnalyticCvSchema.index({cpid: 1, uid: 1});
//Deli
var ApiDeliSchema = new Schema({
    area: String,
    pref: String,
    city: String,
    city_code: String,
    pref_code: String,
    area_code: String,
    region: String,
    lat: Number,
    long: Number,
    created_at: Date,
    updated_at: Date
}, { collection: 'api_delis'});
ApiDeliSchema.index({ city_code: 1, pref_code: 1, area_code: 1});
var ApiDeliRegionSchema = new Schema({
    region: String,
    created_at: Date,
    updated_at: Date
}, { collection: 'api_deli_regions'});
ApiDeliRegionSchema.index({ region: 1 });
//KARUBI-
var KarubiProductSchema = new Schema({
    code: Number,
    name: String,
    description: String,
    image_url: String,
    page_url: String,
    start_date: String,
    end_date: String,
    created_at: Date,
    updated_at: Date
}, { collection: 'custom_karubi_products'});
KarubiProductSchema.index({ code: 1});

var KarubiShowProductSchema = new Schema({
    list_code: Schema.Types.Mixed,
    last_creator_index: Number,
    cpid: String,
    line_id: String,
    created_at: Date,
    updated_at: Date
}, { collection: 'custom_karubi_show_products'});
KarubiShowProductSchema.index({ list_code: 1});


var KarubiTrackingShowProductSchema = new Schema({
    cpid: String,
    date: String,
    code: String,
    name: String,
    page_url: String,
    view_count: Number,
    click_count: Number
}, { collection: 'custom_karubi_tracking_show_products'});
KarubiTrackingShowProductSchema.index({ cpid: 1, date: 1});


//KARUBIP2
var CustomKarubiP2ProductInfoSchema = new Schema({
    jan : String,
    product_code : String,
    product_name : String,
    brand_name: String,
    taste_name: String,
    taste_system: String,
    word_count: String,
    shape: String,
    description: String,
    image_url: String,
    infor_calorie: String,
    url: String,
    con_store_flg: Number,
    product_code_es: String,
    start_date : { type: 'Date' },
    end_date : { type: 'Date' },
    created_at : { type: 'Date', default: Date.now, required: true },
    updated_at : { type: 'Date', default: Date.now, required: true }
}, { collection: 'custom_karubi_p2_product_info' });
CustomKarubiP2ProductInfoSchema.index({ product_code: 1});

var CustomKarubiP2CategoriesSchema = new Schema({
    category : String,
    description : String,
    sub_category : String,
    category_img_url : String,
    list_product : Schema.Types.Mixed,
    created_at : { type: 'Date', default: Date.now, required: true },
    updated_at : { type: 'Date', default: Date.now, required: true }
}, { collection: 'custom_karubi_p2_categories' });
CustomKarubiP2CategoriesSchema.index({ category: 1, sub_category:1});

var CustomKarubiP2TokenSchema = new Schema({
    access_token : String,
    refresh_token : String,
    expires_at: Number,
    status: Boolean,
    data : Schema.Types.Mixed,
    created_at : { type: 'Date', default: Date.now, required: true },
    updated_at : { type: 'Date', default: Date.now, required: true }
}, { collection: 'custom_karubi_p2_token' });

var CustomKarubiP2StatusSchema = new Schema({
    line_id : String,
    cpid : String,
    count: Number,
    list_product:Schema.Types.Mixed,
    type: String,
    data : Schema.Types.Mixed,
    created_at : { type: 'Date', default: Date.now, required: true },
    updated_at : { type: 'Date', default: Date.now, required: true }
}, { collection: 'custom_karubi_p2_status' });
CustomKarubiP2StatusSchema.index({ line_id: 1, cpid:1});

//WILL
var WillProductPriceSchema = new Schema({
    format: String,
    category: String,
    num_pages: Number,
    num_copies: Number,
    num_cover_color: String,
    cover_paper: String,
    num_text_color: String,
    body_paper: String,
    pid: Number,
    pname: String,
    pcode: String,
    selling_price: Number,
}, { collection: 'custom_will_product_prices'});
WillProductPriceSchema.index({ format: 1, category: 1, num_cover_color: 1, cover_paper: 1, num_text_color: 1, body_paper: 1});

// EFO_EC
var ApiEfoEcSchema = new Schema({
    cpid: String,
    user_id: String,
    client_id: String,
    client_secret: String,
    authentication_token: String,
    request_url: String,
    request: Schema.Types.Mixed,
    response: Schema.Types.Mixed,
    result: String,
    error_code: String,
    error_message: String,
    error_info: String,
    created_at: Date,
    updated_at: Date
}, { collection: 'api_efo_ec'});
ApiEfoEcSchema.index({ client_id: 1});


var LeverageSchoolSchema = new Schema({
    task_name: String,
    url: String,
    name: String,
    to: [String],
    cc: [String],
    bcc: [String],
    coupon: [String],
    column_a: [String],
    column_b: [String],
    column_c: [String],
    created_at: Date,
    updated_at: Date,
}, { collection: 'custom_leverage_schools'});
LeverageSchoolSchema.index({ url: 1 });

var UserSchema = new Schema({
    password: String,
    email: String,
    authority: String,
    user_group_id: String,
    created_id: String,
    efo_report_version: Number,
    locale: String,
    name: String,
    company_name: String,
    comment: String,
    max_bot_number: Number,
    max_user_number: Number,
    plan: String,
    white_list_domain:  Schema.Types.Mixed,
    bot_template:  Schema.Types.Mixed,
    sns_type_list:  Schema.Types.Mixed,
    margin: String,
    invoice_type: String,
    function_option:  Schema.Types.Mixed,
    updated_at: Date,
    created_at: Date,
    current_ip: String,
}, { collection: 'users' });

var CustomBankSchema = new Schema({
    bank_code: String,
    branch_code: String,
    bank_name_kana: String,
    bank_name: String,
    branch_name_kana: String,
    branch_name: String,
    zipcode: String,
    address: String,
    tel: String,
    clearing_house_number: String,
    nami_code: String,
    domestic_exchange_flg: String,
}, { collection: 'custom_banks'});
CustomBankSchema.index({ bank_name: 1, branch_name: 1});

var TryPlusSchema = new Schema({
    pref: String,
    school: String,
    to_1: String,
    to_2: String,
    created_at: Date,
    updated_at: Date,
}, { collection: 'custom_tryplus'});
TryPlusSchema.index({ pref:1, school_name: 1 });

var ScenarioGenerateLogsSchema = new Schema({
    page_url: String,
    cpid: String,
    category_result: Schema.Types.Mixed,
    messages: Schema.Types.Mixed,
    created_at : Date
}, { collection: 'scenario_generate_logs' });

var MenuSchema = new Schema({
    connect_page_id: String,
    parent_id: String,
    scenario_id : String,
    priority_order: Number,
    title: String,
    type: String,
    url : String,
    user_restart_convo_flg : Number,
    created_at : Date,
    updated_at : Date,
    richMenuId: String,
    default_flg: Number,
}, {collection: 'menus' });
MenuSchema.index({connect_page_id: 1});

const CustomFukuuroBankSchema = new Schema({
    bank_code: String,
    bank_name: String,
    bank_name_kana: String,
    branches: [{
        branch_code: String,
        branch_name: String,
        branch_name_kana: String,
    }],
}, { collection: "custom_fukuuro_banks" });
CustomFukuuroBankSchema.index({ bank_name: 1 });

const ChurnPreventionBulkhommeSchema = new Schema({
    order_id: String,
    customer_id: String,
    number_of_cycle: Number,
    status: String,
    order_created_at: String,
    order_canceled_at: String,
    payment_type: String,
    product: {
        id: String,
        name: String,
        category: String,
    }
}, { collection: "churn_prevention_bulkhomme" });
ChurnPreventionBulkhommeSchema.index({ bank_name: 1 });

const ZCOMPaymentSchema = new Schema(
    {
        order_number: String,
        connect_page_id: String,
        user_id: String,
        zcom_user_id: String,
        mode: String,
        contract_code: String,
        created_at : Date,
    },
    { collection: "zcom_payments" }
);
ZCOMPaymentSchema.index({ order_number: 1 });

const FromcocoroChurnStateSchema = new Schema(
    {
        user_id: {
            type: String,
            required: true,
            unique: false,
        },
        contract_id: {
            type: String,
            required: true,
            unique: true,
        },
        executed_at: {
            type: Date,
            required: true,
        },
        is_suspend: {
            type: Boolean,
            required: true,
        },
        is_churned: {
            type: Boolean,
            required: true,
        },
        updated_at: {
            type: Date,
        }
    },
    {
        collection: 'churn_status_fromcocoro',
    }
);
FromcocoroChurnStateSchema.index({ user_id: 1, contract_id: 1 });

const ChurnPreventionItemFTGSchema = new Schema({
    item_id: String,
    course_name: String,
    item_name: String,
    comment: String,
    available_flg: Boolean,
    count_promised_receiving: Number
}, { collection: "churn_prevention_item_ftg" });
ChurnPreventionItemFTGSchema.index({ item_id: 1 });


//
//mongoose.connect(config.get('dbURL'), options);
mongoose.connect(config.get('dbURL'), options, function(err) {
    if (err) throw err;
    console.log("connect mongodb done");
});

exports.Zipcode = mongoose.model("Zipcode", ZipcodeSchema);
exports.ZipcodeChinas = mongoose.model('ZipcodeChinas', ZipcodeChinasSchema);
exports.Exception = mongoose.model('Exception', ExceptionSchema);
exports.ApiPalSchool = mongoose.model('ApiPalSchool', ApiPalSchoolSchema);
exports.ApiPalSchoolStartTime = mongoose.model('ApiPalSchoolStartTime', ApiPalSchoolStartTimeSchema);
exports.ApiPaTime = mongoose.model('ApiPaTime', ApiPaTimeSchema);
exports.ApiRakushouTime = mongoose.model('ApiRakushouTime', ApiRakushouTimeSchema);
exports.ApiPalSchoolPrice = mongoose.model('ApiPalSchoolPrice', ApiPalSchoolPriceSchema);
exports.ApiMenkyo = mongoose.model('ApiMenkyo', ApiMenkyoSchema);
exports.ApiDeli = mongoose.model('ApiDeli', ApiDeliSchema);
exports.ApiDeliRegion = mongoose.model('ApiDeliRegion', ApiDeliRegionSchema);
exports.ApiOtsukaSchema = mongoose.model('ApiOtsukaSchema', ApiOtsukaSchema);
exports.ApiNikibic = mongoose.model('ApiNikibic', ApiNikibicSchema);
exports.ApiAcneSchema = mongoose.model('ApiAcneSchema', ApiAcneSchema);
exports.ApiOkurahomeSchema = mongoose.model('ApiOkurahomeSchema', ApiOkurahomeSchema);
exports.GmoPoint = mongoose.model('GmoPoint', GmoPointSchema);
exports.PointTown = mongoose.model('PointTown', PointTownSchema);
exports.SpreadsheetEdsps = mongoose.model('SpreadsheetEdsps', SpreadsheetEdspsSchema);
exports.UrlShorten = mongoose.model("UrlShorten", urlShortenSchema);
exports.UserProfile = mongoose.model("UserProfile", UserProfileSchema);
exports.EfoPOrderHistory = mongoose.model('EfoPOrderHistory', EfoPOrderHistorySchema);
exports.EfoPOrderSetting = mongoose.model('EfoPOrderSetting', EfoPOrderSettingSchema);
exports.PaymentGateway = mongoose.model('PaymentGateway', PGatewaySchema);
exports.EfoCart = mongoose.model('EfoCart', EfoCartSchema);
exports.ConnectPage = mongoose.model('ConnectPage', ConnectPageSchema);
exports.Connect = mongoose.model('Connect', ConnectSchema);
exports.EfoCv = mongoose.model('EfoCv', EfoCvSchema);
exports.PuppeteerRequest = mongoose.model("PuppeteerRequest", puppeteerRequestSchema);
exports.PuppeteerException = mongoose.model("PuppeteerException", puppeteerExceptionSchema);
exports.UserProfile = mongoose.model("UserProfile", UserProfileSchema);

exports.Campaign = mongoose.model("Campaign", CampaignSchema);
exports.ReportCampaign = mongoose.model("ReportCampaign", ReportCampaignSchema);
exports.AnalyticPageview = mongoose.model("AnalyticPageview", AnalyticPageviewSchema);
exports.AnalyticCv = mongoose.model("AnalyticCv", AnalyticCvSchema);

exports.PulldownMaster = mongoose.model("PulldownMaster", PulldownMasterSchema);
exports.Variable = mongoose.model("Variable", VariableSchema);
exports.EfoMessageVariable = mongoose.model('EfoMessageVariable', EfoMessageVariableSchema);
exports.UserCryptKey = mongoose.model('UserCryptKey', UserCryptKeySchema);
exports.PCodSetting = mongoose.model('PCodSetting', PCodSettingSchema);
exports.PuppeteerOrderClick = mongoose.model('PuppeteerOrderClick', PuppeteerOrderClickSchema);
exports.Scenario = mongoose.model("Scenario", ScenarioSchema);
exports.BotMessage = mongoose.model("BotMessage", BotMessageSchema);
exports.EfoUserProfile = mongoose.model("EfoUserProfile", EfoUserProfileSchema);
exports.Api = mongoose.model("Api", ApiSchema);
exports.Master = mongoose.model("Master", MasterSchema);
exports.MessageVariable = mongoose.model('MessageVariable', MessageVariableSchema);
exports.PuppeteerEmailRegister = mongoose.model('PuppeteerEmailRegister', PuppeteerEmailRegisterSchema);
exports.PinCodeAuth = mongoose.model('PinCodeAuth', PinCodeAuthSchema);
exports.Nojima = mongoose.model('Nojima', NojimaSchema);
exports.LogChatMessage = mongoose.model('LogChatMessage', LogChatMessageSchema);


exports.BiyoHistory = mongoose.model('BiyoHistory', BiyoHistorySchema);
exports.BiyoUser = mongoose.model('BiyoUser', BiyoUserSchema);
exports.BiyoMasterAnket = mongoose.model('BiyoMasterAnket', BiyoMasterAnketSchema);

exports.CustomTravelTour = mongoose.model('CustomTravelTour', CustomTravelTourSchema);
exports.CustomTravelGuide = mongoose.model('CustomTravelGuide', CustomTravelGuideSchema);
exports.CustomTravelStatus = mongoose.model('CustomTravelStatus', CustomTravelStatusSchema);
exports.CustomTravelCrawlDataHistory = mongoose.model('CustomTravelCrawlDataHistory', CustomTravelCrawlDataHistorySchema);
exports.CustomMynaviRecommend = mongoose.model('CustomMynaviRecommend', CustomMynaviRecommendSchema);
exports.CustomMynaviPoint = mongoose.model('CustomMynaviPoint', CustomMynaviPointSchema);
exports.CustomMynaviCondition = mongoose.model('CustomMynaviCondition', CustomMynaviConditionSchema);
exports.CustomMynaviCrawlDataHistory = mongoose.model('CustomMynaviCrawlDataHistory', CustomMynaviCrawlDataHistorySchema);
exports.CustomMynaviFavorites = mongoose.model('CustomMynaviFavorites', CustomMynaviFavoritesSchema);
exports.CustomMynaviStatus = mongoose.model('CustomMynaviStatus', CustomMynaviStatusSchema);
exports.CustomMynaviPageNull = mongoose.model('CustomMynaviPageNull', CustomMynaviPageNullSchema);
exports.CustomMynaviReport = mongoose.model('CustomMynaviReport', CustomMynaviReportSchema);
exports.CustomKarubiProduct = mongoose.model('CustomKarubiProduct', KarubiProductSchema);
exports.CustomKarubiShowProduct = mongoose.model('CustomKarubiShowProduct', KarubiShowProductSchema);
exports.CustomKarubiP2ProductInfo = mongoose.model('CustomKarubiP2ProductInfo', CustomKarubiP2ProductInfoSchema);
exports.CustomKarubiP2Categories = mongoose.model('CustomKarubiP2Categories', CustomKarubiP2CategoriesSchema);
exports.CustomKarubiP2Token = mongoose.model('CustomKarubiP2Token', CustomKarubiP2TokenSchema);
exports.CustomKarubiP2Status = mongoose.model('CustomKarubiP2Status', CustomKarubiP2StatusSchema);
exports.CustomWillProductPrice = mongoose.model('CustomWillProductPrice', WillProductPriceSchema);
exports.CustomLeverageSchool = mongoose.model('CustomLeverageSchool', LeverageSchoolSchema);
exports.CustomBank = mongoose.model('CustomBank', CustomBankSchema);
exports.CustomTryPlus = mongoose.model('CustomTryPlus', TryPlusSchema);

exports.TestCvTracking = mongoose.model('TestCvTracking', TestCvTrackingSchema);
exports.UserPosition = mongoose.model('UserPosition', UserPositionSchema);
exports.ApiEfoEc = mongoose.model('ApiEfoEc', ApiEfoEcSchema);
exports.Users = mongoose.model('users', UserSchema);
exports.Menu = mongoose.model('Menu', MenuSchema);

exports.CustomKarubiTrackingShowProduct = mongoose.model('CustomKarubiTrackingShowProduct', KarubiTrackingShowProductSchema);
exports.ScenarioGenerateLog = mongoose.model('ScenarioGenerateLog', ScenarioGenerateLogsSchema);
exports.CustomFukuuroBank = mongoose.model('FukuuroBank',  CustomFukuuroBankSchema);
exports.ChurnPreventionBulkhomme = mongoose.model('ChurnPreventionBulkhomme', ChurnPreventionBulkhommeSchema);
exports.ZCOMPayment = mongoose.model('ZCOMPayment',  ZCOMPaymentSchema);
exports.FromcocoroChurnState = mongoose.model('churn_status_fromcocoro', FromcocoroChurnStateSchema);
exports.ChurnPreventionItemFTG = mongoose.model('churn_item_FTG', ChurnPreventionItemFTGSchema)
