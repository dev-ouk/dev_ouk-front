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

import { useEditor, EditorContent, ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Node, mergeAttributes } from "@tiptap/core";
import { TextSelection, NodeSelection } from "prosemirror-state";
import { useEffect, useState, useRef } from "react";
import { createLowlight } from "lowlight";
import { CodeBlockNodeView } from "./CodeBlockNodeView";
import "highlight.js/styles/github.css";

// ✅ 필요한 언어만 등록(가벼움)
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

  // 😃 더 다양한 얼굴/감정
  { shortcode: "grinning_big", emoji: "😃" },
  { shortcode: "smile_big", emoji: "😄" },
  { shortcode: "laughing", emoji: "😆" },
  { shortcode: "sweat_smile", emoji: "😅" },
  { shortcode: "halo", emoji: "😇" },
  { shortcode: "heart_eyes", emoji: "😍" },
  { shortcode: "hearts", emoji: "🥰" },
  { shortcode: "star_struck", emoji: "🤩" },
  { shortcode: "kissing", emoji: "😗" },
  { shortcode: "kissing_heart", emoji: "😘" },
  { shortcode: "kissing_smiling_eyes", emoji: "😙" },
  { shortcode: "kissing_closed_eyes", emoji: "😚" },
  { shortcode: "slightly_smile", emoji: "🙂" },
  { shortcode: "upside_down", emoji: "🙃" },
  { shortcode: "hugging", emoji: "🤗" },
  { shortcode: "money_mouth", emoji: "🤑" },
  { shortcode: "cowboy", emoji: "🤠" },
  { shortcode: "clown", emoji: "🤡" },
  { shortcode: "poop", emoji: "💩" },
  { shortcode: "robot", emoji: "🤖" },
  { shortcode: "alien", emoji: "👽" },
  { shortcode: "ghost", emoji: "👻" },
  { shortcode: "skull", emoji: "💀" },
  { shortcode: "skull_crossbones", emoji: "☠️" },
  { shortcode: "zany", emoji: "🤪" },
  { shortcode: "facepalm", emoji: "🤦‍♂️" },
  { shortcode: "shrug", emoji: "🤷‍♂️" },

  // 🤝 손/제스처 추가
  { shortcode: "fist", emoji: "✊" },
  { shortcode: "fist_left", emoji: "🤛" },
  { shortcode: "fist_right", emoji: "🤜" },
  { shortcode: "v", emoji: "✌️" },
  { shortcode: "metal", emoji: "🤘" },
  { shortcode: "call_me", emoji: "🤙" },
  { shortcode: "writing_hand", emoji: "✍️" },
  { shortcode: "crossed_fingers", emoji: "🤞" },
  { shortcode: "love_you_gesture", emoji: "🤟" },
  { shortcode: "palms_up", emoji: "🤲" },
  { shortcode: "handshake", emoji: "🤝" },

  // 👥 사람
  { shortcode: "bust_in_silhouette", emoji: "👤" },
  { shortcode: "busts_in_silhouette", emoji: "👥" },
  { shortcode: "baby", emoji: "👶" },
  { shortcode: "boy", emoji: "👦" },
  { shortcode: "girl", emoji: "👧" },
  { shortcode: "man", emoji: "👨" },
  { shortcode: "woman", emoji: "👩" },
  { shortcode: "older_man", emoji: "👴" },
  { shortcode: "older_woman", emoji: "👵" },

  // 🐶 동물
  { shortcode: "dog", emoji: "🐶" },
  { shortcode: "cat", emoji: "🐱" },
  { shortcode: "mouse", emoji: "🐭" },
  { shortcode: "hamster", emoji: "🐹" },
  { shortcode: "rabbit", emoji: "🐰" },
  { shortcode: "fox", emoji: "🦊" },
  { shortcode: "bear", emoji: "🐻" },
  { shortcode: "panda", emoji: "🐼" },
  { shortcode: "koala", emoji: "🐨" },
  { shortcode: "tiger", emoji: "🐯" },
  { shortcode: "lion", emoji: "🦁" },
  { shortcode: "cow", emoji: "🐮" },
  { shortcode: "pig", emoji: "🐷" },
  { shortcode: "monkey", emoji: "🐵" },
  { shortcode: "chicken", emoji: "🐔" },
  { shortcode: "penguin", emoji: "🐧" },
  { shortcode: "bird", emoji: "🐦" },
  { shortcode: "owl", emoji: "🦉" },
  { shortcode: "frog", emoji: "🐸" },
  { shortcode: "turtle", emoji: "🐢" },
  { shortcode: "snake", emoji: "🐍" },
  { shortcode: "dragon", emoji: "🐉" },
  { shortcode: "unicorn", emoji: "🦄" },
  { shortcode: "horse", emoji: "🐴" },
  { shortcode: "fish", emoji: "🐟" },
  { shortcode: "tropical_fish", emoji: "🐠" },
  { shortcode: "blowfish", emoji: "🐡" },
  { shortcode: "dolphin", emoji: "🐬" },
  { shortcode: "whale", emoji: "🐳" },
  { shortcode: "octopus", emoji: "🐙" },
  { shortcode: "crab", emoji: "🦀" },
  { shortcode: "shrimp", emoji: "🦐" },
  { shortcode: "lobster", emoji: "🦞" },
  { shortcode: "butterfly", emoji: "🦋" },
  { shortcode: "bee", emoji: "🐝" },
  { shortcode: "ant", emoji: "🐜" },
  { shortcode: "spider", emoji: "🕷️" },

  // 🌿 식물/자연 추가
  { shortcode: "seedling", emoji: "🌱" },
  { shortcode: "herb", emoji: "🌿" },
  { shortcode: "shamrock", emoji: "☘️" },
  { shortcode: "tree", emoji: "🌳" },
  { shortcode: "palm_tree", emoji: "🌴" },
  { shortcode: "cactus", emoji: "🌵" },
  { shortcode: "maple_leaf", emoji: "🍁" },
  { shortcode: "fallen_leaf", emoji: "🍂" },
  { shortcode: "rose", emoji: "🌹" },
  { shortcode: "tulip", emoji: "🌷" },
  { shortcode: "sunflower", emoji: "🌻" },
  { shortcode: "hibiscus", emoji: "🌺" },
  { shortcode: "partly_sunny", emoji: "⛅" },
  { shortcode: "cloudy", emoji: "🌥️" },
  { shortcode: "tornado", emoji: "🌪️" },
  { shortcode: "fog", emoji: "🌫️" },
  { shortcode: "droplet", emoji: "💧" },
  { shortcode: "umbrella", emoji: "☂️" },
  { shortcode: "umbrella_rain", emoji: "☔" },

  // 🚗 이동/교통
  { shortcode: "car", emoji: "🚗" },
  { shortcode: "taxi", emoji: "🚕" },
  { shortcode: "bus", emoji: "🚌" },
  { shortcode: "trolleybus", emoji: "🚎" },
  { shortcode: "minibus", emoji: "🚐" },
  { shortcode: "truck", emoji: "🚚" },
  { shortcode: "police_car", emoji: "🚓" },
  { shortcode: "fire_engine", emoji: "🚒" },
  { shortcode: "ambulance", emoji: "🚑" },
  { shortcode: "bike", emoji: "🚲" },
  { shortcode: "scooter", emoji: "🛴" },
  { shortcode: "motorcycle", emoji: "🏍️" },
  { shortcode: "train", emoji: "🚆" },
  { shortcode: "subway", emoji: "🚇" },
  { shortcode: "tram", emoji: "🚊" },
  { shortcode: "airplane", emoji: "✈️" },
  { shortcode: "rocket", emoji: "🚀" },
  { shortcode: "satellite", emoji: "🛰️" },
  { shortcode: "ship", emoji: "🚢" },
  { shortcode: "sailboat", emoji: "⛵" },
  { shortcode: "helicopter", emoji: "🚁" },

  // 🏠 장소/건물
  { shortcode: "house", emoji: "🏠" },
  { shortcode: "house_garden", emoji: "🏡" },
  { shortcode: "office", emoji: "🏢" },
  { shortcode: "school", emoji: "🏫" },
  { shortcode: "hospital", emoji: "🏥" },
  { shortcode: "bank", emoji: "🏦" },
  { shortcode: "hotel", emoji: "🏨" },
  { shortcode: "castle", emoji: "🏰" },
  { shortcode: "mountain", emoji: "🏔️" },
  { shortcode: "beach", emoji: "🏖️" },

  // 📚 물건/도구
  { shortcode: "book", emoji: "📖" },
  { shortcode: "books", emoji: "📚" },
  { shortcode: "notebook", emoji: "📓" },
  { shortcode: "page", emoji: "📄" },
  { shortcode: "pencil", emoji: "✏️" },
  { shortcode: "pen", emoji: "🖊️" },
  { shortcode: "fountain_pen", emoji: "🖋️" },
  { shortcode: "scissors", emoji: "✂️" },
  { shortcode: "trash", emoji: "🗑️" },
  { shortcode: "mag", emoji: "🔍" },
  { shortcode: "magnet", emoji: "🧲" },
  { shortcode: "test_tube", emoji: "🧪" },
  { shortcode: "microscope", emoji: "🔬" },
  { shortcode: "telescope", emoji: "🔭" },
  { shortcode: "wrench", emoji: "🔧" },
  { shortcode: "hammer", emoji: "🔨" },
  { shortcode: "toolbox", emoji: "🧰" },
  { shortcode: "nut_and_bolt", emoji: "🔩" },
  { shortcode: "battery", emoji: "🔋" },
  { shortcode: "plug", emoji: "🔌" },
  { shortcode: "signal", emoji: "📶" },
  { shortcode: "satellite_antenna", emoji: "📡" },
  { shortcode: "envelope", emoji: "✉️" },
  { shortcode: "mailbox", emoji: "📫" },
  { shortcode: "moneybag", emoji: "💰" },
  { shortcode: "coin", emoji: "🪙" },
  { shortcode: "credit_card", emoji: "💳" },
  { shortcode: "music", emoji: "🎵" },
  { shortcode: "notes", emoji: "🎶" },
  { shortcode: "speaker", emoji: "🔈" },
  { shortcode: "mute", emoji: "🔇" },
  { shortcode: "bell", emoji: "🔔" },

  // 🥗 음식 더 추가
  { shortcode: "apple", emoji: "🍎" },
  { shortcode: "banana", emoji: "🍌" },
  { shortcode: "grapes", emoji: "🍇" },
  { shortcode: "strawberry", emoji: "🍓" },
  { shortcode: "pineapple", emoji: "🍍" },
  { shortcode: "peach", emoji: "🍑" },
  { shortcode: "watermelon", emoji: "🍉" },
  { shortcode: "avocado", emoji: "🥑" },
  { shortcode: "bread", emoji: "🍞" },
  { shortcode: "sushi", emoji: "🍣" },

  // ⬆️ 기호/도형
  { shortcode: "arrow_up", emoji: "⬆️" },
  { shortcode: "arrow_down", emoji: "⬇️" },
  { shortcode: "arrow_left", emoji: "⬅️" },
  { shortcode: "arrow_right", emoji: "➡️" },
  { shortcode: "arrow_up_down", emoji: "↕️" },
  { shortcode: "arrow_left_right", emoji: "↔️" },
  { shortcode: "arrow_backward", emoji: "◀️" },
  { shortcode: "arrow_forward", emoji: "▶️" },
  { shortcode: "fast_forward", emoji: "⏩" },
  { shortcode: "rewind", emoji: "⏪" },
  { shortcode: "play_pause", emoji: "⏯️" },
  { shortcode: "stop", emoji: "⏹️" },
  { shortcode: "record", emoji: "⏺️" },
  { shortcode: "white_circle", emoji: "⚪" },
  { shortcode: "black_circle", emoji: "⚫" },
  { shortcode: "white_square", emoji: "⬜" },
  { shortcode: "black_square", emoji: "⬛" },
  { shortcode: "small_red_triangle", emoji: "🔺" },
  { shortcode: "small_red_triangle_down", emoji: "🔻" },
  { shortcode: "check_box", emoji: "☑️" },
  { shortcode: "radio_button", emoji: "🔘" },
  { shortcode: "plus", emoji: "➕" },
  { shortcode: "minus", emoji: "➖" },
  { shortcode: "multiply", emoji: "✖️" },
  { shortcode: "divide", emoji: "➗" },
  { shortcode: "equals", emoji: "🟰" },
];

