const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src/app/api/payment/icici/initiate/route.ts');
let content = fs.readFileSync(file, 'utf8');

// We will extract host from request to dynamically build the returnURL
content = content.replace(
  `const merchantId = isUAT ? '100000000007164' : ICICI_CONFIG.merchantId;`,
  `const merchantId = isUAT ? '100000000007164' : ICICI_CONFIG.merchantId;
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const host = request.headers.get('host') || 'www.pbelcitydurgotsav.com';
    const dynamicReturnUrl = \`\${protocol}://\${host}/api/payment/icici/callback\`;`
);

content = content.replace(
  `returnURL: ICICI_CONFIG.returnUrl,`,
  `returnURL: dynamicReturnUrl,`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully updated returnURL logic via Node!');
