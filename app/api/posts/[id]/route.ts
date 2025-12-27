import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import type { UpdatePostInput } from '@/lib/types/blog';

const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL;

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    if (isMock) {
        return NextResponse.json({ post: { id: params.id, title: 'Mock Post', content: {} } });
    }

    const supabase = createClient();
    const { data, error } = await supabase
        .from('ustudio_posts')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ post: data });
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    if (isMock) {
        const body = await request.json();
        return NextResponse.json({ post: { id: params.id, ...body } });
    }

    const supabase = createClient();
    const body = (await request.json()) as UpdatePostInput;

    const { data, error } = await supabase
        .from('ustudio_posts')
        .update({
            ...body,
            updated_at: new Date().toISOString(),
            ...(body.is_published === true ? { published_at: new Date().toISOString() } : {}),
        })
        .eq('id', params.id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ post: data });
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    if (isMock) {
        return NextResponse.json({ success: true });
    }

    const supabase = createClient();
    const { error } = await supabase
        .from('ustudio_posts')
        .delete()
        .eq('id', params.id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
