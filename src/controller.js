const validUrl = require("valid-url");
const shortId = require("shortid");
const urlModel = require("./urlModel");
const validator = require("./validator");
const redis = require("redis");
const { promisify } = require("util");

//----------------------create short Url----------------------------------------------------------------------------------------------------------------

const createShortUrl = async (req, res) => {
  try {
    const baseUrl = "http://localhost:3000";

    if (!validUrl.isUri(baseUrl)) {
      return res.status(400).json("Invalid Base Url");
    }

    if (!validator.isValidRequestBody(req.body)) {
      return res.status(400).send({
        status: false,
        message: "Invalid request. Please provide url details",
      });
    }

    const { longUrl } = req.body;

    if (!validator.isValid(longUrl)) {
      return res
        .status(400)
        .json({ status: false, msg: "please provide longUrl." });
    }

    if (validUrl.isUri(longUrl)) {
      let isUrlUsed = await urlModel.findOne({ longUrl });

      if (isUrlUsed) {
        return res
          .status(200)
          .json({ status: true, msg: "Url Details.", data: isUrlUsed });
      }
    } else {
      return res.status(400).json({ status: false, msg: "invalid longurl" });
    }
    // Create url code
    const urlCode = shortId.generate().toLowerCase();

    //checking duplicate UrlCode
    const isDuplicateUrlCode = await urlModel.findOne({ urlCode });

    if (isDuplicateUrlCode) {
      return res
        .status(400)
        .send({
          status: false,
          msg: `The urlCode ${urlCode} is already present, create another UrlCode.`,
        });
    } else {
      //create short url
      const shortUrl = baseUrl + "/" + urlCode;

      let urlCreated = {
        longUrl,
        shortUrl,
        urlCode,
      };

      let savedData = await urlModel.create(urlCreated);
      return res
        .status(201)
        .json({ status: true, msg: "Url Details.", data: savedData });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, msg: error.message });
  }
};

//----------------------getURL----------------------------------------------------------------------------------------------------------------

//Connect to redis
const redisClient = redis.createClient(
  11591,
  "redis-11591.c264.ap-south-1-1.ec2.cloud.redislabs.com",
  { no_ready_check: true }
);
redisClient.auth("zxcRHOlNM6EjJWf3ZmbflRZRmMicWCGu", function (err) {
  if (err) throw err;
});

redisClient.on("connect", async function () {
  console.log("Connected to Redis..");
});

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

const getUrl = async (req, res) => {
  let cahcedUrl = await GET_ASYNC(`${req.params.urlCode}`);
  if (cahcedUrl) {
    res.status(301).redirect(cahcedUrl.longUrl);
  } else {
    let url = await urlModel.findOne({ urlCode: req.params.urlCode });
    await SET_ASYNC(`${req.params.urlCode}`, JSON.stringify(url));
    return res.status(301).redirect(cahcedUrl.longUrl);
  }
};

module.exports.createShortUrl = createShortUrl;
module.exports.getUrl = getUrl;

//ankit
//redis-13491.c212.ap-south-1-1.ec2.cloud.redislabs.com:13491
//BuMCtOJ6K2GtgEGrtKNmPEPT8rmemIwS

// mine
// A36qdjwe6qe2culvtczsxc7aalgcmjux6gvhrrctexghdh13m2w\
// redis-11591.c264.ap-south-1-1.ec2.cloud.redislabs.com:11591