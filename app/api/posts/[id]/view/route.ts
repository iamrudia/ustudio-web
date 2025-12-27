import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL;

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    if (isMock) {
        return NextResponse.json({ success: true, views: 100 });
    }

    const supabase = createClient();

    // Use RPC if you have a specific function, or just direct update
    // Here we assume direct update for simplicity, though rpc is better for concurrency

    /* 
    // RPC Example
    const { data, error } = await supabase.rpc('increment_view_count', { post_id: params.id });
    */

    // Simple increment (race condition possible but okay for simple blog)
    const { data: post } = await supabase.from('ustudio_posts').select('view_count').eq('id', params.id).single();

    if (post) {
        await supabase
            .from('ustudio_posts')
            .update({ view_count: (post.view_count || 0) + 1 })
            .eq('id', params.id);
    }

    return NextResponse.json({ success: true });
}
