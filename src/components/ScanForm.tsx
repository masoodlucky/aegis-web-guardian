import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { Globe, Database, Target, FileText, Settings, Shield, Bug, ChevronDown, ChevronUp } from "lucide-react";
import AdvancedScanConfig from "./AdvancedScanConfig";

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

  const [advancedConfig, setAdvancedConfig] = useState({});
  const [showAdvancedConfig, setShowAdvancedConfig] = useState(false);
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
        selectedReportFormats,
        advancedConfig // Include advanced configuration
      };

      const scanTypeNames = {
        sqli: "SQL Injection",
        xss: "Cross-Site Scripting (XSS)",
        csrf: "Cross-Site Request Forgery (CSRF)"
      };

      const selectedNames = selectedScanTypes.map(type => scanTypeNames[type]).join(", ");
      
      // Enhanced toast message for advanced features
      let scanDescription = `Scanning ${formData.targetUrl} for ${selectedNames} vulnerabilities`;
      
      if (advancedConfig.enableSubdomainScan) {
        scanDescription += " with subdomain enumeration";
      }
      if (advancedConfig.enableCrawling) {
        scanDescription += " and website crawling";
      }
      if (advancedConfig.enableAuthentication) {
        scanDescription += " on authenticated pages";
      }

      toast({
        title: "Advanced Security Scan Started",
        description: scanDescription + "..."
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

  const handleScanTypeChange = (scanType) => {
    setFormData(prev => ({
      ...prev,
      scanTypes: {
        ...prev.scanTypes,
        [scanType]: !prev.scanTypes[scanType]
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
            <Shield className="h-5 w-5 text-blue-600" />
            AegisScan Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="targetUrl">Target URL *</Label>
              <Input
                id="targetUrl"
                type="url"
                placeholder="https://example.com/vulnerable-page"
                value={formData.targetUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, targetUrl: e.target.value }))}
                className="text-lg"
              />
              <p className="text-sm text-gray-500">
                Include parameters in the URL for better vulnerability detection
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-blue-100">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="h-4 w-4 text-blue-600" />
                    Vulnerability Scans
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sqli"
                      checked={formData.scanTypes.sqli}
                      onCheckedChange={() => handleScanTypeChange('sqli')}
                    />
                    <Label htmlFor="sqli" className="text-sm font-medium flex items-center gap-2">
                      <Database className="h-4 w-4 text-red-500" />
                      SQL Injection
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="xss"
                      checked={formData.scanTypes.xss}
                      onCheckedChange={() => handleScanTypeChange('xss')}
                    />
                    <Label htmlFor="xss" className="text-sm font-medium flex items-center gap-2">
                      <Bug className="h-4 w-4 text-orange-500" />
                      Cross-Site Scripting (XSS)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="csrf"
                      checked={formData.scanTypes.csrf}
                      onCheckedChange={() => handleScanTypeChange('csrf')}
                    />
                    <Label htmlFor="csrf" className="text-sm font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4 text-purple-500" />
                      Cross-Site Request Forgery (CSRF)
                    </Label>
                  </div>
                </CardContent>
              </Card>

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

            {/* Advanced Configuration Section */}
            <Collapsible open={showAdvancedConfig} onOpenChange={setShowAdvancedConfig}>
              <CollapsibleTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-between bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 hover:from-blue-100 hover:to-purple-100"
                >
                  <span className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-blue-600" />
                    Advanced Scan Features
                  </span>
                  {showAdvancedConfig ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <AdvancedScanConfig
                  onConfigChange={setAdvancedConfig}
                  initialConfig={advancedConfig}
                />
              </CollapsibleContent>
            </Collapsible>

            {formData.scanTypes.sqli && (
              <Card className="border-2 border-gray-100">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Settings className="h-4 w-4 text-orange-600" />
                    Advanced Settings (SQLMap)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            )}

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Target className="mr-2 h-5 w-5 animate-spin" />
                  Starting Advanced Security Scan...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-5 w-5" />
                  Start Advanced Vulnerability Scan
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Tool Requirements Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">AegisScan Advanced Requirements</h4>
              <p className="text-sm text-blue-700">
                SQLMap: <code className="bg-blue-100 px-1 rounded">pip install sqlmap</code> | 
                XSStrike: Download from GitHub | 
                Sublist3r: <code className="bg-blue-100 px-1 rounded">pip install sublist3r</code> | 
                CSRF: Built-in analyzer
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScanForm;
