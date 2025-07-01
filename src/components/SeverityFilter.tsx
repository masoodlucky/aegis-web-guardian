
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, CheckCircle } from "lucide-react";

interface SeverityFilterProps {
  selectedSeverities: string[];
  onSeverityChange: (severities: string[]) => void;
  vulnerabilityCounts: Record<string, number>;
}

const SeverityFilter = ({ selectedSeverities, onSeverityChange, vulnerabilityCounts }: SeverityFilterProps) => {
  const severityLevels = [
    { 
      level: 'Critical', 
      color: 'bg-red-100 text-red-800 border-red-200', 
      icon: AlertTriangle,
      emoji: '🔴'
    },
    { 
      level: 'High', 
      color: 'bg-orange-100 text-orange-800 border-orange-200', 
      icon: AlertTriangle,
      emoji: '🟠'
    },
    { 
      level: 'Medium', 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
      icon: Shield,
      emoji: '🟡'
    },
    { 
      level: 'Low', 
      color: 'bg-green-100 text-green-800 border-green-200', 
      icon: CheckCircle,
      emoji: '🟢'
    }
  ];

  const toggleSeverity = (severity: string) => {
    if (selectedSeverities.includes(severity)) {
      onSeverityChange(selectedSeverities.filter(s => s !== severity));
    } else {
      onSeverityChange([...selectedSeverities, severity]);
    }
  };

  const selectAll = () => {
    onSeverityChange(severityLevels.map(s => s.level));
  };

  const clearAll = () => {
    onSeverityChange([]);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-gray-50 rounded-lg">
      <span className="text-sm font-medium text-gray-700">Filter by severity:</span>
      
      {severityLevels.map(({ level, color, icon: Icon, emoji }) => {
        const isSelected = selectedSeverities.includes(level);
        const count = vulnerabilityCounts[level] || 0;
        
        return (
          <Button
            key={level}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => toggleSeverity(level)}
            className={`${isSelected ? '' : 'hover:bg-gray-100'} transition-colors`}
          >
            <span className="mr-1">{emoji}</span>
            {level}
            {count > 0 && (
              <Badge variant="secondary" className="ml-2 px-1 py-0 text-xs">
                {count}
              </Badge>
            )}
          </Button>
        );
      })}
      
      <div className="ml-4 flex gap-2">
        <Button variant="ghost" size="sm" onClick={selectAll}>
          Select All
        </Button>
        <Button variant="ghost" size="sm" onClick={clearAll}>
          Clear All
        </Button>
      </div>
    </div>
  );
};

export default SeverityFilter;
