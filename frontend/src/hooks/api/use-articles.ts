import { Article, ArticleCheck } from "@/lib/article";
import { GetSelectedItem, HistoryItem } from "@/lib/history";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { useAddHistory } from "@/hooks/use-history";

export function useGetArticle() {
  return useQuery({
    queryKey: ["getArticle"],
    queryFn: () => {
      return GetSelectedItem();
    },
  });
}

export function useSetArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["setArticle"],
    mutationFn: (historyItem: HistoryItem) => {
      localStorage.setItem("fakeNewsSelectedItem", JSON.stringify(historyItem));
      return Promise.resolve();
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["getArticle"] });
    },
  });
}

export function useCheckArticle() {
  const { mutateAsync: addHistory } = useAddHistory();
  const { mutateAsync: setHistoryItem } = useSetArticle();

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
      const title = article.content.substring(0, 30) + "...";

      const historyItem: HistoryItem = {
        id: uuidv4(),
        title,
        article,
        timestamp: new Date(),
        result,
      };

      await addHistory(historyItem);
      await setHistoryItem(historyItem);
    },
  });
}
