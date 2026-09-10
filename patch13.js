const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src/app/contribute/page.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Fix Rupee symbols using Unicode escapes
content = content.replace(/\?(\$\{modalSeva\.amount\.toLocaleString\("en-IN"\)\})/g, '\u20B9$1');
content = content.replace(//g, '\u2022'); // bullet point
content = content.replace(/Pay \?\{/g, 'Pay \u20B9{');
content = content.replace(/I Have Paid \?\{/g, 'I Have Paid \u20B9{');
// Catch any remaining question marks that should be rupee symbols
content = content.replace(/Pay \?\$/g, 'Pay \u20B9$');
content = content.replace(/Paid \?\$/g, 'Paid \u20B9$');

// 2. Fix the handleIciciCheckout function to include the DB insert.
// We will use a regex that matches the entire function block regardless of minor differences.
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
        // Fetch categories dynamically or just leave catId undefined if not found
        // Because modalSeva checkout fetches it, we can fetch it too
        // We need to use supabase client
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
