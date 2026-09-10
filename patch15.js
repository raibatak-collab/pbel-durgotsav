const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src/app/api/payment/icici/callback/route.ts');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/status: 'Approved'/g, "status: 'Success'");
content = content.replace(/status: 'Rejected'/g, "status: 'Failed'");

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed DB statuses in callback!');
