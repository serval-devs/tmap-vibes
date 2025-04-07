import type React from "react"

import { useState, useRef, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ConfidenceDisplay } from "@/components/confidence-display"
import { HistorySidebar, type HistoryItem } from "@/components/history-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { ArticleTextBox } from "@/components/article-text-box"

interface fakeNewsHistory {
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

export function FakeNewsDetector() {
  const [url, setUrl] = useState("")
  const [text, setText] = useState("")
  const [fileName, setFileName] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<{ score: number; message: string } | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null)
  const [error, setError] = useState<string | null>(null)

  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("fakeNewsHistory")
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory) as fakeNewsHistory[]
        // Convert string dates back to Date objects
        const historyWithDates = parsedHistory.map((item) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }))
        setHistory(historyWithDates)
      } catch (error) {
        console.error("Failed to parse history:", error)
      }
    }
  }, [])

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("fakeNewsHistory", JSON.stringify(history))
  }, [history])

  const analyzeContent = async () => {
    setIsAnalyzing(true)
    setError(null) // Clear any previous errors

    try {
      // Simulate API call to ML model
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (!text.trim() && !url.trim()) {
        throw new Error("Please provide either article text or URL")
      }

      // Generate a random score between 0 and 1 for demonstration
      const fakeScore = Math.random()

      let message = ""
      if (fakeScore < 0.3) {
        message = "This content appears to be reliable."
      } else if (fakeScore < 0.7) {
        message = "This content contains some questionable elements."
      } else {
        message = "This content has a high likelihood of being fake news."
      }

      const newResult = { score: fakeScore, message }
      setResult(newResult)

      // Create a history item
      const title = fileName || url || text.substring(0, 30) + "..."
      const newHistoryItem: HistoryItem = {
        id: uuidv4(),
        title,
        content: text,
        url: url || undefined,
        timestamp: new Date(),
        result: newResult,
      }

      // Add to history (most recent first)
      setHistory((prev) => [newHistoryItem, ...prev])
      setSelectedHistoryItem(null)

      // Scroll to results section after a short delay to ensure rendering is complete
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
      setResult(null)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void analyzeContent()
  }

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setSelectedHistoryItem(item)
    setText(item.content)
    setUrl(item.url ?? "")
    setResult(item.result)

    setFileName("")
  }

  const handleClearHistory = () => {
    setHistory([])
    localStorage.removeItem("fakeNewsHistory")
  }

  return (
    <>
      <HistorySidebar history={history} onSelectItem={handleSelectHistoryItem} onClearHistory={handleClearHistory} />
      <SidebarInset className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <header className="flex items-center mb-6">
            <SidebarTrigger className="mr-2" />
            <h1 className="text-3xl font-bold">Fake News Detector</h1>
          </header>
          <p className="text-muted-foreground mb-8">Analyze articles to determine if they might contain fake news</p>

          <div className="space-y-8">
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="url">Article URL (Optional)</Label>
                    <Input
                      id="url"
                      placeholder="https://example.com/article"
                      value={url}
                      onChange={(e) => { setUrl(e.target.value) }}
                    />
                  </div>

                  <ArticleTextBox
                    ref={textAreaRef}
                    value={text}
                    onChange={setText}
                    fileName={fileName}
                    placeholder="Paste or type the article text here, or drag and drop a file..."
                  />

                  <Button type="submit" className="w-full" disabled={isAnalyzing || (!url.trim() && !text.trim())}>
                    {isAnalyzing ? "Analyzing..." : "Analyze Content"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {error && (
              <div className="bg-destructive/15 border border-destructive text-destructive px-4 py-3 rounded-md">
                <p className="text-sm">{error}</p>
              </div>
            )}

            {result && (
              <div
                ref={resultsRef}
                className={
                  selectedHistoryItem ? "opacity-100 transition-opacity" : "animate-in fade-in-50 duration-300"
                }
              >
                <ConfidenceDisplay score={result.score} message={result.message} />
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </>
  )
}
