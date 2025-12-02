"use client";

/**
 * Notion 스타일 블록 에디터 컴포넌트
 * 
 * 기술 선택: Tiptap (ProseMirror 기반)
 * 선택 이유:
 * - 블록 에디터에 특화되어 있어 Notion 스타일 구현에 적합
 * - Drag & Drop 지원이 잘 되어있음
 * - 마크다운 단축키 확장이 풍부하고 커스터마이징이 용이
 * - ProseMirror 기반으로 안정적이고 성숙한 라이브러리
 */

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { TextSelection } from "prosemirror-state";
import { useEffect, useState, useRef } from "react";

export type DsnaEditorProps = {
  initialContent?: any; // Tiptap JSON 형식
  onChange?: (value: { json: any; html: string; text: string }) => void;
};

export function DsnaEditor({ initialContent, onChange }: DsnaEditorProps) {
  const [draggedBlock, setDraggedBlock] = useState<number | null>(null);
  const [dragOverBlock, setDragOverBlock] = useState<number | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Shift+Enter: 같은 블록 내 줄바꿈
        hardBreak: {
          keepMarks: true,
        },
        // ✅ StarterKit 안의 기본 horizontalRule은 끄고
        horizontalRule: false,
      }),
      // ✅ 따로 HorizontalRule 추가 (블록용 클래스를 붙이기 위해)
      HorizontalRule.extend({
        draggable: true, // 드래그도 블록처럼
        // hr을 바로 쓰지 말고, div 블록 안에 감싸기
        renderHTML({ HTMLAttributes }) {
          return [
            "div",
            { class: "dsna-hr-block" },       // 블록 역할을 하는 wrapper
            ["hr", HTMLAttributes],           // 실제 선은 안쪽 hr
          ];
        },
      }),
      Placeholder.configure({
        placeholder: "마크다운 단축키를 사용하세요: #, ##, ###, -, *, 1., ```",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline hover:text-blue-700",
        },
      }),
    ],
    content: initialContent || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[400px] px-4 py-3",
      },
      handleKeyDown: (view: any, event: any) => {
        const { state } = view;
        const { selection } = state;
        const { $from } = selection;
        
        // 백틱(`) 입력 시 ``` 패턴 감지하여 코드블록 생성
        if (event.key === "`") {
          const blockStart = $from.start($from.depth);
          const textBeforeCursor = state.doc.textBetween(blockStart, $from.pos, "");
          
          // ``` 패턴이 완성되면 (백틱 2개 + 현재 입력하는 백틱 1개 = 3개)
          if (textBeforeCursor === "``") {
            event.preventDefault();
            const { tr } = state;
            // ``` 삭제 (백틱 3개)
            tr.delete(blockStart, blockStart + 3);
            // Code Block으로 변환
            tr.setBlockType(blockStart, blockStart, state.schema.nodes.codeBlock);
            view.dispatch(tr);
            return true;
          }
        }
        
        // Space 입력 시 마크다운 단축키 처리
        if (event.key === " ") {
          // 현재 블록의 시작 위치
          const blockStart = $from.start($from.depth);
          // 커서 위치까지의 텍스트 (Space 입력 전, 공백 제거)
          const textBeforeCursor = state.doc.textBetween(blockStart, $from.pos, "").trim();
          
          // Heading 단축키: #, ##, ### + Space
          if (/^#{1,3}$/.test(textBeforeCursor)) {
            event.preventDefault();
            const level = textBeforeCursor.length;
            const { tr } = state;
            // # 기호 삭제
            tr.delete(blockStart, blockStart + textBeforeCursor.length);
            // Heading으로 변환
            tr.setBlockType(blockStart, blockStart, state.schema.nodes.heading, { level });
            view.dispatch(tr);
            return true;
          }

          // Bullet List 단축키: -, * + Space
          // 현재 노드의 텍스트를 직접 확인
          const currentNode = $from.parent;
          const currentNodeText = currentNode.textContent.trim();
          if (currentNodeText === "-" || currentNodeText === "*") {
            event.preventDefault();
            const { tr } = state;
            
            // paragraph의 정확한 위치 ($from.before/$from.after 사용)
            const paragraphBefore = $from.before($from.depth);
            const paragraphAfter = $from.after($from.depth);
            
            // 위치 유효성 검사
            if (paragraphBefore < 0 || paragraphAfter <= paragraphBefore || paragraphAfter > state.doc.content.size) {
              return false;
            }
            
            // 빈 paragraph 생성 (기호 없이)
            const emptyParagraph = state.schema.nodes.paragraph.create();
            // listItem 생성
            const listItem = state.schema.nodes.listItem.create(null, emptyParagraph);
            // bulletList 생성
            const bulletList = state.schema.nodes.bulletList.create(null, listItem);
            
            // paragraph를 bulletList로 교체
            tr.replaceWith(paragraphBefore, paragraphAfter, bulletList);
            view.dispatch(tr);
            return true;
          }

          // Ordered List 단축키: 1. + Space
          const currentNodeForOrdered = $from.parent;
          const currentNodeTextForOrdered = currentNodeForOrdered.textContent.trim();
          if (/^\d+\.$/.test(currentNodeTextForOrdered)) {
            event.preventDefault();
            const depth = $from.depth;
            const blockStart = $from.start(depth);
            
            // ✅ 현재 문단 범위 (원래 기준)
            const paragraphBefore = $from.before(depth);
            const paragraphAfter = $from.after(depth);
            
            let tr = state.tr;
            
            // 1) "1." 텍스트 삭제
            tr = tr.delete(blockStart, blockStart + currentNodeTextForOrdered.length);
            
            // 2) 삭제 이후 변경된 좌표로 매핑
            const mappedBefore = tr.mapping.map(paragraphBefore);
            const mappedAfter = tr.mapping.map(paragraphAfter);
            
            // 3) 빈 paragraph -> listItem -> orderedList 생성
            const emptyParagraph = state.schema.nodes.paragraph.create();
            const listItem = state.schema.nodes.listItem.create(null, emptyParagraph);
            const orderedList = state.schema.nodes.orderedList.create(null, listItem);
            
            // 4) paragraph를 orderedList로 교체 (매핑된 좌표 사용)
            tr = tr.replaceWith(mappedBefore, mappedAfter, orderedList);
            
            view.dispatch(tr);
            return true;
          }

          // Code Block 단축키: ``` + Space
          if (textBeforeCursor === "```") {
            event.preventDefault();
            const { tr } = state;
            tr.delete(blockStart, blockStart + textBeforeCursor.length);
            // Code Block으로 변환
            tr.setBlockType(blockStart, blockStart, state.schema.nodes.codeBlock);
            view.dispatch(tr);
            return true;
          }
        }

        // Code Block 단축키: ``` (Enter 입력 시 - 백업)
        if (event.key === "Enter") {
          const blockStart = $from.start($from.depth);
          const blockEnd = $from.end($from.depth);
          const lineText = state.doc.textBetween(blockStart, blockEnd, " ").trim();
          
          if (lineText === "```") {
            event.preventDefault();
            const { tr } = state;
            tr.delete(blockStart, blockEnd);
            // Code Block으로 변환
            tr.setBlockType(blockStart, blockStart, state.schema.nodes.codeBlock);
            view.dispatch(tr);
            return true;
          }
          
          // 리스트 내에서 Enter 처리
          const $pos = $from;
          const listItem = $pos.node(-1);
          if (listItem && (listItem.type.name === "listItem")) {
            const listItemText = listItem.textContent.trim();
            // 빈 리스트 아이템에서 Enter를 누르면 리스트 종료
            if (listItemText === "") {
              event.preventDefault();
              const { tr } = state;
              // 리스트 아이템을 일반 paragraph로 변환
              const paragraph = state.schema.nodes.paragraph.create();
              tr.replaceWith($pos.before(-1), $pos.after(-1), paragraph);
              view.dispatch(tr);
              return true;
            }
          }
        }
        
        // 리스트 내에서 백스페이스 처리 - 빈 리스트 아이템에서 백스페이스 시 리스트 종료
        if (event.key === "Backspace") {
          const { state } = view;
          const { selection } = state;
          const { $from, empty } = selection;
          
          // 드래그 선택 등은 기본 동작
          if (!empty) {
            return false;
          }
          
          // 1) 리스트 아이템 안에서의 동작
          const listItem = $from.node(-1);
          if (listItem && listItem.type.name === "listItem") {
            const paragraphNode = $from.parent;
            
            // 리스트 아이템 안의 문단이 비어있는지
            const isEmpty = paragraphNode.textContent.length === 0;
            // 커서가 문단의 맨 앞인지
            const isAtStart = $from.parentOffset === 0;
            
            if (isEmpty && isAtStart) {
              event.preventDefault();
              const { tr } = state;
              
              // 바로 위에 bulletList / orderedList 가 있는지 확인
              const maybeList = $from.node(-2);
              const isList =
                maybeList &&
                (maybeList.type.name === "bulletList" ||
                  maybeList.type.name === "orderedList");
              
              if (isList && maybeList.childCount === 1) {
                // ✅ 이 경우: "리스트 전체가 하나의 아이템만 가지고 있고,
                //             그게 지금 비어있는 상태" → 통째로 paragraph로 변경
                const listDepth = $from.depth - 2; // bulletList / orderedList 깊이
                
                if (listDepth <= 0) {
                  return false;
                }
                
                const from = $from.before(listDepth);
                const to = $from.after(listDepth);
                const paragraph = state.schema.nodes.paragraph.create();
                
                tr.replaceWith(from, to, paragraph);
                
                const resolved = tr.doc.resolve(from + 1);
                tr.setSelection(TextSelection.near(resolved));
                
                view.dispatch(tr);
                return true;
              } else {
                // ✅ 일반적인 케이스: 리스트 중간 아이템 → 그 item만 paragraph로 변환
                const listItemDepth = $from.depth - 1;
                
                if (listItemDepth <= 0) {
                  return false;
                }
                
                const from = $from.before(listItemDepth);
                const to = $from.after(listItemDepth);
                const paragraph = state.schema.nodes.paragraph.create();
                
                tr.replaceWith(from, to, paragraph);
                
                const resolved = tr.doc.resolve(from + 1);
                tr.setSelection(TextSelection.near(resolved));
                
                view.dispatch(tr);
                return true;
              }
            }
          }
          
          // 2) 일반 빈 블록(paragraph)에서의 동작
          const parent = $from.parent;
          const isParagraph = parent.type.name === "paragraph";
          const isEmpty = parent.content.size === 0;          // 완전 빈 문단
          const isAtStart = $from.parentOffset === 0;         // 문단 맨 앞
          
          if (isParagraph && isEmpty && isAtStart) {
            event.preventDefault();
            // ✅ paragraph는 $from.depth 그대로 사용해야 함
            const paragraphDepth = $from.depth;
            
            if (paragraphDepth === 0) {
              // 이론적으로 paragraph가 depth 0일 일은 없지만, 안전빵
              return false;
            }
            
            const from = $from.before(paragraphDepth);
            const to = $from.after(paragraphDepth);
            
            const tr = state.tr;
            
            // 현재 빈 paragraph 블록 삭제
            tr.delete(from, to);
            
            // 이전 블록의 끝 근처로 커서 이동 (맨 위면 doc 시작으로)
            const prevPos = tr.doc.resolve(Math.max(0, from - 1));
            tr.setSelection(TextSelection.near(prevPos));
            
            view.dispatch(tr);
            return true;
          }
          
          // 나머지는 ProseMirror 기본 키맵에 맡김
          return false;
        }

        return false;
      },
    },
    onUpdate: ({ editor }: { editor: any }) => {
      if (onChange) {
        onChange({
          json: editor.getJSON(),
          html: editor.getHTML(),
          text: editor.getText(),
        });
      }
    },
  });

  // 인라인 마크다운 패턴 인식 (입력 완료 시 변환)
  useEffect(() => {
    if (!editor) return;

    let timeoutId: NodeJS.Timeout;
    let lastTextLength = 0;

    const handleUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const { state } = editor.view;
        const { selection } = state;
        const { $from } = selection;
        const node = $from.parent;
        const text = node.textContent;
        const currentTextLength = text.length;

        // 텍스트가 삭제된 경우 (길이가 줄어든 경우) 마크 제거
        if (currentTextLength < lastTextLength) {
          const { tr } = state;
          // 현재 커서 위치의 마크 제거
          const marks = $from.marks();
          if (marks.length > 0) {
            // 모든 마크 제거
            marks.forEach((mark: any) => {
              tr.removeStoredMark(mark);
            });
            editor.view.dispatch(tr);
          }
          lastTextLength = currentTextLength;
          return;
        }

        lastTextLength = currentTextLength;

        // **bold** 패턴 인식 및 변환
        const boldMatch = text.match(/\*\*(.+?)\*\*/);
        if (boldMatch && boldMatch.index !== undefined) {
          const start = $from.start() + boldMatch.index;
          const end = start + boldMatch[0].length;
          const { tr } = state;
          const content = boldMatch[1];
          tr.delete(start, end);
          tr.insertText(content, start);
          tr.addMark(start, start + content.length, state.schema.marks.bold.create());
          editor.view.dispatch(tr);
          return;
        }

        // *italic* 패턴 인식 (단, **bold**가 아닌 경우)
        const italicMatch = text.match(/(?<!\*)\*([^*]+?)\*(?!\*)/);
        if (italicMatch && italicMatch.index !== undefined) {
          const start = $from.start() + italicMatch.index;
          const end = start + italicMatch[0].length;
          const { tr } = state;
          const content = italicMatch[1];
          tr.delete(start, end);
          tr.insertText(content, start);
          tr.addMark(start, start + content.length, state.schema.marks.italic.create());
          editor.view.dispatch(tr);
          return;
        }

        // `code` 패턴 인식
        const codeMatch = text.match(/`([^`]+?)`/);
        if (codeMatch && codeMatch.index !== undefined) {
          const start = $from.start() + codeMatch.index;
          const end = start + codeMatch[0].length;
          const { tr } = state;
          const content = codeMatch[1];
          tr.delete(start, end);
          tr.insertText(content, start);
          tr.addMark(start, start + content.length, state.schema.marks.code.create());
          editor.view.dispatch(tr);
          return;
        }
      }, 300); // 입력 후 300ms 대기
    };

    // 입력 이벤트 감지 - 일반 텍스트 입력 시 마크 제거
    const handleTransaction = ({ transaction }: { transaction: any }) => {
      if (transaction.steps.length > 0) {
        const step = transaction.steps[0];
        // 텍스트 삽입이 있는 경우
        if (step && step.slice && step.slice.content) {
          const { state } = editor.view;
          const { selection } = state;
          const { $from } = selection;
          
          // 현재 위치의 텍스트 확인
          const textBefore = state.doc.textBetween(
            Math.max(0, $from.pos - 5),
            $from.pos,
            ""
          );
          
          // 마크다운 패턴이 아닌 일반 텍스트 입력 시 마크 제거
          const isMarkdownPattern = /(\*\*|\*|`)$/.test(textBefore);
          if (!isMarkdownPattern && $from.marks().length > 0) {
            // 다음 업데이트에서 마크 제거
            setTimeout(() => {
              const { state: newState } = editor.view;
              const { selection: newSelection } = newState;
              const { $from: newFrom } = newSelection;
              if (newFrom.marks().length > 0) {
                const { tr } = newState;
                newFrom.marks().forEach((mark: any) => {
                  tr.removeStoredMark(mark);
                });
                editor.view.dispatch(tr);
              }
            }, 0);
          }
        }
      }
    };

    editor.on("update", handleUpdate);
    editor.on("transaction", handleTransaction);

    return () => {
      clearTimeout(timeoutId);
      editor.off("update", handleUpdate);
      editor.off("transaction", handleTransaction);
    };
  }, [editor]);

  // 키보드 단축키 (Ctrl/Cmd + B, I, K)
  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // 에디터가 포커스되어 있을 때만 처리
      if (!editor.isFocused) return;

      // Ctrl/Cmd + B: Bold
      if ((event.ctrlKey || event.metaKey) && event.key === "b") {
        event.preventDefault();
        editor.chain().focus().toggleBold().run();
        return;
      }

      // Ctrl/Cmd + I: Italic
      if ((event.ctrlKey || event.metaKey) && event.key === "i") {
        event.preventDefault();
        editor.chain().focus().toggleItalic().run();
        return;
      }

      // Ctrl/Cmd + K: Link
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        const url = window.prompt("링크 URL을 입력하세요:");
        if (url) {
          editor.chain().focus().setLink({ href: url }).run();
        }
        return;
      }
    };

    const editorElement = editor.view.dom;
    editorElement.addEventListener("keydown", handleKeyDown as any);

    return () => {
      editorElement.removeEventListener("keydown", handleKeyDown as any);
    };
  }, [editor]);

  // Drag & Drop 기능 구현
  useEffect(() => {
    if (!editor || !editorRef.current) return;

    const editorElement = editorRef.current;
    let draggedBlockIndex: number | null = null;

    // ✅ 노션처럼: "블록"으로 쓸 DOM 요소 목록
    // - 최상위 블록(.ProseMirror > *) 중 ul/ol은 제외
    // - 그 대신 li(리스트 아이템)을 개별 블록으로 포함
    const getBlocks = () =>
      Array.from(
        editorElement.querySelectorAll(
          ".ProseMirror li, .ProseMirror > *:not(ul):not(ol)"
        )
      );

    const handleDragStart = (event: DragEvent) => {
      const target = event.target as HTMLElement;

      // ✅ 1순위: li (리스트 아이템)을 블록으로 보고,
      //    없으면 최상위 블록(.ProseMirror > *)를 쓴다.
      const blockElement =
        target.closest(".ProseMirror li") ??
        target.closest(".ProseMirror > *:not(ul):not(ol)");

      if (!blockElement) return;

      const blocks = getBlocks();
      draggedBlockIndex = blocks.indexOf(blockElement);
      setDraggedBlock(draggedBlockIndex);

      // 드래그 이미지 설정
      const dragImage = blockElement.cloneNode(true) as HTMLElement;
      dragImage.style.opacity = "0.5";
      dragImage.style.position = "absolute";
      dragImage.style.top = "-1000px";
      document.body.appendChild(dragImage);
      event.dataTransfer?.setDragImage(dragImage, 0, 0);
      setTimeout(() => document.body.removeChild(dragImage), 0);

      event.dataTransfer!.effectAllowed = "move";
    };

    const handleDragOver = (event: DragEvent) => {
      event.preventDefault();
      event.dataTransfer!.dropEffect = "move";

      const target = event.target as HTMLElement;
      const blockElement =
        target.closest(".ProseMirror li") ??
        target.closest(".ProseMirror > *:not(ul):not(ol)");

      if (blockElement) {
        const blocks = getBlocks();
        const blockIndex = blocks.indexOf(blockElement);
        if (blockIndex !== draggedBlockIndex) {
          setDragOverBlock(blockIndex);
        }
      }
    };

    const handleDragLeave = () => {
      setDragOverBlock(null);
    };

    const handleDrop = (event: DragEvent) => {
      event.preventDefault();
      const target = event.target as HTMLElement;
      const blockElement =
        target.closest(".ProseMirror li") ??
        target.closest(".ProseMirror > *:not(ul):not(ol)");

      if (blockElement && draggedBlockIndex !== null) {
        const blocks = getBlocks();
        const dropBlockIndex = blocks.indexOf(blockElement);

        if (draggedBlockIndex !== dropBlockIndex) {
          const { state } = editor.view;
          const { tr } = state;

          const draggedDom = blocks[draggedBlockIndex] as Node;
          const dropDom = blocks[dropBlockIndex] as Node;

          const draggedPos = editor.view.posAtDOM(draggedDom, 0);
          const dropPos = editor.view.posAtDOM(dropDom, 0);

          const draggedNode = state.doc.nodeAt(draggedPos);
          const dropNode = state.doc.nodeAt(dropPos);

          if (draggedNode && dropNode) {
            const isDraggedListItem = draggedNode.type.name === "listItem";
            const isDropListItem = dropNode.type.name === "listItem";

            // ✅ 일단은 리스트 밖으로 끄집어내는 건 막고,
            //    li ↔ li, 블록 ↔ 블록 만 이동 허용
            if (isDraggedListItem !== isDropListItem) {
              setDraggedBlock(null);
              setDragOverBlock(null);
              draggedBlockIndex = null;
              return;
            }

            const draggedStart = draggedPos;
            const draggedEnd = draggedPos + draggedNode.nodeSize;

            if (draggedBlockIndex < dropBlockIndex) {
              // 아래로 이동
              tr.delete(draggedStart, draggedEnd);
              const newDropPos = editor.view.posAtDOM(dropDom, 0);
              tr.insert(newDropPos + dropNode.nodeSize, draggedNode);
            } else {
              // 위로 이동
              const newDropPos = editor.view.posAtDOM(dropDom, 0);
              tr.insert(newDropPos, draggedNode);
              tr.delete(draggedStart, draggedEnd);
            }

            editor.view.dispatch(tr);
          }
        }
      }

      setDraggedBlock(null);
      setDragOverBlock(null);
      draggedBlockIndex = null;
    };

    editorElement.addEventListener("dragstart", handleDragStart);
    editorElement.addEventListener("dragover", handleDragOver);
    editorElement.addEventListener("dragleave", handleDragLeave);
    editorElement.addEventListener("drop", handleDrop);

    return () => {
      editorElement.removeEventListener("dragstart", handleDragStart);
      editorElement.removeEventListener("dragover", handleDragOver);
      editorElement.removeEventListener("dragleave", handleDragLeave);
      editorElement.removeEventListener("drop", handleDrop);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="relative" ref={editorRef}>
      <div className="rounded-xl border border-zinc-200 bg-white">
        <EditorContent editor={editor} />
      </div>
      <style jsx global>{`
        .ProseMirror {
          outline: none;
          position: relative;
          /* ✅ 항상 왼쪽에 핸들용 gutter 확보 (Notion처럼) */
          padding-left: 2.5rem;
        }
        /* 각 블록(문단, heading, 리스트 등) */
        .ProseMirror > * {
          position: relative;
          /* ✅ 텍스트는 padding 없이, 위 ProseMirror padding 기준으로 시작 */
          padding-left: 0;
          transition: background-color 0.2s;
        }
        /* 블록 hover 시 배경만 바뀌되, ul/ol(리스트 컨테이너)은 제외 */
        .ProseMirror > *:not(ul):not(ol):not(.is-empty):hover {
          background-color: #fbfbfb; /* 기존 #fafafa → 아주 약간만 더 연하게 */
        }
        /* 핸들 hit-area (보이지 않는 영역) */
        .ProseMirror > *:not(ul):not(ol):not(.is-empty):hover::before {
          content: "";
          position: absolute;
          /* ✅ gutter 영역(텍스트 왼쪽)에만 존재하도록 음수 방향으로 빼기 */
          left: -2.5rem;
          top: 0;
          bottom: 0;
          width: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: grab;
        }
        /* 실제로 보이는 ⋮⋮ 아이콘 (ul/ol 제외) */
        .ProseMirror > *:not(ul):not(ol):not(.is-empty):hover::after {
          content: "⋮⋮";
          position: absolute;
          left: -1.8rem;      /* gutter 안쪽에 고정 */
          top: 0.45em;        /* ✅ 첫 줄 기준으로 고정 */
          transform: none;    /* ✅ 가운데 정렬 제거 */
          color: #a1a1aa;
          font-size: 0.75rem;
          line-height: 1;
          cursor: grab;
        }
        /* ✅ 리스트 아이템도 개별 블록처럼 핸들 표시 */
        /* 핸들: 기본은 안 보이다가 hover 때만 보이게 */
        .ProseMirror li::after {
          content: "⋮⋮";
          position: absolute;
          left: -1.8rem;       /* 다른 블록이랑 맞춤 */
          top: 0.45em;         /* ✅ 리스트도 첫 줄 기준 */
          transform: none;     /* ✅ 가운데 정렬 제거 */
          color: #a1a1aa;
          font-size: 0.75rem;
          line-height: 1;
          cursor: grab;
          opacity: 0;            /* 기본 숨김 */
        }
        /* hover 시에만 핸들 보이기 */
        .ProseMirror li:hover::after {
          opacity: 1;
        }
        .ProseMirror > *:active {
          cursor: grabbing;
        }
        .ProseMirror > *[draggable="true"] {
          cursor: grab;
        }
        .ProseMirror > *[draggable="true"]:active {
          cursor: grabbing;
        }
        /* ✅ HR 블록 wrapper (--- 로 생기는 선: 블록 간격/높이를 다른 블록이랑 비슷하게) */
        .ProseMirror .dsna-hr-block {
          position: relative;
          margin: 0.25rem 0.15rem;   /* 위아래 약간, 좌우는 p랑 비슷하게 */
          padding: 0.25rem 0;        /* hover 배경 조금 더 넓게 보이도록 */
          min-height: 1.4em;         /* p의 min-height(1.4em)랑 맞춰줌 */
        }
        /* wrapper 안의 진짜 hr은 눈에 안 띄게 */
        .ProseMirror .dsna-hr-block > hr {
          border: none;
          margin: 0;
          padding: 0;
          height: 0;
        }
        /* 실제 선은 wrapper 중앙에 그리기 */
        .ProseMirror .dsna-hr-block::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          border-top: 1px solid #e4e4e7;
          z-index: 0;
        }
        /* Heading 스타일 (텍스트 위치는 항상 동일) */
        .ProseMirror h1 {
          font-size: 2em;
          font-weight: bold;
          margin-top: 0.9em;   /* 기존 1.5em → 줄임 */
          margin-bottom: 0.25em; /* 기존 0.5em → 줄임 */
          line-height: 1.25;
        }
        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 0.7em;     /* 기존 1.25em → 줄임 */
          margin-bottom: 0.25em;
          line-height: 1.3;
        }
        .ProseMirror h3 {
          font-size: 1.25em;
          font-weight: 600;
          margin-top: 0.55em;     /* 기존 1em → 줄임 */
          margin-bottom: 0.2em;
          line-height: 1.35;
        }
        .ProseMirror p {
          margin: 0.15rem 0;      /* 기존 margin-bottom: 0.75em → 전체 간격 대폭 축소 */
          line-height: 1.55;      /* 살짝 타이트하게 */
          min-height: 1.4em;
        }
        /* 리스트 기본 스타일 재정의 */
        .ProseMirror ul,
        .ProseMirror ol {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .ProseMirror li {
          margin: 0.1em 0;        /* 기존 0.5em → 많이 줄임 */
          /* ✅ 텍스트 기준으로 bullet만 살짝 안쪽으로 */
          padding-left: 1.5rem;
          position: relative;
          display: block;
          color: #171717;
          min-height: 1.4em;
          background-color: transparent;
        }
        /* 불릿 위치 (텍스트 기준) */
        .ProseMirror li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: #171717;
          font-weight: bold;
        }
        /* 번호 있는 리스트용 카운터 */
        .ProseMirror ol {
          counter-reset: list-counter;
        }
        .ProseMirror ol li {
          counter-increment: list-counter;
        }
        .ProseMirror ol li::before {
          content: counter(list-counter) ".";
          position: absolute;
          left: 0;
          color: #171717;
          font-weight: normal;
        }
        .ProseMirror li:hover {
          background-color: #fbfbfb; /* 기존 #fafafa → 아주 약간만 더 연하게 */
        }
        .ProseMirror code {
          background-color: #f4f4f5;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-family: "Courier New", monospace;
          font-size: 0.875em;
          color: #dc2626;
        }
        .ProseMirror pre {
          background-color: #f4f4f5;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1em 0;
        }
        .ProseMirror pre code {
          background-color: transparent;
          padding: 0;
          color: inherit;
        }
        .ProseMirror strong {
          font-weight: bold;
        }
        .ProseMirror em {
          font-style: italic;
        }
        .ProseMirror a {
          color: #2563eb;
          text-decoration: underline;
        }
        .ProseMirror a:hover {
          color: #1d4ed8;
        }
        /* ✅ 공통 placeholder: "일반 블록"용 (문단 / 제목) */
        .ProseMirror p.is-empty::before,
        .ProseMirror h1.is-empty::before,
        .ProseMirror h2.is-empty::before,
        .ProseMirror h3.is-empty::before {
          content: attr(data-placeholder);
          position: absolute;
          left: 0;        /* 문단 텍스트 시작 위치 */
          top: 0;
          color: #a1a1aa;
          pointer-events: none;
          white-space: nowrap;
        }
        /* 기본은 문단처럼 padding 없음 */
        .ProseMirror p.is-empty,
        .ProseMirror h1.is-empty,
        .ProseMirror h2.is-empty,
        .ProseMirror h3.is-empty {
          padding-left: 0;
        }
        /* ✅ 리스트 안에 들어간 placeholder: 불릿 뒤 텍스트 자리 맞추기 */
        .ProseMirror li > p.is-empty::before {
          /* li 자체에 padding-left: 1.5rem; 이라
             여기선 굳이 더 밀 필요 없지만,
             혹시 불릿이랑 겹쳐 보이면 0.2rem 정도 더 밀어줘도 됨 */
          left: 0;
        }
        .ProseMirror pre.is-empty::before {
          display: none;
        }
        .ProseMirror codeBlock.is-empty::before {
          display: none;
        }
      `}</style>
    </div>
  );
}
