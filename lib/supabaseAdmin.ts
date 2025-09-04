// lib/supabaseAdmin.ts
import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error('SUPABASE URL 없음');
if (!process.env.SUPABASE_SERVICE_ROLE) throw new Error('SERVICE ROLE 없음');

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE! // 서버 전용(절대 클라이언트에서 사용 금지)
);
// lib/supabaseAdmin.ts

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error('SUPABASE URL 없음');
if (!process.env.SUPABASE_SERVICE_ROLE) throw new Error('SERVICE ROLE 없음');
