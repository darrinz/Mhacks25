import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest) {
    console.log("in function");
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title');
    // console.log(title);

    if (!title) {
        return NextResponse.json({ error: 'title is required' }, { status: 400 });
    }

    const supabase = await createClient();

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
    console.log(JSON.stringify(responsesList))
    return NextResponse.json(responsesList);
}