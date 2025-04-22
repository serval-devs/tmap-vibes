import { type Article, type ArticleCheck } from "@/lib/article"

export interface HistoryItem {
  id: string
  title: string
  article: Article
  timestamp: Date
  result: ArticleCheck
}

export function GetHistory(): HistoryItem[] {
    const savedHistory = localStorage.getItem("fakeNewsHistory");
    if (!savedHistory) {
        return [];
    }

    let parsedHistory: HistoryItem[] = [];
    try {
        parsedHistory = JSON.parse(savedHistory) as HistoryItem[];
    } catch (error) {
        console.error("Failed to parse history from localStorage:", error);
        return [];
    }
    
    // Convert string dates back to Date objects
    const historyWithDates = parsedHistory.map((item) => ({
        ...item,
        timestamp: new Date(item.timestamp),
    }));

    return historyWithDates;
}

export function AddHistory(historyItem: HistoryItem) {
    const history = GetHistory();
    const newHistory = [...history, historyItem];

    localStorage.setItem("fakeNewsHistory", JSON.stringify(newHistory));
}

export function GetSelectedItem() {
    const savedHistory = localStorage.getItem("fakeNewsSelectedItem");
    if (!savedHistory) {
        return null;
    }

    let parsedHistory: HistoryItem | null = null;
    try {
        parsedHistory = JSON.parse(savedHistory) as HistoryItem;
    } catch (error) {
        console.error("Failed to parse selected item from localStorage:", error);
        return null;
    }

    return parsedHistory;
}

export function SetSelectedItem(historyItem: HistoryItem) {
    localStorage.setItem("fakeNewsSelectedItem", JSON.stringify(historyItem));
}
