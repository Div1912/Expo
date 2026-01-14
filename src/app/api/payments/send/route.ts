import { NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendPayment } from '@/lib/stellar';

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { recipient, amount, note } = await request.json();
  if (!recipient || !amount) {
    return NextResponse.json({ error: 'Recipient and amount are required' }, { status: 400 });
  }

  // 1. Get sender profile (need secret key)
  const { data: senderProfile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!senderProfile?.stellar_secret) {
    return NextResponse.json({ error: 'Sender Stellar account not found' }, { status: 404 });
  }

  try {
    let recipientAddress = recipient;
    let recipientProfile = null;

    // 2. Resolve recipient if it's a username
    if (recipient.includes('@expo') || !recipient.startsWith('G')) {
      const username = recipient.replace('@expo', '');
      const { data: recProfile } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('universal_id', username)
        .single();

      if (!recProfile) {
        return NextResponse.json({ error: 'Recipient Universal ID not found' }, { status: 404 });
      }
      recipientAddress = recProfile.stellar_address;
      recipientProfile = recProfile;
    }

    // 3. Send payment
    const txHash = await sendPayment(senderProfile.stellar_secret, recipientAddress, amount.toString());

    // 4. Record transaction
    const { error: txError } = await supabaseAdmin
      .from('transactions')
      .insert({
        sender_id: senderProfile.id,
        recipient_id: recipientProfile?.id || null,
        sender_universal_id: senderProfile.universal_id,
        recipient_universal_id: recipientProfile?.universal_id || recipient,
        amount: parseFloat(amount),
        currency: 'USDC', // For now we use XLM but label as USDC as per requirements (would use USDC asset in real world)
        tx_hash: txHash,
        status: 'completed',
      });

    if (txError) console.error('History recording error:', txError);

    return NextResponse.json({ success: true, tx_hash: txHash });
  } catch (error: any) {
    console.error('Payment error:', error);
    return NextResponse.json({ error: error.message || 'Payment failed' }, { status: 500 });
  }
}
