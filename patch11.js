const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src/app/api/payment/icici/callback/route.ts');
let content = fs.readFileSync(file, 'utf8');

// 1. Save pg_bank_ref_no
content = content.replace(
  `await supabaseAdmin.from('contributions').update({ status: 'Approved' }).eq('payment_id', merchantTxnNo);`,
  `await supabaseAdmin.from('contributions').update({ 
        status: 'Approved',
        pg_bank_ref_no: payload['txnID'] || null
      }).eq('payment_id', merchantTxnNo);`
);

// 2. Fix the redirect parameter ?pid= to ?id=
content = content.replace(
  `return NextResponse.redirect(new URL(\`/receipt?pid=\${merchantTxnNo}\`, request.url), 303);`,
  `return NextResponse.redirect(new URL(\`/receipt?id=\${merchantTxnNo}\`, request.url), 303);`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully updated callback logic via Node!');