// ✅ Toggle Block Extension
const ToggleBlock = Node.create({
  name: "toggle",
  group: "block",
  content: "block+",
  defining: true,
  isolating: true,
  // ✅ 추가
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
  const dragFromHandleRef = useRef(false);
  const draggedNodePosRef = useRef<number | null>(null);
  const draggingRef = useRef(false);
  const overlayHoverRef = useRef(false);
  const hoveredDomRef = useRef<HTMLElement | null>(null);

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
        // ✅ 기본 codeBlock 끄기 (CodeBlockLowlight로 교체)
        codeBlock: false,
      }),
      ToggleBlock, // ✅ Toggle Block 추가
      // ✅ 노션 스타일 CodeBlock (언어 선택 + Copy 버튼)
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockNodeView);
        },
      }).configure({
        lowlight,
        defaultLanguage: null, // 노션처럼 기본은 plain
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
        
        // ✅ 블록 선택 상태에서 Enter/Backspace 처리 (노션식)
        if (selection instanceof NodeSelection) {
          const pos = selection.from;
          const node = state.doc.nodeAt(pos);
          if (!node) return false;

          // Enter => 아래에 새 paragraph 만들고 커서 이동
          if (event.key === "Enter") {
            event.preventDefault();
            const insertPos = pos + node.nodeSize;
            let tr = state.tr.insert(insertPos, state.schema.nodes.paragraph.create());
            tr = tr.setSelection(TextSelection.near(tr.doc.resolve(insertPos + 1)));
            view.dispatch(tr);
            return true;
          }

          // Backspace/Delete => 선택 블록 삭제
          if (event.key === "Backspace" || event.key === "Delete") {
            event.preventDefault();
            let tr = state.tr.delete(pos, pos + node.nodeSize);
            const next = Math.min(tr.doc.content.size, Math.max(0, pos - 1));
            tr = tr.setSelection(TextSelection.near(tr.doc.resolve(next)));
            view.dispatch(tr);
            return true;
          }
        }
        
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
      handleDrop: (view, event) => {
        if (dragFromHandleRef.current) {
          event.preventDefault();
          event.stopPropagation();
          return true; // ✅ ProseMirror drop 처리 중단
        }
        return false;
      },
      handleDOMEvents: {
        drop: (view, event) => {
          if (dragFromHandleRef.current) {
            event.preventDefault();
            event.stopPropagation();
            return true;
          }
          return false;
        },
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
            ? EMOJIS.slice(0, 20)
            : EMOJIS.filter((e) =>
                e.shortcode.toLowerCase().includes(query.toLowerCase())
              ).slice(0, 50);

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

  // ✅ 핸들 오버레이 - Toggle 내부 줄 단위까지 정상 추적 버전
  useEffect(() => {
    if (!editor || !editorRef.current) return;

    const root = editorRef.current;
    const view = editor.view;

    // toggle 버튼(18) + gap(6) = 24px (CSS와 맞춰야 함)
    const TOGGLE_INDENT = 18 + 6;

    // ✅ CSS var(--dsna-list-indent) 값을 px로 읽기 (없으면 fallback)
    const readCssPx = (el: Element, varName: string, fallback: number) => {
      const v = getComputedStyle(el).getPropertyValue(varName).trim();
      if (!v) return fallback;

      // 대부분 px로 떨어지지만 rem일 수도 있어서 처리
      if (v.endsWith("px")) return parseFloat(v);
      if (v.endsWith("rem")) {
        const rootFont = parseFloat(getComputedStyle(document.documentElement).fontSize || "16");
        return parseFloat(v) * rootFont;
      }
      return fallback;
    };

    // ✅ 리스트 중첩 한 단계당 indent(px)
    const LIST_INDENT = readCssPx(view.dom, "--dsna-list-indent", 22);

    const pickBlockNodePos = (pos: number) => {
      const $pos = view.state.doc.resolve(pos);
      // 1) listItem이면 listItem을 블록 루트로 (토글 안/밖 상관없이 최우선)
      for (let d = $pos.depth; d > 0; d--) {
        const n = $pos.node(d);
        if (n.type.name === "listItem") return $pos.before(d);
      }
      // 2) toggle 안이면:
      //    - 제목(첫 자식) hover: toggle 자체를 잡는다 (노션처럼 토글 줄 전체가 한 블록)
      //    - 그 외(둘째 자식~) hover: 해당 "자식 블록"을 잡는다 (토글 내부 줄마다 핸들/플러스)
      for (let d = $pos.depth; d > 0; d--) {
        const n = $pos.node(d);
        if (n.type.name === "toggle") {
          const childIndex = $pos.index(d); // toggle의 몇 번째 자식 안인지 (0=title)
          if (childIndex === 0) return $pos.before(d);     // title => toggle node
          // body => 해당 자식 블록 노드(보통 depth d+1)의 시작 pos
          if ($pos.depth >= d + 1) return $pos.before(d + 1);
          return $pos.before(d);
        }
      }
      // 3) toggle/listItem이 아니면 top-level 블록(= doc의 직접 자식)
      if ($pos.depth >= 1) {
        const topPos = $pos.before(1);
        const topNode = view.state.doc.nodeAt(topPos);
        if (!topNode) return null;
        // ul/ol 컨테이너는 블록 취급 X (흔들림 방지)
        if (topNode.type.name === "bulletList" || topNode.type.name === "orderedList") {
          return null;
        }
        return topPos;
      }
      return null;
    };

    // ✅ 이 nodePos가 "toggle 안에서 얼마나 들어가 있는지"로 핸들 X 위치를 살짝 밀어줌
    // - 바깥 블록: 0
    // - 토글 body 안 블록: 1 * 24
    // - 중첩 토글이면: N * 24
    const calcToggleIndent = (nodePos: number) => {
      // nodePos 바로 안쪽으로 resolve 해야 depth 탐색이 안정적
      const safe = Math.min(view.state.doc.content.size, nodePos + 1);
      const $p = view.state.doc.resolve(safe);
      let toggleCount = 0;
      for (let d = $p.depth; d > 0; d--) {
        if ($p.node(d).type.name === "toggle") toggleCount++;
      }
      const node = view.state.doc.nodeAt(nodePos);
      const isNodeItselfToggle = node?.type.name === "toggle";
      // toggle 노드 "자체"면 카운트에 자기 자신이 포함되므로 -1 (중첩 토글에서 핸들 indent 맞춤)
      const effective = isNodeItselfToggle ? Math.max(0, toggleCount - 1) : toggleCount;
      return effective * TOGGLE_INDENT;
    };

    // ✅ ✅ 추가: 리스트 중첩 indent
    // - listItem이 "블록"이므로 listItem nesting level을 세면 됨
    // - 최상위 리스트(level=1)는 0, 중첩(level=2)부터 LIST_INDENT씩 땡김
    const calcListIndent = (nodePos: number) => {
      const node = view.state.doc.nodeAt(nodePos);
      if (!node) return 0;

      const safe = Math.min(view.state.doc.content.size, nodePos + 1);
      const $p = view.state.doc.resolve(safe);

      let listItemLevel = 0;
      for (let d = $p.depth; d > 0; d--) {
        if ($p.node(d).type.name === "listItem") listItemLevel++;
      }

      return Math.max(0, listItemLevel - 1) * LIST_INDENT;
    };

    const getAnchorRect = (nodePos: number) => {
      const nodeDom = view.nodeDOM(nodePos) as HTMLElement | null;
      if (!nodeDom) return null;
      const node = view.state.doc.nodeAt(nodePos);
      if (!node) return nodeDom.getBoundingClientRect();

      // ✅ toggle: 제목(첫 블록) 기준으로 Y 맞추기
      if (node.type.name === "toggle") {
        const titleEl = nodeDom.querySelector(
          ".dsna-toggle-content > :first-child"
        ) as HTMLElement | null;
        return (titleEl ?? nodeDom).getBoundingClientRect();
      }

      // ✅ listItem: 첫 줄 paragraph 기준
      if (node.type.name === "listItem") {
        const p = nodeDom.querySelector(":scope > p") as HTMLElement | null;
        return (p ?? nodeDom).getBoundingClientRect();
      }

      return nodeDom.getBoundingClientRect();
    };

    const setHoveredDom = (el: HTMLElement | null) => {
      if (hoveredDomRef.current && hoveredDomRef.current !== el) {
        hoveredDomRef.current.classList.remove("dsna-hovered");
      }
      hoveredDomRef.current = el;
      if (el) el.classList.add("dsna-hovered");
    };

    const updateByClientPoint = (clientX: number, clientY: number) => {
      if (overlayHoverRef.current) return; // ✅ 핸들/+ 위면 위치 업데이트 금지(깜빡임 방지)

      // ✅ 마우스가 핸들이나 + 버튼 위면 유지 (깜빡임 방지)
      const isPointerOn = (el: HTMLElement | null) => {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom;
      };
      if (isPointerOn(handleRef.current) || isPointerOn(plusRef.current)) return;

      const rootRect = root.getBoundingClientRect();

      // ✅ root 밖이면 숨김
      // (단, 왼쪽 가터 쪽은 약간 여유를 줘서 핸들로 이동할 때 pointerleave처럼 안 꺼지게)
      const LEFT_LEEWAY = 120; // gutter + 여유
      const inside =
        clientX >= rootRect.left - LEFT_LEEWAY &&
        clientX <= rootRect.right &&
        clientY >= rootRect.top &&
        clientY <= rootRect.bottom;

      if (!inside) {
        lastNodePosRef.current = null;
        setHoveredDom(null);
        setHandle((h) => ({ ...h, visible: false, nodePos: null }));
        return;
      }

      // ✅ 1) "핸들로 이동중" sticky: 현재 블록 유지 (노션 느낌의 핵심)
      const last = lastNodePosRef.current;
      if (last != null) {
        const lastRect = getAnchorRect(last);
        if (lastRect) {
          const PAD_Y = 24;
          const nearY = clientY >= lastRect.top - PAD_Y && clientY <= lastRect.bottom + PAD_Y;

          // 🔥 커서가 텍스트 시작(left)보다 왼쪽으로 가면 = 핸들/가터로 이동 중
          const headingToGutter = clientX < lastRect.left + 12;

          if (nearY && headingToGutter) {
            return; // ✅ last 블록 유지 → "도망" 사라짐
          }
        }
      }

      const pmRect = view.dom.getBoundingClientRect();

      // ✅ 2) posAtCoords를 "텍스트 컬럼"에서 찍도록 X를 보정하는 헬퍼
      const posAtSafeCoords = (x: number, y: number) => {
        let probeX = Math.min(Math.max(x, pmRect.left + 6), pmRect.right - 6);

        for (let i = 0; i < 10; i++) {
          const el = document.elementFromPoint(probeX, y) as HTMLElement | null;

          // ProseMirror 밖이면 오른쪽으로 밀어보기
          if (!el || !view.dom.contains(el)) {
            probeX = Math.min(pmRect.right - 6, probeX + 24);
            continue;
          }

          // ✅ 토글 버튼 영역을 찍었으면 → 텍스트 컬럼으로 점프
          if (el.closest(".dsna-toggle-btn")) {
            probeX = Math.min(pmRect.right - 6, probeX + 28); // 18 + 6 + 여유
            continue;
          }

          // ✅ 리스트 마커 쪽은 종종 LI/UL/OL 자체가 잡힘 → 텍스트 쪽으로 밀기
          const tag = el.tagName;
          if (tag === "LI" || tag === "UL" || tag === "OL") {
            probeX = Math.min(pmRect.right - 6, probeX + 20);
            continue;
          }

          const coords = view.posAtCoords({ left: probeX, top: y });
          if (coords) return coords;

          probeX = Math.min(pmRect.right - 6, probeX + 24);
        }

        return null;
      };

      let coords = posAtSafeCoords(clientX, clientY);

      // coords 못 구하면 숨김
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

      // 동일 노드면 렌더 최소화
      if (lastNodePosRef.current === nodePos) return;
      lastNodePosRef.current = nodePos;

      // ✅ nodePos가 결정되는 지점에서 dom 찾아서 hover 클래스 설정
      const nodeDom = view.nodeDOM(nodePos) as HTMLElement | null;
      setHoveredDom(nodeDom);

      const anchorRect = getAnchorRect(nodePos);
      if (!anchorRect) {
        setHoveredDom(null);
        setHandle((h) => ({ ...h, visible: false, nodePos: null }));
        return;
      }

      const BTN_W = 20;
      const GAP = 6;
      const LEFT_PAD = 8;
      const HANDLE_H = 24;
      const lineH = Math.max(18, Math.min(anchorRect.height, 28));

      const y = anchorRect.top - rootRect.top + (lineH - HANDLE_H) / 2;

      // ✅ 여기만 변경: toggleIndent + listIndent
      const indent = calcToggleIndent(nodePos) + calcListIndent(nodePos);
      const handleX = LEFT_PAD + BTN_W + GAP + indent;

      setHandle({
        visible: true,
        x: handleX,
        y,
        nodePos,
        height: HANDLE_H,
      });
    };

    const onMove = (e: PointerEvent) => {
      if (draggingRef.current) return; // ✅ 드래그 중엔 handle 추적 멈춤

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const x = e.clientX;
      const y = e.clientY;
      rafRef.current = requestAnimationFrame(() => updateByClientPoint(x, y));
    };

    const onLeave = () => {
      if (draggingRef.current) return; // ✅ 드래그 중엔 숨기지 마라

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

  // ✅ 핸들 드래그 전용 DnD (오버레이 handle에서 드래그할 때)
  useEffect(() => {
    if (!editor || !editorRef.current) return;

    const root = editorRef.current;
    const view = editor.view;

    const pickBlockNodePos = (pos: number) => {
      const $pos = view.state.doc.resolve(pos);

      // listItem 우선
      for (let d = $pos.depth; d > 0; d--) {
        if ($pos.node(d).type.name === "listItem") return $pos.before(d);
      }
      // toggle: title면 toggle 자체, body면 해당 자식 블록
      for (let d = $pos.depth; d > 0; d--) {
        const n = $pos.node(d);
        if (n.type.name === "toggle") {
          const childIndex = $pos.index(d);
          if (childIndex === 0) return $pos.before(d);
          if ($pos.depth >= d + 1) return $pos.before(d + 1);
          return $pos.before(d);
        }
      }
      // top-level block
      if ($pos.depth >= 1) {
        const topPos = $pos.before(1);
        const topNode = view.state.doc.nodeAt(topPos);
        if (!topNode) return null;
        if (topNode.type.name === "bulletList" || topNode.type.name === "orderedList") return null;
        return topPos;
      }
      return null;
    };

    const getAnchorRect = (nodePos: number) => {
      const nodeDom = view.nodeDOM(nodePos) as HTMLElement | null;
      if (!nodeDom) return null;
      const node = view.state.doc.nodeAt(nodePos);
      if (!node) return nodeDom.getBoundingClientRect();

      if (node.type.name === "toggle") {
        const titleEl = nodeDom.querySelector(".dsna-toggle-content > :first-child") as HTMLElement | null;
        return (titleEl ?? nodeDom).getBoundingClientRect();
      }

      if (node.type.name === "listItem") {
        const p = nodeDom.querySelector(":scope > p") as HTMLElement | null;
        return (p ?? nodeDom).getBoundingClientRect();
      }

      return nodeDom.getBoundingClientRect();
    };

    const onDragOver = (e: DragEvent) => {
      if (!dragFromHandleRef.current) return;
      e.preventDefault();
      e.dataTransfer!.dropEffect = "move";
    };

    const onDrop = (e: DragEvent) => {
      if (!dragFromHandleRef.current) return;
      e.preventDefault();
      e.stopPropagation();

      const dragPos = draggedNodePosRef.current;
      if (dragPos == null) return;

      const pmRect = view.dom.getBoundingClientRect();

      // ✅ 좌표가 gutter/오버레이면 null 나오는 문제 해결: X를 안쪽으로 밀어 재시도
      const posAtSafeCoords = (x: number, y: number) => {
        let probeX = Math.min(Math.max(x, pmRect.left + 6), pmRect.right - 6);

        for (let i = 0; i < 10; i++) {
          const el = document.elementFromPoint(probeX, y) as HTMLElement | null;

          if (!el || !view.dom.contains(el)) {
            probeX = Math.min(pmRect.right - 6, probeX + 24);
            continue;
          }

          if (el.closest(".dsna-toggle-btn")) {
            probeX = Math.min(pmRect.right - 6, probeX + 28);
            continue;
          }

          const tag = el.tagName;
          if (tag === "LI" || tag === "UL" || tag === "OL") {
            probeX = Math.min(pmRect.right - 6, probeX + 20);
            continue;
          }

          const coords = view.posAtCoords({ left: probeX, top: y });
          if (coords) return coords;

          probeX = Math.min(pmRect.right - 6, probeX + 24);
        }
        return null;
      };

      const coords = posAtSafeCoords(e.clientX, e.clientY);
      if (!coords) return;

      const dropPos = pickBlockNodePos(coords.pos);
      if (dropPos == null) return;
      if (dropPos === dragPos) return;

      const state = view.state;
      const draggedNode = state.doc.nodeAt(dragPos);
      const dropNode = state.doc.nodeAt(dropPos);
      if (!draggedNode || !dropNode) return;

      // li ↔ li, 블록 ↔ 블록만 허용(기존 정책 유지)
      const isDraggedLI = draggedNode.type.name === "listItem";
      const isDropLI = dropNode.type.name === "listItem";
      if (isDraggedLI !== isDropLI) return;

      // 위/아래 판단(노션 느낌)
      const r = getAnchorRect(dropPos);
      const placeAfter = r ? e.clientY > (r.top + r.height / 2) : false;

      const from = dragPos;
      const to = dragPos + draggedNode.nodeSize;

      // 자기 자신 내부로 드롭 방지
      if (dropPos > from && dropPos < to) return;

      const desiredInsert = placeAfter ? (dropPos + dropNode.nodeSize) : dropPos;

      // ✅ 핵심: delete 이후 좌표 변형은 mapping으로 해결 (이게 제일 안정적)
      let tr = state.tr.delete(from, to);
      const mappedInsert = tr.mapping.map(desiredInsert);
      tr = tr.insert(mappedInsert, draggedNode);

      try {
        tr = tr.setSelection(NodeSelection.create(tr.doc, mappedInsert));
      } catch {}

      view.dispatch(tr);
      editor.commands.focus();

      // ✅ 안전빵: drop에서 플래그 정리
      overlayHoverRef.current = false;
      draggingRef.current = false;
      dragFromHandleRef.current = false;
      draggedNodePosRef.current = null;
    };

    // ✅ capture: true 로 먼저 가로채기
    root.addEventListener("dragover", onDragOver, true);
    root.addEventListener("drop", onDrop, true);

    return () => {
      root.removeEventListener("dragover", onDragOver, true);
      root.removeEventListener("drop", onDrop, true);
    };
  }, [editor]);

  // ✅ (보너스 안전빵) 드래그가 가끔 "끝났는데 dragend 안 오는" 케이스 방지
  useEffect(() => {
    const reset = () => {
      overlayHoverRef.current = false;
      draggingRef.current = false;
      dragFromHandleRef.current = false;
      draggedNodePosRef.current = null;
    };
    window.addEventListener("dragend", reset);
    window.addEventListener("drop", reset);
    return () => {
      window.removeEventListener("dragend", reset);
      window.removeEventListener("drop", reset);
    };
  }, []);

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
          onPointerEnter={() => (overlayHoverRef.current = true)}
          onPointerLeave={() => (overlayHoverRef.current = false)}
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
          draggable
          className="dsna-block-handle"
          style={{
            left: handle.x,
            top: handle.y,
            height: handle.height,
            width: 20,
          }}
          onPointerEnter={() => (overlayHoverRef.current = true)}
          onPointerLeave={() => (overlayHoverRef.current = false)}
          onPointerDown={(e) => {
            // ✅ drag 막지 말고, 전파만 막기
            e.stopPropagation();

            if (!editor) return;
            const { state, dispatch } = editor.view;

            const rawPos = handle.nodePos;
            if (rawPos == null) return;

            // ✅ 토글 title이면 토글 노드 pos로 승격
            const safe = Math.min(state.doc.content.size, rawPos + 1);
            const $pos = state.doc.resolve(safe);

            let targetPos = rawPos;
            for (let d = $pos.depth; d > 0; d--) {
              const n = $pos.node(d);
              if (n.type.name === "toggle") {
                const childIndex = $pos.index(d);
                if (childIndex === 0) targetPos = $pos.before(d);
                break;
              }
            }

            try {
              dispatch(state.tr.setSelection(NodeSelection.create(state.doc, targetPos)));
              requestAnimationFrame(() => editor.commands.focus());
            } catch {}
          }}
          onDragStart={(e) => {
            if (!editor) return;

            draggingRef.current = true; // ✅ 락 ON
            dragFromHandleRef.current = true;

            // 지금 handle이 가리키는 블록 pos(토글 title은 토글 pos로 승격)
            const { state, dispatch } = editor.view;
            const rawPos = handle.nodePos;
            if (rawPos == null) return;

            const safe = Math.min(state.doc.content.size, rawPos + 1);
            const $pos = state.doc.resolve(safe);

            let targetPos = rawPos;
            for (let d = $pos.depth; d > 0; d--) {
              const n = $pos.node(d);
              if (n.type.name === "toggle") {
                const childIndex = $pos.index(d);
                if (childIndex === 0) targetPos = $pos.before(d);
                break;
              }
            }

            draggedNodePosRef.current = targetPos;

            // 드래그 중에도 선택 상태 유지
            try {
              dispatch(state.tr.setSelection(NodeSelection.create(state.doc, targetPos)));
            } catch {}

            // ✅ 드래그 인식용 데이터 (빈 문자열 금지)
            e.dataTransfer?.setData("application/x-dsna-block", "1");
            e.dataTransfer?.setData("text/plain", "dsna-block");

            // ✅ 드래그 이미지(없으면 어떤 브라우저는 drag가 불안정)
            const img = document.createElement("div");
            img.style.width = "160px";
            img.style.height = "28px";
            img.style.background = "rgba(24,24,27,0.06)";
            img.style.border = "1px solid rgba(24,24,27,0.08)";
            img.style.borderRadius = "8px";
            img.style.position = "absolute";
            img.style.top = "-9999px";
            img.style.left = "-9999px";
            document.body.appendChild(img);
            e.dataTransfer?.setDragImage(img, 10, 14);
            setTimeout(() => document.body.removeChild(img), 0);

            e.dataTransfer!.effectAllowed = "move";
          }}
          onDragEnd={() => {
            overlayHoverRef.current = false;
            draggingRef.current = false; // ✅ 락 OFF
            dragFromHandleRef.current = false;
            draggedNodePosRef.current = null;
          }}
          title="블록 선택/드래그"
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
        /* ✅ 가터(핸들 영역) hover도 블록이 하이라이트되게 */
        .dsna-editor.ProseMirror > *:not(ul):not(ol).dsna-hovered {
          background-color: #fbfbfb;
        }
        /* ✅ 리스트는 마커까지 칠하려면 기존 ::after를 재활용 */
        .dsna-editor.ProseMirror li.dsna-hovered::after {
          background: #fbfbfb;
        }
        /* ✅ toggle title(토글 자체)에 클래스가 붙는 케이스 */
        .dsna-editor.ProseMirror .dsna-toggle.dsna-hovered .dsna-toggle-content > :first-child {
          background: #fbfbfb;
        }
        /* ✅ toggle body 블록(p/h1 등)에 직접 붙는 케이스 */
        .dsna-editor.ProseMirror .dsna-toggle-content > *.dsna-hovered {
          background: #fbfbfb;
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
        /* =========================
           ✅ Notion-like Selection (Notion 느낌)
           - 아주 미묘한 border + 약한 shadow
           - 일반 블록은 gutter 제외
           - 리스트는 "마커 영역"까지 포함
           ========================= */
        /* 0) 기본 selectednode 배경은 끄기 */
        .dsna-editor.ProseMirror .ProseMirror-selectednode {
          background: transparent !important;
        }
        /* ✅ 선택 톤(노션 느낌: 거의 회색빛 border + 약한 그림자) */
        .dsna-editor.ProseMirror {
          --dsna-select-bg: rgba(24, 24, 27, 0.02);        /* zinc-900 아주 옅게 */
          --dsna-select-border: rgba(24, 24, 27, 0.08);    /* 얇은 테두리 */
          --dsna-select-shadow: 0 1px 2px rgba(0,0,0,0.06);
        }
        /* 1) 최상위 블록(ul/ol 제외): gutter 제외하고 내용영역만 선택 표시 */
        .dsna-editor.ProseMirror > *:not(ul):not(ol).ProseMirror-selectednode {
          position: relative;
          z-index: 0;
        }
        .dsna-editor.ProseMirror > *:not(ul):not(ol).ProseMirror-selectednode::before {
          content: "";
          position: absolute;
          left: 0;   /* ✅ 이미 블록 자체가 gutter를 포함하도록 확장되어 있음 */
          right: 0;
          top: -0.05rem;
          bottom: -0.05rem;
          background: var(--dsna-select-bg);
          border: 1px solid var(--dsna-select-border);
          border-radius: 0.45rem;
          box-shadow: var(--dsna-select-shadow);
          pointer-events: none;
          z-index: -1;
        }
        /* 2) ✅ 리스트 마커 영역까지 포함시키기 위한 핵심:
              ul/ol이 자기 "marker padding" 값을 들고 있고(li가 상속받음),
              li::after가 왼쪽을 음수로 당겨서 마커(동그라미/숫자)까지 덮는다. */
        .dsna-editor.ProseMirror ul,
        .dsna-editor.ProseMirror ol {
          --dsna-marker-pad: var(--dsna-list-pad); /* 기본 마커 공간 */
        }
        /* nested list는 들여쓰기 값이 마커 공간 역할을 하니까 별도 지정 */
        .dsna-editor.ProseMirror li > ul,
        .dsna-editor.ProseMirror li > ol {
          --dsna-marker-pad: var(--dsna-list-indent);
        }
        /* hover 배경(노션처럼 줄 단위로) - ✅ 마커까지 포함 */
        .dsna-editor.ProseMirror li::after {
          content: "";
          position: absolute;
          left: calc(-1 * var(--dsna-marker-pad)); /* ✅ 마커까지 덮기 */
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
        /* 3) ✅ 리스트 선택 표시도 동일한 ::after를 재사용 (마커까지 포함) */
        .dsna-editor.ProseMirror li.ProseMirror-selectednode::after {
          background: var(--dsna-select-bg);
          border: 1px solid var(--dsna-select-border);
          box-shadow: var(--dsna-select-shadow);
        }
        /* ✅ Toggle 자체 선택 표시 (노션처럼) */
        .dsna-editor.ProseMirror .dsna-toggle.ProseMirror-selectednode {
          position: relative;
          z-index: 0;
        }
        .dsna-editor.ProseMirror .dsna-toggle.ProseMirror-selectednode::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: -0.05rem;
          bottom: -0.05rem;
          background: var(--dsna-select-bg);
          border: 1px solid var(--dsna-select-border);
          border-radius: 0.45rem;
          box-shadow: var(--dsna-select-shadow);
          pointer-events: none;
          z-index: -1;
        }
        /* ✅ Toggle 내부 블록 선택 표시(필요하면) */
        .dsna-editor.ProseMirror .dsna-toggle-content > *.ProseMirror-selectednode {
          position: relative;
          z-index: 0;
        }
        .dsna-editor.ProseMirror .dsna-toggle-content > *.ProseMirror-selectednode::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: -0.05rem;
          bottom: -0.05rem;
          background: var(--dsna-select-bg);
          border: 1px solid var(--dsna-select-border);
          border-radius: 0.35rem;
          box-shadow: var(--dsna-select-shadow);
          pointer-events: none;
          z-index: -1;
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
        /* === Notion-like CodeBlock === */
        .dsna-codeblock {
          border: 1px solid #e4e4e7;
          background: #f7f6f3;          /* 노션 느낌 베이지/오프화이트 */
          border-radius: 0.75rem;
          overflow: hidden;
          margin: 0.65rem 0;
        }
        /* 헤더 */
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
        /* 본문 */
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
        /* 🔥 코드블록 wrapper (기존 일반 pre, CodeBlockLowlight가 아닌 경우) */
        .dsna-editor.ProseMirror pre:not(.dsna-codeblock-pre) {
          background-color: #f4f4f5;
          padding: 1rem;
          border-radius: 0.5rem;
          margin: 1em 0;
          position: relative;
          overflow: visible; /* ← 여기서 더 이상 자르지 않음 */
        }
        /* 실제 스크롤은 code가 담당 */
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
        /* ✅ toggle 내부 블록도 노션처럼 줄 hover 표시 */
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
