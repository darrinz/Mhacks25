import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title');

    if (!title) {
        return NextResponse.json({ error: 'title is required' }, { status: 400 });
    }

    // First, get the meeting ID from the title
    const { data: meetingData, error: meetingError } = await supabase
        .from('meetings')
        .select('id')
        .eq('title', title)
        .single();

    if (meetingError) {
        return NextResponse.json({ error: `Meeting not found: ${meetingError.message}` }, { status: 404 });
    }

    const meetingId = meetingData.id;

    // Then get the responses for that meeting
    const { data, error } = await supabase
        .from('user_meeting_responses')
        .select('responses')
        .eq('meeting_id', meetingId);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Extract the responses array
    const responsesList = data?.map(row => row.responses) || [];

    return NextResponse.json(responsesList);
}