import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactNotificationRequest {
  name: string;
  email: string;
  projectType: string;
  message: string;
  adminEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, projectType, message, adminEmail }: ContactNotificationRequest = await req.json();

    // Use the Resend account owner email for testing (before domain verification)
    // After verifying domain at resend.com/domains, you can send to any email
    const notificationEmail = "h.kmustfa0@gmail.com";

    console.log("Sending contact notification to:", notificationEmail);
    console.log("Original admin email:", adminEmail);
    console.log("From:", name, email);

    // Send notification to admin (using verified email for now)
    const adminNotification = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: [notificationEmail],
      subject: `🔔 New ${projectType} inquiry from ${name}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">📬 New Contact Message</h1>
          </div>
          
          <div style="padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; width: 120px;">👤 Name:</td>
                  <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">📧 Email:</td>
                  <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">📁 Project:</td>
                  <td style="padding: 8px 0;"><span style="background: #667eea; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; text-transform: capitalize;">${projectType}</span></td>
                </tr>
              </table>
            </div>
            
            <div style="margin: 20px 0;">
              <h3 style="color: #374151; margin-bottom: 12px; font-size: 16px;">💬 Message:</h3>
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
                <p style="white-space: pre-wrap; line-height: 1.8; color: #4b5563; margin: 0;">${message}</p>
              </div>
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
              <a href="mailto:${email}?subject=Re: ${projectType} inquiry" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600;">
                ✉️ Reply to ${name}
              </a>
            </div>
            
            <p style="color: #9ca3af; font-size: 12px; margin-top: 30px; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 20px;">
              This notification was sent from your portfolio contact form.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Admin notification result:", JSON.stringify(adminNotification));

    // Skip sender confirmation for now (requires domain verification)
    // After verifying your domain, uncomment this section

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Notification sent successfully",
        adminNotification 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending notification:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
