'use client';

import { useState, useEffect } from 'react';
import BlogEditor from '@/components/editor/BlogEditor';
import { useAutoSave } from '@/lib/hooks/useAutoSave';
import { createClient } from '@/lib/supabase/client';
import type { JSONContent } from '@tiptap/core';

export default function BlogWritePage() {
    const supabase = createClient();
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState<JSONContent>({});
    const [postId, setPostId] = useState<string | null>(null);
    const [generatingSlug, setGeneratingSlug] = useState(false);

    // 실시간 저장 (초안 저장용)
    const { saveStatus, lastSaved, triggerSave } = useAutoSave({
        docId: postId || 'draft',
        debounceMs: 2000,
        onSave: async (savedContent, savedTitle) => {
            // For local testing without real auth, we skip auth check if session is missing
            // In production, uncomment this:
            /*
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
              throw new Error('로그인이 필요합니다.');
            }
            */

            // Mock API call for local testing
            console.log('Saving post:', { title: savedTitle, content: savedContent });
            await new Promise(resolve => setTimeout(resolve, 500));
            return;

            /* Real API implementation
            const url = postId ? `/api/posts/${postId}` : '/api/posts';
            const method = postId ? 'PATCH' : 'POST';
            
            const response = await fetch(url, {
              method,
              headers: {
                'Content-Type': 'application/json',
                // Authorization: `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({
                title: savedTitle || title,
                content: savedContent,
                is_published: false, // 초안으로 저장
              }),
            });
      
            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.error || '저장 실패');
            }
      
            const data = await response.json();
            if (data.post && !postId) {
              setPostId(data.post.id);
            }
            */
        },
    });

    // 제목 변경 핸들러
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        if (content) {
            triggerSave(content, newTitle);
        }
    };

    // 본문 변경 핸들러
    const handleContentChange = (newContent: JSONContent) => {
        setContent(newContent);
        triggerSave(newContent, title);
    };

    // slug 자동 생성 (Gemini API 사용)
    useEffect(() => {
        if (!title || title.trim().length === 0) {
            return;
        }

        // debounce: 1초 후에 슬러그 생성
        const timeoutId = setTimeout(async () => {
            // 사용자가 수동으로 슬러그를 수정한 경우 자동 생성하지 않음
            if (slug && slug.trim().length > 0) {
                return;
            }

            setGeneratingSlug(true);
            try {
                // Mock slug generation if API is not available
                await new Promise(resolve => setTimeout(resolve, 1000));
                const fallbackSlug = title
                    .toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '')
                    .trim();
                setSlug(fallbackSlug);

                /* Real API call
                const response = await fetch('/api/blog/generate-slug', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ title, locale: 'ko' }),
                });
          
                if (!response.ok) {
                  throw new Error('슬러그 생성에 실패했습니다.');
                }
          
                const data = await response.json();
                if (data.slug) {
                  setSlug(data.slug);
                }
                */
            } catch (error: any) {
                console.error('Error generating slug:', error);
            } finally {
                setGeneratingSlug(false);
            }
        }, 1000); // 1초 debounce

        return () => clearTimeout(timeoutId);
    }, [title, slug]);

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="mb-8 space-y-4">
                {/* 저장 상태 표시 */}
                <div className="flex items-center gap-2 text-xs">
                    {saveStatus === 'saving' && (
                        <span className="text-yellow-600">저장 중...</span>
                    )}
                    {saveStatus === 'saved' && lastSaved && (
                        <span className="text-green-600">
                            저장됨 {lastSaved.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    )}
                    {saveStatus === 'error' && (
                        <span className="text-red-600">저장 실패</span>
                    )}
                    {saveStatus === 'offline' && (
                        <span className="text-slate-600">오프라인 - 동기화 대기 중</span>
                    )}
                </div>

                {/* 제목 입력 */}
                <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="제목을 입력하세요"
                    className="w-full text-4xl font-bold border-none outline-none placeholder:text-gray-300 bg-transparent"
                />

                {/* 슬러그 표시 */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-mono">/{slug}</span>
                    {generatingSlug && <span className="animate-pulse">...</span>}
                </div>
            </div>

            {/* 에디터 */}
            <BlogEditor
                content={content}
                onChange={handleContentChange}
            />
        </div>
    );
}
