import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/shared/lib/auth-helpers';
import { neon } from '@neondatabase/serverless';

export async function GET() {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.response;

    const sql = neon(process.env.DATABASE_URL!);
    const rows = await sql`SELECT key, value, "updatedAt" FROM system_settings ORDER BY key`;

    const settings: Record<string, string> = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('[Admin Settings GET]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.response;

    const body = await req.json();
    const { settings } = body as { settings: Record<string, string> };

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const sql = neon(process.env.DATABASE_URL!);

    for (const [key, value] of Object.entries(settings)) {
      if (typeof key !== 'string' || typeof value !== 'string') continue;
      await sql`
        INSERT INTO system_settings (key, value, "updatedAt")
        VALUES (${key}, ${value}, now())
        ON CONFLICT (key) DO UPDATE SET value = ${value}, "updatedAt" = now()
      `;
    }

    // Return updated settings
    const rows = await sql`SELECT key, value FROM system_settings ORDER BY key`;
    const updated: Record<string, string> = {};
    for (const row of rows) {
      updated[row.key] = row.value;
    }

    return NextResponse.json({ settings: updated });
  } catch (error) {
    console.error('[Admin Settings PUT]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
