import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  CheckCircle2,
  Loader2,
  Camera
} from "lucide-react";
import Tesseract from "tesseract.js";

const serviceData: Record<string, any> = {
  "voter-id": {
    title: "Voter ID Registration Form",
    documents: ["Citizenship Certificate", "Passport Photo", "Proof of Residence"],
    fields: [
      { name: "fullName", label: "Full Name (नाम थर)", type: "text", required: true },
      { name: "citizenship", label: "Citizenship Number (नागरिकता नं.)", type: "text", required: true },
      { name: "dateOfBirth", label: "Date of Birth (जन्म मिति)", type: "date", required: true },
      { name: "fatherName", label: "Father's Name (बाबुको नाम)", type: "text", required: true },
      { name: "motherName", label: "Mother's Name (आमाको नाम)", type: "text", required: true },
      { name: "province", label: "Province (प्रदेश)", type: "text", required: true },
      { name: "district", label: "District (जिल्ला)", type: "text", required: true },
      { name: "municipality", label: "Municipality (नगरपालिका)", type: "text", required: true },
      { name: "ward", label: "Ward No. (वडा नं.)", type: "text", required: true },
      { name: "tole", label: "Tole/Village (टोल)", type: "text", required: true },
      { name: "phone", label: "Phone Number (फोन नं.)", type: "tel", required: true },
    ]
  },
  "citizenship": {
    title: "Citizenship Certificate Application Form",
    documents: ["Birth Certificate", "Parents' Citizenship", "Proof of Residence"],
    fields: [
      { name: "fullName", label: "Full Name (नाम थर)", type: "text", required: true },
      { name: "dateOfBirth", label: "Date of Birth (जन्म मिति)", type: "date", required: true },
      { name: "birthPlace", label: "Birth Place (जन्म स्थान)", type: "text", required: true },
      { name: "fatherName", label: "Father's Name (बाबुको नाम)", type: "text", required: true },
      { name: "fatherCitizenship", label: "Father's Citizenship No.", type: "text", required: true },
      { name: "motherName", label: "Mother's Name (आमाको नाम)", type: "text", required: true },
      { name: "motherCitizenship", label: "Mother's Citizenship No.", type: "text", required: true },
      { name: "province", label: "Province (प्रदेश)", type: "text", required: true },
      { name: "district", label: "District (जिल्ला)", type: "text", required: true },
      { name: "municipality", label: "Municipality (नगरपालिका)", type: "text", required: true },
      { name: "ward", label: "Ward No. (वडा नं.)", type: "text", required: true },
      { name: "phone", label: "Phone Number (फोन नं.)", type: "tel", required: true },
    ]
  },
  "passport": {
    title: "Passport Application Form",
    documents: ["Citizenship Certificate", "Passport Photo"],
    fields: [
      { name: "fullName", label: "Full Name (नाम थर)", type: "text", required: true },
      { name: "citizenship", label: "Citizenship Number (नागरिकता नं.)", type: "text", required: true },
      { name: "dateOfBirth", label: "Date of Birth (जन्म मिति)", type: "date", required: true },
      { name: "fatherName", label: "Father's Name (बाबुको नाम)", type: "text", required: true },
      { name: "motherName", label: "Mother's Name (आमाको नाम)", type: "text", required: true },
      { name: "spouseName", label: "Spouse's Name (पति/पत्नीको नाम)", type: "text", required: false },
      { name: "province", label: "Province (प्रदेश)", type: "text", required: true },
      { name: "district", label: "District (जिल्ला)", type: "text", required: true },
      { name: "municipality", label: "Municipality (नगरपालिका)", type: "text", required: true },
      { name: "ward", label: "Ward No. (वडा नं.)", type: "text", required: true },
      { name: "phone", label: "Phone Number (फोन नं.)", type: "tel", required: true },
      { name: "email", label: "Email Address", type: "email", required: true },
    ]
  },
};

