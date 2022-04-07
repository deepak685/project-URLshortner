const redis = require("redis");

//Connect to redis
const redisClient = redis.createClient(
    18794,
    "redis-18794.c212.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
  );
  redisClient.auth("7VD5AOUDV2y7Xr429zPlDhzS2h8jLYnN", function (err) {
    if (err) throw err;
  });
  
  redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
  });

  module.exports = {redisClient}