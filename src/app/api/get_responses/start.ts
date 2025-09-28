import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title');

    // if (!meeting_id) {
    //     return NextResponse.json({ error: 'meeting_id is required' }, { status: 400 });
    // }

    const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('title', title)
        .single();
    const meeting_id = data;

    const { data, error } = await supabase
        .from('user_meeting_responses')
        .select('responses')
        .eq('meeting_id', meeting_id);

    if (!meeting_id) {
        return NextResponse.json({ error: 'title is required' }, { status: 400 });
    }

    if (meetingError || !meetingData) {
        return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Extract the responses array
    const responsesList = data?.map(row => row.responses) || [];

    return NextResponse.json(responsesList);
}