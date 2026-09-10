const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'src/app/contribute/page.tsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<label className="block text-xs font-semibold text-gray-700 uppercase mb-1">\s*UPI UTR[\s\S]*?outline-none text-xs sm:text-sm font-mono"\s*\/>\s*<\/div>/g,
  function(match) {
    if (match.includes("!isUatTest")) return match;
    return "{!isUatTest && (<div>\n" + match + "\n)}";
  }
);

content = content.replace(
  /<label className="block font-semibold text-gray-700 mb-1">UPI UTR \/ Ref No\. \(Optional\)<\/label>[\s\S]*?outline-none font-mono"\s*\/>\s*<\/div>/g,
  function(match) {
    if (match.includes("!isUatTest")) return match;
    return "{!isUatTest && (<div>\n" + match + "\n)}";
  }
);

const qrRegex = /\{\/\* Dynamic QR Scanner & 1-Tap Mobile Payment Widget \*\/\}[\s\S]*?\{\/\* Custom Donation Devotee Details Form \*\/\}/g;
content = content.replace(qrRegex, function(match) {
  if (match.includes("!isUatTest")) return match;
  return "{!isUatTest && (<div className=\"test-wrapper\">\n" + match.replace('              {/* Custom Donation Devotee Details Form */}', '') + "</div>)}\n              {/* Custom Donation Devotee Details Form */}";
});

fs.writeFileSync(file, content, 'utf8');
console.log("Replaced");
