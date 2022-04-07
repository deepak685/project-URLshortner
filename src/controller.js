const validUrl = require("valid-url");
const shortId = require("shortid");
const urlModel = require("./urlModel");
const validator = require("./validator");
const { redisClient } = require("./redisClient")
const { promisify } = require("util");

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

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
      await SET_ASYNC(`${urlCode}`, JSON.stringify(longUrl))
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

const getUrl = async (req, res) => {
  try {
    let cachedData = await GET_ASYNC(req.params.urlCode);
    const parsingData = JSON.parse(cachedData)
    if (cachedData) {
      return res.status(307).redirect(parsingData);
    }
    else{
        const urlDetails = await urlModel.findOne({urlCode: req.params.urlCode})
        if(urlDetails){
          return res.status(307).redirect(urlDetails.longUrl)
        }
        else{
          return res.status(404).send({ status: false, msg: "No URL Found" });
        }
  }
  } 
  catch (error) {
    res.status(500).json({ status: false, msg: error.message });
  }
};


module.exports.createShortUrl = createShortUrl;
module.exports.getUrl = getUrl;

//we are using radis database because we want the response time time to decrease, if a big company dont use redis then we would need to go to the main database 
//with millions of data, 