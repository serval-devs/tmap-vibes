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

    const parsedHistory: HistoryItem[] = JSON.parse(savedHistory) as HistoryItem[];
    
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
