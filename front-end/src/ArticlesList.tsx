import { Link } from 'react-router-dom';

type Article = {
    name: string;
    title: string;
    content: string[];
};

type ArticlesListProps = {
    articles: Article[];
};

export default function ArticlesList({ articles }: ArticlesListProps) {
    return (
    <>
    {articles.map((article) => (
        <Link key={article.name} to={'/articles/' + article.name}>
          <h3>{article.title}</h3>
          <p>{article.content[0].substring(0, 150)}...</p>
        </Link>
    ))}
    </>
    )
}