
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

const getAccessToken = async () => {
  console.log("Requesting OAuth token from Pesapal...");
  
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
    const errorText = await authResponse.text();
    console.error("Auth request failed:", errorText);
    throw new Error(`Auth failed: ${authResponse.status} - ${errorText}`);
  }

  const authData = await authResponse.json();
  console.log("Auth response:", authData);
  
  if (!authData.token) {
    throw new Error("No token received from Pesapal");
  }
  
  return authData.token;
};

const registerIPN = async (accessToken: string, callbackUrl: string) => {
  console.log("Registering IPN URL:", callbackUrl);
  
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

  if (ipnResponse.ok) {
    const ipnData = await ipnResponse.json();
    console.log("IPN registered successfully:", ipnData);
    return ipnData.ipn_id;
  } else {
    const errorText = await ipnResponse.text();
    console.warn("IPN registration failed:", errorText);
    // Continue without IPN for now
    return null;
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, phone, email, amount, currency, description, callbackUrl }: PaymentRequest = await req.json();

    console.log("Processing Pesapal payment request:", { name, phone, email, amount, currency });

    // Step 1: Get OAuth token
    const accessToken = await getAccessToken();
    console.log("Pesapal OAuth token obtained successfully");

    // Step 2: Register IPN URL (optional)
    const ipnId = await registerIPN(accessToken, callbackUrl);

    // Step 3: Create payment request with proper formatting
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const paymentData = {
      id: orderId,
      currency: currency || "KES",
      amount: parseFloat(amount.toString()),
      description: description || "Payment for order",
      callback_url: callbackUrl,
      notification_id: ipnId,
      billing_address: {
        email_address: email,
        phone_number: phone.startsWith('+') ? phone : `+254${phone.replace(/^0/, '')}`,
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

    console.log("Sending payment request to Pesapal:", JSON.stringify(paymentData, null, 2));

    const paymentResponse = await fetch(`${PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify(paymentData),
    });

    const responseText = await paymentResponse.text();
    console.log("Pesapal payment response:", responseText);

    if (!paymentResponse.ok) {
      console.error("Payment request failed:", responseText);
      throw new Error(`Payment request failed: ${paymentResponse.status} - ${responseText}`);
    }

    let paymentResult;
    try {
      paymentResult = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse payment response:", responseText);
      throw new Error("Invalid response format from Pesapal");
    }
    
    console.log("Pesapal payment request created successfully:", paymentResult);

    // Validate required fields in response
    if (!paymentResult.order_tracking_id) {
      throw new Error("No order tracking ID received from Pesapal");
    }

    return new Response(JSON.stringify({
      success: true,
      order_tracking_id: paymentResult.order_tracking_id,
      merchant_reference: paymentResult.merchant_reference || orderId,
      redirect_url: paymentResult.redirect_url,
      iframe_src: paymentResult.iframe_src,
      iframe_url: paymentResult.redirect_url || `https://pay.pesapal.com/v3/iframe?token=${paymentResult.order_tracking_id}`,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error processing Pesapal payment:", error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message,
      details: error.stack 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);
