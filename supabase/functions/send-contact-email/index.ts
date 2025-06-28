
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface ContactEmailRequest {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  adminEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
      adminEmail
    }: ContactEmailRequest = await req.json();

    const emailHtml = `
      <h2>New Contact Form Submission</h2>
      <h3>Contact Information:</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      
      <h3>Message Details:</h3>
      <p><strong>Subject:</strong> ${subject}</p>
      <div style="background-color: #f9fafb; padding: 15px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #3b82f6;">
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
      </div>
      
      <hr>
      <p style="color: #6b7280; font-size: 14px;">
        This message was sent from the Techy Technologies contact form.
      </p>
    `;

    const emailResponse = await resend.emails.send({
      from: "Techy Technologies <onboarding@resend.dev>",
      to: [adminEmail],
      subject: `Contact Form: ${subject}`,
      html: emailHtml,
      reply_to: email,
    });

    console.log("Contact email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
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
