const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src/app/api/payment/icici/initiate/route.ts');
let content = fs.readFileSync(file, 'utf8');

// Update txnDate logic to append 235959 to current date
content = content.replace(
  `txnDate: new Date().toISOString().replace(/[-:T.]/g, '').substring(0, 14), // YYYYMMDDHHMISS`,
  `txnDate: new Date().toISOString().split('T')[0].replace(/-/g, '') + '235959', // Must end in 235959 as per ICICI docs`
);

// Add customerName to payload since it was in their sample
content = content.replace(
  `customerEmailID: email || "guest@icicibank.com",`,
  `customerEmailID: email || "guest@icicibank.com",\n      customerName: customerName || "Guest Devotee",`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully updated route.ts via Node!');