export default function Apply() {
  const { serviceId } = useParams();
  const { toast } = useToast();
  const service = serviceData[serviceId || ""];

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, File>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [ocrComplete, setOcrComplete] = useState(false);

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

  const handleFileUpload = async (docType: string, file: File) => {
    setUploadedDocs(prev => ({ ...prev, [docType]: file }));
    
    if (docType === "Citizenship Certificate" || docType === "Birth Certificate") {
      setIsProcessing(true);
      setProcessingProgress(0);
      
      try {
        const result = await Tesseract.recognize(
          file,
          'eng+nep',
          {
            logger: m => {
              if (m.status === 'recognizing text') {
                setProcessingProgress(Math.round(m.progress * 100));
              }
            }
          }
        );

        const text = result.data.text;
        const extractedData = extractDataFromOCR(text);
        
        setFormData(prev => ({ ...prev, ...extractedData }));
        setOcrComplete(true);
        
        toast({
          title: "Document Scanned Successfully",
          description: "Form has been auto-filled with extracted data. Please review and edit if needed.",
        });
      } catch (error) {
        console.error('OCR Error:', error);
        toast({
          title: "Error Processing Document",
          description: "Could not extract text from document. Please fill the form manually.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
        setProcessingProgress(0);
      }
    }
  };

  const extractDataFromOCR = (text: string): Record<string, string> => {
    const extracted: Record<string, string> = {};
    
    // Common patterns for Nepali documents
    const patterns = {
      fullName: /(?:name|नाम)[:\s]+([A-Za-z\s]+)/i,
      citizenship: /(?:citizenship|नागरिकता)[:\s]*(?:no|नं)[:\s]*(\d+[-\s]*\d*)/i,
      dateOfBirth: /(?:date of birth|जन्म मिति)[:\s]*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i,
      fatherName: /(?:father|बाबु)[:\s]*(?:name|नाम)?[:\s]*([A-Za-z\s]+)/i,
      motherName: /(?:mother|आमा)[:\s]*(?:name|नाम)?[:\s]*([A-Za-z\s]+)/i,
      district: /(?:district|जिल्ला)[:\s]*([A-Za-z\s]+)/i,
      phone: /(?:phone|mobile|फोन)[:\s]*(\d{10})/i,
    };

    for (const [key, pattern] of Object.entries(patterns)) {
      const match = text.match(pattern);
      if (match && match[1]) {
        extracted[key] = match[1].trim();
      }
    }

    return extracted;
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Application Submitted",
      description: "Your application has been submitted successfully. You will receive a confirmation shortly.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <Link to={`/service/${serviceId}`}>
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Service Details
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold md:text-4xl">{service.title}</h1>
          <p className="text-muted-foreground">Nepal Government Official Form</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {!ocrComplete && (
              <Card className="mb-8 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-primary" />
                    Upload Required Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {service.documents.map((doc: string, idx: number) => (
                    <div key={idx} className="space-y-2">
                      <Label htmlFor={`doc-${idx}`} className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {doc}
                        {idx === 0 && <span className="text-xs text-primary">(Will auto-fill form)</span>}
                      </Label>
                      <Input
                        id={`doc-${idx}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(doc, file);
                        }}
                        className="cursor-pointer"
                      />
                      {uploadedDocs[doc] && (
                        <p className="flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                          {uploadedDocs[doc].name}
                        </p>
                      )}
                    </div>
                  ))}

                  {isProcessing && (
                    <div className="space-y-2 rounded-lg border border-primary/20 bg-primary/5 p-4">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <p className="text-sm font-medium">Processing document with OCR...</p>
                      </div>
                      <Progress value={processingProgress} className="h-2" />
                      <p className="text-xs text-muted-foreground">{processingProgress}% complete</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card className="border-2 border-primary/30 bg-gradient-to-b from-background to-primary/5">
              <CardHeader className="border-b-2 border-primary/20 bg-primary/10">
                <div className="text-center">
                  <div className="mb-2 flex items-center justify-center gap-2">
                    <img src="/placeholder.svg" alt="Nepal Flag" className="h-8 w-8" />
                    <h2 className="text-xl font-bold">नेपाल सरकार / Government of Nepal</h2>
                  </div>
                  <p className="text-sm font-medium">{service.title}</p>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {service.fields.map((field: any, idx: number) => (
                      <div key={idx} className={field.name === 'phone' || field.name === 'email' ? 'md:col-span-2' : ''}>
                        <Label htmlFor={field.name} className="font-medium">
                          {field.label}
                          {field.required && <span className="text-destructive">*</span>}
                        </Label>
                        {field.type === 'textarea' ? (
                          <Textarea
                            id={field.name}
                            value={formData[field.name] || ""}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            required={field.required}
                            className="mt-2 border-primary/30 bg-background/50"
                          />
                        ) : (
                          <Input
                            id={field.name}
                            type={field.type}
                            value={formData[field.name] || ""}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            required={field.required}
                            className="mt-2 border-primary/30 bg-background/50"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-4">
                    <Label className="mb-2 block font-medium">Applicant's Declaration (आवेदकको घोषणा)</Label>
                    <Textarea
                      placeholder="I hereby declare that all the information provided above is true and correct to the best of my knowledge."
                      className="border-primary/30 bg-background/50"
                      rows={3}
                    />
                  </div>

                  <div className="flex flex-col gap-4 border-t-2 border-primary/20 pt-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label>Applicant's Signature (दस्तखत)</Label>
                        <div className="mt-2 h-24 rounded-lg border-2 border-dashed border-primary/30 bg-background/50 p-2">
                          <p className="text-center text-sm text-muted-foreground">Sign here</p>
                        </div>
                      </div>
                      <div>
                        <Label>Date (मिति)</Label>
                        <Input
                          type="date"
                          className="mt-2 border-primary/30 bg-background/50"
                          defaultValue={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full gap-2">
                      <FileText className="h-5 w-5" />
                      Submit Application
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Alert>
              <Camera className="h-4 w-4" />
              <AlertDescription>
                <strong>Smart OCR:</strong> Upload your citizenship certificate or birth certificate, and we'll automatically extract and fill the form details for you.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Document Checklist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {service.documents.map((doc: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    {uploadedDocs[doc] ? (
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600" />
                    ) : (
                      <div className="h-4 w-4 flex-shrink-0 rounded-full border-2 border-muted-foreground" />
                    )}
                    <span className="text-sm">{doc}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Important Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• All fields marked with * are mandatory</p>
                <p>• Ensure all documents are clear and readable</p>
                <p>• OCR works best with high-quality scans</p>
                <p>• Review auto-filled data before submission</p>
                <p>• Keep digital copies of all documents</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
