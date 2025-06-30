
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OTPProtectionProps {
  onSuccess: () => void;
}

const OTPProtection: React.FC<OTPProtectionProps> = ({ onSuccess }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast({
        title: "Error",
        description: "Please enter the OTP code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('seller_otp')
        .select('*')
        .eq('otp_code', otp.trim())
        .gt('expires_at', new Date().toISOString())
        .eq('used', false)
        .single();

      if (error || !data) {
        toast({
          title: "Access Denied",
          description: "Invalid or expired OTP code",
          variant: "destructive",
        });
        return;
      }

      // Store successful OTP verification in sessionStorage
      sessionStorage.setItem('seller_access', 'granted');
      sessionStorage.setItem('seller_access_time', Date.now().toString());
      
      toast({
        title: "Access Granted",
        description: "Welcome to the seller dashboard",
      });
      
      onSuccess();
    } catch (error) {
      console.error('OTP verification error:', error);
      toast({
        title: "Error",
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Seller Access</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Enter OTP Code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="text-center font-mono"
                autoFocus
              />
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Access Seller Dashboard'}
            </Button>
          </form>
          <p className="text-sm text-gray-600 mt-4 text-center">
            Contact admin for access credentials
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OTPProtection;
