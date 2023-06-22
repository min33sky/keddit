'use client';

import { PostCreationRequest, PostValidator } from '@/lib/validators/post';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import TextareaAutosize from 'react-textarea-autosize';
import EditorJS from '@editorjs/editorjs';
import { uploadFiles } from '@/lib/uploadthing';

import '@/styles/editor.css';

interface Props {
  subredditId: string;
}

export default function Editor({ subredditId }: Props) {
  const {} = useForm<PostCreationRequest>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      subredditId,
      title: '',
      content: null,
    },
  });

  return (
    <div className="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-4">
      <form id="subreddit-post-form" className="w-fit" onSubmit={() => {}}>
        <div className="prose prose-stone dark:prose-invert">
          <TextareaAutosize
            placeholder="Title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl"
          />
        </div>
      </form>
    </div>
  );
}
