const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src/app/contribute/page.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Fix Rupee symbols using simple string replacement instead of regex to avoid parsing issues
content = content.split('Pay ?${modalSeva.amount.toLocaleString("en-IN")}').join('Pay \u20B9${modalSeva.amount.toLocaleString("en-IN")}');
content = content.split('Paid ?${modalSeva.amount.toLocaleString("en-IN")}').join('Paid \u20B9${modalSeva.amount.toLocaleString("en-IN")}');
content = content.split(' Confirm & Get Receipt').join('\u2022 Confirm & Get Receipt');
content = content.split('?? TEST: Pay via ICICI (UAT)').join('\uD83E\uDDEA TEST: Pay via ICICI (UAT)');
content = content.split('o" UPI ID Copied!').join('\u2714 UPI ID Copied!');
content = content.split('dY"< 1-Tap Copy UPI ID').join('\uD83D\uDCF1 1-Tap Copy UPI ID');
content = content.split('dY" To pay via Google Pay').join('\uD83D\uDCA1 To pay via Google Pay');
content = content.split('dY\'').join('\uD83D\uDCA1');

// 2. Fix the handleIciciCheckout function to include the DB insert.
const regex = /const handleIciciCheckout = async \([^)]+\) => \{[\s\S]*?catch \(err\) \{[\s\S]*?\}[\s\S]*?\};/;

const newHandle = `const handleIciciCheckout = async (e: React.FormEvent, amount: number, isGeneral: boolean) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const generatedPaymentId = \`WEB\${Math.random().toString(36).substring(2, 9).toUpperCase()}\`;
      const formData = isGeneral ? customFormData : modalFormData;
      
      const activeTower = isGeneral ? customTower : modalTower;
      const activeFlat = isGeneral ? customFlatUnit : modalFlatUnit;
      const formattedFlat = activeTower === "Other"
        ? activeFlat.trim() || "Guest Devotee"
        : \`\${activeTower} - \${activeFlat.trim()}\`;

      const catName = isGeneral ? "General Pujo Fund" : modalSeva?.title;
      let catId = undefined;
      if (catName) {
        try {
          const { data: catData } = await supabase.from("contribution_categories").select("id").eq("name", catName).maybeSingle();
          if (catData) catId = catData.id;
        } catch (e) {}
      }

      // 1. Insert Pending Record
      const { error } = await supabase.from("contributions").insert({
        contributor_name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        flat_number: formattedFlat,
        amount: amount,
        category_id: catId,
        status: "Pending",
        is_name_visible: formData.isNameVisible,
        payment_id: generatedPaymentId,
      });

      if (error) {
        console.error("DB Error:", error);
        alert("Error registering transaction.");
        setIsSubmitting(false);
        return;
      }

      // 2. Initiate ICICI Session
      const payload = {
        amount,
        customerName: formData.name.trim(),
        email: formData.email.trim(),
        mobileNo: formData.phone.trim(),
        paymentId: generatedPaymentId,
        isUAT: true
      };

      const res = await fetch('/api/payment/icici/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.success && data.redirectURI) {
        window.location.href = \`\${data.redirectURI}?tranCtx=\${data.tranCtx}\`;
      } else {
        alert("ICICI Initiate Failed: " + (data.error || JSON.stringify(data.details || "Unknown error")));
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      alert("Error initiating ICICI payment.");
      setIsSubmitting(false);
    }
  };`;

content = content.replace(regex, newHandle);

fs.writeFileSync(file, content, 'utf8');
console.log("Fixed Unicode and updated handleIciciCheckout!");
