require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const connectDB = require('./connectToDb');
const asyncWrapper = require('./asyncWrapper');
const getShortUrl = require('./getShortUrl');
const Link = require('./shortURL');

// global vars
let ShortUrlListFromDB = [];

// Basic Configuration
const port = process.env.PORT;

app.use(express.urlencoded());

var cors = require('cors');
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

// set homepage
app.get(
  '/',
  asyncWrapper(async (req, res) => {
    res.sendFile(process.cwd() + '/views/index.html');
    // get the short url list
    const allLinks = await Link.find({});
    ShortUrlListFromDB = [];
    for (let i = 0; i < allLinks.length; i++) {
      ShortUrlListFromDB.push(allLinks[i].short_url);
    }
  })
);

// use the sort url
app.get(
  '/api/shorturl/:shortURL',
  asyncWrapper(async (req, res) => {
    let shortURL = req.params.shortURL;
    const selectedLink = await Link.findOne({ short_url: shortURL });
    if (!selectedLink) {
      res.json({ error: 'invalid url' });
    }
    let fullUrl = selectedLink.original_url;
    res.redirect(fullUrl);
  })
);

// POST a new Url to DB
app.post(
  '/api/shorturl',
  jsonParser,
  asyncWrapper(async (req, res) => {
    const inputUrl = req.body;
    if (/^(ftp|http|https):\/\/[^ "]+$/.test(inputUrl.url) == false) {
      return res.json({ error: 'invalid url' });
    }
    const shortUrl = getShortUrl(ShortUrlListFromDB);
    const resultJsonString = {
      original_url: inputUrl.url,
      short_url: shortUrl,
    };
    const link = await Link.create(resultJsonString);
    link.save((err, data) => {
      res.json({ original_url: link.original_url, short_url: link.short_url });
    });
  })
);

// connect to data base and listen to server

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`server is listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
