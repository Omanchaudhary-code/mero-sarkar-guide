import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
      
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold text-primary-foreground md:text-6xl lg:text-7xl">
            Simplifying Government <br />
            <span className="text-accent">Procedures for Nepal</span>
          </h1>
          
          <p className="mb-8 text-lg text-primary-foreground/90 md:text-xl">
            AI-powered guidance for citizenship, passports, voter ID, and more. 
            Navigate bureaucracy with confidence.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link to="/services">
              <Button size="lg" variant="secondary" className="group gap-2 shadow-elevated">
                Browse Services
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/chat">
              <Button size="lg" variant="outline" className="gap-2 border-2 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20">
                <MessageSquare className="h-4 w-4" />
                Ask AI Assistant
              </Button>
            </Link>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="rounded-xl bg-primary-foreground/10 p-6 backdrop-blur-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                <FileText className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="mb-2 font-semibold text-primary-foreground">Step-by-Step Guides</h3>
              <p className="text-sm text-primary-foreground/80">
                Clear instructions for every government procedure
              </p>
            </div>

            <div className="rounded-xl bg-primary-foreground/10 p-6 backdrop-blur-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                <MessageSquare className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="mb-2 font-semibold text-primary-foreground">AI Assistant</h3>
              <p className="text-sm text-primary-foreground/80">
                Get instant answers to your questions 24/7
              </p>
            </div>

            <div className="rounded-xl bg-primary-foreground/10 p-6 backdrop-blur-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                <svg className="h-6 w-6 text-accent-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold text-primary-foreground">Smart Forms</h3>
              <p className="text-sm text-primary-foreground/80">
                Auto-fill forms with OCR document scanning
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
