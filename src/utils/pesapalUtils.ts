
import { supabase } from '@/integrations/supabase/client';

export const verifyPesapalPayment = async (orderTrackingId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('verify-pesapal-payment', {
      body: { orderTrackingId }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error verifying Pesapal payment:', error);
    return null;
  }
};

export const checkPesapalPaymentStatus = (orderTrackingId: string): Promise<string> => {
  return new Promise((resolve) => {
    const checkStatus = async () => {
      const result = await verifyPesapalPayment(orderTrackingId);
      if (result && result.payment_status === 'COMPLETED') {
        resolve('completed');
      } else if (result && result.payment_status === 'FAILED') {
        resolve('failed');
      } else {
        // Continue checking
        setTimeout(checkStatus, 3000);
      }
    };
    checkStatus();
  });
};
