import { env } from 'cloudflare:workers';
import { raw } from '../../../db/raw';
export const dynamic = 'force-dynamic';

function authorized(req: Request) {
  const expected = String((env as any).DW_PEOPLE_SYNC_TOKEN || '');
  const supplied = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  if (!expected || expected.length !== supplied.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ supplied.charCodeAt(i);
  return diff === 0;
}

export async function GET(req: Request) {
  if (!authorized(req)) return Response.json({ error: '인증이 필요합니다.' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  try {
    const db = raw();
    const [employees, leaves, org] = await Promise.all([
      db.prepare("SELECT id,name,company,branch,dept,job,updated FROM users WHERE status='approved' ORDER BY company,dept,name").all(),
      db.prepare("SELECT d.id,d.author_id,u.name AS employee_name,u.company,u.branch,u.dept,u.job AS rank,d.title,d.body,d.leave_data,d.`references`,d.start_date,d.end_date,d.status,d.step,d.line,d.created,d.updated FROM approval_documents d LEFT JOIN users u ON u.id=d.author_id WHERE d.kind='휴가 신청' AND d.status<>'draft' ORDER BY d.start_date DESC,d.created DESC LIMIT 500").all(),
      db.prepare("SELECT revision FROM org_config WHERE id='organization'").first<{ revision: number }>(),
    ]);
    return Response.json({
      organizationRevision: org?.revision || 1,
      syncedAt: new Date().toISOString(),
      employees: employees.results,
      leaveRequests: leaves.results.map((row: any) => ({ ...row, line: JSON.parse(row.line || '[]') })),
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    console.error('HR feed unavailable', e instanceof Error ? e.message : 'unknown');
    return Response.json({ error: 'HR 연동 데이터를 불러오지 못했습니다.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
