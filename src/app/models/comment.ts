export interface Comment {
  id: string;
  postId: string;
  comment: string;
  author?: string;
  createdAt: string;
  isVisibleReplyComments: boolean;
  isVisibleReplyCommentForm: boolean;
  replyComments: string[];
}
