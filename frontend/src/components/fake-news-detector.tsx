import type React from "react"

import { BinaryDisplay } from "@/components/binary-display"
import { HistorySidebar } from "@/components/history-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useRef, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { GetHistory, HistoryItem } from "@/lib/history"

export function FakeNewsDetector() {
  const [url, setUrl] = useState("")
  const [text, setText] = useState("")
  const [fileName, setFileName] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<{ score: number; message: string } | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>(() => GetHistory())
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null)

  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("fakeNewsHistory", JSON.stringify(history))
  }, [history])

  const analyzeContent = async () => {
    setIsAnalyzing(true)

    // Simulate API call to ML model
    await new Promise((resolve) => setTimeout(resolve, 1500))

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
    setIsAnalyzing(false)

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

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="content">Article Text</Label>
                      {fileName && <span className="text-sm text-primary">File: {fileName}</span>}
                    </div>

                    <div className="relative border rounded-md" >
                      <Textarea
                        ref={textAreaRef}
                        id="content"
                        placeholder="Paste or type the article text here, or drag and drop a file..."
                        value={text}
                        onChange={(e) => { setText(e.target.value) } }
                        className="min-h-[200px] resize-y"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isAnalyzing || (!url.trim() && !text.trim())}>
                    {isAnalyzing ? "Analyzing..." : "Analyze Content"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {result && (
              <div
                ref={resultsRef}
                className={
                  selectedHistoryItem ? "opacity-100 transition-opacity" : "animate-in fade-in-50 duration-300"
                }
              >
                <BinaryDisplay isFake={result.score > 0.5} />
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </>
  )
}
