require("dotenv").config();
const Dialogflow = require("dialogflow");
const Pusher = require("pusher");

const getPersonInfo = require('./person.js');

const projectId = process.env.DIALOGFLOW_PROJECT_ID;
const sessionId = "123456";
const languageCode = "en-US";

const config = {
  credentials: {
    private_key: process.env.DIALOGFLOW_PRIVATE_KEY.replace(new RegExp("\\\\n", "\g"), "\n"),
    client_email: process.env.DIALOGFLOW_CLIENT_EMAIL
  }
};

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true
});

const sessionClient = new Dialogflow.SessionsClient(config);
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

const processMessage = message => {
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode
      }
    }
  };

  sessionClient
    .detectIntent(request)
    .then(responses => {
      const result = responses[0].queryResult;

      if (result.intent.displayName === 'detect-person') {
         const person = result.parameters.fields.person.structValue.fields.name.stringValue;
         return getPersonInfo(person).then(info => {
            const { name, height, mass, birth_year, gender } = info;
            return pusher.trigger('bot', 'bot-response', {
               message: `${name} is a ${gender} Star Wars character of height: ${height}cm and mass: ${mass}kg, born in year: ${birth_year}.`
            });
         })
      }

      return pusher.trigger("bot", "bot-response", {
        message: result.fulfillmentText
      });
    })
    .catch(error => console.error(`Message Processing ERROR: ${error}`));
};

module.exports = processMessage;
