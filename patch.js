const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src/app/contribute/page.tsx');
let content = fs.readFileSync(file, 'utf8');

// Replace WEB_ with WEB
content = content.replace(/`WEB_\$\{Math\.random\(\)\.toString\(36\)\.substring\(2, 9\)\.toUpperCase\(\)\}`/g, 
  '`WEB${Math.random().toString(36).substring(2, 9).toUpperCase()}`');

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully patched page.tsx via Node!');
