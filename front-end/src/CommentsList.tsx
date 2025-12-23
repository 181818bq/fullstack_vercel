interface Comment {
  newComment: {
    text: string;
    postedBy: string;
  };
}

interface CommentsListProps {
  comments: Comment[];
}

export default function CommentsList({ comments }: CommentsListProps) {
  // Defensive check: handle undefined, null, or non-array values
  if (!comments || !Array.isArray(comments) || comments.length === 0) {
    return (
      <>
        <h3>Comments:</h3>
        <p>No comments yet.</p>
      </>
    );
  }

  return (
    <>
      <h3>Comments:</h3>
      {comments.map((comment: Comment, idx: number) => (
        <div key={idx}>
          <h4>{comment.newComment?.postedBy || 'Anonymous'}</h4>
          <p>{comment.newComment?.text || ''}</p>
        </div>
      ))}
    </>
  );
}