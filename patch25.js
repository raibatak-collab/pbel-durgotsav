const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'src/app/contribute/page.tsx');
let content = fs.readFileSync(file, 'utf8');

const regex = /\{\/\* Submit Action \*\/\}[\s\S]*?<\/div>/;

const newCustomSubmit = `{/* Submit Action */}
                <div className="pt-2 space-y-2">
                  {isUatTest ? (
                    <button
                      type="button"
                      onClick={(e) => handleIciciCheckout(e, Number(customAmount), true)}
                      disabled={isSubmitting || !customAmount || customAmount <= 0 || !customFormData.name.trim() || customFormData.phone.trim().length !== 10 || !customFlatUnit.trim()}
                      className="w-full bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-[15px] disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale"
                    >
                      <CreditCard size={20} className={isSubmitting ? "animate-pulse" : ""} />
                      <span>
                        {isSubmitting ? "Securely Connecting to ICICI..." : \`Pay \u20B9\${customAmount ? Number(customAmount).toLocaleString("en-IN") : "0"} via ICICI Gateway\`}
                      </span>
                    </button>
                  ) : (
                    <>
                      <button
                        type="submit"
                        disabled={isSubmitting || !customAmount || customAmount <= 0}
                        className="w-full bg-gradient-to-r from-[#D99B26] via-[#B8801C] to-[#966714] hover:from-[#B8801C] hover:to-[#78520D] text-white font-bold text-base py-3.5 rounded-2xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 golden-glow flex items-center justify-center gap-2"
                      >
                        <HeartHandshake size={20} />
                        <span>
                          {isSubmitting
                            ? "Recording Offering..."
                            : \`Confirm & Record \u20B9\${customAmount ? Number(customAmount).toLocaleString("en-IN") : "0"} Offering\`}
                        </span>
                      </button>
                      <p className="text-[11px] text-gray-400 text-center mt-2.5 flex items-center justify-center gap-1">
                        <ShieldCheck size={13} className="text-green-600" /> Direct 100% Zero-Fee Transfer to PBEL Sanskritik Samiti Bank Account
                      </p>
                    </>
                  )}
                </div>`;

content = content.replace(regex, newCustomSubmit);

fs.writeFileSync(file, content, 'utf8');
