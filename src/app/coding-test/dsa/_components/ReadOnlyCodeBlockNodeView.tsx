import { NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const LANG_LABEL: Record<string, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  json: "JSON",
  xml: "HTML/XML",
  css: "CSS",
  bash: "Bash",
  java: "Java",
  python: "Python",
  sql: "SQL",
};

const LANGUAGE_MAP: Record<string, string> = {
  java: "java",
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
  "c++": "cpp",
  c: "c",
  cpp: "cpp",
  "c#": "csharp",
  csharp: "csharp",
  go: "go",
  golang: "go",
  kotlin: "kotlin",
  json: "json",
  xml: "markup",
  html: "markup",
  css: "css",
  bash: "bash",
  sh: "bash",
  sql: "sql",
};

function getPrismLanguage(lang?: string | null) {
  if (!lang) return "text";
  const key = lang.toLowerCase();
  return LANGUAGE_MAP[key] ?? "text";
}

export function ReadOnlyCodeBlockNodeView(props: NodeViewProps) {
  const { node } = props;
  const langValue = node.attrs.language ?? null;
  const code = node.textContent ?? "";
  const [copied, setCopied] = useState(false);

  const languageLabel = langValue ? (LANG_LABEL[langValue] ?? langValue) : "Plain text";

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 900);
    } catch {
      // clipboard 권한 이슈면 무시
    }
  };

  return (
    <NodeViewWrapper className="dsna-codeblock" data-lang={langValue ?? "plain"}>
      <div className="dsna-codeblock-header" contentEditable={false}>
        <span className="dsna-codeblock-lang-label">{languageLabel}</span>
        <button
          type="button"
          className="dsna-codeblock-copy"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onCopy}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <pre className="dsna-codeblock-pre">
        <SyntaxHighlighter
          language={getPrismLanguage(langValue)}
          style={oneDark}
          customStyle={{
            margin: 0,
            fontSize: "12px",
            lineHeight: "1.6",
            background: "#282c34",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </pre>
    </NodeViewWrapper>
  );
}

