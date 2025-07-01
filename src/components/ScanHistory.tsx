
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  History, 
  Download, 
  Eye, 
  RefreshCw, 
  Calendar, 
  AlertTriangle, 
  CheckCircle,
  Database,
  Bug,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HistoryScan {
  id: string;
  targetUrl: string;
  scanTypes: string[];
  timestamp: string;
  duration: string;
  vulnerabilities: number;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'None';
  status: 'completed' | 'failed' | 'interrupted';
}

interface ScanHistoryProps {
  scans: HistoryScan[];
  onRescan: (scanData: any) => void;
  onViewResults: (scanId: string) => void;
}

const ScanHistory = ({ scans, onRescan, onViewResults }: ScanHistoryProps) => {
  const { toast } = useToast();
  const [selectedScans, setSelectedScans] = useState<string[]>([]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      case 'None': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Critical':
      case 'High':
        return <AlertTriangle className="h-4 w-4" />;
      case 'Medium':
      case 'Low':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getScanTypeIcon = (scanType: string) => {
    switch (scanType.toLowerCase()) {
      case 'sqli':
      case 'sql injection':
        return <Database className="h-4 w-4 text-red-500" />;
      case 'xss':
      case 'cross-site scripting':
        return <Bug className="h-4 w-4 text-orange-500" />;
      case 'csrf':
        return <Shield className="h-4 w-4 text-purple-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleDownloadReport = (scan: HistoryScan) => {
    // Generate and download report
    const reportData = {
      scanId: scan.id,
      target: scan.targetUrl,
      timestamp: scan.timestamp,
      duration: scan.duration,
      scanTypes: scan.scanTypes,
      vulnerabilities: scan.vulnerabilities,
      severity: scan.severity,
      status: scan.status
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aegisscan_report_${scan.id}.json`;
    link.click();

    toast({
      title: "Report Downloaded",
      description: `Report for ${scan.targetUrl} has been downloaded.`
    });
  };

  const handleBulkDownload = () => {
    if (selectedScans.length === 0) {
      toast({
        title: "No Scans Selected",
        description: "Please select scans to download.",
        variant: "destructive"
      });
      return;
    }

    const selectedScanData = scans.filter(scan => selectedScans.includes(scan.id));
    const bulkData = {
      exportDate: new Date().toISOString(),
      totalScans: selectedScanData.length,
      scans: selectedScanData
    };

    const dataStr = JSON.stringify(bulkData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aegisscan_bulk_export_${Date.now()}.json`;
    link.click();

    toast({
      title: "Bulk Export Complete",
      description: `${selectedScans.length} scan reports have been exported.`
    });
  };

  const toggleScanSelection = (scanId: string) => {
    if (selectedScans.includes(scanId)) {
      setSelectedScans(selectedScans.filter(id => id !== scanId));
    } else {
      setSelectedScans([...selectedScans, scanId]);
    }
  };

  if (scans.length === 0) {
    return (
      <Card className="bg-white shadow-sm">
        <CardContent className="p-12 text-center">
          <History className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Scan History</h3>
          <p className="text-gray-500">Your completed scans will appear here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-blue-600" />
            Scan History ({scans.length})
          </CardTitle>
          {selectedScans.length > 0 && (
            <Button onClick={handleBulkDownload} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download Selected ({selectedScans.length})
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {scans.map((scan) => (
          <div 
            key={scan.id} 
            className={`p-4 border rounded-lg transition-colors ${
              selectedScans.includes(scan.id) ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={selectedScans.includes(scan.id)}
                  onChange={() => toggleScanSelection(scan.id)}
                  className="mt-1 rounded border-gray-300"
                />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-gray-900 truncate">{scan.targetUrl}</h4>
                    <Badge className={getSeverityColor(scan.severity)}>
                      {getSeverityIcon(scan.severity)}
                      <span className="ml-1">{scan.severity}</span>
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {scan.scanTypes.map((type, index) => (
                      <div key={index} className="flex items-center gap-1">
                        {getScanTypeIcon(type)}
                        <span className="text-sm text-gray-600">{type}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {scan.timestamp}
                    </div>
                    <div>Duration: {scan.duration}</div>
                    <div>Vulnerabilities: {scan.vulnerabilities}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewResults(scan.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadReport(scan)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRescan({
                    targetUrl: scan.targetUrl,
                    selectedScanTypes: scan.scanTypes
                  })}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ScanHistory;
