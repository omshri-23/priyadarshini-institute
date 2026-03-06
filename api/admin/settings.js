import { isAuthorized, json, supabaseFetch } from "../_lib/supabase.js";

const allowedKeys = [
  "institute_name",
  "short_name",
  "location",
  "whatsapp_number",
  "contact_phone",
  "upi_id",
];

export default async function handler(request, response) {
  if (!isAuthorized(request)) {
    return json(response, 401, { error: "Invalid admin credentials." });
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

      return json(response, 200, { ok: true });
    }

    return json(response, 405, { error: "Method not allowed." });
  } catch (error) {
    return json(response, 500, { error: error.message || "Unexpected server error." });
  }
}
