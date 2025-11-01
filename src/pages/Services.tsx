import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Link } from "react-router-dom";
import { 
  User, 
  CreditCard, 
  Vote, 
  FileText, 
  Home, 
  Car,
  Clock,
  MapPin,
  ArrowRight
} from "lucide-react";

const services = [
  {
    id: "voter-id",
    title: "Voter ID Registration",
    description: "Register for your voter identification card to participate in elections",
    icon: Vote,
    duration: "2-3 weeks",
    difficulty: "Easy",
    category: "Citizenship",
  },
  {
    id: "citizenship",
    title: "Citizenship Certificate",
    description: "Apply for or renew your Nepali citizenship certificate",
    icon: User,
    duration: "3-4 weeks",
    difficulty: "Medium",
    category: "Citizenship",
  },
  {
    id: "passport",
    title: "Passport Application",
    description: "Apply for a new passport or renew your existing one",
    icon: CreditCard,
    duration: "1-2 weeks",
    difficulty: "Medium",
    category: "Travel",
  },
  {
    id: "land-registration",
    title: "Land Registration",
    description: "Register land ownership and property documents",
    icon: Home,
    duration: "4-6 weeks",
    difficulty: "Hard",
    category: "Property",
  },
  {
    id: "driving-license",
    title: "Driving License",
    description: "Apply for a new driving license or renew existing one",
    icon: Car,
    duration: "2-3 weeks",
    difficulty: "Medium",
    category: "Transport",
  },
  {
    id: "birth-certificate",
    title: "Birth Certificate",
    description: "Register a birth and obtain birth certificate",
    icon: FileText,
    duration: "1-2 weeks",
    difficulty: "Easy",
    category: "Records",
  },
];

const difficultyColor = {
  Easy: "bg-green-500/10 text-green-700 dark:text-green-400",
  Medium: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  Hard: "bg-red-500/10 text-red-700 dark:text-red-400",
};

export default function Services() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Government Services</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Browse all available government procedures and services. Click on any service to see detailed steps and requirements.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card key={service.id} className="group overflow-hidden transition-all hover:shadow-elevated">
                <CardHeader>
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-hero">
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <Badge className={difficultyColor[service.difficulty as keyof typeof difficultyColor]}>
                      {service.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="mb-2">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{service.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>District Administration Office</span>
                    </div>
                  </div>
                  <Link to={`/service/${service.id}`}>
                    <Button className="w-full gap-2 group-hover:gap-3 transition-all">
                      View Details
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
