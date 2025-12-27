'use client';

import { BubbleMenu } from '@tiptap/react/menus';
import type { Editor } from '@tiptap/core';
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    Link,
    Heading1,
    Heading2,
    Heading3,
} from 'lucide-react';
import { useState } from 'react';

interface EditorBubbleMenuProps {
    editor: Editor;
}

export default function EditorBubbleMenu({ editor }: EditorBubbleMenuProps) {
    const [isLinkOpen, setIsLinkOpen] = useState(false);
    const [url, setUrl] = useState('');

    if (!editor) return null;

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <BubbleMenu
            editor={editor}
            className="flex overflow-hidden rounded-md border border-slate-700 bg-slate-900 shadow-xl"
        >
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 text-slate-400 hover:text-slate-100 ${editor.isActive('bold') ? 'bg-slate-700 text-slate-100' : ''
                    }`}
            >
                <Bold size={16} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 text-slate-400 hover:text-slate-100 ${editor.isActive('italic') ? 'bg-slate-700 text-slate-100' : ''
                    }`}
            >
                <Italic size={16} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`p-2 text-slate-400 hover:text-slate-100 ${editor.isActive('strike') ? 'bg-slate-700 text-slate-100' : ''
                    }`}
            >
                <Strikethrough size={16} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={`p-2 text-slate-400 hover:text-slate-100 ${editor.isActive('code') ? 'bg-slate-700 text-slate-100' : ''
                    }`}
            >
                <Code size={16} />
            </button>
            <button
                onClick={setLink}
                className={`p-2 text-slate-400 hover:text-slate-100 ${editor.isActive('link') ? 'bg-slate-700 text-slate-100' : ''
                    }`}
            >
                <Link size={16} />
            </button>
            <div className="w-[1px] bg-slate-700 my-1" />
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-2 text-slate-400 hover:text-slate-100 ${editor.isActive('heading', { level: 1 }) ? 'bg-slate-700 text-slate-100' : ''
                    }`}
            >
                <Heading1 size={16} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 text-slate-400 hover:text-slate-100 ${editor.isActive('heading', { level: 2 }) ? 'bg-slate-700 text-slate-100' : ''
                    }`}
            >
                <Heading2 size={16} />
            </button>
        </BubbleMenu>
    );
}
