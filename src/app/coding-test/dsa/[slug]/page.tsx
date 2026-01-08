"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { CodeBlockNodeView } from "../_components/CodeBlockNodeView";
import { Node, mergeAttributes } from "@tiptap/core";
import { TextSelection } from "prosemirror-state";
import "highlight.js/styles/github.css";

// 필요한 언어만 등록
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import json from "highlight.js/lib/languages/json";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import bash from "highlight.js/lib/languages/bash";
import java from "highlight.js/lib/languages/java";
import python from "highlight.js/lib/languages/python";
import sql from "highlight.js/lib/languages/sql";

const lowlight = createLowlight();
lowlight.register("javascript", javascript);
lowlight.register("typescript", typescript);
lowlight.register("json", json);
lowlight.register("xml", xml);
lowlight.register("css", css);
lowlight.register("bash", bash);
lowlight.register("java", java);
lowlight.register("python", python);
lowlight.register("sql", sql);

type TaxonomyTerm = {
  slug: string;
  name: string;
};

type AlgoNoteDetailResponse = {
  title: string;
  slug: string;
  contentJson: string; // JSON 문자열
  contentHtml: string | null;
  contentText: string | null;
  status: "DRAFT" | "REVIEWING" | "PUBLISHED" | "REFACTOR_PLANNED";
  pin: boolean; // 서버 응답은 pin
  public: boolean; // 서버 응답은 public
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  taxonomies: {
    algo: {
      terms: TaxonomyTerm[];
    };
  };
};

type AlgoNoteDetail = {
  title: string;
  slug: string;
  contentJson: string;
  contentHtml: string | null;
  contentText: string | null;
  status: "DRAFT" | "REVIEWING" | "PUBLISHED" | "REFACTOR_PLANNED";
  isPublic: boolean;
  isPin: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  taxonomies: {
    algo: {
      terms: TaxonomyTerm[];
    };
  };
};

