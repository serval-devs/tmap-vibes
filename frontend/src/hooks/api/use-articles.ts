import { Article, ArticleCheck } from "@/lib/article";
import { HistoryItem } from "@/lib/history";
import { useMutation } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { useAddHistory } from "@/hooks/use-history";

const apiUrl = "http://localhost:5000/api/v1";

export function useCheckArticle() {
  const { mutateAsync: addHistory } = useAddHistory();

  return useMutation({
    mutationKey: ["checkArticle"],
    mutationFn: async (article: Article) => {
      const response = await fetch(`${apiUrl}/articles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(article),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = (await response.json()) as ArticleCheck;
      return { result, article };
    },

    // Save the result to history after the mutation is successful.
    onSuccess: async ({ article, result }) => {
     const title = article.content.substring(0, 30) + "..."
      
      const historyItem: HistoryItem = {
        id: uuidv4(),
        title,
        content: article.content,
        url: article.website,
        timestamp: new Date(),
        result,
      }

      await addHistory(historyItem)
    },
  })
}
