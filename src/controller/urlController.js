const validUrl = require("valid-url");
const shortId = require("shortid");
const urlModel = require("../models/urlModel");

const isValid = (val) => {
  if (typeof val === "undefined" || typeof val === null) return false;
  if (typeof val === "string" && val.trim().length === 0) return false;
  return true;
};

const isValidRequestBody = (RequestBody) => {
  return Object.keys(RequestBody).length > 0;
};

//////////////////////////////////////////////////////////////////////////////////////////////
const createUrl = async (req, res) => {

  var baseUrl = "http://localhost:3000";

  try {
    if (! isValidRequestBody(req.body)) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Invalid request parameters. Please provide url details",
        });
    }

    if (!validUrl.isUri(baseUrl)) {
      return res.status(401).json("Invalid Base Url");
    }

    const {longUrl} = req.body;

    if (!isValid(longUrl)) {
      return res.status(400).json({ status: false, msg: "lonUrl is required" });
    }
    // Create url code
    const urlCode = shortId.generate();

    // Check long url sent
    if (validUrl.isUri(longUrl)) {
      let isUrlUsed = await urlModel.findOne({
        longUrl,
      });

      if (isUrlUsed) {
        res.status(400).json({ status: false, msg: "url already exits" });
      } else {
        const shortUrl = baseUrl + "/" + urlCode;

        let url = {
          longUrl,
          shortUrl,
          urlCode,
          date: new Date(),
        };

        let savedData = await urlModel.create(url);
        res.status(200).json({ status: true, data: savedData });
      }
    } else {
      res.status(400).json({ status: false, msg: "invalid longurl" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({status:false,msg:error.message});
  }
};

module.exports.createUrl = createUrl;