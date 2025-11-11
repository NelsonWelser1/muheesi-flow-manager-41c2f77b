import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RoleNotificationRequest {
  userName: string;
  userEmail: string;
  role: string;
  company: string;
  actionType: 'assigned' | 'updated';
  changedBy: string;
}

const getRolePermissions = (role: string): string => {
  switch (role) {
    case 'sysadmin':
      return 'Full system access - manage all users, companies, and data across the entire system';
    case 'manager':
      return 'Full CRUD access - create, read, update, and delete all data within your assigned company';
    case 'staff':
      return 'Read-only access - view all data within your assigned company';
    default:
      return 'Standard access';
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userName, userEmail, role, company, actionType, changedBy }: RoleNotificationRequest = await req.json();

    console.log('Sending role notification email to:', userEmail);

    const permissions = getRolePermissions(role);
    const action = actionType === 'assigned' ? 'assigned' : 'updated';

    const emailResponse = await resend.emails.send({
      from: "Role Management <onboarding@resend.dev>",
      to: [userEmail],
      subject: `Your Role Has Been ${action === 'assigned' ? 'Assigned' : 'Updated'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
            Role ${action === 'assigned' ? 'Assignment' : 'Update'} Notification
          </h1>
          
          <p>Hello ${userName},</p>
          
          <p>Your role has been ${action} by ${changedBy}.</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #0066cc; margin-top: 0;">Your New Access Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #ddd;"><strong>Role:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #ddd; text-transform: capitalize;">${role}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #ddd;"><strong>Company:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${company}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0;"><strong>Permissions:</strong></td>
                <td style="padding: 10px 0;">${permissions}</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #856404;">What This Means For You</h3>
            ${role === 'sysadmin' ? `
              <ul style="color: #856404; margin: 0;">
                <li>You have full administrative access to all companies</li>
                <li>You can manage all users and assign roles</li>
                <li>You can access and modify all data across the system</li>
              </ul>
            ` : role === 'manager' ? `
              <ul style="color: #856404; margin: 0;">
                <li>You have full access to data within ${company}</li>
                <li>You can create, edit, and delete records</li>
                <li>You can view reports and analytics for your company</li>
              </ul>
            ` : `
              <ul style="color: #856404; margin: 0;">
                <li>You have read-only access to ${company} data</li>
                <li>You can view records and reports</li>
                <li>Contact your manager if you need to modify data</li>
              </ul>
            `}
          </div>
          
          <p style="margin-top: 30px;">
            If you have any questions about your new role or permissions, please contact your system administrator.
          </p>
          
          <p style="color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            This is an automated notification. Please do not reply to this email.
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-role-notification function:", error);
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
