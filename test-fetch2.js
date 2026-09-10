const crypto = require("crypto");

const payload = {
  merchantId: "T_S00067",
  merchantTxnNo: "Test123456",
  amount: "100.00",
  currencyCode: "356",
  payType: "0",
  customerEmailID: "test@icici.com",
  transactionType: "SALE",
  returnURL: "https://www.pbelcitydurgotsav.com/api/payment/icici/callback",
  txnDate: "20260910103000",
  customerMobileNo: "9999999999"
};

const secretKey = "1033eedc162c60a3dc4ed6c51fb73ddbc6f01d21d28f77cea20140747514144e";
const jsonString = JSON.stringify(payload);
const hmac = crypto.createHmac("sha256", secretKey);
hmac.update(jsonString, "utf8");
const secureHash = hmac.digest("hex").toLowerCase();

async function test() {
  const res = await fetch("https://pgpayuat.icicibank.com/tsp/pg/api/v2/initiateSale", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": secretKey,
      "securehash": secureHash
    },
    body: jsonString // Sending exactly the string we hashed! No secureHash inside it!
  });
  const data = await res.json();
  console.log(data);
}
test();
