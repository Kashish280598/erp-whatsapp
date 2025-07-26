import React, { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import UnderlineExtension from '@tiptap/extension-underline';
import PlaceholderExtension from '@tiptap/extension-placeholder';
import { Bold, Italic, Underline, Strikethrough, List, ListOrdered, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Types
interface Comment {
  id: string;
  user: {
    name: string;
    initials: string;
    image: string;
  };
  timestamp: string;
  message: string;
  isYou?: boolean;
}

interface CommentSectionProps {
  comments?: Comment[];
  onSubmit: (html: string) => void;
  isShowComments?: boolean;
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments, onSubmit, isShowComments = true }) => {
  const [commentText, setCommentText] = useState<string>("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc'
          }
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal'
          }
        }
      }),
      UnderlineExtension,
      Image,
      PlaceholderExtension.configure({
        placeholder: "Add a comment..."
      })
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setCommentText(editor.getHTML());
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const reader = new FileReader();
    reader.onload = () => {
      editor.chain().focus().setImage({ src: reader.result as string }).run();
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (editor && commentText) {
      onSubmit(commentText);
      editor.commands.clearContent();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-lg mb-0">Comments</h2>

      {isShowComments && <div className="space-y-3">
        {comments?.map((comment) => (
          <div
            key={comment.id}
            className={cn("flex gap-4", comment.isYou && "justify-end")}
          >
            {!comment.isYou && (
              <div className="flex items-start">
                <div className="bg-muted text-xs w-8 h-8 flex items-center justify-center rounded-full font-medium">
                  {comment.user.initials}
                </div>
              </div>
            )}
            <div className="space-y-1 max-w-[80%]">
              {!comment.isYou && (
                <div className="text-sm font-semibold text-foreground">
                  {comment.user.name}
                  <span className="text-[#5E5F6E] font-normal ml-2">
                    {comment.timestamp}
                  </span>
                </div>
              )}
              <div
                className={cn(
                  "p-2 text-sm rounded-md",
                  comment.isYou ? "bg-transparent text-right" : "bg-background"
                )}
                dangerouslySetInnerHTML={{ __html: comment.message }}
              />
              {comment.isYou && (
                <div className="text-xs text-[#5E5F6E] text-right">
                  {comment.timestamp} • <span className="text-primary font-medium">You</span>
                </div>
              )}
            </div>
            {comment.isYou && (
              <div className="flex items-start">
                <div className="bg-muted text-xs w-8 h-8 flex items-center justify-center rounded-full font-medium">
                  RS
                </div>
              </div>
            )}
          </div>
        ))}
      </div>}

      <div className={cn("border rounded-[8px] p-3", editor?.isFocused && "border-[#9A4DEF]")}>
        <EditorContent
          editor={editor}
          className="tiptap-rich-editor h-[100px]" />
        <div className="mt-3 flex justify-end gap-4 items-center">
          <Bold
            strokeWidth={editor?.isActive('bold') ? 3 : 2}
            className={`w-4 h-4 cursor-pointer ${editor?.isActive('bold') ? 'text-primary font-[900]' : 'text-[#5E5F6E]'}`}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          />
          <Italic
            strokeWidth={editor?.isActive('italic') ? 3 : 2}
            className={`w-4 h-4 cursor-pointer ${editor?.isActive('italic') ? 'text-primary font-[900]' : 'text-[#5E5F6E]'}`}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          />
          <Underline
            strokeWidth={editor?.isActive('underline') ? 3 : 2}
            className={`w-4 h-4 cursor-pointer ${editor?.isActive('underline') ? 'text-primary font-[900]' : 'text-[#5E5F6E]'}`}
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
          />
          <Strikethrough
            strokeWidth={editor?.isActive('strike') ? 3 : 2}
            className={`w-4 h-4 cursor-pointer ${editor?.isActive('strike') ? 'text-primary font-[900]' : 'text-[#5E5F6E]'}`}
            onClick={() => editor?.chain().focus().toggleStrike().run()}
          />
          <List
            strokeWidth={editor?.isActive('bulletList') ? 3 : 2}
            className={`w-4 h-4 cursor-pointer ${editor?.isActive('bulletList') ? 'text-primary font-[900]' : 'text-[#5E5F6E]'}`}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          />
          <ListOrdered
            strokeWidth={editor?.isActive('orderedList') ? 3 : 2}
            className={`w-4 h-4 cursor-pointer ${editor?.isActive('orderedList') ? 'text-primary font-[900]' : 'text-[#5E5F6E]'}`}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          />
          <label className="cursor-pointer">
            <Link className="w-4 h-4 cursor-pointer text-[#5E5F6E]" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
          <Button onClick={handleSubmit} disabled={!commentText.trim() || editor?.isEmpty}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
