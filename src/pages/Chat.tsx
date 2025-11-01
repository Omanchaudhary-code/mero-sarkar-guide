import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// API Configuration
const API_BASE_URL = "http://localhost:8000";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Namaste! I'm your AI assistant for government procedures and Nepal law. How can I help you today? You can ask me about voter ID registration, passport applications, citizenship certificates, legal procedures, and more."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Check API connection on mount
  useEffect(() => {
    checkApiConnection();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  const checkApiConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (response.ok) {
        const data = await response.json();
        setApiConnected(data.status === "healthy");
        if (data.status === "healthy") {
          toast.success("Connected to AI backend");
        }
      } else {
        setApiConnected(false);
      }
    } catch (error) {
      console.error("API connection error:", error);
      setApiConnected(false);
      toast.error("Cannot connect to AI backend. Make sure the server is running on port 8000.");
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: userMessage }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();
      
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: data.answer }
      ]);

      // Show context used if available (for debugging/transparency)
      if (data.context_used && data.context_used.length > 0) {
        console.log("Context used:", data.context_used);
      }

    } catch (error) {
      console.error("Error sending message:", error);
      
      let errorMessage = "I'm having trouble connecting to the server. ";
      
      if (error instanceof Error) {
        if (error.message.includes("fetch")) {
          errorMessage += "Please make sure the FastAPI server is running on http://localhost:8000";
        } else {
          errorMessage += error.message;
        }
      }
      
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: `Sorry, I encountered an error: ${errorMessage}`
        }
      ]);
      
      toast.error("Failed to get response from AI");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <div className="container mx-auto flex flex-1 flex-col px-4 py-8">
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">AI Assistant</h1>
          <p className="text-muted-foreground">Ask me anything about government procedures and Nepal law</p>
        </div>

        {apiConnected === false && (
          <Alert variant="destructive" className="mx-auto mb-4 max-w-4xl">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Cannot connect to the AI backend. Please ensure:
              <ul className="ml-4 mt-2 list-disc">
                <li>FastAPI server is running: <code className="text-xs">python main.py</code></li>
                <li>Server is accessible at: <code className="text-xs">http://localhost:8000</code></li>
                <li>GEMINI_API_KEY is set in your .env file</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <Card className="mx-auto flex w-full max-w-4xl flex-1 flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Nagarik Sahayak AI
              {apiConnected === true && (
                <span className="ml-2 flex items-center gap-1 text-xs font-normal text-green-600">
                  <span className="h-2 w-2 rounded-full bg-green-600"></span>
                  Connected
                </span>
              )}
              {apiConnected === false && (
                <span className="ml-2 flex items-center gap-1 text-xs font-normal text-red-600">
                  <span className="h-2 w-2 rounded-full bg-red-600"></span>
                  Disconnected
                </span>
              )}
            </CardTitle>
            <CardDescription>
              Get instant answers about voter ID, passports, citizenship, legal procedures, and more
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            <ScrollArea ref={scrollAreaRef} className="mb-4 flex-1 pr-4">
              <div className="space-y-4">
                {messages.map((message, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                    </div>
                    {message.role === "user" && (
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-secondary">
                        <User className="h-4 w-4 text-secondary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary">
                      <Bot className="h-4 w-4 animate-pulse text-primary-foreground" />
                    </div>
                    <div className="rounded-lg bg-muted px-4 py-3">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about any government procedure or legal question..."
                disabled={isLoading || apiConnected === false}
                className="flex-1"
              />
              <Button 
                onClick={handleSend} 
                disabled={isLoading || !input.trim() || apiConnected === false} 
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}