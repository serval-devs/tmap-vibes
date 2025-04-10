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

    const parsedHistory: HistoryItem[] = [];
    try {
        parsedHistory.push(...(JSON.parse(savedHistory) as HistoryItem[]));
    } catch (error) {
        console.error("Failed to parse history:", error);
    }

    // Convert string dates back to Date objects
    const historyWithDates = parsedHistory.map((item) => ({
        ...item,
        timestamp: new Date(item.timestamp),
    }));

    return historyWithDates;
}
