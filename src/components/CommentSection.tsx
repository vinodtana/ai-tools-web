import React, { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchComments, addComment, setShowLoginModel } from '@/store/features/contents/contentsSlice';
import CommentEditor from './CommentEditor';
import CommentItem from './CommentItem';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MessageSquare } from 'lucide-react';

interface CommentSectionProps {
  contentId: string | number;
  type: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ contentId, type }) => {
  const dispatch = useAppDispatch();
  const { comments, loading, user } = useAppSelector((state: any) => state.content);
  const { toast } = useToast();

  useEffect(() => {
    if (contentId) {
      dispatch(fetchComments({ content_id: contentId, type }));
    }
  }, [dispatch, contentId, type]);

  const handleAddComment = async (content: string, media?: File) => {
    if (!user?.id) {
        dispatch(setShowLoginModel(true));
        return;
    }

    await dispatch(addComment({
      content_id: contentId,
      type,
      user_id: user.id,
      comment: content,
      media
    }));
    
    // Refresh comments
    dispatch(fetchComments({ content_id: contentId, type }));
  };

  // Nest comments if they are flat
  const nestedComments = useMemo(() => {
    if (!comments || !Array.isArray(comments)) return [];
    
    const commentMap = new Map();
    const roots: any[] = [];

    // First pass: create map and identify roots
    comments.forEach((comment: any) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: link replies to parents
    comments.forEach((comment: any) => {
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id);
        if (parent) {
          parent.replies.push(commentMap.get(comment.id));
        } else {
            // Orphaned reply, maybe treat as root or ignore
            roots.push(commentMap.get(comment.id)); 
        }
      } else {
        roots.push(commentMap.get(comment.id));
      }
    });
    
    // Sort by date desc
    return roots.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [comments]);

  return (
    <div className="bg-background rounded-xl" id="comments-section">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-xl font-bold">Comments</h3>
        <span className="px-2 py-0.5 rounded-full bg-muted text-xs font-medium">
          {comments?.length || 0}
        </span>
      </div>

      <div className="mb-8">
        <CommentEditor onSubmit={handleAddComment} />
      </div>

      {loading && comments.length === 0 ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-6">
          {nestedComments.length > 0 ? (
            nestedComments.map((comment: any) => (
              <CommentItem 
                key={comment.id} 
                comment={comment} 
                contentId={contentId} 
                type={type} 
              />
            ))
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/10 border-dashed">
              <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground mb-3 opacity-50" />
              <p className="text-muted-foreground font-medium">No comments yet</p>
              <p className="text-xs text-muted-foreground mt-1">Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
