"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { SidebarLayout } from "../../../_components/sidebar-layout";

export default function DSAWritePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = () => {
    // TODO: API 연동
    console.log("제출:", { title, content });
  };

  return (
    <SidebarLayout>
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-8">
          <button
            type="button"
            onClick={handleCancel}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            뒤로가기
          </button>
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            DS&A
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-zinc-900">글쓰기</h1>
        </header>

        <div className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-xs font-semibold uppercase tracking-wide text-zinc-500"
            >
              제목
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="글 제목을 입력하세요"
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="content"
              className="block text-xs font-semibold uppercase tracking-wide text-zinc-500"
            >
              본문
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="글 내용을 입력하세요"
              rows={20}
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-xl border border-zinc-200 px-6 py-2 text-sm font-semibold text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-800"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-xl bg-zinc-900 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-700"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}

