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
  Camera,
  AlertCircle,
  Info
} from "lucide-react";

// API Configuration
const API_BASE_URL = "http://localhost:8000";

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

interface OCRResponse {
  text: string;
  extracted_fields: Record<string, string>;
  language?: string;
  confidence?: number;
}

export default function Apply() {
  const { serviceId } = useParams();
  const { toast } = useToast();
  const service = serviceData[serviceId || ""];

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, File>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [ocrComplete, setOcrComplete] = useState(false);
  const [extractedText, setExtractedText] = useState<string>("");
  const [ocrConfidence, setOcrConfidence] = useState<number>(0);
  const [extractedFieldsCount, setExtractedFieldsCount] = useState<number>(0);

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
    
    // Only process OCR for citizenship/birth certificates
    if (docType === "Citizenship Certificate" || docType === "Birth Certificate" || docType === "Parents' Citizenship") {
      setIsProcessing(true);
      setProcessingProgress(10);
      
      try {
        // Create FormData for file upload
        const formDataToSend = new FormData();
        formDataToSend.append('file', file);

        setProcessingProgress(30);
        
        toast({
          title: "Processing Document",
          description: "Extracting text from citizenship certificate...",
        });

        // Call backend OCR endpoint
        const response = await fetch(`${API_BASE_URL}/api/ocr/upload`, {
          method: 'POST',
          body: formDataToSend,
        });

        setProcessingProgress(60);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || 'OCR processing failed');
        }

        const ocrData: OCRResponse = await response.json();

        setProcessingProgress(80);

        if (!ocrData.text || ocrData.text.trim() === "") {
          throw new Error("No text detected in the document. Please ensure the image is clear and readable.");
        }

        setExtractedText(ocrData.text);
        setOcrConfidence(ocrData.confidence || 0);

        // Use backend-extracted structured fields directly
        if (ocrData.extracted_fields && Object.keys(ocrData.extracted_fields).length > 0) {
          setFormData(prev => ({ ...prev, ...ocrData.extracted_fields }));
          setExtractedFieldsCount(Object.keys(ocrData.extracted_fields).length);
          
          // Log extracted fields for debugging
          console.log("Backend extracted fields:", ocrData.extracted_fields);
          
          setOcrComplete(true);
          setProcessingProgress(100);
          
          toast({
            title: "✅ Document Scanned Successfully!",
            description: `Auto-filled ${Object.keys(ocrData.extracted_fields).length} fields with ${ocrData.confidence?.toFixed(1)}% confidence. Please review the data.`,
          });
        } else {
          // Even if no structured fields, show the raw text
          setOcrComplete(true);
          setProcessingProgress(100);
          
          toast({
            title: "Document Scanned",
            description: "Text extracted but couldn't identify specific fields. Please fill the form manually.",
            variant: "destructive",
          });
        }

      } catch (error) {
        console.error('OCR Error:', error);
        toast({
          title: "❌ Error Processing Document",
          description: error instanceof Error ? error.message : "Could not extract text from document. Please try again or fill manually.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
        setTimeout(() => setProcessingProgress(0), 1000);
      }
    } else {
      toast({
        title: "Document Uploaded",
        description: `${docType} uploaded successfully.`,
      });
    }
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

    // Log submitted data for debugging
    console.log("Submitted Form Data:", formData);
    console.log("Uploaded Documents:", Object.keys(uploadedDocs));
  };

  const getFieldHighlight = (fieldName: string) => {
    return formData[fieldName] && ocrComplete ? "border-green-500 bg-green-50" : "";
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
                      {(doc.includes("Citizenship") || doc.includes("Birth")) && (
                        <span className="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">
                          🤖 Smart OCR - Auto-fills form
                        </span>
                      )}
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
                      disabled={isProcessing}
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
                  <div className="space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <div>
                        <p className="text-sm font-medium">Processing with AI-powered OCR...</p>
                        <p className="text-xs text-muted-foreground">
                          Extracting citizenship details from the document
                        </p>
                      </div>
                    </div>
                    <Progress value={processingProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {processingProgress < 30 && "Uploading document..."}
                      {processingProgress >= 30 && processingProgress < 60 && "Preprocessing image..."}
                      {processingProgress >= 60 && processingProgress < 80 && "Extracting text..."}
                      {processingProgress >= 80 && "Parsing data fields..."}
                    </p>
                  </div>
                )}

                {ocrComplete && extractedText && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <strong className="text-green-900">✅ OCR Processing Complete!</strong>
                          <span className="text-xs text-green-700">
                            {ocrConfidence.toFixed(1)}% confidence
                          </span>
                        </div>
                        <p className="text-sm text-green-800">
                          Successfully extracted <strong>{extractedFieldsCount} fields</strong> from the citizenship certificate.
                          Green-highlighted fields below were auto-filled.
                        </p>
                        <details className="mt-2">
                          <summary className="cursor-pointer text-xs text-green-700 hover:text-green-900">
                            📄 View raw extracted text ({extractedText.length} characters)
                          </summary>
                          <pre className="mt-2 max-h-40 overflow-auto rounded border border-green-200 bg-white p-2 text-xs text-gray-700">
                            {extractedText}
                          </pre>
                        </details>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/30 bg-gradient-to-b from-background to-primary/5">
              <CardHeader className="border-b-2 border-primary/20 bg-primary/10">
                <div className="text-center">
                  <div className="mb-2 flex items-center justify-center gap-2">
                    <img src="/placeholder.svg" alt="Nepal Flag" className="h-8 w-8" />
                    <h2 className="text-xl font-bold">नेपाल सरकार / Government of Nepal</h2>
                  </div>
                  <p className="text-sm font-medium">{service.title}</p>
                  {ocrComplete && (
                    <p className="mt-1 text-xs text-green-600">
                      ✨ {extractedFieldsCount} fields auto-filled from document
                    </p>
                  )}
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
                          {formData[field.name] && ocrComplete && (
                            <span className="ml-2 text-xs text-green-600">✓ Auto-filled</span>
                          )}
                        </Label>
                        {field.type === 'textarea' ? (
                          <Textarea
                            id={field.name}
                            value={formData[field.name] || ""}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            required={field.required}
                            className={`mt-2 border-primary/30 bg-background/50 transition-all ${getFieldHighlight(field.name)}`}
                          />
                        ) : (
                          <Input
                            id={field.name}
                            type={field.type}
                            value={formData[field.name] || ""}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            required={field.required}
                            className={`mt-2 border-primary/30 bg-background/50 transition-all ${getFieldHighlight(field.name)}`}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {ocrComplete && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        Please review all auto-filled fields carefully. Edit any incorrect information before submitting.
                      </AlertDescription>
                    </Alert>
                  )}

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
                <strong>🤖 AI-Powered OCR:</strong> Upload your citizenship certificate and our backend AI will automatically detect and extract all details including:
                <ul className="ml-4 mt-2 list-disc text-xs">
                  <li>Full Name</li>
                  <li>Citizenship Number</li>
                  <li>Date of Birth</li>
                  <li>District & Municipality</li>
                  <li>Ward Number</li>
                  <li>And more...</li>
                </ul>
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
                <p>• Ensure documents are clear and well-lit</p>
                <p>• Backend OCR uses Tesseract AI</p>
                <p>• Supports English + Nepali text</p>
                <p>• Review auto-filled data carefully</p>
                <p>• Accepted: PNG, JPG, JPEG, TIFF</p>
              </CardContent>
            </Card>

            {ocrComplete && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-base text-green-900">OCR Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700">Confidence:</span>
                    <strong className="text-green-900">{ocrConfidence.toFixed(1)}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Fields Extracted:</span>
                    <strong className="text-green-900">{extractedFieldsCount}</strong>
                  </div>
                  <div className="mt-3 rounded bg-white p-2 text-xs">
                    {ocrConfidence > 85 ? (
                      <p className="text-green-700">✅ High accuracy - Data should be reliable</p>
                    ) : ocrConfidence > 70 ? (
                      <p className="text-yellow-700">⚠️ Good accuracy - Please verify data</p>
                    ) : (
                      <p className="text-orange-700">⚠️ Lower accuracy - Review all fields carefully</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}