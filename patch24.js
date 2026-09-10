const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'src/app/contribute/page.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Hide QR in Custom Form
content = content.replace(
  '<div className="bg-gradient-to-br from-amber-50/95 via-orange-50/80 to-amber-100/50 p-5 sm:p-6 rounded-3xl border border-amber-300/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">',
  '<div className={`bg-gradient-to-br from-amber-50/95 via-orange-50/80 to-amber-100/50 p-5 sm:p-6 rounded-3xl border border-amber-300/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 ${isUatTest ? "hidden" : ""}`}>'
);

// 2. Hide UTR in Custom Form
content = content.replace(
  '<label className="block text-xs font-semibold text-gray-700 uppercase mb-1">\n                      UPI UTR / Transaction Ref No. (Optional from GPay/PhonePe)\n                    </label>',
  '<label className={`block text-xs font-semibold text-gray-700 uppercase mb-1 ${isUatTest ? "hidden" : ""}`}>\n                      UPI UTR / Transaction Ref No. (Optional from GPay/PhonePe)\n                    </label>'
);
content = content.replace(
  'className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-xs sm:text-sm font-mono"\n                    />\n                  </div>',
  'className={`w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-xs sm:text-sm font-mono ${isUatTest ? "hidden" : ""}`}\n                    />\n                  </div>'
);

// 3. Hide UTR in Modal Form
content = content.replace(
  '<label className="block font-semibold text-gray-700 mb-1">UPI UTR / Ref No. (Optional)</label>',
  '<label className={`block font-semibold text-gray-700 mb-1 ${isUatTest ? "hidden" : ""}`}>UPI UTR / Ref No. (Optional)</label>'
);
content = content.replace(
  'className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-mono"\n                    />\n                  </div>',
  'className={`w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-mono ${isUatTest ? "hidden" : ""}`}\n                    />\n                  </div>'
);

fs.writeFileSync(file, content, 'utf8');
console.log("Safe class injection done!");
