
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Globe, Shield, Zap, FileText, Settings } from "lucide-react";

const ScanForm = ({ onScanStart }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    targetUrl: "",
    scanTypes: {
      sqli: true,
      xss: true,
      csrf: false
    },
    reportFormats: {
      json: true,
      txt: false,
      html: false
    },
    scanDepth: "medium",
    timeout: 300,
    userAgent: "",
    customHeaders: "",
    threads: 1
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
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }

    const selectedScanTypes = Object.entries(formData.scanTypes)
      .filter(([_, selected]) => selected)
      .map(([type, _]) => type);

    if (selectedScanTypes.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one scan type",
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
        selectedScanTypes,
        selectedReportFormats
      };

      toast({
        title: "Scan Started",
        description: `Scanning ${formData.targetUrl} for vulnerabilities...`
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

  const handleScanTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      scanTypes: {
        ...prev.scanTypes,
        [type]: !prev.scanTypes[type]
      }
    }));
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
            <Globe className="h-5 w-5 text-blue-600" />
            Target Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="targetUrl">Target URL *</Label>
              <Input
                id="targetUrl"
                type="url"
                placeholder="https://example.com"
                value={formData.targetUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, targetUrl: e.target.value }))}
                className="text-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Scan Types */}
              <Card className="border-2 border-gray-100">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-4 w-4 text-green-600" />
                    Scan Types
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sqli"
                      checked={formData.scanTypes.sqli}
                      onCheckedChange={() => handleScanTypeChange('sqli')}
                    />
                    <Label htmlFor="sqli" className="text-sm font-medium">
                      SQL Injection (SQLi)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="xss"
                      checked={formData.scanTypes.xss}
                      onCheckedChange={() => handleScanTypeChange('xss')}
                    />
                    <Label htmlFor="xss" className="text-sm font-medium">
                      Cross-Site Scripting (XSS)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="csrf"
                      checked={formData.scanTypes.csrf}
                      onCheckedChange={() => handleScanTypeChange('csrf')}
                    />
                    <Label htmlFor="csrf" className="text-sm font-medium">
                      Cross-Site Request Forgery (CSRF)
                    </Label>
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
                      JSON
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="txt"
                      checked={formData.reportFormats.txt}
                      onCheckedChange={() => handleReportFormatChange('txt')}
                    />
                    <Label htmlFor="txt" className="text-sm font-medium">
                      Text (TXT)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="html"
                      checked={formData.reportFormats.html}
                      onCheckedChange={() => handleReportFormatChange('html')}
                    />
                    <Label htmlFor="html" className="text-sm font-medium">
                      HTML
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
                  Advanced Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scanDepth">Scan Depth</Label>
                    <Select value={formData.scanDepth} onValueChange={(value) => setFormData(prev => ({ ...prev, scanDepth: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="deep">Deep</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeout">Timeout (seconds)</Label>
                    <Input
                      id="timeout"
                      type="number"
                      min="60"
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
                      max="10"
                      value={formData.threads}
                      onChange={(e) => setFormData(prev => ({ ...prev, threads: parseInt(e.target.value) || 1 }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userAgent">Custom User Agent (Optional)</Label>
                  <Input
                    id="userAgent"
                    placeholder="Mozilla/5.0 (Windows NT 10.0; Win64; x64)..."
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Zap className="mr-2 h-5 w-5 animate-spin" />
                  Starting Scan...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-5 w-5" />
                  Start Security Scan
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScanForm;
