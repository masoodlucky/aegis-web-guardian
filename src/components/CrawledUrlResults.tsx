
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, ExternalLink, Shield, AlertTriangle, FileText } from "lucide-react";

interface CrawledUrlResultsProps {
  urls: Array<{
    url: string;
    status: number;
    title?: string;
    forms?: number;
    parameters?: number;
    vulnerabilities?: number;
    depth: number;
  }>;
  onScanUrl?: (url: string) => void;
}

const CrawledUrlResults = ({ urls, onScanUrl }: CrawledUrlResultsProps) => {
  if (!urls || urls.length === 0) {
    return (
      <Card className="bg-gray-50">
        <CardContent className="p-6 text-center">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No URLs discovered during crawling</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: number) => {
    if (status >= 200 && status < 300) {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{status} OK</Badge>;
    } else if (status >= 300 && status < 400) {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{status} Redirect</Badge>;
    } else if (status >= 400 && status < 500) {
      return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">{status} Error</Badge>;
    } else if (status >= 500) {
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">{status} Server Error</Badge>;
    }
    return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">{status}</Badge>;
  };

  const getVulnerabilityBadge = (count: number) => {
    if (count === 0) return null;
    const severity = count > 5 ? 'High' : count > 2 ? 'Medium' : 'Low';
    const color = severity === 'High' ? 'bg-red-50 text-red-700 border-red-200' :
                  severity === 'Medium' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                  'bg-yellow-50 text-yellow-700 border-yellow-200';
    
    return <Badge variant="outline" className={color}>{count} vulnerabilities</Badge>;
  };

  const getDepthColor = (depth: number) => {
    switch (depth) {
      case 0:
      case 1:
        return 'text-green-600 bg-green-50';
      case 2:
        return 'text-blue-600 bg-blue-50';
      case 3:
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-red-600 bg-red-50';
    }
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-green-600" />
          Crawled URLs ({urls.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {urls.map((urlData, index) => (
            <div key={index} className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <FileText className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-gray-900 truncate">{urlData.url}</h4>
                  {urlData.title && (
                    <p className="text-sm text-gray-600 truncate">{urlData.title}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className={`text-xs ${getDepthColor(urlData.depth)}`}>
                      Depth {urlData.depth}
                    </Badge>
                    {urlData.forms > 0 && (
                      <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                        {urlData.forms} forms
                      </Badge>
                    )}
                    {urlData.parameters > 0 && (
                      <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">
                        {urlData.parameters} params
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                {getStatusBadge(urlData.status)}
                {urlData.vulnerabilities !== undefined && getVulnerabilityBadge(urlData.vulnerabilities)}
                
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" asChild>
                    <a href={urlData.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  
                  {onScanUrl && urlData.status >= 200 && urlData.status < 400 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onScanUrl(urlData.url)}
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      Scan
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CrawledUrlResults;
