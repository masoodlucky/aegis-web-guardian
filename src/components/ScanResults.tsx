import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  Download, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Database,
  Bug,
  Globe,
  Search,
  Lock,
  BarChart3
} from "lucide-react";
import SeverityFilter from "./SeverityFilter";
import SubdomainResults from "./SubdomainResults";
import CrawledUrlResults from "./CrawledUrlResults";
import { useState, useEffect } from "react";

const ScanResults = ({ results, onRescan }) => {
  if (!results) {
    return (
      <Card className="bg-gray-50">
        <CardContent className="p-8 text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No scan results available</h3>
          <p className="text-gray-500">Run a security scan to see detailed vulnerability reports here.</p>
        </CardContent>
      </Card>
    );
  }

  const vulnerabilities = results.results?.vulnerabilities || results.vulnerabilities || [];
  const scanSummary = results.results?.scan_summary || results.scan_summary || {};
  
  // Process vulnerabilities for filtering
  const processedVulnerabilities = vulnerabilities.map((vuln, index) => ({
    id: index,
    type: vuln.type || 'Unknown',
    severity: vuln.severity || 'Medium',
    description: vuln.description || vuln.details || 'No description available',
    parameter: vuln.parameter || 'N/A',
    url: vuln.url || results.targetUrl || 'N/A',
    payload: vuln.payload || 'N/A'
  }));

  // Count vulnerabilities by severity
  const severityCounts = processedVulnerabilities.reduce((acc, vuln) => {
    acc[vuln.severity] = (acc[vuln.severity] || 0) + 1;
    return acc;
  }, {});

  // Advanced scan results
  const subdomains = results.subdomains || [];
  const crawledUrls = results.crawledUrls || [];
  const authResults = results.authResults || null;
  const advancedConfig = results.advancedConfig || {};

  const [selectedSeverities, setSelectedSeverities] = useState(['Critical', 'High', 'Medium', 'Low']);
  const [filteredVulnerabilities, setFilteredVulnerabilities] = useState(processedVulnerabilities);

  useEffect(() => {
    const filtered = processedVulnerabilities.filter(vuln => 
      selectedSeverities.includes(vuln.severity)
    );
    setFilteredVulnerabilities(filtered);
  }, [selectedSeverities, processedVulnerabilities]);

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'text-red-800 bg-red-100 border-red-200';
      case 'high': return 'text-orange-800 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-800 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-800 bg-green-100 border-green-200';
      default: return 'text-gray-800 bg-gray-100 border-gray-200';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
        return <Shield className="h-4 w-4" />;
      case 'low':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'sql injection':
      case 'sqli':
        return <Database className="h-4 w-4 text-red-500" />;
      case 'xss':
      case 'cross-site scripting':
        return <Bug className="h-4 w-4 text-orange-500" />;
      case 'csrf':
      case 'cross-site request forgery':
        return <Shield className="h-4 w-4 text-purple-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleRescan = () => {
    if (onRescan) {
      const rescanConfig = {
        targetUrl: results.targetUrl,
        selectedScanTypes: results.selectedScanTypes || ['sqli'],
        selectedReportFormats: results.selectedReportFormats || ['json'],
        advancedConfig: results.advancedConfig || {}
      };
      onRescan(rescanConfig);
    }
  };

  const downloadReport = (format) => {
    const reportData = {
      scan_summary: scanSummary,
      vulnerabilities: processedVulnerabilities,
      timestamp: new Date().toISOString(),
      target: results.targetUrl,
      subdomains: subdomains,
      crawledUrls: crawledUrls,
      authResults: authResults
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: format === 'json' ? 'application/json' : 'text/plain'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aegisscan_report_${Date.now()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Scan Summary */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Advanced Scan Results Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-900">{processedVulnerabilities.length}</p>
              <p className="text-sm text-blue-700">Vulnerabilities</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Globe className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-900">{subdomains.length}</p>
              <p className="text-sm text-green-700">Subdomains</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Search className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-900">{crawledUrls.length}</p>
              <p className="text-sm text-purple-700">Crawled URLs</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-900">{results.duration || '0s'}</p>
              <p className="text-sm text-orange-700">Scan Duration</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleRescan} variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              Rescan Target
            </Button>
            <Button onClick={() => downloadReport('json')} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download JSON
            </Button>
            <Button onClick={() => downloadReport('html')} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download HTML
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Tabs */}
      <Tabs defaultValue="vulnerabilities" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
          <TabsTrigger value="vulnerabilities" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Vulnerabilities
          </TabsTrigger>
          <TabsTrigger value="subdomains" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Subdomains
          </TabsTrigger>
          <TabsTrigger value="crawled" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Crawled URLs
          </TabsTrigger>
          <TabsTrigger value="auth" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Authentication
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vulnerabilities" className="mt-6">
          <div className="space-y-6">
            {processedVulnerabilities.length > 0 && (
              <SeverityFilter
                selectedSeverities={selectedSeverities}
                onSeverityChange={setSelectedSeverities}
                vulnerabilityCounts={severityCounts}
              />
            )}

            {filteredVulnerabilities.length > 0 ? (
              <div className="space-y-4">
                {filteredVulnerabilities.map((vuln) => (
                  <Card key={vuln.id} className="bg-white shadow-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(vuln.type)}
                          <CardTitle className="text-lg">{vuln.type}</CardTitle>
                        </div>
                        <Badge className={getSeverityColor(vuln.severity)}>
                          {getSeverityIcon(vuln.severity)}
                          {vuln.severity}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-gray-700">{vuln.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-600">Parameter:</span>
                            <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded">{vuln.parameter}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">URL:</span>
                            <span className="ml-2 text-blue-600 break-all">{vuln.url}</span>
                          </div>
                        </div>
                        
                        {vuln.payload !== 'N/A' && (
                          <div className="text-sm">
                            <span className="font-medium text-gray-600">Payload:</span>
                            <code className="ml-2 bg-red-50 text-red-800 px-2 py-1 rounded text-xs break-all">
                              {vuln.payload}
                            </code>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-green-50">
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-800 mb-2">No Vulnerabilities Found</h3>
                  <p className="text-green-600">The target appears to be secure against the tested attack vectors.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="subdomains" className="mt-6">
          <SubdomainResults 
            subdomains={subdomains}
            onScanSubdomain={(subdomain) => {
              if (onRescan) {
                onRescan({
                  targetUrl: `https://${subdomain}`,
                  selectedScanTypes: results.selectedScanTypes || ['sqli'],
                  selectedReportFormats: ['json']
                });
              }
            }}
          />
        </TabsContent>

        <TabsContent value="crawled" className="mt-6">
          <CrawledUrlResults 
            urls={crawledUrls}
            onScanUrl={(url) => {
              if (onRescan) {
                onRescan({
                  targetUrl: url,
                  selectedScanTypes: results.selectedScanTypes || ['sqli'],
                  selectedReportFormats: ['json']
                });
              }
            }}
          />
        </TabsContent>

        <TabsContent value="auth" className="mt-6">
          {authResults ? (
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-orange-600" />
                  Authentication Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium text-gray-600">Login Status:</span>
                      <Badge className={authResults.success ? 'bg-green-100 text-green-800 ml-2' : 'bg-red-100 text-red-800 ml-2'}>
                        {authResults.success ? 'Success' : 'Failed'}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Pages Scanned:</span>
                      <span className="ml-2 font-mono">{authResults.pagesScanned || 0}</span>
                    </div>
                  </div>
                  
                  {authResults.message && (
                    <div>
                      <span className="font-medium text-gray-600">Details:</span>
                      <p className="mt-1 text-gray-700">{authResults.message}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gray-50">
              <CardContent className="p-8 text-center">
                <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Authentication Data</h3>
                <p className="text-gray-500">Authentication scanning was not enabled for this scan.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScanResults;
