const isValid = (val) => {
    if (typeof val === "undefined" || typeof val === null) return false;
    if (typeof val === "string" && val.trim().length === 0) return false;
    return true;
  };
  
  const isValidRequestBody = (RequestBody) => {
    return Object.keys(RequestBody).length > 0;
  };

module.exports.isValid = isValid
module.exports.isValidRequestBody = isValidRequestBody