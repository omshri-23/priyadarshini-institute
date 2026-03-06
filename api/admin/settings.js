import { authorizeAdmin, hashPassword, json, supabaseFetch } from "../_lib/supabase.js";

const allowedKeys = [
  "institute_name",
  "short_name",
  "location",
  "whatsapp_number",
  "contact_phone",
  "upi_id",
  "upi_payee_name",
  "upi_qr_image_url",
  "upi_payment_note",
];

export default async function handler(request, response) {
  if (!(await authorizeAdmin(request, response))) {
    return;
  }

  try {
    if (request.method === "GET") {
      const result = await supabaseFetch("/rest/v1/site_settings?select=setting_key,setting_value", {
        method: "GET",
      });

      return json(response, result.ok ? 200 : 500, {
        rows: result.ok ? await result.json() : [],
        error: result.ok ? null : await result.text(),
      });
    }

    if (request.method === "PUT") {
      const settings = request.body || {};
      const entries = Object.entries(settings).filter(([key]) => allowedKeys.includes(key));

      for (const [settingKey, settingValue] of entries) {
        const result = await supabaseFetch("/rest/v1/site_settings", {
          method: "POST",
          headers: {
            Prefer: "resolution=merge-duplicates,return=minimal",
          },
          body: JSON.stringify({
            setting_key: settingKey,
            setting_value: String(settingValue ?? ""),
          }),
        });

        if (!result.ok) {
          return json(response, 500, { error: await result.text() });
        }
      }

      const currentUsername = request.headers["x-admin-user"];
      const nextUsername = String(settings.admin_username || "").trim();
      const nextPassword = String(settings.admin_password || "").trim();

      if (nextUsername && nextUsername !== currentUsername) {
        const renameResult = await supabaseFetch(
          `/rest/v1/admin_users?username=eq.${encodeURIComponent(currentUsername)}`,
          {
            method: "PATCH",
            headers: { Prefer: "return=minimal" },
            body: JSON.stringify({ username: nextUsername }),
          },
        );

        if (!renameResult.ok) {
          return json(response, 500, { error: await renameResult.text() });
        }
      }

      if (nextPassword) {
        const passwordResult = await supabaseFetch(
          `/rest/v1/admin_users?username=eq.${encodeURIComponent(nextUsername || currentUsername)}`,
          {
            method: "PATCH",
            headers: { Prefer: "return=minimal" },
            body: JSON.stringify({ password_hash: hashPassword(nextPassword) }),
          },
        );

        if (!passwordResult.ok) {
          return json(response, 500, { error: await passwordResult.text() });
        }
      }

      return json(response, 200, { ok: true });
    }

    return json(response, 405, { error: "Method not allowed." });
  } catch (error) {
    return json(response, 500, { error: error.message || "Unexpected server error." });
  }
}
