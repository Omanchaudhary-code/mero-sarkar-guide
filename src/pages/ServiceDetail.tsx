import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  FileText,
  Upload,
  AlertCircle,
  Banknote
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const serviceData: Record<string, any> = {
  "voter-id": {
    title: "Voter ID Registration",
    description: "Complete guide to registering for your voter identification card",
    duration: "2-3 weeks",
    difficulty: "Easy",
    office: "District Administration Office / Election Commission",
    fee: "Free",
    eligibility: [
      "Must be a Nepali citizen",
      "Must be 18 years or older",
      "Must have permanent address in Nepal",
    ],
    documents: [
      "Citizenship certificate (original and photocopy)",
      "Recent passport-size photo (2 copies)",
      "Proof of residence",
    ],
    steps: [
      {
        title: "Prepare Documents",
        description: "Gather all required documents including citizenship certificate and recent photos",
        substeps: ["Get 2 passport-size photos", "Make photocopies of citizenship certificate"],
      },
      {
        title: "Visit Election Office",
        description: "Go to your local District Election Office or Administration Office",
        substeps: ["Check office hours (usually 10 AM - 5 PM)", "Bring all documents"],
      },
      {
        title: "Fill Application Form",
        description: "Complete the voter registration form with accurate information",
        substeps: ["Provide personal details", "Submit documents for verification"],
      },
      {
        title: "Biometric Enrollment",
        description: "Your fingerprints and photo will be captured",
        substeps: ["Fingerprint scanning", "Digital photograph"],
      },
      {
        title: "Receive Receipt",
        description: "Get acknowledgment receipt with tracking number",
        substeps: ["Keep receipt safe", "Note down the reference number"],
      },
      {
        title: "Collect Voter ID",
        description: "Return after 2-3 weeks to collect your voter ID card",
        substeps: ["Bring receipt", "Verify details on card"],
      },
    ],
  },
  "citizenship": {
    title: "Citizenship Certificate",
    description: "Apply for or renew your Nepali citizenship certificate",
    duration: "3-4 weeks",
    difficulty: "Medium",
    office: "District Administration Office",
    fee: "NPR 100-500",
    eligibility: [
      "Born in Nepal to Nepali parents",
      "Or naturalized citizen meeting residency requirements",
    ],
    documents: [
      "Birth certificate",
      "Parents' citizenship certificates",
      "Proof of residence",
      "Recent passport-size photos (3 copies)",
      "Marriage certificate (if applicable)",
    ],
    steps: [
      {
        title: "Document Preparation",
        description: "Collect all necessary documents",
        substeps: ["Birth certificate", "Parents' citizenship", "Residence proof"],
      },
      {
        title: "Visit DAO",
        description: "Go to District Administration Office",
        substeps: ["Check timings", "Take token/queue number"],
      },
      {
        title: "Submit Application",
        description: "Fill and submit citizenship application form",
        substeps: ["Complete form accurately", "Attach all documents"],
      },
      {
        title: "Verification Process",
        description: "Office will verify your documents",
        substeps: ["May take 2-3 weeks", "Keep receipt safe"],
      },
      {
        title: "Collect Certificate",
        description: "Return to collect your citizenship certificate",
        substeps: ["Bring receipt", "Verify printed details"],
      },
    ],
  },
  "passport": {
    title: "Passport Application",
    description: "Complete guide to applying for a Nepali passport",
    duration: "1-2 weeks",
    difficulty: "Medium",
    office: "Department of Passports",
    fee: "NPR 5,000 (normal) / NPR 10,000 (urgent)",
    eligibility: [
      "Must be a Nepali citizen",
      "Must have citizenship certificate",
    ],
    documents: [
      "Citizenship certificate (original and photocopy)",
      "Recent passport-size photo (2 copies)",
      "Previous passport (if renewal)",
      "Online application confirmation",
    ],
    steps: [
      {
        title: "Online Registration",
        description: "Visit passport.gov.np and create account",
        substeps: ["Fill personal details", "Upload photo", "Print application form"],
      },
      {
        title: "Prepare Documents",
        description: "Gather all required documents",
        substeps: ["Citizenship certificate copies", "Passport photos", "Application printout"],
      },
      {
        title: "Payment",
        description: "Pay passport fee at designated bank",
        substeps: ["Visit authorized bank", "Keep payment receipt"],
      },
      {
        title: "Visit Passport Office",
        description: "Go to Department of Passports with documents",
        substeps: ["Bring all documents", "Biometric enrollment"],
      },
      {
        title: "Verification",
        description: "Documents will be verified",
        substeps: ["May take few days", "Track status online"],
      },
      {
        title: "Collect Passport",
        description: "Pick up passport or opt for delivery",
        substeps: ["Bring receipt", "Verify passport details"],
      },
    ],
  },
};

export default function ServiceDetail() {
  const { serviceId } = useParams();
  const service = serviceData[serviceId || ""];

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="mb-4 text-3xl font-bold">Service Not Found</h1>
          <Link to="/services">
            <Button>Back to Services</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <Link to="/services">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">{service.title}</h1>
          <p className="mb-6 text-lg text-muted-foreground">{service.description}</p>
          
          <div className="flex flex-wrap gap-4">
            <Badge variant="outline" className="gap-2">
              <Clock className="h-4 w-4" />
              {service.duration}
            </Badge>
            <Badge variant="outline" className="gap-2">
              <MapPin className="h-4 w-4" />
              {service.office}
            </Badge>
            <Badge variant="outline" className="gap-2">
              <Banknote className="h-4 w-4" />
              {service.fee}
            </Badge>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Eligibility Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.eligibility.map((req: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Required Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.documents.map((doc: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <FileText className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Step-by-Step Process</CardTitle>
                <CardDescription>Follow these steps to complete your application</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {service.steps.map((step: any, idx: number) => (
                    <div key={idx} className="relative pl-8">
                      <div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        {idx + 1}
                      </div>
                      {idx < service.steps.length - 1 && (
                        <div className="absolute left-3 top-6 h-full w-px bg-border" />
                      )}
                      <div className="pb-6">
                        <h3 className="mb-2 font-semibold">{step.title}</h3>
                        <p className="mb-3 text-sm text-muted-foreground">{step.description}</p>
                        <ul className="space-y-1">
                          {step.substeps.map((substep: string, subIdx: number) => (
                            <li key={subIdx} className="flex items-center gap-2 text-sm">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                              {substep}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to={`/apply/${serviceId}`}>
                  <Button className="w-full gap-2">
                    <Upload className="h-4 w-4" />
                    Apply with Smart Form
                  </Button>
                </Link>
                <Link to="/chat">
                  <Button variant="outline" className="w-full">
                    Ask AI Assistant
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> Make sure to verify all information and bring original documents along with photocopies when visiting the office.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Office Locations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="mb-1 font-medium">District Administration Office</p>
                  <p className="text-sm text-muted-foreground">Kathmandu, Lalitpur, Bhaktapur</p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium">Office Hours</p>
                  <p className="text-sm text-muted-foreground">Sunday - Friday: 10 AM - 5 PM</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
