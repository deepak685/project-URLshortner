const mongoose = require("mongoose");
// const shortId = require("shortid");

const urlSchema = new mongoose.Schema(
  {
    urlCode: {
      type: String,
      required:"urlCode is required",
      unique: true,
      lowercase: true,
      trim: true,
    },
    longUrl: { type: String, required:"longUrl is required" ,trim:true}, //valid url
    shortUrl: { type: String, required: "shortUrl is required", unique: true,trim:true}
  },
  { timestamps: true }
);

module.exports = mongoose.model("url", urlSchema);