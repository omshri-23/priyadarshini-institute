import { authorizeAdmin, json, supabaseFetch } from "../_lib/supabase.js";

function createCountHeaders() {
  return {
    Prefer: "count=exact",
    Range: "0-0",
  };
}

function buildMessageFilters(query) {
  const filters = [];
  const search = String(query || "").trim();

  if (search) {
    const value = `*${search}*`;
    filters.push(
      `or=${encodeURIComponent(`(${[
        `sender_name.ilike.${value}`,
        `phone_number.ilike.${value}`,
        `message.ilike.${value}`,
        `status.ilike.${value}`,
      ].join(",")})`)}`,
    );
  }

  return filters;
}

function appendFilters(basePath, filters) {
  if (filters.length === 0) {
    return basePath;
  }

  const separator = basePath.includes("?") ? "&" : "?";
  return `${basePath}${separator}${filters.join("&")}`;
}

async function fetchCount(path) {
  const result = await supabaseFetch(path, { method: "GET", headers: createCountHeaders() });
  if (!result.ok) {
    throw new Error("Unable to load message counts.");
  }
  return Number(result.headers.get("content-range")?.split("/")?.[1] || 0);
}

export default async function handler(request, response) {
  if (!(await authorizeAdmin(request, response))) {
    return;
  }

  try {
    if (request.method === "GET") {
      const limit = Math.min(Math.max(Number(request.query?.limit || 20), 1), 50);
      const offset = Math.max(Number(request.query?.offset || 0), 0);
      const filters = buildMessageFilters(request.query?.query);
      const selectPath = appendFilters(
        `/rest/v1/contact_messages?select=id,sender_name,phone_number,message,status,created_at&order=id.desc&limit=${limit}&offset=${offset}`,
        filters,
      );

      const [result, total, fresh, resolved] = await Promise.all([
        supabaseFetch(selectPath, { method: "GET" }),
        fetchCount(appendFilters("/rest/v1/contact_messages?select=id", filters)),
        fetchCount(appendFilters("/rest/v1/contact_messages?select=id&status=eq.new", filters)),
        fetchCount(appendFilters("/rest/v1/contact_messages?select=id&status=eq.done", filters)),
      ]);

      if (!result.ok) {
        return json(response, 500, { rows: [], error: await result.text() });
      }

      return json(response, 200, {
        rows: await result.json(),
        total,
        stats: { total, fresh, resolved },
        error: null,
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
