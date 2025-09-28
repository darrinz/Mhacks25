import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { title, markdown } = body;

        if (!title || !markdown) {
            return NextResponse.json({ error: 'title and markdown are required' }, { status: 400 });
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

        // Update the meeting with the markdown
        const { data, error } = await supabase
            .from('meetings')
            .update({ markdown: markdown })
            .eq('id', meetingId)
            .select();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
}