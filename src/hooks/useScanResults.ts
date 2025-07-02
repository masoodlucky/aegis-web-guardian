
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ScanResult {
  id?: string;
  user_id?: string;
  url: string;
  scan_type: string;
  result_json: any;
  created_at?: string;
}

export const useScanResults = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const saveScanResult = async (scanData: Omit<ScanResult, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save scan results",
        variant: "destructive",
      });
      return null;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('scan_results')
        .insert([
          {
            user_id: user.id,
            url: scanData.url,
            scan_type: scanData.scan_type,
            result_json: scanData.result_json,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error saving scan result:', error);
        toast({
          title: "Save failed",
          description: "Could not save scan result",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Scan saved",
        description: "Scan result has been saved successfully",
      });

      return data;
    } catch (error) {
      console.error('Error saving scan result:', error);
      toast({
        title: "Save failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getScanResults = async () => {
    if (!user) return [];

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('scan_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching scan results:', error);
        toast({
          title: "Load failed",
          description: "Could not load scan results",
          variant: "destructive",
        });
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching scan results:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    saveScanResult,
    getScanResults,
    loading,
  };
};
