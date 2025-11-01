import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Shield, Zap, Globe } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      
      <section className="container mx-auto px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Why Choose Nagarik Sahayak?</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            We make government procedures simple, transparent, and accessible to every Nepali citizen
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-2 transition-all hover:border-primary hover:shadow-card">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Accurate Information</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Up-to-date, verified information about all government procedures and requirements
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 transition-all hover:border-primary hover:shadow-card">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                <Zap className="h-6 w-6 text-secondary" />
              </div>
              <CardTitle className="text-xl">Save Time</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Know exactly what you need before visiting offices. No more multiple trips or confusion
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 transition-all hover:border-primary hover:shadow-card">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-xl">AI Assistance</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                24/7 AI chatbot to answer your questions and guide you through complex procedures
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 transition-all hover:border-primary hover:shadow-card">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Bilingual Support</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Available in both English and Nepali for maximum accessibility across Nepal
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-t bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Simplifying Bureaucracy, Empowering Citizens
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Our mission is to make government services accessible to every Nepali citizen. 
              No more confusion, no more wasted time. Just clear, step-by-step guidance.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t py-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 Nagarik Sahayak. Making government services accessible for all Nepali citizens.</p>
        </div>
      </footer>
    </div>
  );
}
