import { RichTextEditor } from "@mantine/tiptap";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { RichTextEditor as MantineRichTextEditor } from "@mantine/tiptap";

interface RichTextEditorProps {
  value: string;
  onChange?: (value: string) => void;
}
function TextEditorWrapper({ value, onChange }: RichTextEditorProps) {
  console.log("value: ", value);
  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Underline,
        TextAlign,
        Placeholder.configure({
          placeholder: "공지사항 내용을 입력해 주세요.",
        }),
      ],
      content: value,
      onUpdate: ({ editor }) => {
        onChange?.(editor.getHTML());
      },
    },
    []
  );
  return (
    <MantineRichTextEditor
      editor={editor}
      styles={{
        typographyStylesProvider: { fontSize: "var(--mantine-font-size-sm)" },
        content: { minHeight: 300, maxHeight: 300, overflowY: "scroll" },
      }}
    >
      <MantineRichTextEditor.Toolbar>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Code />
        </RichTextEditor.ControlsGroup>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditor.ControlsGroup>
      </MantineRichTextEditor.Toolbar>

      <MantineRichTextEditor.Content />
    </MantineRichTextEditor>
  );
}

export default TextEditorWrapper;
