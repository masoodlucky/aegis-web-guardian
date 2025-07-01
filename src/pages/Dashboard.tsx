
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import Index from './Index';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="relative">
      {/* User info and logout button */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <User className="h-4 w-4" />
          <span>{user?.email}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
      
      {/* Main scanner interface */}
      <Index />
    </div>
  );
};

export default Dashboard;
