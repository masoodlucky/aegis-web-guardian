
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock, AlertTriangle, CheckCircle, XCircle, Loader2 } from "lucide-react";

const ScanProgress = ({ scan, onComplete, onError }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("Initializing...");
  const [logs, setLogs] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!scan) return;

    // Simulate scan progress
    const steps = [
      { step: "Initializing scan engine...", duration: 2000 },
      { step: "Analyzing target URL...", duration: 3000 },
      { step: "Checking for SQL injection vulnerabilities...", duration: 8000 },
      { step: "Scanning for XSS vulnerabilities...", duration: 6000 },
      { step: "Testing CSRF protection...", duration: 4000 },
      { step: "Generating security report...", duration: 3000 },
      { step: "Finalizing results...", duration: 2000 }
    ];

    let currentStepIndex = 0;
    let currentProgress = 0;

    const progressInterval = setInterval(() => {
      if (currentStepIndex < steps.length) {
        const step = steps[currentStepIndex];
        setCurrentStep(step.step);
        
        const stepProgress = (currentStepIndex + 1) / steps.length * 100;
        setProgress(stepProgress);
        
        // Add log entry
        setLogs(prev => [...prev, {
          timestamp: new Date().toLocaleTimeString(),
          message: step.step,
          type: 'info'
        }]);

        // Simulate finding vulnerabilities
        if (step.step.includes('SQL injection') && Math.random() > 0.7) {
          setLogs(prev => [...prev, {
            timestamp: new Date().toLocaleTimeString(),
            message: "⚠️ Potential SQL injection vulnerability detected",
            type: 'warning'
          }]);
        }

        if (step.step.includes('XSS') && Math.random() > 0.8) {
          setLogs(prev => [...prev, {
            timestamp: new Date().toLocaleTimeString(),
            message: "⚠️ XSS vulnerability found in form input",
            type: 'warning'
          }]);
        }

        currentStepIndex++;
      } else {
        clearInterval(progressInterval);
        
        // Simulate scan completion
        setTimeout(() => {
          const mockResults = {
            scanTime: elapsedTime,
            vulnerabilities: [
              {
                type: 'SQL Injection',
                severity: 'High',
                description: 'Potential SQL injection in login form',
                url: scan.targetUrl + '/login',
                parameter: 'username'
              },
              {
                type: 'XSS',
                severity: 'Medium',
                description: 'Reflected XSS in search functionality',
                url: scan.targetUrl + '/search',
                parameter: 'q'
              }
            ],
            totalEndpoints: 15,
            testedEndpoints: 15,
            reportFiles: scan.selectedReportFormats.map(format => ({
              format: format.toUpperCase(),
              filename: `aegis_scan_${Date.now()}.${format}`,
              size: Math.floor(Math.random() * 100) + 50 + 'KB'
            }))
          };
          
          onComplete(mockResults);
        }, 1000);
      }
    }, 3000);

    // Timer for elapsed time
    const timeInterval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(timeInterval);
    };
  }, [scan, onComplete, elapsedTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!scan) return null;

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600 animate-pulse" />
            Scan in Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Scan Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Target: {scan.targetUrl}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Elapsed: {formatTime(elapsedTime)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Scan Types: {scan.selectedScanTypes?.join(', ').toUpperCase()}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">{currentStep}</span>
              <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          {/* Current Status */}
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
            <span className="text-sm text-blue-800">{currentStep}</span>
          </div>
        </CardContent>
      </Card>

      {/* Live Logs */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-600" />
            Live Scan Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="flex items-start gap-2 mb-1">
                <span className="text-gray-500">[{log.timestamp}]</span>
                <span className={log.type === 'warning' ? 'text-yellow-400' : 'text-green-400'}>
                  {log.message}
                </span>
              </div>
            ))}
            {logs.length === 0 && (
              <div className="text-gray-500">Waiting for scan to begin...</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScanProgress;
