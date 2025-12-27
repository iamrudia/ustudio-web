import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/client'; // In server components use createServerClient ideally
import PostViewer from '@/components/blog/PostViewer';
import { generateHTML } from '@tiptap/html';
import { extensions } from '@/components/editor/extensions-server'; // Use server extensions
import type { JSONContent } from '@tiptap/core';
import type { Extensions } from '@tiptap/core';

// Mock data fetch for local demo
async function getPostBySlug(slug: string) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        return {
            title: `Mock Post: ${slug}`,
            content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'This is a mock post content.' }] }] },
            published_at: new Date().toISOString(),
            tags: ['mock', 'demo']
        };
    }

    // In real app use createServerClient
    const supabase = createClient();
    const { data: post, error } = await supabase
        .from('ustudio_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

    if (error || !post) return null;
    return post;
}

// Generate Metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
    const post = await getPostBySlug(params.slug);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    return {
        title: post.seo_title || post.title,
        description: post.seo_description || 'Blog post',
        keywords: post.seo_keywords || [],
        openGraph: {
            title: post.seo_title || post.title,
            description: post.seo_description || 'Blog post',
            type: 'article',
            publishedTime: post.published_at,
            images: post.thumbnail_url ? [{ url: post.thumbnail_url }] : [],
        },
    };
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
    const post = await getPostBySlug(params.slug);

    if (!post) {
        notFound();
    }

    // Generate HTML from Tiptap JSON
    // Note: extensions need to be cast to any or correct type for generateHTML due to version mismatch sometimes
    const html = generateHTML(post.content as JSONContent, extensions as unknown as Extensions);

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <header className="mb-8 border-b border-gray-200 pb-8 dark:border-gray-800">
                <h1 className="text-4xl font-bold mb-4 leading-tight">{post.title}</h1>
                <div className="flex items-center text-gray-500 text-sm">
                    <time dateTime={post.published_at}>
                        {new Date(post.published_at).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </time>
                </div>
            </header>

            <article className="min-h-[50vh]">
                <PostViewer htmlContent={html} />
            </article>

            {/* View count increment script could go here via a client component */}
        </div>
    );
}
