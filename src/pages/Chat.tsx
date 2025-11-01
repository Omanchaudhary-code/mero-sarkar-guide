import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User } from "lucide-react";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Namaste! I'm your AI assistant for government procedures. How can I help you today? You can ask me about voter ID registration, passport applications, citizenship certificates, and more."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    // Simulated AI response - will be replaced with actual Lovable AI integration
    setTimeout(() => {
      const responses: Record<string, string> = {
        "voter": "To register for a Voter ID, you'll need: 1) Citizenship certificate (original and copy), 2) Two passport-size photos, and 3) Proof of residence. Visit your local District Election Office or Administration Office. The process takes 2-3 weeks.",
        "passport": "For a passport application: 1) First register online at passport.gov.np, 2) Pay the fee at a designated bank (NPR 5,000 normal / NPR 10,000 urgent), 3) Visit the Department of Passports with your citizenship certificate and application printout. Processing takes 1-2 weeks.",
        "citizenship": "To apply for a citizenship certificate, you need: 1) Birth certificate, 2) Parents' citizenship certificates, 3) Proof of residence, and 4) Three passport photos. Visit your District Administration Office. The process takes 3-4 weeks.",
      };

      const lowerInput = userMessage.toLowerCase();
      let response = "I can help you with various government procedures including voter ID registration, passport applications, citizenship certificates, driving licenses, and more. Could you please specify which service you're interested in?";

      for (const [key, value] of Object.entries(responses)) {
        if (lowerInput.includes(key)) {
          response = value;
          break;
        }
      }

      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      setIsLoading(false);
    }, 1000);
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
          <p className="text-muted-foreground">Ask me anything about government procedures</p>
        </div>

        <Card className="mx-auto flex w-full max-w-4xl flex-1 flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Nagarik Sahayak AI
            </CardTitle>
            <CardDescription>
              Get instant answers about voter ID, passports, citizenship, and more
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            <ScrollArea className="mb-4 flex-1 pr-4">
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
                      <p className="text-sm leading-relaxed">{message.content}</p>
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
                placeholder="Ask about any government procedure..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={isLoading || !input.trim()} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
