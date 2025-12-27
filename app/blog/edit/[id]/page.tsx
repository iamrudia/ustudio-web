'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BlogEditor from '@/components/editor/BlogEditor';
import { createClient } from '@/lib/supabase/client';
import type { JSONContent } from '@tiptap/core';

export default function BlogEditPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState<JSONContent>({});
    const [isPublished, setIsPublished] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        async function fetchPost() {
            try {
                const res = await fetch(`/api/posts/${params.id}`);
                if (!res.ok) {
                    alert('Post not found');
                    router.push('/blog');
                    return;
                }
                const data = await res.json();
                if (data.post) {
                    setTitle(data.post.title);
                    setContent(data.post.content);
                    setIsPublished(data.post.is_published);
                }
            } catch (error) {
                console.error('Error fetching post:', error);
            } finally {
                setLoading(false);
            }
        }

        if (params.id) {
            fetchPost();
        }
    }, [params.id, router]);

    const handleSave = async (publish: boolean = false) => {
        setIsSaving(true);
        try {
            const res = await fetch(`/api/posts/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    content,
                    is_published: publish
                })
            });

            if (!res.ok) throw new Error('Failed to save');

            const data = await res.json();
            if (publish) {
                setIsPublished(true);
                alert('Published successfully!');
            } else {
                // Just saved draft
            }
        } catch (error) {
            console.error('Error saving:', error);
            alert('Failed to save');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading editor...</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="flex justify-between items-center mb-8">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-3xl font-bold bg-transparent border-none outline-none w-full placeholder:text-gray-300"
                    placeholder="Post Title"
                />
                <div className="flex gap-2">
                    <button
                        onClick={() => handleSave(false)}
                        disabled={isSaving}
                        className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded text-gray-800 transition-colors"
                    >
                        {isSaving ? 'Saving...' : 'Save Draft'}
                    </button>
                    <button
                        onClick={() => handleSave(true)}
                        disabled={isSaving}
                        className={`px-4 py-2 text-sm rounded text-white transition-colors ${isPublished ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {isPublished ? 'Update' : 'Publish'}
                    </button>
                </div>
            </div>

            <BlogEditor
                content={content}
                onChange={(newContent) => setContent(newContent)}
            />
        </div>
    );
}
