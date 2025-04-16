import { ArticleTextBox } from "@/components/article-text-box";
import { BinaryDisplay } from "@/components/binary-display";
import { HistorySidebar } from "@/components/history-sidebar";
import { type HistoryItem } from "@/lib/history";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ErrorMessage } from "@/components/ui/error-message";
import { useCheckArticle } from "@/hooks/api/use-articles";
import { useEffect, useRef, useState, useCallback } from "react";
import { AuthorInput } from "@/components/author-input"
import { WebsiteInput } from "@/components/website-input"

export function FakeNewsDetector() {
  const [text, setText] = useState("")
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isValid, setIsValid] = useState(false)
  const [author, setAuthor] = useState("")
  const [website, setWebsite] = useState("")

  const {
    mutate: checkArticle,
    data,
    error,
    isPending,
    isSuccess,
  } = useCheckArticle();

  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [isSuccess]);

  const handleHistorySelect = useCallback((item: HistoryItem) => {
    setText(item.content);
    setAuthor("");
    setWebsite("");
    setIsValid(true);
    setValidationError(null);
  }, []);

  function analyzeContent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    checkArticle({ 
      content: text,
      author: author.trim(),
      website: website.trim()
    });
  }

  return (
    <>
      <HistorySidebar
        onSelectItem={handleHistorySelect}
      />
      <SidebarInset className="flex flex-col items-center">
        <div className="container mx-auto px-4 py-8 w-full">
          <header className="flex items-center mb-6">
            <SidebarTrigger className="mr-2" />
            <h1 className="text-3xl font-bold">Fake News Detector</h1>
          </header>
          <p className="text-muted-foreground mb-8">
            Analyze articles to determine if they might contain fake news.
          </p>

          <div className="space-y-8">
            <Card className="w-full max-w-2xl mx-auto">
              <CardHeader className="text-lg font-semibold">
                Analyze Article
              </CardHeader>
              <CardContent>
                <form onSubmit={analyzeContent} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <AuthorInput 
                      value={author}
                      onChange={setAuthor}
                    />
                    <WebsiteInput
                      value={website}
                      onChange={setWebsite}
                    />
                  </div>

                  <ArticleTextBox
                    currentValue={text}
                    onValueChange={(value: string) => {
                      setText(value);
                    }}
                    onValidationChange={(valid) => {
                      setIsValid(valid);
                    }}
                    onError={(error) => {
                      setValidationError(error);
                    }}
                  />

                  {validationError && <ErrorMessage message={validationError} />}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isPending || !text.trim() || !isValid}
                  >
                    {isPending ? "Analyzing..." : "Analyze Content"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {error && (
              <div className="bg-destructive/15 border border-destructive text-destructive px-4 py-3 rounded-md">
                <p className="text-sm">{error.message}</p>
              </div>
            )}
            {data && (
              <div
                ref={resultsRef}
                className="animate-in fade-in-50 duration-300"
              >
                <BinaryDisplay isFake={data.result.confidence > 0.5} />
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </>
  );
}
