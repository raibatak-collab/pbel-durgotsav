const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src/app/contribute/page.tsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace('</div>)}\n\n              {/* Direct Seva Devotee Details Form */}', '</div>\n              )}\n\n              {/* Direct Seva Devotee Details Form */}');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed syntax!');
