import { useState } from 'react';

export default function AddCommentForm({ onAddComment }: { onAddComment: (comment: { postedBy: string; text: string }) => void }) {
  const [postedBy, setPostedBy] = useState('');
  const [text, setText] = useState('');

  return (
    <div>
      <h3>Add a Comment</h3>
      <label>
        <input
            type="text"
            placeholder="Your name"
            value={postedBy}
            onChange={(e) => setPostedBy(e.target.value)}
        />
      </label><br/>
      <br/>
      <label>
        <textarea
            rows={3}
            cols={50}
            placeholder="Your comment"
            value={text}
            onChange={(e) => setText(e.target.value)}
        />
      </label><br/>
      <button onClick={() => {
        onAddComment({postedBy, text});
        setPostedBy('');
        setText('');
    }}>Submit</button>
    </div>
  );
}