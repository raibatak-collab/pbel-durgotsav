const crypto = require("crypto");

const merchantId = "100000000007164";
const aggregatorID = "A100000000007164";
const secretKey = "db06cca0-838b-4e01-8b20-6ac446ffb6bd";

const payload = {
  merchantId: merchantId,
  aggregatorID: aggregatorID,
  merchantTxnNo: "Test" + Date.now(),
  amount: "100.00",
  currencyCode: "356",
  payType: "0",
  customerEmailID: "guest@icicibank.com",
  transactionType: "SALE",
  returnURL: "https://www.pbelcitydurgotsav.com/api/payment/icici/callback",
  txnDate: new Date().toISOString().replace(/[-:T.]/g, '').substring(0, 14),
  customerMobileNo: "9999999999"
};

// Test V1 Hash (Concatenation) inside JSON
const sortedKeys = Object.keys(payload).sort();
let concatenatedValues = '';
for (const key of sortedKeys) {
  concatenatedValues += payload[key];
}
const v1Hash = crypto.createHmac("sha256", secretKey).update(concatenatedValues, "utf8").digest("hex").toLowerCase();

// Test V2 Hash (Stringify) inside JSON
const jsonString = JSON.stringify(payload);
const v2Hash = crypto.createHmac("sha256", secretKey).update(jsonString, "utf8").digest("hex").toLowerCase();

async function testApi(hashToSend, putInHeader) {
  const finalPayload = { ...payload };
  const headers = { "Content-Type": "application/json" };
  
  if (putInHeader) {
    headers["securehash"] = hashToSend;
  } else {
    finalPayload.secureHash = hashToSend;
  }

  const res = await fetch("https://pgpayuat.icicibank.com/tsp/pg/api/v2/initiateSale", {
    method: "POST",
    headers: headers,
    body: putInHeader ? jsonString : JSON.stringify(finalPayload)
  });
  
  const data = await res.json();
  console.log(`Hash=${hashToSend.substring(0,6)} InHeader=${putInHeader} ->`, data.responseCode, data.responseDescription || data.respDescription);
}

async function run() {
  await testApi(v1Hash, false); // V1 in JSON
  await testApi(v2Hash, false); // V2 in JSON
  await testApi(v2Hash, true);  // V2 in Header
}

run();
