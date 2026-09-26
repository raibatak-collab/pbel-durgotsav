import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-key'
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      chefName,
      stallName,
      stallType = 'Food',
      tower,
      flatNumber,
      phone,
      category,
      description,
      emoji = '🍲',
      dishes,
      itemsDescription,
      priceRange,
      tablesCount = 1,
      totalAmount = 1000,
      paymentRef = '',
      status = 'Pending',
      paymentStatus = 'Pending Verification',
      isAdmin = false,
    } = body;

    if (!chefName || !stallName || !phone) {
      return NextResponse.json(
        { success: false, error: 'Chef name, stall name, and phone number are required.' },
        { status: 400 }
      );
    }

    const cleanPhone = (phone || '').replace(/[^0-9]/g, '').slice(-10);
    const cleanPaymentRef = (paymentRef || '').trim();

    // 1. Fetch current live stalls from campaigns table
    const { data: campData, error: fetchErr } = await supabaseAdmin
      .from('campaigns')
      .select('id, redirect_link')
      .eq('title', 'config_anandamela_stalls')
      .maybeSingle();

    if (fetchErr) {
      console.error('[Anandamela Register] Error fetching stalls:', fetchErr);
    }

    let currentStalls: any[] = [];
    if (campData?.redirect_link) {
      try {
        currentStalls = JSON.parse(campData.redirect_link);
      } catch (_) {}
    }

    // Check if duplicate already exists
    const existingIndex = currentStalls.findIndex((s: any) => {
      if (cleanPaymentRef && s.paymentRef === cleanPaymentRef) return true;
      if (s.phone === cleanPhone && s.stallName.toLowerCase() === stallName.toLowerCase()) return true;
      return false;
    });

    let savedStall: any;
    const finalStatus = isAdmin ? 'Approved' : status;
    const finalPaymentStatus = isAdmin ? 'Payment Verified' : paymentStatus;

    if (existingIndex >= 0) {
      // Update existing
      currentStalls[existingIndex] = {
        ...currentStalls[existingIndex],
        chefName,
        stallName,
        stallType,
        tower: tower || currentStalls[existingIndex].tower,
        flatNumber: flatNumber || currentStalls[existingIndex].flatNumber,
        phone: cleanPhone,
        category: category || currentStalls[existingIndex].category,
        description: description || currentStalls[existingIndex].description,
        emoji: emoji || currentStalls[existingIndex].emoji,
        dishes: dishes || currentStalls[existingIndex].dishes,
        itemsDescription: itemsDescription || currentStalls[existingIndex].itemsDescription,
        priceRange: priceRange || currentStalls[existingIndex].priceRange,
        tablesCount: Number(tablesCount) || currentStalls[existingIndex].tablesCount || 1,
        totalAmount: Number(totalAmount) || currentStalls[existingIndex].totalAmount || 1000,
        paymentRef: cleanPaymentRef || currentStalls[existingIndex].paymentRef,
        status: finalStatus,
        paymentStatus: finalPaymentStatus,
      };
      savedStall = currentStalls[existingIndex];
    } else {
      // Create new stall
      const stallNumber = `Stall #${String(currentStalls.length + 1).padStart(2, '0')}`;
      savedStall = {
        id: `stall-${Date.now()}`,
        stallNumber,
        stallName,
        chefName,
        stallType,
        tower: tower || 'PBEL City',
        flatNumber: flatNumber || '',
        phone: cleanPhone,
        category: category || (stallType === 'Food' ? 'Festive Specialty' : 'Apparel & Festive Wear'),
        description: description || 'Festive specialty prepared with love by PBEL City residents.',
        emoji,
        dishes: dishes || undefined,
        itemsDescription: itemsDescription || undefined,
        priceRange: priceRange || undefined,
        status: finalStatus,
        tablesCount: Number(tablesCount) || 1,
        totalAmount: Number(totalAmount) || 1000,
        paymentRef: cleanPaymentRef,
        paymentStatus: finalPaymentStatus,
        createdAt: new Date().toISOString(),
      };
      // Prepend newest stall
      currentStalls = [savedStall, ...currentStalls];
    }

    // 2. Atomically save back to campaigns table
    const { error: upsertErr } = await supabaseAdmin.from('campaigns').upsert({
      title: 'config_anandamela_stalls',
      image_url: 'config',
      redirect_link: JSON.stringify(currentStalls),
      is_active: true,
    });

    if (upsertErr) {
      console.error('[Anandamela Register] Error saving stalls to campaigns:', upsertErr);
      return NextResponse.json({ success: false, error: 'Database save failed.' }, { status: 500 });
    }

    // 3. Mirror into contributions table for accounting
    if (cleanPaymentRef || isAdmin) {
      try {
        const { data: existingContrib } = await supabaseAdmin
          .from('contributions')
          .select('id')
          .or(`payment_id.eq.UTR_${cleanPaymentRef},pg_bank_ref_no.eq.${cleanPaymentRef}`)
          .maybeSingle();

        if (!existingContrib) {
          await supabaseAdmin.from('contributions').insert({
            contributor_name: chefName,
            phone: cleanPhone,
            flat_number: `${tower || ''} - ${flatNumber || ''}`.trim().replace(/^-\s*|\s*-$/g, '') || 'PBEL City',
            amount: Number(totalAmount) || (Number(tablesCount) || 1) * 1000,
            category_id: null,
            status: isAdmin ? 'Success' : 'Pending',
            payment_id: cleanPaymentRef ? `UTR_${cleanPaymentRef}` : `MANUAL_${Date.now()}`,
            pg_bank_ref_no: cleanPaymentRef || null,
            is_name_visible: true,
          });
        }
      } catch (contribErr) {
        console.warn('[Anandamela Register] Mirror to contributions warning:', contribErr);
      }
    }

    return NextResponse.json({
      success: true,
      stall: savedStall,
      stalls: currentStalls,
    });
  } catch (err: any) {
    console.error('[Anandamela Register] Critical error:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
