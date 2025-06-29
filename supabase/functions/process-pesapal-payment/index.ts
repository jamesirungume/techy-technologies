
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PESAPAL_CONSUMER_KEY = "NMjAcA377rp5LBxdJNX1Sd5WDqa8mtWq";
const PESAPAL_CONSUMER_SECRET = "ZjkW1CTfrYBGiyW/pduJX/T+iPQ=";
const PESAPAL_BASE_URL = "https://cybqa.pesapal.com/pesapalv3"; // Sandbox URL

interface PaymentRequest {
  name: string;
  phone: string;
  email: string;
  amount: number;
  currency: string;
  description: string;
  callbackUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, phone, email, amount, currency, description, callbackUrl }: PaymentRequest = await req.json();

    console.log("Processing Pesapal payment request:", { name, phone, email, amount, currency });

    // Step 1: Get OAuth token from Pesapal
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
    const accessToken = authData.token;

    console.log("Pesapal OAuth token obtained successfully");

    // Step 2: Register IPN URL (required for payment notifications)
    const ipnResponse = await fetch(`${PESAPAL_BASE_URL}/api/URLSetup/RegisterIPN`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        url: callbackUrl,
        ipn_notification_type: "GET",
      }),
    });

    let ipnId = null;
    if (ipnResponse.ok) {
      const ipnData = await ipnResponse.json();
      ipnId = ipnData.ipn_id;
      console.log("IPN registered with ID:", ipnId);
    }

    // Step 3: Create payment request
    const paymentData = {
      id: `order_${Date.now()}`, // Unique order ID
      currency: currency || "KES",
      amount: amount,
      description: description || "Payment for order",
      callback_url: callbackUrl,
      notification_id: ipnId,
      billing_address: {
        email_address: email,
        phone_number: phone,
        country_code: "KE",
        first_name: name.split(' ')[0] || name,
        last_name: name.split(' ').slice(1).join(' ') || "",
        line_1: "N/A",
        line_2: "",
        city: "Nairobi",
        state: "Nairobi",
        postal_code: "00100",
        zip_code: "00100",
      },
    };

    const paymentResponse = await fetch(`${PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify(paymentData),
    });

    if (!paymentResponse.ok) {
      const errorText = await paymentResponse.text();
      throw new Error(`Payment request failed: ${errorText}`);
    }

    const paymentResult = await paymentResponse.json();
    
    console.log("Pesapal payment request created successfully:", paymentResult);

    return new Response(JSON.stringify({
      success: true,
      iframe_token: paymentResult.iframe_token,
      order_tracking_id: paymentResult.order_tracking_id,
      merchant_reference: paymentResult.merchant_reference,
      iframe_url: `https://pay.pesapal.com/v3/iframe?iframe_token=${paymentResult.iframe_token}`,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error processing Pesapal payment:", error);
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
