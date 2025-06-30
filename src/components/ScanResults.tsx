
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Shield, 
  Clock,
  RefreshCw,
  ExternalLink
} from "lucide-react";

const ScanResults = ({ results, onRescan }) => {
  const { toast } = useToast();

  if (!results) {
    return (
      <Card className="bg-white shadow-sm">
        <CardContent className="p-12 text-center">
          <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No scan results available</h3>
          <p className="text-gray-500 mb-4">Start a new scan to see vulnerability assessment results</p>
        </CardContent>
      </Card>
    );
  }

  const handleDownload = (reportFile) => {
    // Simulate file download
    toast({
      title: "Download Started",
      description: `Downloading ${reportFile.filename}...`
    });
    
    // In a real implementation, this would trigger a download from your backend
    const element = document.createElement('a');
    element.href = `data:text/plain;charset=utf-8,${encodeURIComponent(`AegisScan Report - ${reportFile.format}\n\nTarget: ${results.targetUrl}\nScan Date: ${results.startTime}\n\nVulnerabilities Found: ${results.results?.vulnerabilities?.length || 0}\n\n${results.results?.vulnerabilities?.map(v => `${v.type}: ${v.description}`).join('\n') || 'No vulnerabilities detected'}`)}`;
    element.download = reportFile.filename;
    element.click();
  };

  const handleRescan = () => {
    if (onRescan) {
      onRescan({
        targetUrl: results.targetUrl,
        selectedScanTypes: results.selectedScanTypes,
        selectedReportFormats: results.selectedReportFormats
      });
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Shield className="h-4 w-4 text-gray-600" />;
    }
  };

  const vulnerabilities = results.results?.vulnerabilities || [];
  const reportFiles = results.results?.reportFiles || [];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vulnerabilities</p>
                <p className="text-2xl font-bold text-red-600">{vulnerabilities.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scan Time</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.floor((results.endTime - results.startTime) / 1000)}s
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Endpoints</p>
                <p className="text-2xl font-bold text-green-600">{results.results?.testedEndpoints || 0}</p>
              </div>
              <ExternalLink className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reports</p>
                <p className="text-2xl font-bold text-purple-600">{reportFiles.length}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Results */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Scan Results for {results.targetUrl}
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                Completed: {new Date(results.endTime).toLocaleString()}
              </Badge>
              <Button onClick={handleRescan} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-1" />
                Rescan
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="vulnerabilities" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="vulnerabilities" className="mt-6">
              {vulnerabilities.length > 0 ? (
                <div className="space-y-4">
                  {vulnerabilities.map((vulnerability, index) => (
                    <Card key={index} className="border-l-4 border-l-red-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              {getSeverityIcon(vulnerability.severity)}
                              <h4 className="font-semibold text-gray-900">{vulnerability.type}</h4>
                              <Badge className={getSeverityColor(vulnerability.severity)}>
                                {vulnerability.severity}
                              </Badge>
                            </div>
                            <p className="text-gray-600">{vulnerability.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>URL: {vulnerability.url}</span>
                              {vulnerability.parameter && (
                                <span>Parameter: {vulnerability.parameter}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-600 mb-2">No Vulnerabilities Found</h3>
                  <p className="text-gray-600">Great! No security issues were detected in this scan.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="reports" className="mt-6">
              <div className="space-y-4">
                {reportFiles.map((file, index) => (
                  <Card key={index} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-blue-600" />
                          <div>
                            <h4 className="font-semibold text-gray-900">{file.filename}</h4>
                            <p className="text-sm text-gray-600">
                              {file.format} Report • {file.size}
                            </p>
                          </div>
                        </div>
                        <Button 
                          onClick={() => handleDownload(file)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScanResults;
