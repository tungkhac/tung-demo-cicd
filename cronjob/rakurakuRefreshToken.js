// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const axios = require("axios");
const { get } = require('lodash')
const {Variable} = require('../model');
const {generateLog} = require('../services/rakuraku/helper');
const {RAKURAKU_API, ACCESS_TOKEN_PATH} = require('../services/rakuraku/constants');

/**
 * Rakuraku's customer will provide a code to get an access_token and refresh_token
 * We use refresh_token to generate a new access_token for each session
 * But refresh_token will be expired after 100 days
 * We write a cronjob to generate a new refresh_token
 */
const run = async () => {
    const rakurakuVariable = await Variable.findOne({variable_name: "bot_name", default_value: "Rakuraku"});
    if (!rakurakuVariable) {
        return console.log(generateLog(`cronjob useRefreshToken: Rakuraku variable bot_name is not existed. Please check again`));
    }
    const {connect_page_id} = rakurakuVariable;

    if (!connect_page_id) {
        return console.log(generateLog(`cronjob useRefreshToken: Rakuraku variable connect_page_id is not existed. Please check again`));
    }

    const promises = [
        Variable.findOne({connect_page_id, variable_name: "refresh_token"}),
        Variable.findOne({connect_page_id, variable_name: "client_id"}),
        Variable.findOne({connect_page_id, variable_name: "client_secret"})
    ];

    const [refreshTokenVariable, clientIdVariable, clientSecretVariable] = await Promise.all(promises);
    if (!refreshTokenVariable || !refreshTokenVariable.default_value) {
        return console.log(generateLog(`cronjob useRefreshToken: Rakuraku refresh_token is not existed. Please check again`));
    }


    if (!clientIdVariable || !clientIdVariable.default_value) {
        return console.log(generateLog(`cronjob useRefreshToken: Rakuraku clientId is not existed. Please check again`));
    }

    if (!clientSecretVariable || !clientSecretVariable.default_value) {
        return console.log(generateLog(`cronjob useRefreshToken: Rakuraku clientSecret is not existed. Please check again`));
    }

    try {
        const result = await axios.post(RAKURAKU_API + ACCESS_TOKEN_PATH, {
            grant_type: "client_credentials",
            refresh_token: refreshTokenVariable.default_value,
            client_secret: clientSecretVariable.default_value,
            client_id: clientIdVariable.default_value
        });
        const refreshToken = get(result, 'data.refresh_token');
        if (refreshToken) {
            await Variable.updateOne({connect_page_id, variable_name: "refresh_token"}, {default_value: refreshToken, updated_at: new Date()})
            return console.log(generateLog(`cronjob update refresh_token successsfully, refreshToken: ${refreshToken}`))
        }
        console.log(generateLog('cronjob useRefreshToken result: ', result.data))
    } catch (err) {
        console.log(generateLog('cronjob useRefreshToken error: ', {err, message: err.message}))
    }
}

module.exports = {
    run,
}
