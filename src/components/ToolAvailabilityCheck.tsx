
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Loader2, Database, Bug, Shield } from "lucide-react";

interface ToolStatus {
  name: string;
  available: boolean;
  version?: string;
  checking: boolean;
  icon: React.ComponentType<any>;
  description: string;
}

const ToolAvailabilityCheck = () => {
  const [tools, setTools] = useState<ToolStatus[]>([
    {
      name: 'SQLMap',
      available: false,
      checking: true,
      icon: Database,
      description: 'SQL injection detection and exploitation tool'
    },
    {
      name: 'XSStrike',
      available: false,
      checking: true,
      icon: Bug,
      description: 'Cross-Site Scripting detection suite'
    },
    {
      name: 'CSRF Analyzer',
      available: true, // Built-in
      checking: false,
      icon: Shield,
      description: 'Cross-Site Request Forgery analysis tool'
    }
  ]);

  useEffect(() => {
    checkToolAvailability();
  }, []);

  const checkToolAvailability = async () => {
    // Simulate checking tool availability
    // In a real implementation, this would call the backend API
    setTimeout(() => {
      setTools(prevTools => 
        prevTools.map(tool => ({
          ...tool,
          checking: false,
          available: tool.name === 'CSRF Analyzer' ? true : Math.random() > 0.3,
          version: tool.name === 'SQLMap' ? '1.7.2' : 
                   tool.name === 'XSStrike' ? '3.1.5' : 
                   tool.name === 'CSRF Analyzer' ? '1.0.0' : undefined
        }))
      );
    }, 2000);
  };

  const getStatusIcon = (tool: ToolStatus) => {
    if (tool.checking) {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    }
    return tool.available ? 
      <CheckCircle className="h-4 w-4 text-green-500" /> : 
      <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadge = (tool: ToolStatus) => {
    if (tool.checking) {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700">Checking...</Badge>;
    }
    return tool.available ? 
      <Badge variant="outline" className="bg-green-50 text-green-700">✅ Available</Badge> : 
      <Badge variant="outline" className="bg-red-50 text-red-700">❌ Missing</Badge>;
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Security Tools Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div key={tool.name} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Icon className="h-6 w-6 text-gray-600" />
                <div>
                  <h4 className="font-medium text-gray-900">{tool.name}</h4>
                  <p className="text-sm text-gray-600">{tool.description}</p>
                  {tool.version && (
                    <p className="text-xs text-gray-500">Version: {tool.version}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(tool)}
                {getStatusBadge(tool)}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ToolAvailabilityCheck;
