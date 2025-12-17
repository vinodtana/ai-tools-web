import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, Reply } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import CommentEditor from './CommentEditor';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { likeComment, addComment, fetchComments, setShowLoginModel } from '@/store/features/contents/contentsSlice';
import { useToast } from '@/hooks/use-toast';

interface CommentProps {
  comment: any;
  contentId: string | number;
  type: string;
  isReply?: boolean;
}

const CommentItem: React.FC<CommentProps> = ({ comment, contentId, type, isReply = false }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isLiked, setIsLiked] = useState(comment.isLiked || false); // Optimistic
  const [likesCount, setLikesCount] = useState(comment.likesCount || 0); // Optimistic
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: any) => state.content);
  const { toast } = useToast();

  const handleLike = async () => {
    if (!user?.id) {
        dispatch(setShowLoginModel(true));
        return;
    }

    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1);

    await dispatch(likeComment({
      comment_id: comment.id,
      user_id: user.id,
      is_liked: newIsLiked
    }));
  };

  const handleReplySubmit = async (content: string, media?: File) => {
    if (!user?.id) {
        dispatch(setShowLoginModel(true));
        return;
    }

    await dispatch(addComment({
      content_id: contentId,
      type,
      user_id: user.id,
      comment: content,
      parent_id: comment.id,
      media
    }));
    
    setIsReplying(false);
    // Refresh comments to show new reply
    dispatch(fetchComments({ content_id: contentId, type }));
  };

  return (
    <div className={`flex gap-4 ${isReply ? 'ml-12 mt-4' : 'mt-6'}`}>
      <Avatar className="h-10 w-10 border">
        <AvatarImage src={comment.user?.avatar || comment.user_avatar} />
        <AvatarFallback>{comment.user?.name?.[0] || 'U'}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="bg-muted/30 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">{comment.user?.name || comment.user_name || 'Anonymous'}</span>
              <span className="text-xs text-muted-foreground">
                {comment.created_at ? formatDistanceToNow(new Date(comment.created_at), { addSuffix: true }) : 'Just now'}
              </span>
            </div>
          </div>
          
          <div 
            className="text-sm prose dark:prose-invert max-w-none mb-3"
            dangerouslySetInnerHTML={{ __html: comment.content || comment.comment }} 
          />

          {comment.media_url && (
             <div className="mb-3">
                 {comment.media_type?.startsWith('video') ? (
                     <video src={comment.media_url} controls className="max-h-60 rounded-lg" />
                 ) : (
                     <img src={comment.media_url} alt="Attachment" className="max-h-60 rounded-lg object-cover" />
                 )}
             </div>
          )}

          <div className="flex items-center gap-4">
            {!isReply && (
              <Button 
                variant="ghost" 
                size="sm" 
                className={`h-8 px-2 text-xs ${isLiked ? 'text-primary hover:text-primary' : 'text-muted-foreground'}`}
                onClick={handleLike}
              >
                <Heart className={`h-3 w-3 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                {likesCount} Likes
              </Button>
            )}
            
            {!isReply && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-xs text-muted-foreground"
                onClick={() => {
                    if (!user?.id) {
                        dispatch(setShowLoginModel(true));
                    } else {
                        setIsReplying(!isReplying);
                    }
                }}
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                Reply
              </Button>
            )}
          </div>
        </div>

        {isReplying && (
          <div className="mt-4">
             <CommentEditor 
                onSubmit={handleReplySubmit}
                onCancel={() => setIsReplying(false)}
                isReply
                placeholder={`Replying to ${comment.user?.name || 'user'}...`}
             />
          </div>
        )}

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-4">
            {comment.replies.map((reply: any) => (
              <CommentItem 
                key={reply.id} 
                comment={reply} 
                contentId={contentId} 
                type={type} 
                isReply 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
