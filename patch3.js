const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src/app/contribute/page.tsx');
let content = fs.readFileSync(file, 'utf8');

// The replacement logic:
const targetString = 'className="pt-3"';

const newButton = `className="pt-3 space-y-2" >
                {isUatTest && (
                  <button
                    type="button"
                    onClick={(e) => handleIciciCheckout(e, Number(modalSeva.amount), false)}
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-sm"
                  >
                    <span>🧪 TEST: Pay via ICICI (UAT)</span>
                  </button>
                )}`;

// We have two places with pt-3?
// Let's replace the one right before the submit button in the modalSeva form.

let idx = content.lastIndexOf('<div className="pt-3">');
if (idx !== -1) {
    content = content.substring(0, idx) + '<div ' + newButton + content.substring(idx + 22);
}

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully injected button!');
