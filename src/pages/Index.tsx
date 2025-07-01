
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Activity, FileText, AlertTriangle, Settings } from "lucide-react";
import ScanForm from "@/components/ScanForm";
import ScanProgress from "@/components/ScanProgress";
import ScanResults from "@/components/ScanResults";
import RecentScans from "@/components/RecentScans";
import ScanHistory from "@/components/ScanHistory";
import ToolAvailabilityCheck from "@/components/ToolAvailabilityCheck";
import DarkModeToggle from "@/components/DarkModeToggle";
import LiveScanTerminal from "@/components/LiveScanTerminal";

const Index = () => {
  const [currentScan, setCurrentScan] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("scan");

  const handleScanStart = (scanData) => {
    setCurrentScan({
      ...scanData,
      id: Date.now().toString(),
      status: 'running',
      startTime: new Date(),
      progress: 0
    });
    setActiveTab("progress");
  };

  const handleScanComplete = (results) => {
    if (currentScan) {
      const completedScan = {
        ...currentScan,
        status: 'completed',
        endTime: new Date(),
        results: results,
        progress: 100,
        // Add history-specific fields
        timestamp: new Date().toLocaleString(),
        duration: results.scanTime || '0s',
        vulnerabilities: results.vulnerabilities?.length || 0,
        severity: results.vulnerabilities?.length > 0 ? 'High' : 'None',
        scanTypes: currentScan.selectedScanTypes || []
      };
      setScanHistory(prev => [completedScan, ...prev.slice(0, 9)]);
      setCurrentScan(null);
      setActiveTab("results");
    }
  };

  const handleScanError = (error) => {
    if (currentScan) {
      const errorScan = {
        ...currentScan,
        status: 'error',
        endTime: new Date(),
        error: error,
        progress: 0,
        // Add history-specific fields
        timestamp: new Date().toLocaleString(),
        duration: '0s',
        vulnerabilities: 0,
        severity: 'None',
        scanTypes: currentScan.selectedScanTypes || []
      };
      setScanHistory(prev => [errorScan, ...prev.slice(0, 9)]);
      setCurrentScan(null);
      setActiveTab("scan");
    }
  };

  const handleViewResults = (scanId) => {
    const scan = scanHistory.find(s => s.id === scanId);
    if (scan) {
      setActiveTab("results");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors">
      <DarkModeToggle />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">AegisScan</h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300">Advanced Web Vulnerability Scanner</p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Scans</p>
                  <p className="text-2xl font-bold text-gray-900">{scanHistory.length}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Scans</p>
                  <p className="text-2xl font-bold text-gray-900">{currentScan ? 1 : 0}</p>
                </div>
                <Shield className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Vulnerabilities Found</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {scanHistory.reduce((total, scan) => total + (scan.results?.vulnerabilities?.length || 0), 0)}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Reports Generated</p>
                  <p className="text-2xl font-bold text-gray-900">{scanHistory.length}</p>
                </div>
                <FileText className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white dark:bg-gray-800 shadow-sm">
            <TabsTrigger value="scan" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              New Scan
            </TabsTrigger>
            <TabsTrigger value="progress" disabled={!currentScan} className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Results
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scan" className="mt-6">
            <ScanForm onScanStart={handleScanStart} />
          </TabsContent>

          <TabsContent value="progress" className="mt-6">
            <div className="space-y-6">
              {currentScan && (
                <ScanProgress 
                  scan={currentScan} 
                  onComplete={handleScanComplete}
                  onError={handleScanError}
                />
              )}
              
              <LiveScanTerminal 
                isScanning={!!currentScan}
                scanType={currentScan?.selectedScanTypes?.join(', ') || 'Unknown'}
                targetUrl={currentScan?.targetUrl || ''}
              />
            </div>
          </TabsContent>

          <TabsContent value="results" className="mt-6">
            <ScanResults 
              results={scanHistory.length > 0 ? scanHistory[0] : null}
              onRescan={handleScanStart}
            />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <ScanHistory 
              scans={scanHistory}
              onRescan={handleScanStart}
              onViewResults={handleViewResults}
            />
          </TabsContent>

          <TabsContent value="tools" className="mt-6">
            <ToolAvailabilityCheck />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
