
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, AlertTriangle, CheckCircle, XCircle, RefreshCw, Eye } from "lucide-react";

const RecentScans = ({ scans, onRescan }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-600 animate-pulse" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleRescan = (scan) => {
    if (onRescan) {
      onRescan({
        targetUrl: scan.targetUrl,
        selectedScanTypes: scan.selectedScanTypes,
        selectedReportFormats: scan.selectedReportFormats
      });
    }
  };

  if (scans.length === 0) {
    return (
      <Card className="bg-white shadow-sm">
        <CardContent className="p-12 text-center">
          <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No scan history</h3>
          <p className="text-gray-500">Your recent scans will appear here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Recent Scans
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Target URL</TableHead>
                <TableHead>Scan Types</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Vulnerabilities</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scans.map((scan) => (
                <TableRow key={scan.id}>
                  <TableCell className="font-medium">
                    <div className="max-w-xs truncate" title={scan.targetUrl}>
                      {scan.targetUrl}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {scan.selectedScanTypes?.map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(scan.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(scan.status)}
                        {scan.status}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {scan.status === 'completed' ? (
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        {scan.results?.vulnerabilities?.length || 0}
                      </div>
                    ) : scan.status === 'error' ? (
                      <span className="text-gray-500">-</span>
                    ) : (
                      <span className="text-gray-500">Scanning...</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {scan.endTime && scan.startTime ? (
                      `${Math.floor((scan.endTime - scan.startTime) / 1000)}s`
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {new Date(scan.startTime).toLocaleDateString()}
                      <br />
                      <span className="text-xs text-gray-500">
                        {new Date(scan.startTime).toLocaleTimeString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRescan(scan)}
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                      {scan.status === 'completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentScans;
