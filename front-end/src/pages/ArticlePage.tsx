import { useState } from 'react';
import { useParams, useLoaderData } from 'react-router-dom';
import axios from 'axios';
import CommentsList from '../CommentsList';
import AddCommentForm from '../AddCommentForm';
import articles from '../article-content';
import { LoaderFunctionArgs } from 'react-router-dom';
import useUser from '../useUser';

type Article = {
  name: string;
  title: string;
  content: string[];
};

// Get the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || '';

console.log('API_URL configured as:', API_URL); // Debugging helper

export default function ArticlePage() {
  const { name } = useParams();
  const { upvotes: initialUpvotes, comments: initialComments } = useLoaderData() as { upvotes: number; comments: any[] };
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [comments, setComments] = useState(initialComments || []);

  //const { isLoading, user } = useUser();
  const { user } = useUser();

  const article = articles.find((a: Article) => a.name === name);

  if (!article) {
    throw new Error('Article not found');
  }

async function onUpvoteClicked() {
  try {
    const token = user && await user.getIdToken();
    const headers = token ? { authtoken: token } : {};
    const response = await axios.post(`${API_URL}/api/articles/${name}/upvote`, null, { headers });
    const updatedArticleData = response.data;
    setUpvotes(updatedArticleData.upvotes);
  } catch (error) {
    console.error('Error upvoting:', error);
    alert('Failed to upvote article');
  }
}
    
async function onAddComment({ postedBy, text }: { postedBy: string; text: string }) {
  try {
    const token = user && await user.getIdToken();
    const headers = token ? { authtoken: token } : {};
    const response = await axios.post(`${API_URL}/api/articles/${name}/comments`, {
      postedBy,
      text
    }, { headers });

    const updatedComments = response.data.comments;
    setComments(updatedComments || []);
  } catch (error) {
    console.error('Error adding comment:', error);
    alert('Failed to add comment');
  }
}

return (
    <>
      <h1>{article.title}</h1>
      {user && <button onClick={onUpvoteClicked}>Upvote</button>}
      <p> This article has { upvotes } upvotes</p>
      {article.content && article.content.map((p, idx) => <p key={idx}>{p}</p>)}
      {user
        ? <AddCommentForm onAddComment={onAddComment} />
        : <p>Please sign in to add a comment.</p>}
        <CommentsList comments={comments} />
    </>
  );
}

export async function loader({ params }: LoaderFunctionArgs) {
  try {
    console.log('Loader fetching from:', `${API_URL}/api/articles/${params.name}`);
    const response = await axios.get(`${API_URL}/api/articles/${params.name}`);
    console.log('Loader response:', response.data);
    const { upvotes, comments } = response.data;
    return { upvotes: upvotes || 0, comments: comments || [] };
  } catch (error) {
    console.error('Loader error:', error);
    // Return default values if API fails
    return { upvotes: 0, comments: [] };
  }
}