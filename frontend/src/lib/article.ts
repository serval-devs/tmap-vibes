export interface Article {
  content: string
  author?: string
  website?: string
};

export interface ArticleCheck {
  isFake: boolean;
  confidence: number;
}

