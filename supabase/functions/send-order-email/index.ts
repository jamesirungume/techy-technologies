
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface OrderEmailRequest {
  orderId: string;
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  items: Array<{
    product: {
      name: string;
      price: number;
    };
    quantity: number;
  }>;
  totalAmount: number;
  paymentMethod: string;
  isCOD: boolean;
  adminEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      orderId,
      customerInfo,
      items,
      totalAmount,
      paymentMethod,
      isCOD,
      adminEmail
    }: OrderEmailRequest = await req.json();

    const itemsList = items.map(item => 
      `- ${item.product.name} x ${item.quantity} = $${(item.product.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const subject = isCOD 
      ? `New COD Order #${orderId} - Confirmation Required`
      : `New Paid Order #${orderId}`;

    const message = isCOD 
      ? `Call this number for verification: ${customerInfo.phone}`
      : `Payment has been completed successfully.`;

    const emailHtml = `
      <h2>${subject}</h2>
      <h3>Customer Information:</h3>
      <p><strong>Name:</strong> ${customerInfo.fullName}</p>
      <p><strong>Email:</strong> ${customerInfo.email}</p>
      <p><strong>Phone:</strong> ${customerInfo.phone}</p>
      <p><strong>Delivery Address:</strong> ${customerInfo.address}, ${customerInfo.city}, ${customerInfo.postalCode}</p>
      
      <h3>Order Details:</h3>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Payment Method:</strong> ${paymentMethod}</p>
      <pre>${itemsList}</pre>
      <p><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
      
      <div style="background-color: ${isCOD ? '#fef3c7' : '#d1fae5'}; padding: 15px; margin: 20px 0; border-radius: 5px;">
        <p><strong>Action Required:</strong></p>
        <p>${message}</p>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "Techy Technologies <onboarding@resend.dev>",
      to: [adminEmail],
      subject: subject,
      html: emailHtml,
    });

    console.log("Order email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-order-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
