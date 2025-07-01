
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, ExternalLink, Shield, AlertTriangle } from "lucide-react";

interface SubdomainResultsProps {
  subdomains: Array<{
    domain: string;
    status: 'active' | 'inactive' | 'unknown';
    vulnerabilities?: number;
    lastScanned?: string;
  }>;
  onScanSubdomain?: (subdomain: string) => void;
}

const SubdomainResults = ({ subdomains, onScanSubdomain }: SubdomainResultsProps) => {
  if (!subdomains || subdomains.length === 0) {
    return (
      <Card className="bg-gray-50">
        <CardContent className="p-6 text-center">
          <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No subdomains discovered</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">🟢 Active</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">🔴 Inactive</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">❓ Unknown</Badge>;
    }
  };

  const getVulnerabilityBadge = (count: number) => {
    if (count === 0) return null;
    const severity = count > 5 ? 'High' : count > 2 ? 'Medium' : 'Low';
    const color = severity === 'High' ? 'bg-red-50 text-red-700 border-red-200' :
                  severity === 'Medium' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                  'bg-yellow-50 text-yellow-700 border-yellow-200';
    
    return <Badge variant="outline" className={color}>{count} vulnerabilities</Badge>;
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-600" />
          Discovered Subdomains ({subdomains.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {subdomains.map((subdomain, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-gray-500" />
                <div>
                  <h4 className="font-medium text-gray-900">{subdomain.domain}</h4>
                  {subdomain.lastScanned && (
                    <p className="text-sm text-gray-500">Last scanned: {subdomain.lastScanned}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {getStatusBadge(subdomain.status)}
                {subdomain.vulnerabilities !== undefined && getVulnerabilityBadge(subdomain.vulnerabilities)}
                
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" asChild>
                    <a href={`https://${subdomain.domain}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  
                  {onScanSubdomain && subdomain.status === 'active' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onScanSubdomain(subdomain.domain)}
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

export default SubdomainResults;
