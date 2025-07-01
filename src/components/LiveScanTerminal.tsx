
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Terminal, Play, Pause, Square } from "lucide-react";

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
}

interface LiveScanTerminalProps {
  isScanning: boolean;
  scanType: string;
  targetUrl: string;
}

const LiveScanTerminal = ({ isScanning, scanType, targetUrl }: LiveScanTerminalProps) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isScanning && !isPaused) {
      // Simulate real-time logs
      const interval = setInterval(() => {
        const mockLogs = [
          { level: 'info' as const, message: `[*] Starting ${scanType} scan on ${targetUrl}...` },
          { level: 'info' as const, message: '[*] Analyzing target response...' },
          { level: 'info' as const, message: '[*] Testing GET parameters...' },
          { level: 'warning' as const, message: '[!] Possible vulnerability detected in parameter "id"' },
          { level: 'success' as const, message: '[+] SQL injection confirmed!' },
          { level: 'info' as const, message: '[*] Testing POST parameters...' },
          { level: 'info' as const, message: '[*] Checking for XSS vectors...' },
          { level: 'error' as const, message: '[!] Request timeout - retrying...' },
          { level: 'info' as const, message: '[*] Payload: <script>alert(1)</script>' },
          { level: 'success' as const, message: '[+] XSS vulnerability found in searchFor parameter!' }
        ];

        const randomLog = mockLogs[Math.floor(Math.random() * mockLogs.length)];
        const newLogEntry: LogEntry = {
          timestamp: new Date().toLocaleTimeString(),
          level: randomLog.level,
          message: randomLog.message
        };

        setLogs(prev => [...prev, newLogEntry].slice(-100)); // Keep last 100 logs
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [isScanning, isPaused, scanType, targetUrl]);

  useEffect(() => {
    if (autoScroll && terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const clearLogs = () => {
    setLogs([]);
  };

  const getLogColor = (level: string) => {
    switch (level) {
      case 'info': return 'text-blue-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      case 'success': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getLogPrefix = (level: string) => {
    switch (level) {
      case 'info': return '[*]';
      case 'warning': return '[!]';
      case 'error': return '[!]';
      case 'success': return '[+]';
      default: return '[-]';
    }
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-green-600" />
            Live Scan Terminal
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPaused(!isPaused)}
              disabled={!isScanning}
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearLogs}
            >
              <Square className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          ref={terminalRef}
          className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto"
          onScroll={(e) => {
            const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
            setAutoScroll(scrollTop + clientHeight >= scrollHeight - 10);
          }}
        >
          {logs.length === 0 ? (
            <div className="text-gray-500">
              {isScanning ? 'Initializing scan...' : 'No scan running. Start a scan to see live output.'}
            </div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="flex items-start gap-2 mb-1">
                <span className="text-gray-500 text-xs min-w-[60px]">[{log.timestamp}]</span>
                <span className={`${getLogColor(log.level)} font-medium min-w-[20px]`}>
                  {getLogPrefix(log.level)}
                </span>
                <span className={getLogColor(log.level)}>
                  {log.message}
                </span>
              </div>
            ))
          )}
          {autoScroll && logs.length > 0 && (
            <div className="text-gray-600 text-xs mt-2">
              ● Auto-scrolling enabled
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveScanTerminal;
