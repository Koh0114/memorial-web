// app/api/offerings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      flower = 'chrysanthemum',
      is_paid = false,
      amount = 0,
      from_name,
      is_anonymous = true,
      message,
    } = body || {};

    // 1) 헌화 저장(유료=gold, 무료=white)
    const { data: inserted, error: insErr } = await supabaseAdmin
      .from('offerings')
      .insert({
        flower,
        message,
        from_name: is_anonymous ? null : (from_name || null),
        is_anonymous,
        is_paid,
        amount,
        color: is_paid ? 'gold' : 'white',
      })
      .select('id')
      .single();
    if (insErr || !inserted) throw new Error(insErr.message);

    // 2) 점 배정 RPC 호출
    const { data: claimed, error: rpcErr } =
      await supabaseAdmin.rpc('claim_next_dot', { p_offering_id: inserted.id });
    if (rpcErr) throw new Error(rpcErr.message);

    const dot = Array.isArray(claimed) && claimed[0] ? claimed[0] : null;

    // 3) 배정 좌표를 offerings에 업데이트
    if (dot) {
      const { error: upErr } = await supabaseAdmin
        .from('offerings')
        .update({ dot_id: dot.id, x: dot.x, y: dot.y })
        .eq('id', inserted.id);
      if (upErr) throw new Error(upErr.message);
    }

    return NextResponse.json({ ok: true, id: inserted.id, dot }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e.message }, { status: 400 });
  }
}

// (선택) 디버그용 GET 유지 가능
export async function GET() {
  return NextResponse.json({ ok: true, method: 'GET' });
}