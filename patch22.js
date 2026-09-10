const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src/app/contribute/page.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Hide UTR in Custom Form
const customUtrBlock = `                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                      UPI UTR / Transaction Ref No. (Optional from GPay/PhonePe)
                    </label>
                    <input
                      type="text"
                      value={customFormData.upiRef}
                      onChange={(e) => setCustomFormData({ ...customFormData, upiRef: e.target.value })}
                      placeholder="e.g. 12-digit UTR for instant verification"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-xs sm:text-sm font-mono"
                    />
                  </div>`;
                  
if (content.includes(customUtrBlock)) {
    content = content.replace(customUtrBlock, `                  {!isUatTest && (<div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                      UPI UTR / Transaction Ref No. (Optional from GPay/PhonePe)
                    </label>
                    <input
                      type="text"
                      value={customFormData.upiRef}
                      onChange={(e) => setCustomFormData({ ...customFormData, upiRef: e.target.value })}
                      placeholder="e.g. 12-digit UTR for instant verification"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-xs sm:text-sm font-mono"
                    />
                  </div>)}`);
} else {
    console.log("Could not find customUtrBlock");
}

// 2. Hide UTR in Modal Form
const modalUtrBlock = `                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">UPI UTR / Ref No. (Optional)</label>
                    <input
                      type="text"
                      value={modalFormData.upiRef}
                      onChange={(e) => setModalFormData({ ...modalFormData, upiRef: e.target.value })}
                      placeholder="12-digit UTR from GPay"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-mono"
                    />
                  </div>`;

if (content.includes(modalUtrBlock)) {
    content = content.replace(modalUtrBlock, `                  {!isUatTest && (<div>
                    <label className="block font-semibold text-gray-700 mb-1">UPI UTR / Ref No. (Optional)</label>
                    <input
                      type="text"
                      value={modalFormData.upiRef}
                      onChange={(e) => setModalFormData({ ...modalFormData, upiRef: e.target.value })}
                      placeholder="12-digit UTR from GPay"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-mono"
                    />
                  </div>)}`);
} else {
    console.log("Could not find modalUtrBlock");
}

fs.writeFileSync(file, content, 'utf8');
