const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src/app/contribute/page.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Wrap the QR section
content = content.replace(
  '{/* UPI & QR Scanner Section (Zero Friction: 1-Tap Copy UPI + QR Scanner) */}',
  '{!isUatTest && (\n<div className="test-wrapper">{/* UPI & QR Scanner Section (Zero Friction: 1-Tap Copy UPI + QR Scanner) */}'
);
content = content.replace(
  '            {/* Direct Seva Devotee Details Form */}',
  '            </div>\n            )}\n            {/* Direct Seva Devotee Details Form */}'
);

// 2. Wrap the UTR section
content = content.replace(
  '                <div>\n                  <label className="block font-semibold text-gray-700 mb-1">UPI UTR / Ref No. (Optional)</label>',
  '                {!isUatTest && (<div>\n                  <label className="block font-semibold text-gray-700 mb-1">UPI UTR / Ref No. (Optional)</label>'
);
content = content.replace(
  '                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-mono"\n                  />\n                </div>\n              </div>',
  '                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-mono"\n                  />\n                </div>)}\n              </div>'
);

// 3. Replace the submit buttons
const oldBtnRegex = /<div className="pt-3 space-y-2">[\s\S]*?<\/button>\s*<\/div>/;
const newBtn = `<div className="pt-3 space-y-2" >
                {isUatTest ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      if (!modalFormData.name.trim() || !modalFormData.phone.trim() || !modalFlatUnit.trim()) {
                         setModalFormError("Please fill out your Name, Phone Number, and Flat Unit before proceeding to payment.");
                         return;
                      }
                      handleIciciCheckout(e, Number(modalSeva.amount), false);
                    }}
                    disabled={isSubmitting || !modalFormData.name.trim() || !modalFormData.phone.trim() || !modalFlatUnit.trim()}
                    className="w-full bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white font-bold py-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CreditCard size={18} />
                    <span>
                      {isSubmitting ? "Initiating Secure Payment..." : \`Pay ?\${modalSeva.amount.toLocaleString("en-IN")} via ICICI Gateway\`}
                    </span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#D99B26] via-[#B8801C] to-[#966714] text-white font-bold py-3.5 rounded-xl transition shadow-lg golden-glow flex items-center justify-center gap-2 text-sm"
                  >
                    <CheckCircle2 size={17} />
                    <span>
                      {isSubmitting
                        ? "Recording Offering..."
                        : \`I Have Paid ?\${modalSeva.amount.toLocaleString("en-IN")} • Confirm & Get Receipt\`}
                    </span>
                  </button>
                )}
              </div>`;

content = content.replace(oldBtnRegex, newBtn);

fs.writeFileSync(file, content, 'utf8');
