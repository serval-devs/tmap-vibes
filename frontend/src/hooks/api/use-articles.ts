import { Article } from "@/lib/article";
import { HistoryItem } from "@/lib/history";
import { useMutation } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { useAddHistory } from "@/hooks/use-history";

interface ArticleCheck {
  isFake: boolean;
  confidence: number;
}

export function useCheckArticle() {
  const { mutateAsync: addHistory } = useAddHistory();

  return useMutation({
    mutationKey: ["checkArticle"],
    mutationFn: (article: Article) => {
      const confidence = Math.random(); // Simulate a confidence score
      return Promise.resolve({
        article,
        result: {
          isFake: confidence > 0.5,
          confidence,
        } satisfies ArticleCheck,
      });

      //const response = await fetch("http://localhost:3030/api/v1/articles", {
      //  method: "POST",
      //  headers: {
      //    "Content-Type": "application/json",
      //  },
      //  body: JSON.stringify(article),
      //});
      //
      //if (!response.ok) {
      //  throw new Error("Network response was not ok");
      //}
      //
      //const result = (await response.json()) as ArticleCheck;
      //return { result, article };
    },

    // Save the result to history after the mutation is successful.
    onSuccess: async ({ article, result }) => {
      const title = article.title ?? article.content.substring(0, 30) + "...";
      const message = result.isFake
        ? "This content is likely to be fake."
        : "This content appears to be reliable.";

      const newHistoryItem: HistoryItem = {
        id: uuidv4(),
        title,
        content: article.content,
        url: undefined,
        timestamp: new Date(),
        result: {
          score: result.confidence,
          message,
        },
      };

      await addHistory(newHistoryItem);
    },
  });
}
