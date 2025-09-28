import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const meeting_id = searchParams.get('title');

    // if (!meeting_id) {
    //     return NextResponse.json({ error: 'meeting_id is required' }, { status: 400 });
    // }

    const { data, error } = await supabase
        .from('user_meeting_responses')
        .select('responses')
        .eq('meeting_id', meeting_id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Extract the responses array
    const responsesList = data?.map(row => row.responses) || [];

    return NextResponse.json(responsesList);
}