const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src/app/contribute/page.tsx');
let content = fs.readFileSync(file, 'utf8');

// The regex needs to be extremely forgiving for spaces
const oldBtnRegex = /<div className="pt-3 space-y-2"\s*>[\s\S]*?<\/button>\s*<\/div>/;

const newBtn = `<div className="pt-3 space-y-2">
                {isUatTest ? (
                  <button
                    type="button"
                    onClick={(e) => handleIciciCheckout(e, Number(modalSeva.amount), false)}
                    disabled={isSubmitting || !modalFormData.name.trim() || modalFormData.phone.trim().length !== 10 || !modalFlatUnit.trim()}
                    className="w-full bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-[15px] disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale"
                  >
                    <CreditCard size={20} className={isSubmitting ? "animate-pulse" : ""} />
                    <span>
                      {isSubmitting ? "Securely Connecting to ICICI..." : \`Pay ?\${modalSeva.amount.toLocaleString("en-IN")} via ICICI Gateway\`}
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
console.log('Successfully fixed UI button!');