// Toggle Block Extension
const ToggleBlock = Node.create({
  name: "toggle",
  group: "block",
  content: "block+",
  defining: true,
  isolating: true,
  selectable: true,
  draggable: true,
  addAttributes() {
    return {
      open: { default: true },
    };
  },
  parseHTML() {
    return [{ tag: 'div[data-type="toggle"]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "toggle" }),
      0,
    ];
  },
  addNodeView() {
    return ({ node, editor, getPos }) => {
      let currentNode = node;
      const dom = document.createElement("div");
      dom.className = "dsna-toggle";
      dom.setAttribute("data-type", "toggle");

      const row = document.createElement("div");
      row.className = "dsna-toggle-row";

      const button = document.createElement("button");
      button.type = "button";
      button.className = "dsna-toggle-btn";
      button.setAttribute("contenteditable", "false");

      const contentDOM = document.createElement("div");
      contentDOM.className = "dsna-toggle-content";

      const applyOpenState = () => {
        const open = !!currentNode.attrs.open;
        dom.dataset.open = open ? "true" : "false";
        if (open) {
          dom.classList.remove("is-collapsed");
          button.textContent = "▾";
        } else {
          dom.classList.add("is-collapsed");
          button.textContent = "▸";
        }
      };

      button.addEventListener("mousedown", (e) => {
        e.preventDefault();
        const pos = typeof getPos === "function" ? getPos() : null;
        if (pos == null) return;

        const nextOpen = !currentNode.attrs.open;
        let tr = editor.state.tr.setNodeMarkup(pos, undefined, {
          ...currentNode.attrs,
          open: nextOpen,
        });
        if (!nextOpen) {
          const titlePos = Math.min(tr.doc.content.size, pos + 2);
          tr = tr.setSelection(TextSelection.near(tr.doc.resolve(titlePos)));
        }
        editor.view.dispatch(tr);
        editor.commands.focus();
      });

      row.appendChild(button);
      row.appendChild(contentDOM);
      dom.appendChild(row);
      applyOpenState();

      return {
        dom,
        contentDOM,
        update(updatedNode) {
          if (updatedNode.type !== currentNode.type) return false;
          currentNode = updatedNode;
          applyOpenState();
          return true;
        },
      };
    };
  },
});

export default function DSANoteDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const [note, setNote] = useState<AlgoNoteDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TipTap 에디터를 읽기 전용으로 설정
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        codeBlock: false,
      }),
      ToggleBlock, // Toggle Block 추가
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockNodeView);
        },
      }).configure({
        lowlight,
        defaultLanguage: null,
      }),
      HorizontalRule.extend({
        renderHTML({ HTMLAttributes }) {
          return [
            "div",
            { class: "dsna-hr-block" },
            ["hr", HTMLAttributes],
          ];
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline hover:text-blue-700",
        },
      }),
    ],
    editable: false, // 읽기 전용
    editorProps: {
      attributes: {
        class:
          "dsna-editor ProseMirror focus:outline-none min-h-[400px] px-4 py-3",
      },
    },
  });

  useEffect(() => {
    if (!slug) {
      setError("Slug가 제공되지 않았습니다.");
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchNote = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      if (!baseUrl) {
        setError("NEXT_PUBLIC_API_BASE_URL 환경 변수가 설정되어 있지 않습니다.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
        const response = await fetch(
          `${normalizedBaseUrl}/api/v1/algo-notes/${encodeURIComponent(slug)}`,
          {
            method: "GET",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          if (response.status === 404) {
            const errorData = (await response.json()) as {
              message?: string;
              correlationId?: string;
            };
            throw new Error(
              errorData.message || `알고리즘 노트를 찾을 수 없습니다. slug=${slug}`,
            );
          } else if (response.status === 400) {
            const errorData = (await response.json()) as {
              message?: string;
              correlationId?: string;
            };
            throw new Error(
              errorData.message || `입력 정보가 올바르지 않습니다.`,
            );
          } else if (response.status >= 500) {
            const errorData = (await response.json()) as {
              message?: string;
              correlationId?: string;
            };
            let errorMessage = errorData.message || "서버 오류가 발생했습니다.";
            if (errorData.correlationId) {
              errorMessage += ` (ID: ${errorData.correlationId})`;
            }
            throw new Error(errorMessage);
          } else {
            throw new Error(
              `알고리즘 노트를 불러올 수 없습니다. (status: ${response.status})`,
            );
          }
        }

        const responseData = (await response.json()) as AlgoNoteDetailResponse;
        
        // 서버 응답 키(pin/public)를 프론트엔드 키(isPin/isPublic)로 매핑
        const payload: AlgoNoteDetail = {
          ...responseData,
          isPin: responseData.pin,
          isPublic: responseData.public,
        };
        
        setNote(payload);

        // TipTap 에디터에 JSON 콘텐츠 설정
        if (editor && payload.contentJson) {
          try {
            const contentJson = JSON.parse(payload.contentJson);
            editor.commands.setContent(contentJson);
          } catch (parseError) {
            console.error("JSON 파싱 오류:", parseError);
            // 파싱 실패 시 HTML로 폴백
            if (payload.contentHtml) {
              editor.commands.setContent(payload.contentHtml);
            }
          }
        }
      } catch (fetchError) {
        if ((fetchError as Error).name === "AbortError") {
          return;
        }
        setError((fetchError as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNote();

    return () => {
      controller.abort();
    };
  }, [slug, editor]);

  const handleBack = () => {
    router.back();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            <p className="text-sm text-zinc-500">알고리즘 노트를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-8">
          <button
            type="button"
            onClick={handleBack}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            뒤로가기
          </button>
        </header>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6">
          <h2 className="mb-2 text-lg font-semibold text-rose-900">오류 발생</h2>
          <p className="text-sm text-rose-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!note) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <header className="mb-8">
        <button
          type="button"
          onClick={handleBack}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          뒤로가기
        </button>
        <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          DS&A
        </p>
        <div className="mt-3 flex items-center gap-3">
          {note.isPin && (
            <span className="text-lg" title="상단 고정">
              📌
            </span>
          )}
          <h1 className="text-3xl font-semibold text-zinc-900">{note.title}</h1>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-zinc-500">
          <span>작성일: {formatDate(note.createdAt)}</span>
          {note.updatedAt !== note.createdAt && (
            <span>수정일: {formatDate(note.updatedAt)}</span>
          )}
          {note.publishedAt && (
            <span>발행일: {formatDate(note.publishedAt)}</span>
          )}
        </div>
        {note.taxonomies?.algo?.terms && note.taxonomies.algo.terms.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {note.taxonomies.algo.terms.map((term) => (
              <span
                key={term.slug}
                className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700"
              >
                {term.name}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="space-y-6">
        <div className="rounded-xl border border-zinc-200 bg-white">
          {editor && <EditorContent editor={editor} />}
        </div>
      </div>

      <style jsx global>{`
        /* === 루트 === */
        .dsna-editor.ProseMirror {
          outline: none;
          position: relative;
        }
        /* === Heading / Paragraph === */
        .dsna-editor.ProseMirror h1 {
          font-size: 2em;
          font-weight: bold;
          margin-top: 0.9em;
          margin-bottom: 0.25em;
          line-height: 1.25;
        }
        .dsna-editor.ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 0.7em;
          margin-bottom: 0.25em;
          line-height: 1.3;
        }
        .dsna-editor.ProseMirror h3 {
          font-size: 1.25em;
          font-weight: 600;
          margin-top: 0.55em;
          margin-bottom: 0.2em;
          line-height: 1.35;
        }
        .dsna-editor.ProseMirror p {
          margin: 0.15rem 0;
          line-height: 1.55;
          min-height: 1.4em;
        }
        /* === 코드 === */
        .dsna-editor.ProseMirror code {
          background-color: #f4f4f5;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-family: "Courier New", monospace;
          font-size: 0.875em;
          color: #dc2626;
        }
        /* === Notion-like CodeBlock === */
        .dsna-codeblock {
          border: 1px solid #e4e4e7;
          background: #f7f6f3;
          border-radius: 0.75rem;
          overflow: hidden;
          margin: 0.65rem 0;
        }
        .dsna-codeblock-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          padding: 0.45rem 0.6rem;
          background: rgba(0,0,0,0.03);
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }
        .dsna-codeblock-select {
          font-size: 12px;
          padding: 0.25rem 0.45rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(0,0,0,0.10);
          background: white;
          color: #27272a;
          outline: none;
        }
        .dsna-codeblock-copy {
          font-size: 12px;
          padding: 0.25rem 0.5rem;
          border-radius: 0.5rem;
          border: 1px solid transparent;
          color: #52525b;
          background: transparent;
          cursor: pointer;
        }
        .dsna-codeblock-copy:hover {
          background: rgba(0,0,0,0.06);
          border-color: rgba(0,0,0,0.06);
          color: #27272a;
        }
        .dsna-codeblock-pre {
          margin: 0;
          padding: 0.8rem 0.9rem;
          overflow: auto;
        }
        .dsna-codeblock-code {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 13px;
          line-height: 1.65;
          white-space: pre;
        }
        .dsna-editor.ProseMirror pre:not(.dsna-codeblock-pre) {
          background-color: #f4f4f5;
          padding: 1rem;
          border-radius: 0.5rem;
          margin: 1em 0;
          position: relative;
          overflow: visible;
        }
        .dsna-editor.ProseMirror pre:not(.dsna-codeblock-pre) code {
          display: block;
          background-color: transparent;
          padding: 0;
          color: inherit;
          white-space: pre;
          overflow-x: auto;
          overflow-y: hidden;
        }
        /* === 마크 / 링크 === */
        .dsna-editor.ProseMirror strong {
          font-weight: bold;
        }
        .dsna-editor.ProseMirror em {
          font-style: italic;
        }
        .dsna-editor.ProseMirror a {
          color: #2563eb;
          text-decoration: underline;
        }
        .dsna-editor.ProseMirror a:hover {
          color: #1d4ed8;
        }
        /* === HR 블록 === */
        .dsna-editor.ProseMirror .dsna-hr-block {
          position: relative;
          margin: 0.25rem 0.15rem;
          padding: 0.25rem 0;
          min-height: 1.4em;
        }
        .dsna-editor.ProseMirror .dsna-hr-block > hr {
          border: none;
          margin: 0;
          padding: 0;
          height: 0;
        }
        .dsna-editor.ProseMirror .dsna-hr-block::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          border-top: 1px solid #e4e4e7;
          z-index: 0;
        }
        /* === List === */
        .dsna-editor.ProseMirror ul,
        .dsna-editor.ProseMirror ol {
          margin: 0.15rem 0;
          padding-left: 1.55rem;
        }
        .dsna-editor.ProseMirror li {
          padding: 0.05rem 0;
        }
        .dsna-editor.ProseMirror li p {
          margin: 0;
          line-height: 1.55;
          min-height: 1.4em;
        }
        .dsna-editor.ProseMirror li > ul,
        .dsna-editor.ProseMirror li > ol {
          margin: 0.1rem 0 0;
          padding-left: 1.35rem;
        }
        .dsna-editor.ProseMirror ul { list-style-type: disc; }
        .dsna-editor.ProseMirror ul ul { list-style-type: circle; }
        .dsna-editor.ProseMirror ul ul ul { list-style-type: square; }
        .dsna-editor.ProseMirror ul ul ul ul { list-style-type: disc; }
        .dsna-editor.ProseMirror ol { list-style-type: decimal; }
        .dsna-editor.ProseMirror ol ol { list-style-type: lower-alpha; }
        .dsna-editor.ProseMirror ol ol ol { list-style-type: lower-roman; }
        .dsna-editor.ProseMirror ol ol ol ol { list-style-type: decimal; }
        /* === Toggle Block === */
        .dsna-toggle {
          position: relative;
          overflow: visible;
          --toggle-btn: 18px;
          --toggle-gap: 6px;
        }
        .dsna-toggle-row {
          display: flex;
          align-items: flex-start;
          overflow: visible;
        }
        .dsna-toggle-btn {
          flex: 0 0 auto;
          width: var(--toggle-btn);
          height: var(--toggle-btn);
          margin-top: 0.18rem;
          margin-right: var(--toggle-gap);
          padding: 0;
          box-sizing: border-box;
          border: 1px solid transparent;
          border-radius: 0.25rem;
          background: transparent;
          color: #71717a;
          cursor: pointer;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dsna-toggle-btn:hover {
          background: #e4e4e7;
          border-color: #e4e4e7;
          color: #27272a;
        }
        .dsna-toggle-content {
          flex: 1 1 auto;
          min-width: 0;
          padding-left: 0;
        }
        .dsna-toggle-content > :first-child {
          margin-top: 0;
        }
        .dsna-toggle.is-collapsed .dsna-toggle-content > :nth-child(n + 2) {
          display: none;
        }
        .dsna-toggle-content > p,
        .dsna-toggle-content > h1,
        .dsna-toggle-content > h2,
        .dsna-toggle-content > h3,
        .dsna-toggle-content > pre,
        .dsna-toggle-content > .dsna-hr-block {
          position: relative;
          border-radius: 0.25rem;
        }
        .dsna-toggle-content > p:hover,
        .dsna-toggle-content > h1:hover,
        .dsna-toggle-content > h2:hover,
        .dsna-toggle-content > h3:hover,
        .dsna-toggle-content > pre:hover,
        .dsna-toggle-content > .dsna-hr-block:hover {
          background: #fbfbfb;
        }
      `}</style>
    </div>
  );
}

