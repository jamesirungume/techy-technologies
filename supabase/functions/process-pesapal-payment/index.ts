
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Use Supabase secrets
const PESAPAL_CONSUMER_KEY = Deno.env.get("PESAPAL_CONSUMER_KEY");
const PESAPAL_CONSUMER_SECRET = Deno.env.get("PESAPAL_CONSUMER_SECRET");
const PESAPAL_BASE_URL = "https://pay.pesapal.com/v3";

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
  
  if (!PESAPAL_CONSUMER_KEY || !PESAPAL_CONSUMER_SECRET) {
    throw new Error("Missing Pesapal credentials in environment variables");
  }

  try {
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

    const responseText = await authResponse.text();
    console.log("Auth response status:", authResponse.status);
    console.log("Auth response text:", responseText);

    if (!authResponse.ok) {
      throw new Error(`Auth failed: ${authResponse.status} - ${responseText}`);
    }

    let authData;
    try {
      authData = JSON.parse(responseText);
    } catch (e) {
      throw new Error(`Invalid auth response format: ${responseText}`);
    }
    
    if (authData.error) {
      throw new Error(`Pesapal auth error: ${authData.error.message || authData.error.code}`);
    }
    
    if (!authData.token) {
      throw new Error(`No token in auth response: ${JSON.stringify(authData)}`);
    }
    
    console.log("Token obtained successfully");
    return authData.token;
  } catch (error) {
    console.error("Auth error:", error);
    throw error;
  }
};

const registerIPN = async (accessToken: string, callbackUrl: string) => {
  console.log("Attempting to register IPN URL:", callbackUrl);
  
  try {
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

    const responseText = await ipnResponse.text();
    console.log("IPN response status:", ipnResponse.status);
    console.log("IPN response text:", responseText);

    if (ipnResponse.ok) {
      const ipnData = JSON.parse(responseText);
      console.log("IPN registered successfully");
      return ipnData.ipn_id;
    } else {
      console.warn("IPN registration failed, continuing without IPN");
      return null;
    }
  } catch (error) {
    console.warn("IPN registration error:", error);
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

    // Step 1: Get OAuth token with retry logic
    let accessToken;
    let retries = 3;
    
    while (retries > 0) {
      try {
        accessToken = await getAccessToken();
        break;
      } catch (error) {
        retries--;
        console.log(`Auth retry ${3 - retries} failed:`, error);
        if (retries === 0) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
      }
    }

    console.log("Access token obtained successfully");

    // Step 2: Register IPN URL (optional)
    const ipnId = await registerIPN(accessToken, callbackUrl);

    // Step 3: Create payment request
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Format phone number properly
    let formattedPhone = phone;
    if (phone.startsWith('0')) {
      formattedPhone = `+254${phone.substring(1)}`;
    } else if (!phone.startsWith('+')) {
      formattedPhone = `+254${phone}`;
    }
    
    const paymentData = {
      id: orderId,
      currency: currency || "KES",
      amount: parseFloat(amount.toString()),
      description: description || "Payment for order",
      callback_url: callbackUrl,
      notification_id: ipnId || undefined,
      billing_address: {
        email_address: email,
        phone_number: formattedPhone,
        country_code: "KE",
        first_name: name.split(' ')[0] || name,
        last_name: name.split(' ').slice(1).join(' ') || "User",
        line_1: "N/A",
        line_2: "",
        city: "Nairobi",
        state: "Nairobi",
        postal_code: "00100",
        zip_code: "00100",
      },
    };

    console.log("Sending payment request:", JSON.stringify(paymentData, null, 2));

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
    console.log("Payment response status:", paymentResponse.status);
    console.log("Payment response text:", responseText);

    if (!paymentResponse.ok) {
      throw new Error(`Payment request failed: ${JSON.stringify({ status: paymentResponse.status, body: responseText })}`);
    }

    let paymentResult;
    try {
      paymentResult = JSON.parse(responseText);
    } catch (e) {
      throw new Error(`Invalid payment response format: ${responseText}`);
    }
    
    console.log("Payment request successful:", paymentResult);

    if (!paymentResult.order_tracking_id) {
      throw new Error(`No order tracking ID in response: ${JSON.stringify(paymentResult)}`);
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
