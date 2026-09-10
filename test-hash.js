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
"txnDate": "20251003123421"
};

const secretKey = "1033eedc162c60a3dc4ed6c51fb73ddbc6f01d21d28f77cea20140747514144e"; // guess? No, let's just see how to stringify.
const jsonStr = JSON.stringify(payload);
console.log("JSON String:", jsonStr);

// Let's test the hash with the key from the PDF sample if available?
