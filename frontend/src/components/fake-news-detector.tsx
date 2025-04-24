import { ArticleTextBox } from "@/components/article-text-box";
import { BinaryDisplay } from "@/components/binary-display";
import { HistorySidebar } from "@/components/history-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ErrorMessage } from "@/components/ui/error-message";
import { useCheckArticle, useGetArticle } from "@/hooks/api/use-articles";
import { useEffect, useRef, useState } from "react";
import { AuthorInput } from "@/components/author-input";
import { WebsiteInput } from "@/components/website-input";
import { HistoryItem } from "@/lib/history";

export function FakeNewsDetector() {
  const { data: selectedItem } = useGetArticle();
  const [text, setText] = useState(selectedItem?.article.content ?? "");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [author, setAuthor] = useState(selectedItem?.article.author ?? "");
  const [website, setWebsite] = useState(selectedItem?.article.website ?? "");

  const {
    mutate: checkArticle,
    error,
    isPending,
  } = useCheckArticle();

  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [selectedItem]);

  function handleHistorySelect(item: HistoryItem) {
    setText(item.article.content);
    setAuthor(item.article.author ?? "");
    setWebsite(item.article.website ?? "");
    setIsValid(true);
    setValidationError(null);
  }

  function analyzeContent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    checkArticle({
      content: text,
      author: author.trim(),
      website: website.trim(),
    });
  }

  return (
    <>
      <HistorySidebar onSelectItem={handleHistorySelect} />
      <SidebarInset className="flex flex-col items-center">
        <div className="container mx-auto px-4 py-8 w-full">
          <header className="flex items-center mb-6">
            <SidebarTrigger className="mr-2" />
            <h1 className="text-3xl font-bold">Fake News Detector</h1>
          </header>
          <p className="text-muted-foreground mb-8">
            Analyze articles to determine if they might contain fake news.
          </p>
          <div className="text-sm text-muted-foreground border border-dashed border-muted-foreground/50 p-4 rounded-md mb-8 max-w-2xl mx-auto">
            <p className="font-semibold mb-2">DISCLAIMER</p>
            <p>
              This tool is designed for use with only American English articles.
              It is not intended for use with any other language or dialect. The
              results are not guaranteed.
            </p>
          </div>

          <div className="space-y-8">
            <Card className="w-full max-w-2xl mx-auto">
              <CardHeader className="text-lg font-semibold">
                Analyze Article
              </CardHeader>
              <CardContent>
                <form onSubmit={analyzeContent} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <AuthorInput value={author} onChange={setAuthor} />
                    <WebsiteInput value={website} onChange={setWebsite} />
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

                  {validationError && (
                    <ErrorMessage message={validationError} />
                  )}

                  <Button
                    id="analyze-button"
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
            {selectedItem && (
              <div
                ref={resultsRef}
                className="animate-in fade-in-50 duration-300"
              >
                <BinaryDisplay isFake={selectedItem.result.confidence > 0.5} />
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </>
  );
}
