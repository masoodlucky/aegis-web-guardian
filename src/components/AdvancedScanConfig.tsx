
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Globe, Search, Lock, Settings, Eye, EyeOff } from "lucide-react";

interface AdvancedScanConfigProps {
  onConfigChange: (config: any) => void;
  initialConfig?: any;
}

const AdvancedScanConfig = ({ onConfigChange, initialConfig = {} }: AdvancedScanConfigProps) => {
  const [config, setConfig] = useState({
    // Subdomain enumeration
    enableSubdomainScan: false,
    subdomainTools: {
      sublist3r: true,
      dnsdumpster: false,
      custom: false
    },
    maxSubdomains: 50,
    
    // Website crawling
    enableCrawling: false,
    crawlDepth: 2,
    maxPages: 100,
    followRedirects: true,
    crawlExternalLinks: false,
    
    // Authentication
    enableAuthentication: false,
    authType: 'form', // 'form', 'basic', 'bearer'
    loginUrl: '',
    username: '',
    password: '',
    loginFormSelector: '',
    usernameField: 'username',
    passwordField: 'password',
    submitButton: '',
    bearerToken: '',
    customHeaders: '',
    
    ...initialConfig
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleConfigUpdate = (newConfig: any) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    onConfigChange(updatedConfig);
  };

  const handleSubdomainToolChange = (tool: string) => {
    const newTools = {
      ...config.subdomainTools,
      [tool]: !config.subdomainTools[tool]
    };
    handleConfigUpdate({ subdomainTools: newTools });
  };

  return (
    <div className="space-y-6">
      {/* Subdomain Enumeration */}
      <Card className="border-2 border-purple-100">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Globe className="h-4 w-4 text-purple-600" />
            Subdomain Enumeration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="enableSubdomainScan"
              checked={config.enableSubdomainScan}
              onCheckedChange={(checked) => handleConfigUpdate({ enableSubdomainScan: checked })}
            />
            <Label htmlFor="enableSubdomainScan" className="text-sm font-medium">
              Enable subdomain discovery and scanning
            </Label>
          </div>

          {config.enableSubdomainScan && (
            <div className="space-y-4 ml-6">
              <div>
                <Label className="text-sm font-medium mb-2 block">Discovery Tools:</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sublist3r"
                      checked={config.subdomainTools.sublist3r}
                      onCheckedChange={() => handleSubdomainToolChange('sublist3r')}
                    />
                    <Label htmlFor="sublist3r" className="text-sm">Sublist3r (Recommended)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="dnsdumpster"
                      checked={config.subdomainTools.dnsdumpster}
                      onCheckedChange={() => handleSubdomainToolChange('dnsdumpster')}
                    />
                    <Label htmlFor="dnsdumpster" className="text-sm">DNSDumpster API</Label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxSubdomains">Max Subdomains</Label>
                  <Input
                    id="maxSubdomains"
                    type="number"
                    min="10"
                    max="500"
                    value={config.maxSubdomains}
                    onChange={(e) => handleConfigUpdate({ maxSubdomains: parseInt(e.target.value) || 50 })}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Website Crawling */}
      <Card className="border-2 border-green-100">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="h-4 w-4 text-green-600" />
            Website Crawling (Spidering)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="enableCrawling"
              checked={config.enableCrawling}
              onCheckedChange={(checked) => handleConfigUpdate({ enableCrawling: checked })}
            />
            <Label htmlFor="enableCrawling" className="text-sm font-medium">
              Enable automatic link discovery and crawling
            </Label>
          </div>

          {config.enableCrawling && (
            <div className="space-y-4 ml-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="crawlDepth">Crawl Depth</Label>
                  <Select 
                    value={String(config.crawlDepth)} 
                    onValueChange={(value) => handleConfigUpdate({ crawlDepth: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Surface only</SelectItem>
                      <SelectItem value="2">2 - Recommended</SelectItem>
                      <SelectItem value="3">3 - Deep</SelectItem>
                      <SelectItem value="4">4 - Very deep</SelectItem>
                      <SelectItem value="5">5 - Maximum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxPages">Max Pages</Label>
                  <Input
                    id="maxPages"
                    type="number"
                    min="10"
                    max="1000"
                    value={config.maxPages}
                    onChange={(e) => handleConfigUpdate({ maxPages: parseInt(e.target.value) || 100 })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="followRedirects"
                    checked={config.followRedirects}
                    onCheckedChange={(checked) => handleConfigUpdate({ followRedirects: checked })}
                  />
                  <Label htmlFor="followRedirects" className="text-sm">Follow redirects</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="crawlExternalLinks"
                    checked={config.crawlExternalLinks}
                    onCheckedChange={(checked) => handleConfigUpdate({ crawlExternalLinks: checked })}
                  />
                  <Label htmlFor="crawlExternalLinks" className="text-sm">Include external links (slower)</Label>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Authentication */}
      <Card className="border-2 border-orange-100">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lock className="h-4 w-4 text-orange-600" />
            Authentication Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="enableAuthentication"
              checked={config.enableAuthentication}
              onCheckedChange={(checked) => handleConfigUpdate({ enableAuthentication: checked })}
            />
            <Label htmlFor="enableAuthentication" className="text-sm font-medium">
              Scan authenticated pages (login required)
            </Label>
          </div>

          {config.enableAuthentication && (
            <div className="space-y-4 ml-6">
              <div className="space-y-2">
                <Label htmlFor="authType">Authentication Type</Label>
                <Select 
                  value={config.authType} 
                  onValueChange={(value) => handleConfigUpdate({ authType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="form">Form-based Login</SelectItem>
                    <SelectItem value="basic">HTTP Basic Auth</SelectItem>
                    <SelectItem value="bearer">Bearer Token</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {config.authType === 'form' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="loginUrl">Login Page URL</Label>
                    <Input
                      id="loginUrl"
                      type="url"
                      placeholder="https://example.com/login"
                      value={config.loginUrl}
                      onChange={(e) => handleConfigUpdate({ loginUrl: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="admin"
                        value={config.username}
                        onChange={(e) => handleConfigUpdate({ username: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="password"
                          value={config.password}
                          onChange={(e) => handleConfigUpdate({ password: e.target.value })}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="usernameField">Username Field Name</Label>
                      <Input
                        id="usernameField"
                        placeholder="username"
                        value={config.usernameField}
                        onChange={(e) => handleConfigUpdate({ usernameField: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passwordField">Password Field Name</Label>
                      <Input
                        id="passwordField"
                        placeholder="password"
                        value={config.passwordField}
                        onChange={(e) => handleConfigUpdate({ passwordField: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {config.authType === 'basic' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="basicUsername">Username</Label>
                    <Input
                      id="basicUsername"
                      type="text"
                      value={config.username}
                      onChange={(e) => handleConfigUpdate({ username: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="basicPassword">Password</Label>
                    <div className="relative">
                      <Input
                        id="basicPassword"
                        type={showPassword ? "text" : "password"}
                        value={config.password}
                        onChange={(e) => handleConfigUpdate({ password: e.target.value })}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {config.authType === 'bearer' && (
                <div className="space-y-2">
                  <Label htmlFor="bearerToken">Bearer Token</Label>
                  <Textarea
                    id="bearerToken"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={config.bearerToken}
                    onChange={(e) => handleConfigUpdate({ bearerToken: e.target.value })}
                    rows={3}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="customAuthHeaders">Custom Headers (Optional)</Label>
                <Textarea
                  id="customAuthHeaders"
                  placeholder="X-API-Key: your-api-key&#10;Authorization: Custom token"
                  value={config.customHeaders}
                  onChange={(e) => handleConfigUpdate({ customHeaders: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedScanConfig;
