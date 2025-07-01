
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Globe, Database, Target, FileText, Settings } from "lucide-react";

const ScanForm = ({ onScanStart }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    targetUrl: "",
    scanTypes: {
      sqli: true,
      xss: false,
      csrf: false
    },
    reportFormats: {
      json: true,
      txt: false,
      html: false
    },
    scanDepth: 3,
    riskLevel: 1,
    timeout: 300,
    userAgent: "",
    customHeaders: "",
    threads: 10
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.targetUrl) {
      toast({
        title: "Error",
        description: "Please enter a target URL",
        variant: "destructive"
      });
      return;
    }

    if (!validateUrl(formData.targetUrl)) {
      toast({
        title: "Error",
        description: "Please enter a valid URL (include http:// or https://)",
        variant: "destructive"
      });
      return;
    }

    // For SQL injection scanning, we need at least SQLi selected
    if (!formData.scanTypes.sqli) {
      toast({
        title: "Error",
        description: "SQL Injection scan type must be selected",
        variant: "destructive"
      });
      return;
    }

    const selectedReportFormats = Object.entries(formData.reportFormats)
      .filter(([_, selected]) => selected)
      .map(([format, _]) => format);

    if (selectedReportFormats.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one report format",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const scanConfig = {
        ...formData,
        selectedScanTypes: ['sqli'], // Focus on SQL injection
        selectedReportFormats
      };

      toast({
        title: "SQL Injection Scan Started",
        description: `Scanning ${formData.targetUrl} for SQL injection vulnerabilities...`
      });

      onScanStart(scanConfig);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start scan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReportFormatChange = (format) => {
    setFormData(prev => ({
      ...prev,
      reportFormats: {
        ...prev.reportFormats,
        [format]: !prev.reportFormats[format]
      }
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-red-600" />
            SQL Injection Scanner Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="targetUrl">Target URL *</Label>
              <Input
                id="targetUrl"
                type="url"
                placeholder="https://example.com/vulnerable-page?id=1"
                value={formData.targetUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, targetUrl: e.target.value }))}
                className="text-lg"
              />
              <p className="text-sm text-gray-500">
                Include parameters in the URL for better injection point detection
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* SQL Injection Settings */}
              <Card className="border-2 border-red-100">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Database className="h-4 w-4 text-red-600" />
                    SQL Injection Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sqli"
                      checked={formData.scanTypes.sqli}
                      disabled={true} // Always enabled for SQL scanner
                    />
                    <Label htmlFor="sqli" className="text-sm font-medium">
                      SQL Injection Testing (Required)
                    </Label>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="scanDepth">Scan Level (1-5)</Label>
                    <Select 
                      value={String(formData.scanDepth)} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, scanDepth: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Level 1 - Basic</SelectItem>
                        <SelectItem value="2">Level 2 - Cookie</SelectItem>
                        <SelectItem value="3">Level 3 - User-Agent/Referer</SelectItem>
                        <SelectItem value="4">Level 4 - Extensive</SelectItem>
                        <SelectItem value="5">Level 5 - Maximum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="riskLevel">Risk Level (1-3)</Label>
                    <Select 
                      value={String(formData.riskLevel)} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, riskLevel: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Risk 1 - Safe</SelectItem>
                        <SelectItem value="2">Risk 2 - Medium</SelectItem>
                        <SelectItem value="3">Risk 3 - Aggressive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Report Formats */}
              <Card className="border-2 border-gray-100">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-4 w-4 text-purple-600" />
                    Report Formats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="json"
                      checked={formData.reportFormats.json}
                      onCheckedChange={() => handleReportFormatChange('json')}
                    />
                    <Label htmlFor="json" className="text-sm font-medium">
                      JSON (Structured data)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="txt"
                      checked={formData.reportFormats.txt}
                      onCheckedChange={() => handleReportFormatChange('txt')}
                    />
                    <Label htmlFor="txt" className="text-sm font-medium">
                      Text (Human readable)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="html"
                      checked={formData.reportFormats.html}
                      onCheckedChange={() => handleReportFormatChange('html')}
                    />
                    <Label htmlFor="html" className="text-sm font-medium">
                      HTML (Web report)
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Advanced Settings */}
            <Card className="border-2 border-gray-100">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="h-4 w-4 text-orange-600" />
                  Advanced SQLMap Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timeout">Timeout (seconds)</Label>
                    <Input
                      id="timeout"
                      type="number"
                      min="30"
                      max="3600"
                      value={formData.timeout}
                      onChange={(e) => setFormData(prev => ({ ...prev, timeout: parseInt(e.target.value) || 300 }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="threads">Threads</Label>
                    <Input
                      id="threads"
                      type="number"
                      min="1"
                      max="20"
                      value={formData.threads}
                      onChange={(e) => setFormData(prev => ({ ...prev, threads: parseInt(e.target.value) || 10 }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userAgent">Custom User Agent (Optional)</Label>
                  <Input
                    id="userAgent"
                    placeholder="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                    value={formData.userAgent}
                    onChange={(e) => setFormData(prev => ({ ...prev, userAgent: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customHeaders">Custom Headers (Optional)</Label>
                  <Textarea
                    id="customHeaders"
                    placeholder="Authorization: Bearer token&#10;X-Custom-Header: value"
                    value={formData.customHeaders}
                    onChange={(e) => setFormData(prev => ({ ...prev, customHeaders: e.target.value }))}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Target className="mr-2 h-5 w-5 animate-spin" />
                  Starting SQL Injection Scan...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-5 w-5" />
                  Start SQL Injection Scan
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* SQLMap Installation Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Database className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">SQLMap Requirements</h4>
              <p className="text-sm text-blue-700">
                Make sure SQLMap is installed and accessible in your system PATH. 
                Install with: <code className="bg-blue-100 px-1 rounded">pip install sqlmap</code>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScanForm;
