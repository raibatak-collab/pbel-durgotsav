const crypto = require("crypto");
const secretKey = "1033eedc162c60a3dc4ed6c51fb73ddbc6f01d21d28f77cea20140747514144e";

const resObj = {
  responseCode: 'P1006',
  responseDescription: 'Invalid request: Secure hash does not match',
  merchantId: 'T_S00067',
  aggregatorID: null,
  merchantTxnNo: 'Test123456'
};

// V1 Hash
const sortedKeys = Object.keys(resObj).sort();
let concatenatedValues = '';
for (const key of sortedKeys) {
  if (resObj[key] !== null && resObj[key] !== '') {
    concatenatedValues += resObj[key];
  }
}
console.log("V1 Concat:", concatenatedValues);
console.log("V1 Hash:", crypto.createHmac("sha256", secretKey).update(concatenatedValues, "utf8").digest("hex").toLowerCase());

// V2 Hash
console.log("V2 Hash:", crypto.createHmac("sha256", secretKey).update(JSON.stringify(resObj), "utf8").digest("hex").toLowerCase());
