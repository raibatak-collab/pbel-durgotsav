/**
 * Utility to convert numbers into Indian Rupee currency words.
 * Examples:
 * 1001 -> "Rupees One Thousand One Only"
 * 7500 -> "Rupees Seven Thousand Five Hundred Only"
 * 25000 -> "Rupees Twenty Five Thousand Only"
 * 100000 -> "Rupees One Lakh Only"
 */

const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen"
];

const TENS = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
];

function convertBelowThousand(num: number): string {
  let str = "";
  if (num >= 100) {
    str += ONES[Math.floor(num / 100)] + " Hundred ";
    num %= 100;
  }
  if (num >= 20) {
    str += TENS[Math.floor(num / 10)] + " ";
    num %= 10;
  }
  if (num > 0) {
    str += ONES[num] + " ";
  }
  return str.trim();
}

export function numberToIndianRupeesWords(amount: number): string {
  const rounded = Math.floor(Math.abs(amount));
  if (rounded === 0) return "Rupees Zero Only";

  let crore = Math.floor(rounded / 10000000);
  let remainder = rounded % 10000000;

  let lakh = Math.floor(remainder / 100000);
  remainder %= 100000;

  let thousand = Math.floor(remainder / 1000);
  remainder %= 1000;

  let result = "";

  if (crore > 0) {
    result += convertBelowThousand(crore) + " Crore ";
  }
  if (lakh > 0) {
    result += convertBelowThousand(lakh) + " Lakh ";
  }
  if (thousand > 0) {
    result += convertBelowThousand(thousand) + " Thousand ";
  }
  if (remainder > 0) {
    result += convertBelowThousand(remainder) + " ";
  }

  return `Rupees ${result.replace(/\s+/g, " ").trim()} Only`;
}
