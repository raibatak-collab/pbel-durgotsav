const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src/app/api/payment/icici/initiate/route.ts');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'merchantTxnNo: paymentId,',
  'merchantTxnNo: paymentId.replace(/[^a-zA-Z0-9]/g, \'\'),'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully patched initiate route.ts via Node!');
