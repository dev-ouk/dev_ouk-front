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
import { Node, mergeAttributes } from "@tiptap/core";
import { TextSelection } from "prosemirror-state";
import { useEffect, useState, useRef } from "react";

export type DsnaEditorProps = {
  initialContent?: any; // Tiptap JSON 형식
  onChange?: (value: { json: any; html: string; text: string }) => void;
};

// ✅ 이모지 리스트 정의
const EMOJIS = [
  // 😀 기본 얼굴
  { shortcode: "grinning", emoji: "😀" },
  { shortcode: "grin", emoji: "😁" },
  { shortcode: "joy", emoji: "😂" },
  { shortcode: "rofl", emoji: "🤣" },
  { shortcode: "smile", emoji: "😄" },
  { shortcode: "happy", emoji: "😊" },
  { shortcode: "blush", emoji: "😊" },
  { shortcode: "relaxed", emoji: "☺️" },
  { shortcode: "wink", emoji: "😉" },
  { shortcode: "yum", emoji: "😋" },
  { shortcode: "sunglasses", emoji: "😎" },
  { shortcode: "neutral", emoji: "😐" },
  { shortcode: "thinking", emoji: "🤔" },
  { shortcode: "expressionless", emoji: "😑" },
  { shortcode: "unamused", emoji: "😒" },

  // 😢 슬픈 / 불편
  { shortcode: "cry", emoji: "😢" },
  { shortcode: "sob", emoji: "😭" },
  { shortcode: "disappointed", emoji: "😞" },
  { shortcode: "worried", emoji: "😟" },
  { shortcode: "pensive", emoji: "😔" },
  { shortcode: "tired", emoji: "😫" },
  { shortcode: "weary", emoji: "😩" },
  { shortcode: "persevere", emoji: "😣" },
  { shortcode: "confounded", emoji: "😖" },
  { shortcode: "sweat", emoji: "😓" },
  { shortcode: "cold_sweat", emoji: "😰" },

  // 😡 분노 / 짜증
  { shortcode: "angry", emoji: "😠" },
  { shortcode: "rage", emoji: "😡" },
  { shortcode: "triumph", emoji: "😤" },
  { shortcode: "exploding_head", emoji: "🤯" },
  { shortcode: "cursing", emoji: "🤬" },

  // 🤯 특수 감정
  { shortcode: "mind_blown", emoji: "🤯" },
  { shortcode: "shocked", emoji: "😱" },
  { shortcode: "scream", emoji: "😱" },
  { shortcode: "astonished", emoji: "😲" },
  { shortcode: "flushed", emoji: "😳" },
  { shortcode: "zip_mouth", emoji: "🤐" },
  { shortcode: "sleeping", emoji: "😴" },
  { shortcode: "sleepy", emoji: "😪" },
  { shortcode: "dizzy_face", emoji: "😵" },
  { shortcode: "hot", emoji: "🥵" },
  { shortcode: "cold", emoji: "🥶" },
  { shortcode: "nerd", emoji: "🤓" },
  { shortcode: "smirk", emoji: "😏" },
  { shortcode: "relieved", emoji: "😌" },

  // 😷 건강 / 병
  { shortcode: "mask", emoji: "😷" },
  { shortcode: "sick", emoji: "🤒" },
  { shortcode: "nauseated", emoji: "🤢" },
  { shortcode: "vomiting", emoji: "🤮" },
  { shortcode: "sneezing", emoji: "🤧" },

  // 🤗 제스처 / 사람
  { shortcode: "wave", emoji: "👋" },
  { shortcode: "raised_hand", emoji: "✋" },
  { shortcode: "hand", emoji: "✋" },
  { shortcode: "ok_hand", emoji: "👌" },
  { shortcode: "thumbs_up", emoji: "👍" },
  { shortcode: "thumbs_down", emoji: "👎" },
  { shortcode: "clap", emoji: "👏" },
  { shortcode: "pray", emoji: "🙏" },
  { shortcode: "muscle", emoji: "💪" },
  { shortcode: "point_up", emoji: "☝️" },
  { shortcode: "point_up_2", emoji: "👆" },
  { shortcode: "point_down", emoji: "👇" },
  { shortcode: "point_left", emoji: "👈" },
  { shortcode: "point_right", emoji: "👉" },
  { shortcode: "folded_hands", emoji: "🙏" },

  // ❤️ 하트류
  { shortcode: "heart", emoji: "❤️" },
  { shortcode: "orange_heart", emoji: "🧡" },
  { shortcode: "yellow_heart", emoji: "💛" },
  { shortcode: "green_heart", emoji: "💚" },
  { shortcode: "blue_heart", emoji: "💙" },
  { shortcode: "purple_heart", emoji: "💜" },
  { shortcode: "black_heart", emoji: "🖤" },
  { shortcode: "broken_heart", emoji: "💔" },
  { shortcode: "two_hearts", emoji: "💕" },
  { shortcode: "sparkling_heart", emoji: "💖" },
  { shortcode: "heartbeat", emoji: "💓" },
  { shortcode: "revolving_hearts", emoji: "💞" },

  // 🔥 상태 / 반응
  { shortcode: "fire", emoji: "🔥" },
  { shortcode: "star", emoji: "⭐" },
  { shortcode: "sparkles", emoji: "✨" },
  { shortcode: "boom", emoji: "💥" },
  { shortcode: "collision", emoji: "💥" },
  { shortcode: "100", emoji: "💯" },
  { shortcode: "check", emoji: "✅" },
  { shortcode: "cross_mark", emoji: "❌" },
  { shortcode: "warning", emoji: "⚠️" },
  { shortcode: "info", emoji: "ℹ️" },
  { shortcode: "question", emoji: "❓" },
  { shortcode: "grey_question", emoji: "❔" },
  { shortcode: "grey_exclamation", emoji: "❕" },
  { shortcode: "exclamation", emoji: "❗" },
  { shortcode: "double_exclamation", emoji: "‼️" },

  // 💻 개발 / 작업 느낌
  { shortcode: "laptop", emoji: "💻" },
  { shortcode: "desktop", emoji: "🖥️" },
  { shortcode: "keyboard", emoji: "⌨️" },
  { shortcode: "gear", emoji: "⚙️" },
  { shortcode: "hammer_wrench", emoji: "🛠️" },
  { shortcode: "bulb", emoji: "💡" },
  { shortcode: "memo", emoji: "📝" },
  { shortcode: "bookmark", emoji: "🔖" },
  { shortcode: "link", emoji: "🔗" },
  { shortcode: "paperclip", emoji: "📎" },
  { shortcode: "pushpin", emoji: "📌" },
  { shortcode: "calendar", emoji: "📅" },
  { shortcode: "hourglass", emoji: "⌛" },
  { shortcode: "alarm", emoji: "⏰" },
  { shortcode: "clipboard", emoji: "📋" },
  { shortcode: "chart_up", emoji: "📈" },
  { shortcode: "chart_down", emoji: "📉" },
  { shortcode: "file_folder", emoji: "📁" },
  { shortcode: "open_folder", emoji: "📂" },
  { shortcode: "package", emoji: "📦" },
  { shortcode: "lock", emoji: "🔒" },
  { shortcode: "unlock", emoji: "🔓" },
  { shortcode: "key", emoji: "🔑" },

  // 🐛 디버깅 / 경고
  { shortcode: "bug", emoji: "🐛" },
  { shortcode: "beetle", emoji: "🪲" },
  { shortcode: "warning_bug", emoji: "🐞" },

  // 📱 기기 / 미디어
  { shortcode: "iphone", emoji: "📱" },
  { shortcode: "phone", emoji: "☎️" },
  { shortcode: "camera", emoji: "📷" },
  { shortcode: "movie_camera", emoji: "🎥" },
  { shortcode: "clapper", emoji: "🎬" },
  { shortcode: "headphones", emoji: "🎧" },
  { shortcode: "microphone", emoji: "🎤" },
  { shortcode: "tv", emoji: "📺" },
  { shortcode: "gamepad", emoji: "🎮" },

  // 🍕 음식 / 카페 감성
  { shortcode: "coffee", emoji: "☕" },
  { shortcode: "tea", emoji: "🫖" },
  { shortcode: "beer", emoji: "🍺" },
  { shortcode: "wine", emoji: "🍷" },
  { shortcode: "cocktail", emoji: "🍸" },
  { shortcode: "bento", emoji: "🍱" },
  { shortcode: "ramen", emoji: "🍜" },
  { shortcode: "pizza", emoji: "🍕" },
  { shortcode: "burger", emoji: "🍔" },
  { shortcode: "fries", emoji: "🍟" },
  { shortcode: "chicken", emoji: "🍗" },
  { shortcode: "meat", emoji: "🥩" },
  { shortcode: "salad", emoji: "🥗" },
  { shortcode: "cake", emoji: "🍰" },
  { shortcode: "cookie", emoji: "🍪" },
  { shortcode: "icecream", emoji: "🍨" },

  // 🏃‍♂️ 활동 / 운동
  { shortcode: "run", emoji: "🏃‍♂️" },
  { shortcode: "walk", emoji: "🚶‍♂️" },
  { shortcode: "gym", emoji: "🏋️‍♂️" },
  { shortcode: "yoga", emoji: "🧘‍♂️" },
  { shortcode: "biking", emoji: "🚴‍♂️" },
  { shortcode: "swim", emoji: "🏊‍♂️" },
  { shortcode: "soccer", emoji: "⚽" },
  { shortcode: "basketball", emoji: "🏀" },
  { shortcode: "football", emoji: "🏈" },
  { shortcode: "baseball", emoji: "⚾" },
  { shortcode: "medal", emoji: "🏅" },
  { shortcode: "trophy", emoji: "🏆" },

  // 🌍 자연 / 날씨
  { shortcode: "sunny", emoji: "☀️" },
  { shortcode: "cloud", emoji: "☁️" },
  { shortcode: "rain", emoji: "🌧️" },
  { shortcode: "thunder", emoji: "⛈️" },
  { shortcode: "snow", emoji: "❄️" },
  { shortcode: "rainbow", emoji: "🌈" },
  { shortcode: "star2", emoji: "🌟" },
  { shortcode: "moon", emoji: "🌙" },
  { shortcode: "earth", emoji: "🌍" },
  { shortcode: "fireworks", emoji: "🎆" },
  { shortcode: "cherry_blossom", emoji: "🌸" },
  { shortcode: "leaf", emoji: "🍃" },

  // 🎉 파티 / 축하
  { shortcode: "tada", emoji: "🎉" },
  { shortcode: "confetti_ball", emoji: "🎊" },
  { shortcode: "party", emoji: "🥳" },
  { shortcode: "gift", emoji: "🎁" },
  { shortcode: "balloon", emoji: "🎈" },
  { shortcode: "sparkler", emoji: "🎇" },

  // 🧠 감정/상태 상징
  { shortcode: "brain", emoji: "🧠" },
  { shortcode: "zzz", emoji: "💤" },
  { shortcode: "sweat_drops", emoji: "💦" },
  { shortcode: "anger_symbol", emoji: "💢" },
  { shortcode: "thought_balloon", emoji: "💭" },
  { shortcode: "speech_balloon", emoji: "💬" },

  // 📌 기타 심볼
  { shortcode: "pin", emoji: "📌" },
  { shortcode: "top", emoji: "🔝" },
  { shortcode: "soon", emoji: "🔜" },
  { shortcode: "repeat", emoji: "🔁" },
  { shortcode: "recycle", emoji: "♻️" },
  { shortcode: "infinity", emoji: "♾️" },
];

