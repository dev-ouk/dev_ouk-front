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

export function DsnaEditor({ initialContent, onChange }: DsnaEditorProps) {
  const [draggedBlock, setDraggedBlock] = useState<number | null>(null);
  const [dragOverBlock, setDragOverBlock] = useState<number | null>(null);
  // ✅ 이모지 추천 상태
  const [emojiQuery, setEmojiQuery] = useState<string | null>(null);
  const [emojiCoords, setEmojiCoords] = useState<{ left: number; top: number } | null>(null);
  const [emojiResults, setEmojiResults] = useState<typeof EMOJIS>([]);
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
          "dsna-editor ProseMirror focus:outline-none min-h-[400px] px-4 py-3",
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

  // 핸들 hover 효과
  useEffect(() => {
    if (!editor || !editorRef.current) return;

    const editorElement = editorRef.current;
    let rafId: number | null = null;

    const handleMouseMove = (event: MouseEvent) => {
      // requestAnimationFrame으로 성능 최적화 및 안정성 향상
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        // 모든 블록 체크
        const allBlocks = editorElement.querySelectorAll(
          ".ProseMirror li, .ProseMirror > *:not(ul):not(ol)"
        );

        allBlocks.forEach((block) => {
          const rect = block.getBoundingClientRect();
          const isListItem = block.tagName === "LI";
          
          // 블록이 화면에 보이는지 확인
          if (rect.width === 0 || rect.height === 0) return;
          
          // 일반 블록: 핸들 버튼 위치는 left: 0.5rem (블록의 padding 영역 안)
          // 리스트 아이템: 핸들 버튼 위치는 left: -1.3rem
          let handleAreaLeft: number;
          if (isListItem) {
            // 리스트 아이템: 블록의 왼쪽에서 -1.3rem 위치
            handleAreaLeft = rect.left - 20.8; // -1.3rem ≈ -20.8px
          } else {
            // 일반 블록: margin-left: -2.5rem이 적용되어 있으므로, 
            // 핸들은 실제로 rect.left + 0.5rem 위치
            handleAreaLeft = rect.left + 8; // 0.5rem ≈ 8px
          }
          
          const handleAreaRight = handleAreaLeft + 20; // 1.25rem ≈ 20px
          const handleCenterY = rect.top + (rect.height / 2);
          const handleAreaTop = handleCenterY - 12; // 버튼 높이의 절반
          const handleAreaBottom = handleCenterY + 12;
          
          // 핸들 버튼 영역에 마우스가 있는지 확인
          const isInHandleArea = 
            mouseX >= handleAreaLeft &&
            mouseX < handleAreaRight &&
            mouseY >= handleAreaTop &&
            mouseY <= handleAreaBottom;
          
          // 현재 블록이 hover 상태인지 확인 (핸들이 보이는 상태)
          // elementFromPoint를 사용하여 더 정확하게 확인
          const elementAtPoint = document.elementFromPoint(mouseX, mouseY);
          const isBlockHovered = block.contains(elementAtPoint) || 
                                 block === elementAtPoint ||
                                 block.matches(":hover");
          
          // 블록이 hover 상태이고, 핸들 버튼 영역에 마우스가 있으면 handle-hover 클래스 추가
          if (isBlockHovered && isInHandleArea) {
            block.classList.add("handle-hover");
          } else {
            block.classList.remove("handle-hover");
          }
        });
      });
    };

    const handleMouseLeave = () => {
      const allBlocks = editorElement.querySelectorAll(
        ".ProseMirror li, .ProseMirror > *:not(ul):not(ol)"
      );
      allBlocks.forEach((block) => {
        block.classList.remove("handle-hover");
      });
    };

    // mousemove 이벤트를 더 자주 감지하도록 설정 (passive로 성능 최적화)
    editorElement.addEventListener("mousemove", handleMouseMove, { passive: true });
    editorElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      editorElement.removeEventListener("mousemove", handleMouseMove);
      editorElement.removeEventListener("mouseleave", handleMouseLeave);
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
          /* Notion 스타일 gutter */
          padding-left: 2.5rem;
        }
        /* 각 블록(문단, heading, 코드블록 등) */
        .dsna-editor.ProseMirror > * {
          position: relative;
          padding-left: 0;
          transition: background-color 0.2s;
        }
        /* 블록 hover 영역 확장 - 핸들 영역까지 포함하도록 마진 확장 */
        .dsna-editor.ProseMirror > *:not(ul):not(ol) {
          margin-left: -2.5rem;
          padding-left: 2.5rem;
        }
        /* 배경색은 padding 영역(내용 부분)에만 적용되도록 */
        .dsna-editor.ProseMirror > *:not(ul):not(ol):hover {
          background-color: #fbfbfb;
        }
        /* 핸들 버튼 영역 - 블록 hover 시 블록 배경색과 같게 */
        .dsna-editor.ProseMirror > *:not(ul):not(ol):hover::before {
          content: "";
          position: absolute;
          left: 0.5rem;
          top: 50%;
          transform: translateY(-50%);
          width: 1.25rem;
          height: 1.5rem;
          background-color: #fbfbfb;
          border-radius: 0.25rem;
          pointer-events: none;
          transition: background-color 0.15s ease;
        }
        /* 핸들 버튼에 hover 시 배경색 변경 (더 진하게) - 우선순위 높임 */
        .dsna-editor.ProseMirror > *:not(ul):not(ol).handle-hover:hover::before,
        .dsna-editor.ProseMirror > *:not(ul):not(ol).handle-hover::before {
          background-color: #e4e4e7 !important;
        }
        /* 🔥 핸들 아이콘 (코드블록 포함) - 버튼 중앙에 배치 */
        .dsna-editor.ProseMirror > *:not(ul):not(ol):hover::after {
          content: "⋮⋮";
          position: absolute;
          left: 0.5rem;
          top: 50%;
          transform: translateY(-50%);
          width: 1.25rem;
          height: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #a1a1aa;
          font-size: 0.875rem;
          line-height: 1;
          cursor: grab;
          pointer-events: none;
          transition: color 0.15s ease;
        }
        /* 핸들 버튼에 hover 시 아이콘 색상 더 진하게 - 우선순위 높임 */
        .dsna-editor.ProseMirror > *:not(ul):not(ol).handle-hover:hover::after,
        .dsna-editor.ProseMirror > *:not(ul):not(ol).handle-hover::after {
          color: #52525b !important;
        }
        /* 리스트 컨테이너 기본 리셋 */
        .dsna-editor.ProseMirror ul,
        .dsna-editor.ProseMirror ol {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        /* 리스트 아이템 하나도 블록처럼 핸들 표시 */
        .dsna-editor.ProseMirror li {
          margin: 0.1em 0;
          padding-left: 1.5rem;
          position: relative;
          display: block;
          color: #171717;
          min-height: 1.4em;
          background-color: transparent;
        }
        .dsna-editor.ProseMirror li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: #171717;
          font-weight: bold;
        }
        .dsna-editor.ProseMirror ol {
          counter-reset: list-counter;
        }
        .dsna-editor.ProseMirror ol li {
          counter-increment: list-counter;
        }
        .dsna-editor.ProseMirror ol li::before {
          content: counter(list-counter) ".";
          position: absolute;
          left: 0;
          color: #171717;
          font-weight: normal;
        }
        .dsna-editor.ProseMirror li:hover {
          background-color: #fbfbfb;
        }
        /* 리스트 아이템 핸들 버튼 배경 */
        .dsna-editor.ProseMirror li:hover::before {
          content: "";
          position: absolute;
          left: -1.3rem;
          top: 50%;
          transform: translateY(-50%);
          width: 1.25rem;
          height: 1.5rem;
          background-color: #fbfbfb;
          border-radius: 0.25rem;
          transition: background-color 0.15s ease;
          z-index: 1;
        }
        /* 리스트 아이템 핸들 버튼에 hover 시 배경색 변경 (더 진하게) - 우선순위 높임 */
        .dsna-editor.ProseMirror li.handle-hover:hover::before,
        .dsna-editor.ProseMirror li.handle-hover::before {
          background-color: #e4e4e7 !important;
        }
        /* 리스트 아이템 핸들 아이콘 - 버튼 중앙에 배치 */
        .dsna-editor.ProseMirror li::after {
          content: "⋮⋮";
          position: absolute;
          left: -1.3rem;
          top: 50%;
          transform: translateY(-50%);
          width: 1.25rem;
          height: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #a1a1aa;
          font-size: 0.875rem;
          line-height: 1;
          cursor: grab;
          opacity: 0;
          transition: opacity 0.2s ease, color 0.15s ease;
          z-index: 2;
        }
        .dsna-editor.ProseMirror li:hover::after {
          opacity: 1;
        }
        /* 리스트 아이템 핸들 버튼에 hover 시 아이콘 색상 더 진하게 - 우선순위 높임 */
        .dsna-editor.ProseMirror li.handle-hover:hover::after,
        .dsna-editor.ProseMirror li.handle-hover::after {
          color: #52525b !important;
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
        .dsna-editor.ProseMirror p.is-empty::before,
        .dsna-editor.ProseMirror h1.is-empty::before,
        .dsna-editor.ProseMirror h2.is-empty::before,
        .dsna-editor.ProseMirror h3.is-empty::before {
          content: attr(data-placeholder);
          position: absolute;
          left: 2.5rem;
          top: 0;
          color: #a1a1aa;
          pointer-events: none;
          white-space: nowrap;
        }
        .dsna-editor.ProseMirror p.is-empty,
        .dsna-editor.ProseMirror h1.is-empty,
        .dsna-editor.ProseMirror h2.is-empty,
        .dsna-editor.ProseMirror h3.is-empty {
          padding-left: 2.5rem;
        }
        .dsna-editor.ProseMirror li > p.is-empty::before {
          left: 0;
        }
        .dsna-editor.ProseMirror pre.is-empty::before {
          display: none;
        }
        .dsna-editor.ProseMirror codeBlock.is-empty::before {
          display: none;
        }
      `}</style>
    </div>
  );
}
