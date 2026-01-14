import { NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
import { createStellarAccount, registerUniversalId } from '@/lib/stellar';

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { username } = await request.json();
  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  // Double check availability
  const { data: existing } = await supabaseAdmin
    .from('profiles')
    .select('universal_id')
    .eq('universal_id', username)
    .single();

  if (existing) {
    return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
  }

  try {
    // 1. Create Stellar account
    const { publicKey, secretKey } = await createStellarAccount();

    // 2. Register on Soroban
    const txHash = await registerUniversalId(username, publicKey);

    // 3. Update Supabase profile
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        universal_id: username,
        stellar_address: publicKey,
        stellar_secret: secretKey,
      })
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      username,
      stellar_address: publicKey,
      tx_hash: txHash,
    });
  } catch (error: any) {
    console.error('Claim error:', error);
    return NextResponse.json({ error: error.message || 'Failed to claim Universal ID' }, { status: 500 });
  }
}
