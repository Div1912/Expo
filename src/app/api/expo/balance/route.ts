import { NextResponse } from 'next/server';
import { getUser } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
import { getBalances } from '@/lib/stellar';

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('stellar_address')
      .eq('id', user.id)
      .maybeSingle();
  
    if (error || !profile?.stellar_address) {
      return NextResponse.json({ balances: [] });
    }


  const balances = await getBalances(profile.stellar_address);
  return NextResponse.json({ balances });
}
