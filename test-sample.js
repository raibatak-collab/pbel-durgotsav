const crypto = require("crypto");

const payload = {
"merchantId": "T_S00067",
"merchantTxnNo": "Test03102025111",
"amount": "550.00",
"currencyCode": "356",
"payType": "0",
"customerEmailID": "guest@icici.com",
"transactionType": "SALE",
"returnURL": "https://pgpayuat.icicibank.com/tsp/pg/api/merchant",
"txnDate": "20251003123421",
"customerMobileNo": "7912403781",
"addlParam1": "Additional Information",
"addlParam2": "Additional Information"
};

const secretKey = "1033eedc162c60a3dc4ed6c51fb73ddbc6f01d21d28f77cea20140747514144e"; // uat key

// V1 Hash
const sortedKeys = Object.keys(payload).sort();
let concatenatedValues = '';
for (const key of sortedKeys) {
  concatenatedValues += payload[key];
}
console.log("V1 Concat:", concatenatedValues);
console.log("V1 Hash:", crypto.createHmac("sha256", secretKey).update(concatenatedValues, "utf8").digest("hex").toLowerCase());

// V2 Hash
const jsonString = JSON.stringify(payload);
console.log("V2 Hash:", crypto.createHmac("sha256", secretKey).update(jsonString, "utf8").digest("hex").toLowerCase());
