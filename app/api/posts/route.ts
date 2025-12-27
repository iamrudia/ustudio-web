import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import type { CreatePostInput } from '@/lib/types/blog';

// In a real server component we would use createServerClient from @supabase/ssr
// But for this local demo without cookies setup, we simulated it or use the client wrapper but logically correct
// To minimize complexity for the user guide, we will use the client-side logic but in route handlers 
// (Note: In real App Router, you'd use cookies() and createServerClient)

// Mock implementation for local demo if no env vars
const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL;

export async function GET(request: NextRequest) {
    if (isMock) {
        return NextResponse.json({ posts: [] });
    }

    const supabase = createClient();
    const searchParams = request.nextUrl.searchParams;
    const publishedOnly = searchParams.get('published') === 'true';
    const limit = parseInt(searchParams.get('limit') || '10');

    let query = supabase
        .from('ustudio_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (publishedOnly) {
        query = query.eq('is_published', true);
    }

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ posts: data });
}

export async function POST(request: NextRequest) {
    if (isMock) {
        const body = await request.json();
        return NextResponse.json({ post: { ...body, id: 'mock-id-' + Date.now() } });
    }

    const supabase = createClient();
    // Auth check would go here (getServerSession equivalent)
    // For now assuming RLS handles it or client sends token if we strictly used server client

    const body = (await request.json()) as CreatePostInput;

    // Validation
    if (!body.title || !body.slug || !body.content) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('ustudio_posts')
        .insert({
            title: body.title,
            slug: body.slug,
            content: body.content,
            thumbnail_url: body.thumbnail_url,
            locale: body.locale || 'ko',
            is_published: body.is_published || false,
            published_at: body.is_published ? new Date().toISOString() : null,
        })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ post: data });
}
