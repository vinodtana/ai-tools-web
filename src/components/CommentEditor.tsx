import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline, Link as LinkIcon, List, ListOrdered, Image as ImageIcon, Send, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CommentEditorProps {
  onSubmit: (content: string, media?: File) => void;
  onCancel?: () => void;
  initialContent?: string;
  placeholder?: string;
  isReply?: boolean;
}

const CommentEditor: React.FC<CommentEditorProps> = ({ 
  onSubmit, 
  onCancel, 
  initialContent = '', 
  placeholder = 'Share your thoughts with the community...',
  isReply = false
}) => {
  const [content, setContent] = useState(initialContent);
  const [media, setMedia] = useState<File | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (editorRef.current && initialContent) {
      editorRef.current.innerHTML = initialContent;
    }
  }, [initialContent]);

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive"
        });
        return;
      }
      setMedia(file);
    }
  };

  const handleSubmit = () => {
    if (!editorRef.current?.innerHTML && !media) {
        return;
    }
    onSubmit(editorRef.current?.innerHTML || '', media || undefined);
    if (editorRef.current) editorRef.current.innerHTML = '';
    setMedia(null);
  };

  return (
    <div className="border rounded-lg shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-muted/30">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => execCommand('formatBlock', 'P')}>
          <span className="font-bold text-xs">Normal</span>
        </Button>
        <div className="h-4 w-px bg-border mx-1" />
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => execCommand('bold')}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => execCommand('italic')}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => execCommand('underline')}>
          <Underline className="h-4 w-4" />
        </Button>
        <div className="h-4 w-px bg-border mx-1" />
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => execCommand('insertUnorderedList')}>
          <List className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => execCommand('insertOrderedList')}>
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="h-4 w-px bg-border mx-1" />
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => {
          const url = prompt('Enter URL:');
          if (url) execCommand('createLink', url);
        }}>
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Area */}
      <div className="p-4">
        <div
          ref={editorRef}
          contentEditable
          className="min-h-[100px] outline-none prose dark:prose-invert max-w-none text-sm"
          onInput={(e) => setContent(e.currentTarget.innerHTML)}
          data-placeholder={placeholder}
          style={{
            emptyCells: 'show'
          }}
        />
        {/* Placeholder hack if needed, or just CSS */}
        {!content && (
             <div className="absolute pointer-events-none text-muted-foreground text-sm mt-[-100px] hidden">
                 {placeholder}
             </div>
        )}
      </div>

      {/* Media Preview */}
      {media && (
        <div className="px-4 pb-2">
            <div className="relative inline-block">
                {media.type.startsWith('image/') ? (
                    <img src={URL.createObjectURL(media)} alt="Preview" className="h-20 w-20 object-cover rounded-md border" />
                ) : (
                    <div className="h-20 w-20 bg-muted flex items-center justify-center rounded-md border text-xs text-center p-1">
                        {media.name}
                    </div>
                )}
                <button 
                    onClick={() => setMedia(null)}
                    className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-0.5 hover:bg-destructive/90"
                >
                    <X className="h-3 w-3" />
                </button>
            </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-3 flex items-center justify-between border-t bg-muted/10">
        <div>
            <input 
                type="file" 
                ref={fileInputRef}
                className="hidden"
                accept="image/*,video/*"
                onChange={handleMediaUpload}
            />
            <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fileInputRef.current?.click()}
                className="text-xs"
            >
                <ImageIcon className="h-3 w-3 mr-2" />
                Add Image/Video
            </Button>
        </div>
        <div className="flex gap-2">
            {onCancel && (
                <Button variant="ghost" size="sm" onClick={onCancel}>
                    Cancel
                </Button>
            )}
            <Button size="sm" onClick={handleSubmit} className="primary-gradient text-white">
                <Send className="h-3 w-3 mr-2" />
                Post {isReply ? 'Reply' : 'Comment'}
            </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentEditor;
