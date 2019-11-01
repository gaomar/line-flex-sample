'use strict';

const line = require('@line/bot-sdk');
const express = require('express');

// load environment variables
require('dotenv').config();

// LINE Bot Setting
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};
const client = new line.Client(config);

// base URL for webhook server
const baseURL = process.env.BASE_URL;

// express
const app = new express();
const port = 3000;

// serve static files
app.use('/static', express.static('static'));

// LINE Bot webhook callback [POST only]
app.post('/linebot', line.middleware(config), (req, res) => {
  if (req.body.destination) {
      console.log("Destination User ID: " + req.body.destination);
  }
  // req.body.events should be an array of events
  if (!Array.isArray(req.body.events)) {
      return res.status(500).end();
  }
  // handle each event
  Promise
      .all(req.body.events.map(handleEvent))
      .then(() => res.end())
      .catch((err) => {
          console.error(err);
          res.status(500).end();
      });
});

// callback function to handle a single event
function handleEvent(event) {
  if (event.replyToken && event.replyToken.match(/^(.)\1*$/)) {
      return console.log("Test hook recieved: " + JSON.stringify(event.message));
  }
  // handle event
  switch (event.type) {
      // handle message event
      case 'message':
          const message = event.message;
          switch (message.type) {
              // handle Text message
              case 'text':
                  return handleText(message, event.replyToken, event.source);
              // unknown message
              default:
                  replyText(replyToken, 'よく分かりませんでした');
          }
      // handle follow(友だち追加) event
      case 'follow':
          return replyText(event.replyToken, 'お友だち追加ありがとうございます！');
      // handle unfollow(ブロック) event
      case 'unfollow':
          return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);
      // handle join(グループ参加) event
      case 'join':
          return replyText(event.replyToken, `Joined ${event.source.type}`);
      // handle leave(グループ退室) event
      case 'leave':
          return console.log(`Left: ${JSON.stringify(event)}`);
      // unknown event
      default:
          throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }
};

// simple reply function
function replyText (token, texts) {
  texts = Array.isArray(texts) ? texts : [texts];
  return client.replyMessage(
      token,
      texts.map((text) => ({ type: 'text', text }))
  );
};

// handle TextMessage
function handleText(message, replyToken, event_source) {
  console.log('handleText function called!');
  const f_message = generateFlexMessage();
  return client.replyMessage(
      replyToken,
      f_message
  );
};

// FlexMessage を生成する
function generateFlexMessage() {
  // FlexMessage の中身を生成
  const message_text = `タイトル`
  const message = {
    "type": "carousel",
    "contents": [
      {
        "type": "bubble",
        "size": "micro",
        "hero": {
          "type": "image",
          "url": "https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip10.jpg",
          "size": "full",
          "aspectMode": "cover",
          "aspectRatio": "320:213"
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "Brown Cafe",
              "weight": "bold",
              "size": "sm",
              "wrap": true
            },
            {
              "type": "box",
              "layout": "baseline",
              "contents": [
                {
                  "type": "icon",
                  "size": "xs",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                },
                {
                  "type": "icon",
                  "size": "xs",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                },
                {
                  "type": "icon",
                  "size": "xs",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                },
                {
                  "type": "icon",
                  "size": "xs",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                },
                {
                  "type": "icon",
                  "size": "xs",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png"
                },
                {
                  "type": "text",
                  "text": "4.0",
                  "size": "xs",
                  "color": "#8c8c8c",
                  "margin": "md",
                  "flex": 0
                }
              ]
            },
            {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "text",
                      "text": "東京旅行",
                      "wrap": true,
                      "color": "#8c8c8c",
                      "size": "xs",
                      "flex": 5
                    }
                  ]
                }
              ]
            }
          ],
          "spacing": "sm",
          "paddingAll": "13px"
        }
      },
      {
        "type": "bubble",
        "size": "micro",
        "hero": {
          "type": "image",
          "url": "https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip11.jpg",
          "size": "full",
          "aspectMode": "cover",
          "aspectRatio": "320:213"
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "Brow&Cony's Restaurant",
              "weight": "bold",
              "size": "sm",
              "wrap": true
            },
            {
              "type": "box",
              "layout": "baseline",
              "contents": [
                {
                  "type": "icon",
                  "size": "xs",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                },
                {
                  "type": "icon",
                  "size": "xs",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                },
                {
                  "type": "icon",
                  "size": "xs",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                },
                {
                  "type": "icon",
                  "size": "xs",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                },
                {
                  "type": "icon",
                  "size": "xs",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png"
                },
                {
                  "type": "text",
                  "text": "4.0",
                  "size": "sm",
                  "color": "#8c8c8c",
                  "margin": "md",
                  "flex": 0
                }
              ]
            },
            {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "text",
                      "text": "東京旅行",
                      "wrap": true,
                      "color": "#8c8c8c",
                      "size": "xs",
                      "flex": 5
                    }
                  ]
                }
              ]
            }
          ],
          "spacing": "sm",
          "paddingAll": "13px"
        }
      },
      {
        "type": "bubble",
        "size": "micro",
        "hero": {
          "type": "image",
          "url": "https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip12.jpg",
          "size": "full",
          "aspectMode": "cover",
          "aspectRatio": "320:213"
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "Tata",
              "weight": "bold",
              "size": "sm"
            },
            {
              "type": "box",
              "layout": "baseline",
              "contents": [
                {
                  "type": "icon",
                  "size": "xs",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                },
                {
                  "type": "icon",
                  "size": "xs",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                },
                {
                  "type": "icon",
                  "size": "xs",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                },
                {
                  "type": "icon",
                  "size": "xs",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                },
                {
                  "type": "icon",
                  "size": "xs",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png"
                },
                {
                  "type": "text",
                  "text": "4.0",
                  "size": "sm",
                  "color": "#8c8c8c",
                  "margin": "md",
                  "flex": 0
                }
              ]
            },
            {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "text",
                      "text": "東京旅行",
                      "wrap": true,
                      "color": "#8c8c8c",
                      "size": "xs",
                      "flex": 5
                    }
                  ]
                }
              ]
            }
          ],
          "spacing": "sm",
          "paddingAll": "13px"
        }
      }
    ]
  };
  return {
      "type": "flex",
      "altText": message_text,
      "contents": message
  };
};

// run express server
app.listen(port, () => {
  console.log(`Server running on ${port}`)
});