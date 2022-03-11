// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const request = require("request");
const apiURL = "https://api.chatwork.com/v2/rooms/{{roomId}}/messages";
const config = require("config");

const headers = {
  "Content-Type": "application/x-www-form-urlencoded",
};

const roomId = config.has("error_chatwork_roomId")
  ? config.get("error_chatwork_roomId")
  : "";
const token = config.has("error_chatwork_token")
  ? config.get("error_chatwork_token")
  : "";

const logToChatwork = (message) => {
  if (!roomId || !token || !message) return;
  try {
    const url = apiURL.replace("{{roomId}}", roomId);
    const body = `${message}`.trim();
    request.post(
      {
        url,
        form: { body },
        headers: { ...headers, "X-ChatWorkToken": token },
        method: "POST",
      },
      (error, response, body) => {}
    );
  } catch (error) {}
};
module.exports = { logToChatwork };