// ✅ Toggle Block Extension
const ToggleBlock = Node.create({
  name: "toggle",
  group: "block",
  content: "block+",
  defining: true,
  isolating: true,
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

      // ✅ 버튼/내용을 나란히 놓는 row
      const row = document.createElement("div");
      row.className = "dsna-toggle-row";

      const button = document.createElement("button");
      button.type = "button";
      button.className = "dsna-toggle-btn";
      button.setAttribute("contenteditable", "false");

      // children 렌더링되는 영역
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
        // ✅ 닫을 때: 커서가 숨겨질 수 있으니 "제목(첫 블록)"로 이동
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

export function DsnaEditor({ initialContent, onChange }: DsnaEditorProps) {
  const [draggedBlock, setDraggedBlock] = useState<number | null>(null);
  const [dragOverBlock, setDragOverBlock] = useState<number | null>(null);
  // ✅ 이모지 추천 상태
  const [emojiQuery, setEmojiQuery] = useState<string | null>(null);
  const [emojiCoords, setEmojiCoords] = useState<{ left: number; top: number } | null>(null);
  const [emojiResults, setEmojiResults] = useState<typeof EMOJIS>([]);
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<any>(null);
  
  // ✅ 핸들 오버레이 상태
  type HandleState = {
    visible: boolean;
    x: number;     // editorRef 기준 상대좌표
    y: number;     // editorRef 기준 상대좌표
    nodePos: number | null; // PM node pos (드래그/클릭에 활용 가능)
    height: number;
  };
  const [handle, setHandle] = useState<HandleState>({
    visible: false,
    x: 0,
    y: 0,
    nodePos: null,
    height: 24,
  });
  const handleRef = useRef<HTMLButtonElement>(null);
  const plusRef = useRef<HTMLButtonElement>(null);
  const lastNodePosRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  const editor = useEditor({
    onCreate: ({ editor }) => {
      editorInstanceRef.current = editor;
    },
    extensions: [
      StarterKit.configure({
        // Shift+Enter: 같은 블록 내 줄바꿈
        hardBreak: {
          keepMarks: true,
        },
        // ✅ StarterKit 안의 기본 horizontalRule은 끄고
        horizontalRule: false,
      }),
      ToggleBlock, // ✅ Toggle Block 추가
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
          "dsna-editor ProseMirror focus:outline-none min-h-[400px] px-4 py-3",
      },
      handleKeyDown: (view: any, event: any) => {
        const { state } = view;
        const { selection } = state;
        const { $from } = selection;
        
        // ✅ Toggle Notion-like behavior (닫힘 Enter=아래에 새 토글, Backspace=탈출/삭제)
        const getToggleCtx = () => {
          for (let d = $from.depth; d > 0; d--) {
            const n = $from.node(d);
            if (n.type.name === "toggle") {
              return {
                depth: d,
                pos: $from.before(d),     // toggle node 시작 pos
                node: n,                  // toggle node
                childIndex: $from.index(d) // toggle의 몇 번째 자식 안인지 (0=title)
              };
            }
          }
          return null;
        };

        const toggleCtx = getToggleCtx();

        // 현재 커서가 toggle 안의 "제목(첫 블록)"에 있을 때만 노션식 처리
        if (toggleCtx && toggleCtx.childIndex === 0 && selection.empty) {
          const { pos: togglePos, node: toggleNode } = toggleCtx;
          const inTitleParagraph = $from.parent.type.name === "paragraph";
          const atStartOfTitle = $from.parentOffset === 0;
          const titleEmpty = $from.parent.textContent.length === 0;

          // 1) 닫힌 토글에서 Enter => 토글 "밖" 아래에 새 토글 생성
          if (event.key === "Enter" && toggleNode.attrs.open === false) {
            event.preventDefault();
            const p = state.schema.nodes.paragraph;
            const newToggle = state.schema.nodes.toggle.create(
              { open: true },
              [p.create(), p.create()]
            );
            const insertPos = togglePos + toggleNode.nodeSize; // 현재 토글 뒤
            let tr = state.tr.insert(insertPos, newToggle);
            // 새 토글의 title paragraph 안으로 커서 이동 (보통 +2가 안전)
            const cursorPos = Math.min(tr.doc.content.size, insertPos + 2);
            tr = tr.setSelection(TextSelection.near(tr.doc.resolve(cursorPos)));
            view.dispatch(tr);
            return true;
          }

          // 2) 토글 제목 맨 앞에서 Backspace
          //    - 제목이 비어있으면 토글을 paragraph로 "풀어서" 사실상 삭제
          //    - 제목이 있으면 토글 밖(이전 블록 쪽)으로 커서 이동
          if (event.key === "Backspace" && inTitleParagraph && atStartOfTitle) {
            event.preventDefault();
            let tr = state.tr;
            if (titleEmpty) {
              // 토글 전체를 일반 paragraph로 교체(노션 느낌의 "토글 삭제")
              const replacement = state.schema.nodes.paragraph.create();
              tr = tr.replaceWith(togglePos, togglePos + toggleNode.nodeSize, replacement);
              const cursorPos = Math.min(tr.doc.content.size, togglePos + 1);
              tr = tr.setSelection(TextSelection.near(tr.doc.resolve(cursorPos)));
            } else {
              // 토글 밖으로 커서 이동 (토글 앞쪽으로)
              const safePos = Math.max(0, togglePos);
              tr = tr.setSelection(TextSelection.near(tr.doc.resolve(safePos), -1));
            }
            view.dispatch(tr);
            return true;
          }
        }
        
        // ===== ✅ Notion-like List Behavior =====
        const ed = editorInstanceRef.current;
        const findListItemDepth = () => {
          for (let d = $from.depth; d > 0; d--) {
            if ($from.node(d).type.name === "listItem") return d;
          }
          return null;
        };
        const listItemDepth = findListItemDepth();
        const inListItem = listItemDepth != null;
        const isEmptyParagraph =
          $from.parent.type.name === "paragraph" && $from.parent.content.size === 0;
        const isAtStart = $from.parentOffset === 0;

        // 1) Enter: 빈 리스트 아이템이면 "리스트 탈출" (노션)
        if (event.key === "Enter" && selection.empty && inListItem && isEmptyParagraph) {
          event.preventDefault();
          ed?.commands.liftListItem("listItem");
          return true;
        }

        // 2) Backspace: 빈 리스트 아이템 + 맨 앞이면 "리스트 삭제/해제" (노션)
        if (event.key === "Backspace" && selection.empty && inListItem && isEmptyParagraph && isAtStart) {
          event.preventDefault();
          ed?.commands.liftListItem("listItem");
          return true;
        }

        // 3) 마크다운 단축키: "- " / "* " / "1. " => 리스트 생성 (노션)
        if (event.key === " " && selection.empty && !inListItem && $from.parent.type.name === "paragraph") {
          // 커서 앞 텍스트(문단 시작 ~ 커서)
          const paraStart = $from.start();
          const typed = state.doc.textBetween(paraStart, $from.pos, "", "");
          // 문단 전체 텍스트가 typed와 같은지(= 커서가 문단 끝에 있는지) 체크
          const full = $from.parent.textContent;

          // "- " or "* "
          if ((typed === "-" || typed === "*") && full === typed) {
            event.preventDefault();
            ed
              ?.chain()
              .focus()
              .deleteRange({ from: paraStart, to: $from.pos })
              .toggleBulletList()
              .run();
            return true;
          }

          // "1. " / "2. " ...
          if (/^\d+\.$/.test(typed) && full === typed) {
            event.preventDefault();
            ed
              ?.chain()
              .focus()
              .deleteRange({ from: paraStart, to: $from.pos })
              .toggleOrderedList()
              .run();
            return true;
          }
        }
        // ===== ✅ Notion-like List Behavior End =====
        
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
          
          // Toggle 단축키: > + Space (Notion Toggle)
          if (textBeforeCursor === ">") {
            event.preventDefault();
            // 리스트 안에서는 일단 막기(원하면 나중에 지원)
            const inListItem = (() => {
              for (let d = $from.depth; d > 0; d--) {
                if ($from.node(d).type.name === "listItem") return true;
              }
              return false;
            })();
            if (inListItem) return true;

            const depth = $from.depth;
            const paragraphBefore = $from.before(depth);
            const paragraphAfter = $from.after(depth);
            let tr = state.tr;
            const p = state.schema.nodes.paragraph;
            const toggle = state.schema.nodes.toggle.create(
              { open: true },
              [
                p.create(), // 제목(첫 블록)
                p.create(), // 본문 시작(두번째 블록)
              ]
            );
            tr = tr.replaceWith(paragraphBefore, paragraphAfter, toggle);
            // 커서를 제목 paragraph 안으로 이동
            const mappedStart = tr.mapping.map(paragraphBefore);
            const cursorPos = Math.min(tr.doc.content.size, mappedStart + 2);
            tr = tr.setSelection(TextSelection.near(tr.doc.resolve(cursorPos)));
            view.dispatch(tr);
            return true;
          }
          
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
          
        }
        
        // 일반 빈 블록(paragraph)에서의 Backspace 동작
        if (event.key === "Backspace") {
          const { state } = view;
          const { selection } = state;
          const { $from, empty } = selection;
          
          // 드래그 선택 등은 기본 동작
          if (!empty) {
            return false;
          }
          
          // 일반 빈 블록(paragraph)에서의 동작
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

  // ✅ :이모지 자동완성 감지
  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      const { state } = editor;
      const { from } = state.selection;

      // 커서 앞 30글자만 보면 충분
      const textBefore = state.doc.textBetween(Math.max(0, from - 30), from, "", "");

      const match = /:([a-zA-Z0-9_+-]*)$/.exec(textBefore);

      if (match) {
        const query = match[1]; // ':' 뒤의 문자열 (비어있을 수도 있음)

        setEmojiQuery(query);

        // 위치 계산 (커서 아래에 팝업)
        const coords = editor.view.coordsAtPos(from);

        setEmojiCoords({ left: coords.left, top: coords.bottom + 4 });

        // 필터링
        const filtered =
          query.length === 0
            ? EMOJIS.slice(0, 5)
            : EMOJIS.filter((e) =>
                e.shortcode.toLowerCase().includes(query.toLowerCase())
              ).slice(0, 8);

        setEmojiResults(filtered);
      } else {
        // 콜론 패턴 아니면 팝업 닫기
        setEmojiQuery(null);
        setEmojiCoords(null);
        setEmojiResults([]);
      }
    };

    editor.on("update", handleUpdate);
    editor.on("selectionUpdate", handleUpdate);

    return () => {
      editor.off("update", handleUpdate);
      editor.off("selectionUpdate", handleUpdate);
    };
  }, [editor]);

  // ✅ 이모지 선택 핸들러
  const handleSelectEmoji = (emoji: string) => {
    if (!editor) return;

    const { state } = editor;
    const { from } = state.selection;

    // 커서 기준으로 다시 매칭
    const textBefore = state.doc.textBetween(Math.max(0, from - 30), from, "", "");

    const match = /:([a-zA-Z0-9_+-]*)$/.exec(textBefore);

    if (!match) {
      // 혹시나 사이에 뭔가 바뀌었으면 그냥 무시
      setEmojiQuery(null);
      setEmojiCoords(null);
      setEmojiResults([]);
      return;
    }

    const matchLength = match[0].length; // ':smile' 길이

    const fromPos = from - matchLength;
    const toPos = from;

    editor
      .chain()
      .focus()
      .deleteRange({ from: fromPos, to: toPos })
      .insertContent(emoji + " ")
      .run();

    // 선택하고 나면 팝업 닫기
    setEmojiQuery(null);
    setEmojiCoords(null);
    setEmojiResults([]);
  };

  // ✅ 아래에 새 블록 삽입 함수
  const insertBlockBelow = () => {
    if (!editor) return;

    const nodePos = handle.nodePos;
    if (nodePos == null) return;

    const { state, dispatch } = editor.view;
    const node = state.doc.nodeAt(nodePos);
    if (!node) return;

    const insertPos = nodePos + node.nodeSize;
    let tr = state.tr;

    // 1) listItem이면: 같은 리스트 안에 새 listItem 추가
    if (node.type.name === "listItem") {
      const p = state.schema.nodes.paragraph.create();
      const li = state.schema.nodes.listItem.create(null, p);
      tr = tr.insert(insertPos, li);
      // 커서를 새 listItem의 paragraph 안으로
      const selPos = Math.min(tr.doc.content.size, insertPos + 2);
      tr = tr.setSelection(TextSelection.near(tr.doc.resolve(selPos)));
      dispatch(tr);
      editor.chain().focus().run();
      return;
    }

    // 2) 일반 블록이면: paragraph 추가
    const p = state.schema.nodes.paragraph.create();
    tr = tr.insert(insertPos, p);
    const selPos = Math.min(tr.doc.content.size, insertPos + 1);
    tr = tr.setSelection(TextSelection.near(tr.doc.resolve(selPos)));
    dispatch(tr);
    editor.chain().focus().run();
  };

  // ✅ 핸들 오버레이 - ProseMirror API 기반 안정 버전
  useEffect(() => {
    if (!editor || !editorRef.current) return;

    const root = editorRef.current;
    const view = editor.view;

    const pickBlockNodePos = (pos: number) => {
      const $pos = view.state.doc.resolve(pos);
      // 1) 리스트 아이템이면 listItem을 블록으로
      for (let d = $pos.depth; d > 0; d--) {
        const n = $pos.node(d);
        if (n.type.name === "listItem") {
          return $pos.before(d);
        }
      }
      // 2) 아니면 top-level 블록(= doc의 직접 자식)
      //    (heading/paragraph/pre/hr/div 등)
      if ($pos.depth >= 1) {
        const topPos = $pos.before(1);
        const topNode = view.state.doc.nodeAt(topPos);
        if (!topNode) return null;
        // ✅ ul/ol 자체는 블록으로 취급하지 않음 (핸들 흔들림 방지)
        if (topNode.type.name === "bulletList" || topNode.type.name === "orderedList") {
          return null;
        }
        return topPos;
      }
      return null;
    };

    const updateByClientPoint = (clientX: number, clientY: number) => {
      // ✅ 마우스가 핸들이나 + 버튼 위에 있으면 숨기지 말고 유지 (깜빡임 방지)
      const isPointerOn = (el: HTMLElement | null) => {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return (
          clientX >= r.left &&
          clientX <= r.right &&
          clientY >= r.top &&
          clientY <= r.bottom
        );
      };
      
      if (isPointerOn(handleRef.current) || isPointerOn(plusRef.current)) {
        return;
      }

      const coords = view.posAtCoords({ left: clientX, top: clientY });
      if (!coords) {
        lastNodePosRef.current = null;
        setHandle((h) => ({ ...h, visible: false, nodePos: null }));
        return;
      }

      const nodePos = pickBlockNodePos(coords.pos);
      if (nodePos == null) {
        lastNodePosRef.current = null;
        setHandle((h) => ({ ...h, visible: false, nodePos: null }));
        return;
      }

      // 동일 노드면 불필요 렌더 최소화
      if (lastNodePosRef.current === nodePos && handle.visible) return;

      lastNodePosRef.current = nodePos;

      const dom = view.nodeDOM(nodePos) as HTMLElement | null;
      if (!dom) {
        setHandle((h) => ({ ...h, visible: false, nodePos: null }));
        return;
      }

      const blockRect = dom.getBoundingClientRect();
      const rootRect = root.getBoundingClientRect();

      const BTN_W = 20;
      const GAP = 6;
      const LEFT_PAD = 8;
      const HANDLE_H = 24;

      // y는 블록 기준으로 유지
      const y = blockRect.top - rootRect.top + blockRect.height / 2 - HANDLE_H / 2;
      
      // x는 고정 gutter 기준
      const handleX = LEFT_PAD + BTN_W + GAP;

      setHandle({
        visible: true,
        x: handleX,
        y,
        nodePos,
        height: HANDLE_H,
      });
    };

    const onMove = (e: PointerEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const x = e.clientX;
      const y = e.clientY;
      rafRef.current = requestAnimationFrame(() => updateByClientPoint(x, y));
    };

    const onLeave = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      lastNodePosRef.current = null;
      setHandle((h) => ({ ...h, visible: false, nodePos: null }));
    };

    root.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, [editor, handle.visible]);

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

      {/* ✅ + 오버레이 버튼 */}
      {handle.visible && (
        <button
          ref={plusRef}
          type="button"
          className="dsna-block-plus"
          style={{
            left: handle.x - (20 + 6), // 핸들보다 왼쪽 (+ 버튼 + 간격)
            top: handle.y,
            height: handle.height,
            width: 20,
          }}
          onMouseDown={(e) => {
            e.preventDefault(); // blur 방지
            insertBlockBelow();
          }}
          title="블록 추가"
        >
          +
        </button>
      )}

      {/* ✅ 핸들 오버레이 버튼 */}
      {handle.visible && (
        <button
          ref={handleRef}
          type="button"
          className="dsna-block-handle"
          style={{
            left: handle.x,
            top: handle.y,
            height: handle.height,
            width: 20,
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            editor?.chain().focus().run();
          }}
          title="드래그"
        >
          ⋮⋮
        </button>
      )}

      {/* ✅ 이모지 자동완성 팝업 */}
      {emojiCoords && emojiResults.length > 0 && (
        <div
          className="fixed z-50 rounded-md border border-zinc-200 bg-white shadow-lg text-xs"
          style={{
            left: emojiCoords.left,
            top: emojiCoords.top,
          }}
        >
          <div className="max-h-56 w-48 overflow-y-auto py-1">
            {emojiResults.map((item) => (
              <button
                key={item.shortcode}
                type="button"
                className="flex w-full items-center gap-2 px-2 py-1 hover:bg-zinc-100 text-left"
                onMouseDown={(e) => {
                  // blur 방지
                  e.preventDefault();
                  handleSelectEmoji(item.emoji);
                }}
              >
                <span className="text-base">{item.emoji}</span>
                <span className="text-[11px] text-zinc-600">
                  :{item.shortcode}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <style jsx global>{`
        /* === 루트 === */
        .dsna-editor.ProseMirror {
          outline: none;
          position: relative;
          /* Notion 스타일 gutter (기존 2.5rem -> 4.5rem) */
          --dsna-gutter: 4.5rem;
          padding-left: var(--dsna-gutter);
        }
        /* 각 블록(문단, heading, 코드블록 등) */
        .dsna-editor.ProseMirror > * {
          position: relative;
          padding-left: 0;
          transition: background-color 0.2s;
        }
        /* 블록 hover 영역 확장 - 핸들 영역까지 포함하도록 마진 확장 */
        .dsna-editor.ProseMirror > *:not(ul):not(ol) {
          margin-left: calc(-1 * var(--dsna-gutter));
          padding-left: var(--dsna-gutter);
        }
        /* 배경색은 padding 영역(내용 부분)에만 적용되도록 */
        .dsna-editor.ProseMirror > *:not(ul):not(ol):hover {
          background-color: #fbfbfb;
        }
        /* ✅ 핸들 오버레이 버튼 스타일 */
        .dsna-block-handle {
          position: absolute;
          z-index: 30;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.25rem;
          border: 1px solid transparent;
          background: transparent;
          color: #a1a1aa;
          font-size: 0.875rem;
          line-height: 1;
          cursor: grab;
        }
        .dsna-block-handle:hover {
          background: #e4e4e7;
          color: #52525b;
          border-color: #e4e4e7;
        }
        .dsna-block-handle:active {
          cursor: grabbing;
        }
        /* ✅ + 오버레이 버튼 스타일 */
        .dsna-block-plus {
          position: absolute;
          z-index: 30;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.25rem;
          border: 1px solid transparent;
          background: transparent;
          color: #a1a1aa;
          font-size: 0.95rem;
          line-height: 1;
          cursor: pointer;
        }
        .dsna-block-plus:hover {
          background: #e4e4e7;
          color: #52525b;
          border-color: #e4e4e7;
        }
        /* === List: Notion-like (v3, native markers) === */
        .dsna-editor.ProseMirror {
          --dsna-list-pad: 1.55rem;     /* 리스트 마커 공간(기본) */
          --dsna-list-indent: 1.35rem;  /* nested 들여쓰기(노션 느낌) */
        }
        /* 기본 list marker 살리기 */
        .dsna-editor.ProseMirror ul,
        .dsna-editor.ProseMirror ol {
          margin: 0.15rem 0;
          padding-left: var(--dsna-list-pad);
        }
        /* 최상위 리스트는 gutter까지 확장 */
        .dsna-editor.ProseMirror > ul,
        .dsna-editor.ProseMirror > ol {
          margin-left: calc(-1 * var(--dsna-gutter));
          padding-left: calc(var(--dsna-gutter) + var(--dsna-list-pad));
        }
        /* 아이템 간격/라인 높이(노션처럼 촘촘) */
        .dsna-editor.ProseMirror li {
          position: relative;
          z-index: 0;
          padding: 0.05rem 0;
        }
        .dsna-editor.ProseMirror li p {
          margin: 0;
          line-height: 1.55;
          min-height: 1.4em;
        }
        /* nested list 들여쓰기 + 위 간격 */
        .dsna-editor.ProseMirror li > ul,
        .dsna-editor.ProseMirror li > ol {
          margin: 0.1rem 0 0;
          padding-left: var(--dsna-list-indent);
        }
        /* ✅ 노션식 bullet depth 모양: ● → ○ → ■ → 반복 */
        .dsna-editor.ProseMirror ul { list-style-type: disc; }
        .dsna-editor.ProseMirror ul ul { list-style-type: circle; }
        .dsna-editor.ProseMirror ul ul ul { list-style-type: square; }
        .dsna-editor.ProseMirror ul ul ul ul { list-style-type: disc; }
        /* ✅ 노션식 ordered depth: 1. → a. → i. → 반복 */
        .dsna-editor.ProseMirror ol { list-style-type: decimal; }
        .dsna-editor.ProseMirror ol ol { list-style-type: lower-alpha; }
        .dsna-editor.ProseMirror ol ol ol { list-style-type: lower-roman; }
        .dsna-editor.ProseMirror ol ol ol ol { list-style-type: decimal; }
        /* hover 배경(노션처럼 줄 단위로) */
        .dsna-editor.ProseMirror li::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: -0.05rem;
          bottom: -0.05rem;
          border-radius: 0.25rem;
          background: transparent;
          z-index: -1;
        }
        .dsna-editor.ProseMirror li:hover::after {
          background: #fbfbfb;
        }
        /* 최상위 리스트 아이템 hover는 gutter까지 확장 */
        .dsna-editor.ProseMirror > ul > li::after,
        .dsna-editor.ProseMirror > ol > li::after {
          left: calc(-1 * var(--dsna-gutter));
        }
        .dsna-editor.ProseMirror > *:active {
          cursor: grabbing;
        }
        .dsna-editor.ProseMirror > *[draggable="true"] {
          cursor: grab;
        }
        .dsna-editor.ProseMirror > *[draggable="true"]:active {
          cursor: grabbing;
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
        /* 🔥 코드블록 wrapper (여기에 핸들 붙음) */
        .dsna-editor.ProseMirror pre {
          background-color: #f4f4f5;
          padding: 1rem;
          border-radius: 0.5rem;
          margin: 1em 0;
          position: relative;
          overflow: visible; /* ← 여기서 더 이상 자르지 않음 */
        }
        /* 실제 스크롤은 code가 담당 */
        .dsna-editor.ProseMirror pre code {
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
        /* === Placeholder === */
        /* ✅ 최상위 블록에서만 placeholder 위치/패딩 적용 */
        .dsna-editor.ProseMirror > p.is-empty::before,
        .dsna-editor.ProseMirror > h1.is-empty::before,
        .dsna-editor.ProseMirror > h2.is-empty::before,
        .dsna-editor.ProseMirror > h3.is-empty::before {
          content: attr(data-placeholder);
          position: absolute;
          left: var(--dsna-gutter);
          top: 0;
          color: #a1a1aa;
          pointer-events: none;
          white-space: nowrap;
        }
        .dsna-editor.ProseMirror > p.is-empty,
        .dsna-editor.ProseMirror > h1.is-empty,
        .dsna-editor.ProseMirror > h2.is-empty,
        .dsna-editor.ProseMirror > h3.is-empty {
          padding-left: var(--dsna-gutter);
        }
        /* ✅ li 내부는 기존대로 */
        .dsna-editor.ProseMirror li > p.is-empty::before {
          left: 0;
        }
        /* ✅ 토글 내부(중첩 포함)는 gutter 패딩 금지 → 기본 시작점(0) */
        .dsna-toggle-content > p.is-empty,
        .dsna-toggle-content > h1.is-empty,
        .dsna-toggle-content > h2.is-empty,
        .dsna-toggle-content > h3.is-empty {
          padding-left: 0;
        }
        .dsna-toggle-content > p.is-empty::before,
        .dsna-toggle-content > h1.is-empty::before,
        .dsna-toggle-content > h2.is-empty::before,
        .dsna-toggle-content > h3.is-empty::before {
          left: 0;
        }
        .dsna-editor.ProseMirror pre.is-empty::before {
          display: none;
        }
        .dsna-editor.ProseMirror codeBlock.is-empty::before {
          display: none;
        }
        /* === Toggle Block (Notion-like) === */
        .dsna-toggle {
          position: relative;
          overflow: visible;
          /* 노션 느낌: 아이콘 슬롯 + 간격 */
          --toggle-btn: 18px;
          --toggle-gap: 6px;
        }
        /* 버튼이 흐름을 차지해야 "노션식 정렬"이 됨 */
        .dsna-toggle-row {
          display: flex;
          align-items: flex-start;
          overflow: visible;
        }
        /* ✅ 삼각형 버튼 = list marker처럼 레이아웃에 포함 */
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
        /* ✅ 내용은 버튼 오른쪽에서 시작 (제목/자식블록 전부 동일 컬럼) */
        .dsna-toggle-content {
          flex: 1 1 auto;
          min-width: 0;
          padding-left: 0; /* 중요 */
        }
        /* 제목(첫 블록) 위쪽 마진만 정리 */
        .dsna-toggle-content > :first-child {
          margin-top: 0;
        }
        /* 접힘 상태: 제목(첫 블록)만 남기고 나머지 숨김 */
        .dsna-toggle.is-collapsed .dsna-toggle-content > :nth-child(n + 2) {
          display: none;
        }
      `}</style>
    </div>
  );
}
