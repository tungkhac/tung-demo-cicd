// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'key/client_token_karubi.json';

const { GoogleSpreadsheet } = require('google-spreadsheet');
const API_KEY = 'AIzaSyBuM5GwydDMWgeOsPKYaaPWuHTR3xxEu6o';
const SHEET_ID = '13K1TpwwoSTmWU68I9DHoYy3FsswiqTGWDJIsZDj2IVo';

//var data2 = [
//    "2020-01-01",
//    "123",
//    "display_name111",
//    "comment22",
//    "creator_comment22"
//];
//
//
//fillDataToSS(data2);

function fillDataToSS(data){
    // Load client secrets from a local file.
    fs.readFile('./key/karubi_secret.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Sheets API.
        authorize(JSON.parse(content), function (auth) {
            appendRow(auth, data);
        });
        //authorize(JSON.parse(content), listMajors);
    });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    console.log(client_secret, client_id, redirect_uris);
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error while trying to retrieve access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function appendRow(auth, data) {
    var sheets = google.sheets({version: 'v4', auth});
    const sheets2 = google.sheets('v4');

    console.log(data);
    //var rowcount = sheets.spreadsheets.values.get(SHEET_ID,  'A1:A100000').execute().getValues().size();
    sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: '生産者応援機能!A1:A10000'
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;
        if (rows.length) {
            let values = [
               data
            ];
            const resource = {
                values
            };
            var ranges = "生産者応援機能!A" + rows.length + ":E" + rows.length;
            const request = {
                // The ID of the spreadsheet to update.
                spreadsheetId: SHEET_ID,

                // The A1 notation of a range to search for a logical table of data.
                // Values are appended after the last row of the table.
                range: ranges,

                //// How the input data should be interpreted.
                valueInputOption: "USER_ENTERED",  // TODO: Update placeholder value.
                //
                //// How the input data should be inserted.
                //insertDataOption: '',  // TODO: Update placeholder value.
                resource: resource,
                auth: auth
            };
            //console.log(request);
            try {
                sheets2.spreadsheets.values.append(request, (err, result) => {
                    if (err) {
                        // Handle error
                        console.log(err);
                    } else {

                    }
                });
            } catch (err) {
                console.error(err);
            }
        } else {
            console.log('No data found.');
        }
    });
}

function appendRowNewProduct(auth, data) {
    var sheets = google.sheets({version: 'v4', auth});
    const sheets2 = google.sheets('v4');

    var arrs = [];
    var arr = [];
    for(var i = 0; i < data.length; i++){
        var row = data[i];
        arr = [
            row.date,
            row.name,
            row.code,
            row.page_url,
            row.view_count,
            row.click_count
        ];
        arrs.push(arr);
    }
    console.log(arrs);
    //var rowcount = sheets.spreadsheets.values.get(SHEET_ID,  'A1:A100000').execute().getValues().size();
    sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: '新商品ランダム!A1:A10000'
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;
        if (rows.length) {
            let values = arrs;
            const resource = {
                values
            };
            var ranges = "新商品ランダム!A" + rows.length + ":F" + (rows.length + arrs.length);
            const request = {
                // The ID of the spreadsheet to update.
                spreadsheetId: SHEET_ID,

                // The A1 notation of a range to search for a logical table of data.
                // Values are appended after the last row of the table.
                range: ranges,

                //// How the input data should be interpreted.
                valueInputOption: "USER_ENTERED",  // TODO: Update placeholder value.
                //
                //// How the input data should be inserted.
                //insertDataOption: '',  // TODO: Update placeholder value.
                resource: resource,
                auth: auth
            };
            //console.log(request);
            try {
                sheets2.spreadsheets.values.append(request, (err, result) => {
                    if (err) {
                        // Handle error
                        console.log(err);
                    } else {

                    }
                });
            } catch (err) {
                console.error(err);
            }
        } else {
            console.log('No data found.');
        }
    });
}

function fillDataToSSNewProduct(data){
    // Load client secrets from a local file.
    fs.readFile('./key/karubi_secret.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Sheets API.
        authorize(JSON.parse(content), function (auth) {
            appendRowNewProduct(auth, data);
        });
        //authorize(JSON.parse(content), listMajors);
    });
}


exports.fillDataToSS = fillDataToSS;

exports.fillDataToSSNewProduct = fillDataToSSNewProduct;