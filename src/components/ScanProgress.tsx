
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock, AlertTriangle, Loader2, Database, Target, Bug, Shield } from "lucide-react";

const ScanProgress = ({ scan, onComplete, onError }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("Initializing scan...");
  const [logs, setLogs] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [payloadsTested, setPayloadsTested] = useState(0);
  const [currentScanType, setCurrentScanType] = useState("");
  const [scanStats, setScanStats] = useState({
    parameters: 0,
    dbmsDetected: null,
    vulnType: null,
    completedScans: [],
    totalScans: 0
  });

  useEffect(() => {
    if (!scan) return;

    const scanTypes = scan.selectedScanTypes || [];
    setScanStats(prev => ({ ...prev, totalScans: scanTypes.length }));

    let logIndex = 0;
    const progressSteps = [];

    // Generate progress steps based on selected scan types
    scanTypes.forEach((scanType, index) => {
      const scanName = {
        sqli: "SQL Injection",
        xss: "Cross-Site Scripting (XSS)",
        csrf: "Cross-Site Request Forgery (CSRF)"
      }[scanType];

      const baseProgress = (index / scanTypes.length) * 100;
      const stepIncrement = 100 / scanTypes.length / 10;

      progressSteps.push(
        { step: `Initializing ${scanName} scan...`, progress: baseProgress + stepIncrement },
        { step: `Setting up ${scanName} parameters...`, progress: baseProgress + stepIncrement * 2 },
        { step: `Testing target accessibility for ${scanName}...`, progress: baseProgress + stepIncrement * 3 },
        { step: `Analyzing ${scanName} injection points...`, progress: baseProgress + stepIncrement * 4 },
        { step: `Testing ${scanName} payloads...`, progress: baseProgress + stepIncrement * 6 },
        { step: `Verifying ${scanName} vulnerabilities...`, progress: baseProgress + stepIncrement * 8 },
        { step: `Finalizing ${scanName} results...`, progress: baseProgress + stepIncrement * 9 }
      );
    });

    progressSteps.push(
      { step: "Generating comprehensive report...", progress: 95 },
      { step: "Scan completed successfully!", progress: 100 }
    );

    const progressInterval = setInterval(() => {
      if (logIndex < progressSteps.length) {
        const step = progressSteps[logIndex];
        setCurrentStep(step.step);
        setProgress(step.progress);

        // Determine current scan type from step
        if (step.step.includes("SQL Injection")) {
          setCurrentScanType("SQL Injection");
        } else if (step.step.includes("XSS")) {
          setCurrentScanType("Cross-Site Scripting");
        } else if (step.step.includes("CSRF")) {
          setCurrentScanType("CSRF Analysis");
        }
        
        // Add realistic log entries
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, {
          timestamp,
          message: step.step,
          type: 'info'
        }]);

        // Simulate payload testing
        if (step.progress > 20 && step.progress < 90) {
          const payloadCount = Math.floor(Math.random() * 8) + 1;
          setPayloadsTested(prev => prev + payloadCount);
          
          // Add payload testing logs based on scan type
          setTimeout(() => {
            let payloadMessage = "";
            if (step.step.includes("SQL Injection")) {
              payloadMessage = `Testing ${payloadCount} SQL injection payloads...`;
            } else if (step.step.includes("XSS")) {
              payloadMessage = `Testing ${payloadCount} XSS payloads...`;
            } else if (step.step.includes("CSRF")) {
              payloadMessage = `Analyzing ${payloadCount} CSRF vectors...`;
            } else {
              payloadMessage = `Testing ${payloadCount} security payloads...`;
            }

            setLogs(prev => [...prev, {
              timestamp: new Date().toLocaleTimeString(),
              message: payloadMessage,
              type: 'payload'
            }]);
          }, 1000);
        }

        // Simulate vulnerability detection
        if (step.progress > 40 && step.progress < 80 && Math.random() > 0.4) {
          const vulnerabilityTypes = {
            sqli: ['Boolean-based blind', 'Error-based', 'Time-based blind', 'UNION-based'],
            xss: ['Reflected XSS', 'DOM-based XSS', 'Stored XSS'],
            csrf: ['Missing CSRF token', 'Weak CSRF protection', 'CSRF bypass']
          };

          const currentType = step.step.includes("SQL") ? 'sqli' : 
                             step.step.includes("XSS") ? 'xss' : 'csrf';
          
          const vulnTypes = vulnerabilityTypes[currentType];
          const detectedVuln = vulnTypes[Math.floor(Math.random() * vulnTypes.length)];
          
          setScanStats(prev => ({ ...prev, vulnType: detectedVuln }));
          setTimeout(() => {
            setLogs(prev => [...prev, {
              timestamp: new Date().toLocaleTimeString(),
              message: `⚠️ Vulnerability detected: ${detectedVuln}`,
              type: 'warning'
            }]);
          }, 1500);
        }

        logIndex++;
      } else {
        clearInterval(progressInterval);
        
        // Complete the scan
        setTimeout(() => {
          const mockResults = {
            scanTime: elapsedTime,
            vulnerabilities: generateMockVulnerabilities(scan.selectedScanTypes, scanStats.vulnType),
            totalPayloads: payloadsTested,
            scansCompleted: scan.selectedScanTypes,
            reportFiles: scan.selectedReportFormats?.map(format => ({
              format: format.toUpperCase(),
              filename: `aegisscan_report_${Date.now()}.${format}`,
              size: Math.floor(Math.random() * 500) + 200 + 'KB'
            })) || []
          };
          
          onComplete(mockResults);
        }, 1000);
      }
    }, 2000);

    // Timer for elapsed time
    const timeInterval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(timeInterval);
    };
  }, [scan, onComplete, payloadsTested, scanStats, elapsedTime]);

  const generateMockVulnerabilities = (scanTypes, vulnType) => {
    const vulnerabilities = [];

    scanTypes.forEach(scanType => {
      if (Math.random() > 0.3) { // 70% chance of finding vulnerabilities
        const vulnData = {
          sqli: {
            type: 'SQL Injection',
            subtype: vulnType || 'Boolean-based blind',
            severity: 'Critical',
            description: 'SQL injection vulnerability detected in parameter',
            parameter: 'id',
            dbms: ['MySQL', 'PostgreSQL', 'SQLite'][Math.floor(Math.random() * 3)]
          },
          xss: {
            type: 'Cross-Site Scripting',
            subtype: vulnType || 'Reflected XSS',
            severity: 'High',
            description: 'XSS vulnerability allows script injection',
            parameter: 'searchFor'
          },
          csrf: {
            type: 'CSRF',
            subtype: vulnType || 'Missing CSRF token',
            severity: 'Medium',
            description: 'CSRF vulnerability in form submission',
            parameter: 'action'
          }
        };

        vulnerabilities.push({
          ...vulnData[scanType],
          url: scan.targetUrl,
          payloadsTested: Math.floor(payloadsTested / scanTypes.length)
        });
      }
    });

    return vulnerabilities;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScanTypeIcon = (scanType) => {
    switch (scanType) {
      case 'SQL Injection': return <Database className="h-4 w-4 text-red-500" />;
      case 'Cross-Site Scripting': return <Bug className="h-4 w-4 text-orange-500" />;
      case 'CSRF Analysis': return <Shield className="h-4 w-4 text-purple-500" />;
      default: return <Target className="h-4 w-4 text-blue-500" />;
    }
  };

  if (!scan) return null;

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600 animate-pulse" />
            Security Vulnerability Scan in Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Scan Info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-gray-500" />
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
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
            {currentScanType && (
              <div className="flex items-center gap-2">
                {getScanTypeIcon(currentScanType)}
                <span className="text-sm text-green-600">
                  Current: {currentScanType}
                </span>
              </div>
            )}
          </div>

          {/* Scan Types Progress */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scan.selectedScanTypes?.map((scanType) => {
              const scanNames = {
                sqli: 'SQL Injection',
                xss: 'XSS Detection',
                csrf: 'CSRF Analysis'
              };
              const scanIcons = {
                sqli: <Database className="h-4 w-4 text-red-500" />,
                xss: <Bug className="h-4 w-4 text-orange-500" />,
                csrf: <Shield className="h-4 w-4 text-purple-500" />
              };

              return (
                <div key={scanType} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  {scanIcons[scanType]}
                  <span className="text-sm font-medium">{scanNames[scanType]}</span>
                  <div className="ml-auto">
                    <Loader2 className="h-3 w-3 animate-spin text-gray-500" />
                  </div>
                </div>
              );
            })}
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

          {/* Scan Statistics */}
          {scanStats.vulnType && (
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium text-orange-800">
                  Vulnerability Detected: {scanStats.vulnType}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Live Scan Output */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-600" />
            Live Scan Output
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
              <div className="text-gray-500">Initializing AegisScan...</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScanProgress;
