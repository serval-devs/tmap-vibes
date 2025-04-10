export interface HistoryItem {
  id: string
  title: string
  content: string
  url?: string
  timestamp: Date
  result: {
    score: number
    message: string
  }
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
