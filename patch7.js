const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src/app/contribute/page.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Hide QR Section
content = content.replace(
  '<div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-300/90 mb-5 text-center space-y-3">',
  '{!isUatTest && (<div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-300/90 mb-5 text-center space-y-3">'
);
content = content.replace(
  '              </div>\n\n              {/* Direct Seva Devotee Details Form */}',
  '              </div>)}\n\n              {/* Direct Seva Devotee Details Form */}'
);

// 2. Hide UTR field
content = content.replace(
  '                <div>\n                  <label className="block font-semibold text-gray-700 mb-1">UPI UTR / Ref No. (Optional)</label>',
  '                {!isUatTest && (<div>\n                  <label className="block font-semibold text-gray-700 mb-1">UPI UTR / Ref No. (Optional)</label>'
);
content = content.replace(
  '                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-mono"\n                  />\n                </div>\n              </div>',
  '                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-mono"\n                  />\n                </div>)}\n              </div>'
);

// 3. Update ICICI button & Hide Submit button
const oldSubmitSection = `              <div className="pt-3 space-y-2" >
                {isUatTest && (
                  <button
                    type="button"
                    onClick={(e) => handleIciciCheckout(e, Number(modalSeva.amount), false)}
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-sm"
                  >
                    <span>🧪 TEST: Pay via ICICI (UAT)</span>
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#D99B26] via-[#B8801C] to-[#966714] text-white font-bold py-3.5 rounded-xl transition shadow-lg golden-glow flex items-center justify-center gap-2 text-sm"
                >
                  <CheckCircle2 size={17} />
                  <span>
                    {isSubmitting
                      ? "Recording Offering..."
                      : \`I Have Paid ₹\${modalSeva.amount.toLocaleString("en-IN")} • Confirm & Get Receipt\`}
                  </span>
                </button>
              </div>`;

const newSubmitSection = `              <div className="pt-3 space-y-2" >
                {isUatTest ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      if (!modalFormData.name.trim() || !modalFormData.phone.trim() || !modalFlatUnit.trim()) {
                         alert("Please fill out your Name, Phone Number, and Flat Unit before proceeding to payment.");
                         return;
                      }
                      handleIciciCheckout(e, Number(modalSeva.amount), false);
                    }}
                    disabled={isSubmitting || !modalFormData.name.trim() || !modalFormData.phone.trim() || !modalFlatUnit.trim()}
                    className="w-full bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white font-bold py-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CreditCard size={18} />
                    <span>
                      {isSubmitting ? "Initiating Secure Payment..." : \`Pay ₹\${modalSeva.amount.toLocaleString("en-IN")} via ICICI Gateway\`}
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
                        : \`I Have Paid ₹\${modalSeva.amount.toLocaleString("en-IN")} • Confirm & Get Receipt\`}
                    </span>
                  </button>
                )}
              </div>`;

content = content.replace(oldSubmitSection, newSubmitSection);

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully updated UI via Node!');
