const nodemailer = require("nodemailer");
require('dotenv').config({ path: '../.env' });
const { log } = require('../utils/logger')
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWSAPI_KEY);
const { emails } = require('../emails.json')

async function send() {
  log.debug('> Grabbing news...')
  newsapi.v2
    .topHeadlines({
      category: "general",
      language: "en",
      country: process.env.COUNTRY_CODE,
    })
    .then(async (generalResponse) => {
      // log.debug("> General News fetched");
      newsapi.v2
        .topHeadlines({
          category: "technology",
          language: "en",
          country: process.env.COUNTRY_CODE,
        })
        .then(async (techResponse) => {
          // log.debug("> Tech News fetched");
          newsapi.v2
            .topHeadlines({
              category: "health",
              language: "en",
              country: process.env.COUNTRY_CODE,
            })
            .then(async (healthResponse) => {
              // log.debug("> Health News fetched");
              const { template } = require("./handlebars");
              var data = {
                "GENERAL-ONE-TITLE": generalResponse.articles[0].title,
                "GENERAL-ONE-IMG": (generalResponse.articles[0].urlToImage == null ? 'https://i.imgur.com/0CSGynq.jpg' : generalResponse.articles[0].urlToImage),
                "GENERAL-ONE-CONTENT":
                  generalResponse.articles[0].content.replace(/\[.*?\]/g, ""),
                "GENERAL-ONE-URL": generalResponse.articles[0].url,
                "GENERAL-TWO-TITLE": generalResponse.articles[1].title,
                "GENERAL-TWO-IMG": (generalResponse.articles[1].urlToImage == null ? 'https://i.imgur.com/0CSGynq.jpg' : generalResponse.articles[1].urlToImage),
                "GENERAL-TWO-CONTENT":
                  generalResponse.articles[1].content.replace(/\[.*?\]/g, ""),
                "GENERAL-TWO-URL": generalResponse.articles[1].url,
                "GENERAL-THREE-TITLE": generalResponse.articles[2].title,
                "GENERAL-THREE-IMG": (generalResponse.articles[2].urlToImage == null ? 'https://i.imgur.com/0CSGynq.jpg' : generalResponse.articles[2].urlToImage),
                "GENERAL-THREE-CONTENT":
                  generalResponse.articles[2].content.replace(/\[.*?\]/g, ""),
                "GENERAL-THREE-URL": generalResponse.articles[2].url,
                "TECH-ONE-TITLE": techResponse.articles[0].title,
                "TECH-ONE-IMG": (techResponse.articles[0].urlToImage == null ? 'https://i.imgur.com/0CSGynq.jpg' : techResponse.articles[0].urlToImage),
                "TECH-ONE-CONTENT": 
                  techResponse.articles[0].content.replace(/\[.*?\]/g,""),
                "TECH-ONE-URL": techResponse.articles[0].url,
                "TECH-TWO-TITLE": techResponse.articles[1].title,
                "TECH-TWO-IMG": (techResponse.articles[1].urlToImage == null ? 'https://i.imgur.com/0CSGynq.jpg' : techResponse.articles[1].urlToImage),
                "TECH-TWO-CONTENT": 
                  techResponse.articles[1].content.replace(/\[.*?\]/g,""),
                "TECH-TWO-URL": techResponse.articles[1].url,
                "HEALTH-ONE-TITLE": healthResponse.articles[0].title,
                "HEALTH-ONE-IMG": (healthResponse.articles[0].urlToImage == null ? 'https://i.imgur.com/0CSGynq.jpg' : healthResponse.articles[0].urlToImage),
                "HEALTH-ONE-CONTENT":
                  healthResponse.articles[0].content.replace(/\[.*?\]/g, ""),
                "HEALTH-ONE-URL": healthResponse.articles[0].url,
                "HEALTH-TWO-TITLE": healthResponse.articles[1].title,
                "HEALTH-TWO-IMG": (healthResponse.articles[1].urlToImage == null ? 'https://i.imgur.com/0CSGynq.jpg' : healthResponse.articles[1].urlToImage),
                "HEALTH-TWO-CONTENT":
                  healthResponse.articles[1].content.replace(/\[.*?\]/g, ""),
                "HEALTH-TWO-URL": healthResponse.articles[1].url,
              };

              var result = template(data);

                log.info('> Attemping to send Email...')
                var transporter = await nodemailer.createTransport({
                  host: process.env.SMTP_HOST,
                  port: process.env.SMTP_PORT,
                  secure: false, // true for 465, false for other ports
                  auth: {
                    user: process.env.SMTP_USERNAME,
                    pass: process.env.SMTP_PASSWORD,
                  },
                  tls: {
                    ciphers: 'SSLv3',
                    rejectUnauthorized: false
                  }
                });

                //for each email in emails.json send the email
                emails.forEach(async (email) => {
                  var mailOptions = {
                    from: '"Morning Mail" <' + process.env.SMTP_USERNAME + '>',
                    to: email,
                    subject: "☕ Good morning!",
                    html: result,
                  };

                  transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                      log.error(error);
                    } else {
                      log.info('Email sent: ' + info.messageId);
                    }
                  });
                });
            });
        });
    });
}

send()

///

