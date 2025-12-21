import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { useState } from "react";

const LANGS = [
  { label: "Plain text", value: null },
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "JSON", value: "json" },
  { label: "HTML/XML", value: "xml" },
  { label: "CSS", value: "css" },
  { label: "Bash", value: "bash" },
  { label: "Java", value: "java" },
  { label: "Python", value: "python" },
  { label: "SQL", value: "sql" },
];

export function CodeBlockNodeView(props: any) {
  const { node, updateAttributes, editor } = props;

  const langValue = node.attrs.language ?? null;

  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      const text = node.textContent ?? "";
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 900);
      editor.commands.focus();
    } catch {
      // clipboard 권한 이슈면 무시
    }
  };

  const onChangeLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value;
    updateAttributes({ language: v === "__plain__" ? null : v });
    editor.commands.focus();
  };

  return (
    <NodeViewWrapper className="dsna-codeblock" data-lang={langValue ?? "plain"}>
      <div className="dsna-codeblock-header" contentEditable={false}>
        <select
          className="dsna-codeblock-select"
          value={langValue ?? "__plain__"}
          onChange={onChangeLang}
        >
          {LANGS.map((l) => (
            <option
              key={l.value ?? "__plain__"}
              value={l.value ?? "__plain__"}
            >
              {l.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="dsna-codeblock-copy"
          onMouseDown={(e) => e.preventDefault()} // blur 방지
          onClick={onCopy}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* ✅ NodeViewContent는 코드 텍스트가 들어가는 contentDOM */}
      <pre className="dsna-codeblock-pre">
        <code className="dsna-codeblock-code">
          <NodeViewContent as="span" />
        </code>
      </pre>
    </NodeViewWrapper>
  );
}

