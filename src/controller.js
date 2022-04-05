const validUrl = require("valid-url");
const shortId = require("shortid");
const urlModel = require("./urlModel");
const validator = require("./validator")

//----------------------create short Url----------------------------------------------------------------------------------------------------------------

const createShortUrl = async (req, res) => {
  try {
    const baseUrl = "http://localhost:3000";

    if (!validUrl.isUri(baseUrl)) {
      return res.status(400).json("Invalid Base Url");
    }

    if (!(validator.isValidRequestBody(req.body))) {
      return res.status(400).send({
        status: false,
        message: "Invalid request. Please provide url details",
      });
    }

    const { longUrl } = req.body;

    if (!(validator.isValid(longUrl))) {
      return res.status(400).json({ status: false, msg: "longUrl is required" });
    }

    if (validUrl.isUri(longUrl)) {
      let isUrlUsed = await urlModel.findOne({longUrl});

      if (isUrlUsed) {
        return res.status(200).json({ status: true, msg: "Url Details.", data:isUrlUsed});
      }
    } else {
      res.status(400).json({ status: false, msg: "invalid longurl" });
    }
    // Create url code
    const urlCode = shortId.generate().toLowerCase();

    //checking duplicate UrlCode
    const isDuplicateUrlCode = await urlModel.findOne({urlCode});

    if(isDuplicateUrlCode){
      return res.status(400).send({status:false, msg:"The urlCode is already present, create another UrlCode."})
    }
    else{
      //create short url
      const shortUrl = baseUrl + "/" + urlCode;

      let urlCreated = {
        longUrl,
        shortUrl,
        urlCode
      };

      let savedData = await urlModel.create(urlCreated);
      res.status(201).json({ status: true, msg:"Url Details.", data: savedData });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, msg: error.message });
  }
};

//----------------------getURL----------------------------------------------------------------------------------------------------------------

const getUrl = async (req, res) => {
  try {
    const url = await urlModel.findOne({ urlCode: req.params.urlCode });
    if (url) {
      return res.status(301).redirect(url.longUrl);
    } else {
      return res.status(400).json({ status: false, msg: "Invalid URL" });
    }
  } catch (error) {
    res.status(500).json({ status: false, msg: error.message });
  }
};

module.exports.getUrl = getUrl;
module.exports.createShortUrl = createShortUrl;