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
  return (
    <>
      <h3>Comments:</h3>
      {comments.map((comment: Comment, idx: number) => (
        <div key={idx}>
          <h4>{comment.newComment.postedBy}</h4>
          <p>{comment.newComment.text}</p>
        </div>
      ))}
    </>
  );
}