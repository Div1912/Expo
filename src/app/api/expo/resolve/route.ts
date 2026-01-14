import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  // Check local DB first (acting as a cache/registry source for the demo)
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('stellar_address, universal_id')
    .eq('universal_id', username)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Universal ID not found' }, { status: 404 });
  }

  return NextResponse.json({
    username: data.universal_id,
    address: data.stellar_address,
  });
}
