"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  UnderlineIcon,
  List,
  ListOrdered,
  Heading2,
  AlignLeft,
  AlignCenter,
  Undo,
  Redo,
  Minus,
} from "lucide-react";

interface Props {
  value: string;
  onChange: (html: string) => void;
}

export function InstructionsEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder:
          "1. Elmayı yıka ve kabuğunu soy.\n2. Küçük parçalara kes.\n3. Buharda 10 dakika pişir...",
      }),
    ],
    immediatelyRender: false,
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[180px] px-4 py-3 focus:outline-none text-sm text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-3 [&_h2]:mb-1 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-0.5 [&_p]:my-1 [&_hr]:my-3 [&_strong]:font-semibold [&_em]:italic",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const btn = (active: boolean) =>
    `p-1.5 rounded-lg transition-all ${
      active
        ? "bg-primary text-white shadow-sm"
        : "text-muted-foreground hover:text-foreground hover:bg-muted"
    }`;

  return (
    <div className="rounded-xl border border-border bg-background overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary transition-all">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-border bg-muted/30 flex-wrap">
        {/* History */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-border mr-1">
          <button type="button" onClick={() => editor.chain().focus().undo().run()} className={btn(false)} title="Geri Al">
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={() => editor.chain().focus().redo().run()} className={btn(false)} title="İleri Al">
            <Redo className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-border mr-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={btn(editor.isActive("heading", { level: 2 }))}
            title="Başlık"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Text format */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-border mr-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={btn(editor.isActive("bold"))}
            title="Kalın"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={btn(editor.isActive("italic"))}
            title="İtalik"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={btn(editor.isActive("underline"))}
            title="Altı Çizili"
          >
            <UnderlineIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-border mr-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={btn(editor.isActive("bulletList"))}
            title="Madde İşaretli Liste"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={btn(editor.isActive("orderedList"))}
            title="Numaralı Liste"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Align */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-border mr-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={btn(editor.isActive({ textAlign: "left" }))}
            title="Sola Hizala"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={btn(editor.isActive({ textAlign: "center" }))}
            title="Ortala"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Divider */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={btn(false)}
          title="Yatay Çizgi"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        {/* Word count */}
        <span className="ml-auto text-[10px] text-muted-foreground">
          {editor.storage.characterCount?.characters?.() ??
            editor.getText().length}{" "}
          karakter
        </span>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  );
}
