import { authorizeAdmin, json, supabaseFetch } from "../_lib/supabase.js";

export default async function handler(request, response) {
  if (!(await authorizeAdmin(request, response))) {
    return;
  }

  try {
    if (request.method === "GET") {
      const result = await supabaseFetch(
        "/rest/v1/contact_messages?select=id,sender_name,phone_number,message,status,created_at&order=id.desc",
        { method: "GET" },
      );

      return json(response, result.ok ? 200 : 500, {
        rows: result.ok ? await result.json() : [],
        error: result.ok ? null : await result.text(),
      });
    }

    if (request.method === "PATCH") {
      const { id, status } = request.body || {};
      if (!id || !status) {
        return json(response, 400, { error: "id and status are required." });
      }

      const result = await supabaseFetch(`/rest/v1/contact_messages?id=eq.${id}`, {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({ status }),
      });

      return json(response, result.ok ? 200 : 500, {
        ok: result.ok,
        error: result.ok ? null : await result.text(),
      });
    }

    if (request.method === "DELETE") {
      const { id } = request.query || {};
      if (!id) {
        return json(response, 400, { error: "id is required." });
      }

      const result = await supabaseFetch(`/rest/v1/contact_messages?id=eq.${id}`, {
        method: "DELETE",
        headers: { Prefer: "return=minimal" },
      });

      return json(response, result.ok ? 200 : 500, {
        ok: result.ok,
        error: result.ok ? null : await result.text(),
      });
    }

    return json(response, 405, { error: "Method not allowed." });
  } catch (error) {
    return json(response, 500, { error: error.message || "Unexpected server error." });
  }
}
