
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PESAPAL_CONSUMER_KEY = "NMjAcA377rp5LBxdJNX1Sd5WDqa8mtWq";
const PESAPAL_CONSUMER_SECRET = "ZjkW1CTfrYBGiyW/pduJX/T+iPQ=";
const PESAPAL_BASE_URL = "https://pay.pesapal.com/v3";

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderTrackingId } = await req.json();

    console.log("Verifying Pesapal payment for order:", orderTrackingId);

    if (!PESAPAL_CONSUMER_KEY || !PESAPAL_CONSUMER_SECRET) {
      throw new Error("Missing Pesapal credentials in environment variables");
    }

    // Get OAuth token
    const authResponse = await fetch(`${PESAPAL_BASE_URL}/api/Auth/RequestToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        consumer_key: PESAPAL_CONSUMER_KEY,
        consumer_secret: PESAPAL_CONSUMER_SECRET,
      }),
    });

    if (!authResponse.ok) {
      throw new Error(`Auth failed: ${authResponse.statusText}`);
    }

    const authData = await authResponse.json();
    
    if (authData.error) {
      throw new Error(`Pesapal auth error: ${authData.error.message || authData.error.code}`);
    }
    
    const accessToken = authData.token;

    // Get transaction status
    const statusResponse = await fetch(`${PESAPAL_BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    if (!statusResponse.ok) {
      throw new Error(`Status check failed: ${statusResponse.statusText}`);
    }

    const statusData = await statusResponse.json();
    
    console.log("Pesapal payment status:", statusData);

    return new Response(JSON.stringify({
      success: true,
      payment_status: statusData.payment_status_description,
      amount: statusData.amount,
      currency: statusData.currency,
      payment_method: statusData.payment_method,
      confirmation_code: statusData.confirmation_code,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error verifying Pesapal payment:", error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);
