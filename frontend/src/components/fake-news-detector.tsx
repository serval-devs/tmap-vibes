import { ArticleTextBox } from "@/components/article-text-box";
import { BinaryDisplay } from "@/components/binary-display";
import { HistorySidebar } from "@/components/history-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useCheckArticle } from "@/hooks/api/articles";
import { useEffect, useRef, useState } from "react";

export function FakeNewsDetector() {
  const [text, setText] = useState("");
  const [error] = useState<string | null>(null);

  const {
    mutate: checkArticle,
    data,
    isPending,
    isSuccess,
  } = useCheckArticle();

  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to results section after a short delay to ensure rendering is complete
    const timer = setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [isSuccess]);

  function analyzeContent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    checkArticle({ content: text });
  }

  return (
    <>
      <HistorySidebar
        onSelectItem={(item) => {
          console.log(item);
        }}
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
                  <ArticleTextBox
                    onValueChange={(value: string) => {
                      setText(value);
                    }}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isPending || !text.trim()}
                  >
                    {isPending ? "Analyzing..." : "Analyze Content"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {error && (
              <div className="bg-destructive/15 border border-destructive text-destructive px-4 py-3 rounded-md">
                <p className="text-sm">{error}</p>
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
