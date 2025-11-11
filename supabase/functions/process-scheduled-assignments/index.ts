import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log("Processing scheduled role assignments...");

    const now = new Date().toISOString();

    // Find assignments that should start now
    const { data: assignmentsToStart, error: startError } = await supabaseClient
      .from("scheduled_role_assignments")
      .select(`
        *,
        user_profile:profiles!scheduled_role_assignments_user_id_fkey(full_name, email)
      `)
      .eq("status", "scheduled")
      .lte("start_date", now);

    if (startError) {
      console.error("Error fetching assignments to start:", startError);
      throw startError;
    }

    console.log(`Found ${assignmentsToStart?.length || 0} assignments to start`);

    // Process each assignment to start
    for (const assignment of assignmentsToStart || []) {
      try {
        // Check if user already has a role
        const { data: existingRole } = await supabaseClient
          .from("user_roles")
          .select("id, role, company")
          .eq("user_id", assignment.user_id)
          .maybeSingle();

        const oldRole = existingRole?.role || null;
        const oldCompany = existingRole?.company || null;

        // Update or insert role
        if (existingRole) {
          await supabaseClient
            .from("user_roles")
            .update({
              role: assignment.role,
              company: assignment.company,
              assigned_by: assignment.created_by
            })
            .eq("user_id", assignment.user_id);
        } else {
          await supabaseClient
            .from("user_roles")
            .insert({
              user_id: assignment.user_id,
              role: assignment.role,
              company: assignment.company,
              assigned_by: assignment.created_by
            });
        }

        // Mark assignment as active
        await supabaseClient
          .from("scheduled_role_assignments")
          .update({ status: "active" })
          .eq("id", assignment.id);

        // Log the change
        await supabaseClient
          .from("role_change_audit_log")
          .insert({
            changed_by: assignment.created_by,
            affected_user: assignment.user_id,
            old_role: oldRole,
            new_role: assignment.role,
            old_company: oldCompany,
            new_company: assignment.company,
            action_type: existingRole ? "updated" : "assigned",
            notes: `Scheduled assignment activated: ${assignment.notes || "N/A"}`
          });

        // Send notification email
        try {
          await supabaseClient.functions.invoke("send-role-notification", {
            body: {
              userName: assignment.user_profile.full_name,
              userEmail: assignment.user_profile.email,
              role: assignment.role,
              company: assignment.company,
              actionType: existingRole ? "updated" : "assigned",
              changedBy: "Automated System"
            }
          });
        } catch (emailError) {
          console.error("Failed to send email:", emailError);
        }

        console.log(`Started assignment for user ${assignment.user_id}`);
      } catch (error) {
        console.error(`Failed to start assignment ${assignment.id}:`, error);
      }
    }

    // Find assignments that should end now
    const { data: assignmentsToEnd, error: endError } = await supabaseClient
      .from("scheduled_role_assignments")
      .select("*")
      .eq("status", "active")
      .not("end_date", "is", null)
      .lte("end_date", now);

    if (endError) {
      console.error("Error fetching assignments to end:", endError);
      throw endError;
    }

    console.log(`Found ${assignmentsToEnd?.length || 0} assignments to end`);

    // Process each assignment to end
    for (const assignment of assignmentsToEnd || []) {
      try {
        // Mark assignment as completed
        await supabaseClient
          .from("scheduled_role_assignments")
          .update({ status: "completed" })
          .eq("id", assignment.id);

        // Remove the role (or revert to previous role if needed)
        await supabaseClient
          .from("user_roles")
          .delete()
          .eq("user_id", assignment.user_id);

        // Log the removal
        await supabaseClient
          .from("role_change_audit_log")
          .insert({
            changed_by: assignment.created_by,
            affected_user: assignment.user_id,
            old_role: assignment.role,
            new_role: null,
            old_company: assignment.company,
            new_company: null,
            action_type: "removed",
            notes: `Scheduled assignment completed: ${assignment.notes || "N/A"}`
          });

        console.log(`Ended assignment for user ${assignment.user_id}`);
      } catch (error) {
        console.error(`Failed to end assignment ${assignment.id}:`, error);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        started: assignmentsToStart?.length || 0,
        ended: assignmentsToEnd?.length || 0
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );
  } catch (error: any) {
    console.error("Error processing scheduled assignments:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});
