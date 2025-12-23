import ArticlesList from '../ArticlesList'; 
import articles from '../article-content';

export default function ArticlesListPage() {
  return (
    <div className="articles-page">
      <h1>Articles</h1>
      <p className="articles-intro">Click on an article to read more.</p>
      <ArticlesList articles={articles} />
    </div>
  );
}