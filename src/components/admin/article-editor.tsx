"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import CharacterCount from "@tiptap/extension-character-count";
import Highlight from "@tiptap/extension-highlight";
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Minus,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Highlighter,
  X,
} from "lucide-react";
import { useCallback, useState } from "react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function ArticleEditor({ value, onChange, placeholder }: Props) {
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: { languageClassPrefix: "language-" },
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder: placeholder ?? "Makale içeriğini buraya yazın…",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-primary underline underline-offset-2 hover:text-primary/80" },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-xl max-w-full mx-auto my-4" },
      }),
      CharacterCount,
      Highlight.configure({ multicolor: false }),
    ],
    immediatelyRender: false,
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[400px] px-5 py-4 focus:outline-none text-sm text-foreground " +
          "[&_h1]:text-xl [&_h1]:font-bold [&_h1]:mt-5 [&_h1]:mb-2 " +
          "[&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-1.5 " +
          "[&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1 " +
          "[&_p]:my-2 [&_p]:leading-relaxed " +
          "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 " +
          "[&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:my-3 " +
          "[&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono " +
          "[&_pre]:bg-muted [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:my-3 [&_pre_code]:bg-transparent [&_pre_code]:p-0 " +
          "[&_hr]:border-border [&_hr]:my-4 " +
          "[&_strong]:font-semibold [&_em]:italic [&_s]:line-through " +
          "[&_mark]:bg-yellow-200 [&_mark]:dark:bg-yellow-900/50 [&_mark]:px-0.5 [&_mark]:rounded-sm " +
          "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 " +
          "[&_img]:rounded-xl [&_img]:max-w-full [&_img]:my-4",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    if (!linkUrl) {
      editor.chain().focus().unsetLink().run();
    } else {
      const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
      editor.chain().focus().setLink({ href: url }).run();
    }
    setLinkUrl("");
    setShowLinkInput(false);
  }, [editor, linkUrl]);

  const insertImage = useCallback(() => {
    if (!editor || !imageUrl) return;
    editor.chain().focus().setImage({ src: imageUrl }).run();
    setImageUrl("");
    setShowImageInput(false);
  }, [editor, imageUrl]);

  if (!editor) return null;

  const btn = (active: boolean, danger = false) =>
    `p-1.5 rounded-lg transition-all text-xs ${
      active
        ? "bg-primary text-white shadow-sm"
        : danger
        ? "text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        : "text-muted-foreground hover:text-foreground hover:bg-muted"
    }`;

  const sep = "w-px h-5 bg-border mx-0.5";

  const wordCount = editor.storage.characterCount?.words?.() ?? 0;
  const charCount = editor.storage.characterCount?.characters?.() ?? 0;

  return (
    <div className="rounded-xl border border-border bg-background overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary transition-all">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-border bg-muted/20 flex-wrap">
        {/* History */}
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className={btn(false)} title="Geri Al (Ctrl+Z)">
          <Undo className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className={btn(false)} title="İleri Al (Ctrl+Y)">
          <Redo className="w-3.5 h-3.5" />
        </button>

        <div className={sep} />

        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={btn(editor.isActive("heading", { level: 1 }))}
          title="Başlık 1"
        >
          <Heading1 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={btn(editor.isActive("heading", { level: 2 }))}
          title="Başlık 2"
        >
          <Heading2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={btn(editor.isActive("heading", { level: 3 }))}
          title="Başlık 3"
        >
          <Heading3 className="w-3.5 h-3.5" />
        </button>

        <div className={sep} />

        {/* Text format */}
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive("bold"))} title="Kalın (Ctrl+B)">
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive("italic"))} title="İtalik (Ctrl+I)">
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btn(editor.isActive("underline"))} title="Altı Çizili (Ctrl+U)">
          <UnderlineIcon className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={btn(editor.isActive("strike"))} title="Üstü Çizili">
          <Strikethrough className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHighlight().run()} className={btn(editor.isActive("highlight"))} title="Vurgula">
          <Highlighter className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleCode().run()} className={btn(editor.isActive("code"))} title="Kod">
          <Code className="w-3.5 h-3.5" />
        </button>

        <div className={sep} />

        {/* Lists & Blocks */}
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive("bulletList"))} title="Madde İşaretli Liste">
          <List className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive("orderedList"))} title="Numaralı Liste">
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btn(editor.isActive("blockquote"))} title="Alıntı">
          <Quote className="w-3.5 h-3.5" />
        </button>

        <div className={sep} />

        {/* Align */}
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("left").run()} className={btn(editor.isActive({ textAlign: "left" }))} title="Sola Hizala">
          <AlignLeft className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("center").run()} className={btn(editor.isActive({ textAlign: "center" }))} title="Ortala">
          <AlignCenter className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("right").run()} className={btn(editor.isActive({ textAlign: "right" }))} title="Sağa Hizala">
          <AlignRight className="w-3.5 h-3.5" />
        </button>

        <div className={sep} />

        {/* Link */}
        <button
          type="button"
          onClick={() => { setShowLinkInput((v) => !v); setShowImageInput(false); }}
          className={btn(editor.isActive("link") || showLinkInput)}
          title="Bağlantı Ekle"
        >
          <LinkIcon className="w-3.5 h-3.5" />
        </button>

        {/* Image */}
        <button
          type="button"
          onClick={() => { setShowImageInput((v) => !v); setShowLinkInput(false); }}
          className={btn(showImageInput)}
          title="Resim Ekle (URL)"
        >
          <ImageIcon className="w-3.5 h-3.5" />
        </button>

        {/* HR */}
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btn(false)} title="Yatay Çizgi">
          <Minus className="w-3.5 h-3.5" />
        </button>

        {/* Stats */}
        <div className="ml-auto flex items-center gap-3 text-[10px] text-muted-foreground">
          <span>{wordCount} kelime</span>
          <span>{charCount} karakter</span>
        </div>
      </div>

      {/* Link input popover */}
      {showLinkInput && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/10">
          <LinkIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <input
            autoFocus
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); setLink(); } if (e.key === "Escape") setShowLinkInput(false); }}
            placeholder="https://ornek.com"
            className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
          />
          {editor.isActive("link") && (
            <button type="button" onClick={() => { editor.chain().focus().unsetLink().run(); setShowLinkInput(false); }} className="text-xs text-destructive hover:underline">
              Kaldır
            </button>
          )}
          <button type="button" onClick={setLink} className="text-xs bg-primary text-white rounded-lg px-2.5 py-1 font-medium hover:bg-primary/90 transition-colors">
            Ekle
          </button>
          <button type="button" onClick={() => setShowLinkInput(false)} className="text-muted-foreground hover:text-foreground">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Image URL input */}
      {showImageInput && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/10">
          <ImageIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <input
            autoFocus
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); insertImage(); } if (e.key === "Escape") setShowImageInput(false); }}
            placeholder="https://resim-url.com/gorsel.jpg"
            className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
          />
          <button type="button" onClick={insertImage} disabled={!imageUrl} className="text-xs bg-primary text-white rounded-lg px-2.5 py-1 font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
            Ekle
          </button>
          <button type="button" onClick={() => setShowImageInput(false)} className="text-muted-foreground hover:text-foreground">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  );
}
