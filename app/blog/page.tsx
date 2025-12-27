'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { BlogPost } from '@/lib/types/blog';
import { Calendar, Eye } from 'lucide-react';

export default function BlogListPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            // Direct supabase call or API call
            // Ideally calling our API
            try {
                const res = await fetch('/api/posts?published=true');
                const data = await res.json();
                if (data.posts) {
                    setPosts(data.posts);
                }
            } catch (error) {
                console.error('Failed to fetch posts', error);
            } finally {
                setLoading(false);
            }
        }

        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-4xl animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-40 bg-gray-100 rounded-lg"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Blog</h1>
                <Link
                    href="/blog/write"
                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                    Write Post
                </Link>
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <p>No posts found.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {posts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            className="block group p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-all bg-white dark:bg-zinc-900 dark:border-zinc-800"
                        >
                            <article>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                    <Calendar size={14} />
                                    <span>
                                        {post.published_at
                                            ? new Date(post.published_at).toLocaleDateString()
                                            : 'Draft'}
                                    </span>
                                    <div className="flex items-center gap-1 ml-4">
                                        <Eye size={14} />
                                        <span>{post.view_count}</span>
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                                    {post.seo_description || 'No description'}
                                </p>
                            </article>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
