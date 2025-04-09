def validate_article_content(article: str) -> None:
    if not article or not article.strip():
        raise ValueError("Article must not be empty.")
    if not isinstance(article, str):
        raise TypeError("Article must be a string.")
    if len(article) > 300:
        raise ValueError("Article is too long")
