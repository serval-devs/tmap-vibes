export interface Article {
    title?: string;
    content: string;
};

export interface ArticleCheck {
  isFake: boolean;
  confidence: number;
}

