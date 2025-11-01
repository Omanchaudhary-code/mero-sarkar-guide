import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, Globe } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Navbar = () => {
  const [language, setLanguage] = useState<"en" | "ne">("en");

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ne" : "en");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-hero">
            <span className="text-xl font-bold text-primary-foreground">नस</span>
          </div>
          <span className="text-xl font-bold">Nagarik Sahayak</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <Link to="/services" className="text-sm font-medium transition-colors hover:text-primary">
            {language === "en" ? "Services" : "सेवाहरू"}
          </Link>
          <Link to="/chat" className="text-sm font-medium transition-colors hover:text-primary">
            {language === "en" ? "AI Assistant" : "AI सहायक"}
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="gap-2"
          >
            <Globe className="h-4 w-4" />
            {language === "en" ? "नेपाली" : "English"}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col gap-4 pt-8">
              <Link to="/services" className="text-lg font-medium">
                {language === "en" ? "Services" : "सेवाहरू"}
              </Link>
              <Link to="/chat" className="text-lg font-medium">
                {language === "en" ? "AI Assistant" : "AI सहायक"}
              </Link>
              <Button
                variant="outline"
                onClick={toggleLanguage}
                className="gap-2"
              >
                <Globe className="h-4 w-4" />
                {language === "en" ? "Switch to Nepali" : "Switch to English"}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};
