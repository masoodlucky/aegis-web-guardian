
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock, AlertTriangle, Loader2, Database, Target } from "lucide-react";

const ScanProgress = ({ scan, onComplete, onError }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("Initializing SQLMap...");
  const [logs, setLogs] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [payloadsTested, setPayloadsTested] = useState(0);
  const [scanStats, setScanStats] = useState({
    parameters: 0,
    dbmsDetected: null,
    vulnType: null
  });

  useEffect(() => {
    if (!scan) return;

    let logIndex = 0;
    const progressSteps = [
      { step: "Initializing SQLMap process...", progress: 5 },
      { step: "Setting up scan parameters...", progress: 10 },
      { step: "Testing target accessibility...", progress: 15 },
      { step: "Analyzing injection points...", progress: 25 },
      { step: "Testing boolean-based blind injection...", progress: 40 },
      { step: "Testing error-based injection...", progress: 55 },
      { step: "Testing time-based blind injection...", progress: 70 },
      { step: "Testing UNION-based injection...", progress: 85 },
      { step: "Finalizing scan results...", progress: 95 },
      { step: "Generating vulnerability report...", progress: 100 }
    ];

    const progressInterval = setInterval(() => {
      if (logIndex < progressSteps.length) {
        const step = progressSteps[logIndex];
        setCurrentStep(step.step);
        setProgress(step.progress);
        
        // Add realistic SQLMap log entries
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, {
          timestamp,
          message: step.step,
          type: 'info'
        }]);

        // Simulate payload testing
        if (step.progress > 20 && step.progress < 90) {
          const payloadCount = Math.floor(Math.random() * 5) + 1;
          setPayloadsTested(prev => prev + payloadCount);
          
          // Add payload testing logs
          setTimeout(() => {
            setLogs(prev => [...prev, {
              timestamp: new Date().toLocaleTimeString(),
              message: `Testing ${payloadCount} SQL injection payloads...`,
              type: 'payload'
            }]);
          }, 1000);
        }

        // Simulate DBMS detection
        if (step.progress === 55 && Math.random() > 0.3) {
          const dbms = ['MySQL', 'PostgreSQL', 'SQLite', 'MSSQL'][Math.floor(Math.random() * 4)];
          setScanStats(prev => ({ ...prev, dbmsDetected: dbms }));
          setTimeout(() => {
            setLogs(prev => [...prev, {
              timestamp: new Date().toLocaleTimeString(),
              message: `Backend DBMS detected: ${dbms}`,
              type: 'success'
            }]);
          }, 1500);
        }

        // Simulate vulnerability detection
        if (step.progress === 70 && Math.random() > 0.5) {
          const vulnTypes = ['Boolean-based blind', 'Error-based', 'Time-based blind'];
          const detectedVuln = vulnTypes[Math.floor(Math.random() * vulnTypes.length)];
          setScanStats(prev => ({ ...prev, vulnType: detectedVuln }));
          setTimeout(() => {
            setLogs(prev => [...prev, {
              timestamp: new Date().toLocaleTimeString(),
              message: `⚠️ SQL injection vulnerability detected: ${detectedVuln}`,
              type: 'warning'
            }]);
          }, 2000);
        }

        logIndex++;
      } else {
        clearInterval(progressInterval);
        
        // Complete the scan
        setTimeout(() => {
          const mockResults = {
            scanTime: elapsedTime,
            vulnerabilities: scanStats.vulnType ? [
              {
                type: 'SQL Injection',
                subtype: scanStats.vulnType,
                severity: scanStats.vulnType === 'Error-based' ? 'Critical' : 'High',
                description: `${scanStats.vulnType} SQL injection vulnerability detected`,
                url: scan.targetUrl,
                parameter: 'id',
                dbms: scanStats.dbmsDetected || 'Unknown',
                payloadsTested: payloadsTested
              }
            ] : [],
            totalPayloads: payloadsTested,
            dbmsDetected: scanStats.dbmsDetected,
            reportFiles: scan.selectedReportFormats?.map(format => ({
              format: format.toUpperCase(),
              filename: `sqli_scan_${Date.now()}.${format}`,
              size: Math.floor(Math.random() * 200) + 100 + 'KB'
            })) || []
          };
          
          onComplete(mockResults);
        }, 1000);
      }
    }, 2500);

    // Timer for elapsed time
    const timeInterval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(timeInterval);
    };
  }, [scan, onComplete, payloadsTested, scanStats, elapsedTime]);

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
            <Database className="h-5 w-5 text-red-600 animate-pulse" />
            SQL Injection Scan in Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Scan Info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-gray-500" />
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                {scan.targetUrl}
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
                Payloads: {payloadsTested}
              </span>
            </div>
            {scanStats.dbmsDetected && (
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">
                  DBMS: {scanStats.dbmsDetected}
                </span>
              </div>
            )}
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
          <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
            <Loader2 className="h-4 w-4 text-red-600 animate-spin" />
            <span className="text-sm text-red-800">{currentStep}</span>
          </div>

          {/* Scan Statistics */}
          {(scanStats.dbmsDetected || scanStats.vulnType) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              {scanStats.dbmsDetected && (
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Database: {scanStats.dbmsDetected}</span>
                </div>
              )}
              {scanStats.vulnType && (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">Type: {scanStats.vulnType}</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Live SQLMap Logs */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-600" />
            SQLMap Live Output
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="flex items-start gap-2 mb-1">
                <span className="text-gray-500">[{log.timestamp}]</span>
                <span className={
                  log.type === 'warning' ? 'text-yellow-400' : 
                  log.type === 'success' ? 'text-green-400' :
                  log.type === 'payload' ? 'text-blue-400' : 'text-green-400'
                }>
                  {log.message}
                </span>
              </div>
            ))}
            {logs.length === 0 && (
              <div className="text-gray-500">Initializing SQLMap scan...</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScanProgress;
