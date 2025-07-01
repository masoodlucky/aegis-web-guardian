import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";

const CSRFScanner = ({ targetUrl, onResults }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [findings, setFindings] = useState([]);

  const runCSRFScan = async () => {
    setIsScanning(true);
    
    // Simulate CSRF scan logic
    const mockFindings = [];
    
    try {
      // Mock CSRF detection logic
      const response = await fetch(targetUrl, { method: 'GET' });
      const html = await response.text();
      
      // Check for common CSRF protection mechanisms
      const hasCSRFToken = html.includes('csrf') || html.includes('_token');
      const hasSameSitecookie = html.includes('SameSite');
      const hasRefererCheck = response.headers.get('Referer-Policy');
      
      if (!hasCSRFToken) {
        mockFindings.push({
          type: 'CSRF',
          severity: 'Medium',
          description: 'No CSRF tokens detected in forms',
          details: 'Forms may be vulnerable to CSRF attacks'
        });
      }
      
      if (!hasSameSitecookie) {
        mockFindings.push({
          type: 'CSRF',
          severity: 'Low',
          description: 'SameSite cookie attribute not detected',
          details: 'Consider implementing SameSite cookie protection'
        });
      }
      
      setFindings(mockFindings);
      if (onResults) {
        onResults(mockFindings);
      }
      
    } catch (error) {
      console.error('CSRF scan error:', error);
      mockFindings.push({
        type: 'Error',
        severity: 'Low',
        description: 'Could not complete CSRF analysis',
        details: error.message
      });
      setFindings(mockFindings);
    }
    
    setIsScanning(false);
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-purple-600" />
          CSRF Analysis Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {findings.length > 0 ? (
          findings.map((finding, index) => (
            <div key={index} className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {finding.severity === 'Medium' ? (
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                <Badge variant="outline" className={
                  finding.severity === 'Medium' ? 'bg-orange-50 text-orange-700' : 'bg-green-50 text-green-700'
                }>
                  {finding.severity}
                </Badge>
              </div>
              <h4 className="font-medium">{finding.description}</h4>
              <p className="text-sm text-gray-600">{finding.details}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">CSRF analysis will be performed during scan</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CSRFScanner;
