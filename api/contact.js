import { json, supabaseFetch } from "./_lib/supabase.js";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return json(response, 405, { error: "Method not allowed." });
  }

  const body = request.body || {};
  const senderName = String(body.name || "").trim();
  const phoneNumber = String(body.phone || "").trim();
  const message = String(body.message || "").trim();

  if (!senderName || !phoneNumber || !message) {
    return json(response, 400, { error: "name, phone, and message are required." });
  }

  try {
    const result = await supabaseFetch("/rest/v1/contact_messages", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        sender_name: senderName,
        phone_number: phoneNumber,
        message,
        status: "new",
      }),
    });

    return json(response, result.ok ? 201 : 500, {
      ok: result.ok,
      error: result.ok ? null : await result.text(),
    });
  } catch (error) {
    return json(response, 500, { error: error.message || "Unexpected server error." });
  }
}
