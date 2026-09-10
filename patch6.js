const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src/app/api/payment/icici/callback/route.ts');
let content = fs.readFileSync(file, 'utf8');

// Replace standard redirect (307) with 303 See Other
content = content.replace(
  `return NextResponse.redirect(new URL(\`/receipt?pid=\${merchantTxnNo}\`, request.url));`,
  `return NextResponse.redirect(new URL(\`/receipt?pid=\${merchantTxnNo}\`, request.url), 303);`
);

content = content.replace(
  `return NextResponse.redirect(new URL('/contribute?error=payment_failed', request.url));`,
  `return NextResponse.redirect(new URL('/contribute?error=payment_failed', request.url), 303);`
);

content = content.replace(
  `return NextResponse.redirect(new URL('/contribute?error=missing_hash', request.url));`,
  `return NextResponse.redirect(new URL('/contribute?error=missing_hash', request.url), 303);`
);

content = content.replace(
  `return NextResponse.redirect(new URL('/contribute?error=tampered_payment', request.url));`,
  `return NextResponse.redirect(new URL('/contribute?error=tampered_payment', request.url), 303);`
);

content = content.replace(
  `return NextResponse.redirect(new URL('/contribute?error=internal_error', request.url));`,
  `return NextResponse.redirect(new URL('/contribute?error=internal_error', request.url), 303);`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully fixed 303 redirects!');
