import { authorizeAdmin, json, supabaseFetch } from "../_lib/supabase.js";

function createCountHeaders() {
  return {
    Prefer: "count=exact",
    Range: "0-0",
  };
}

function buildRegistrationFilters(query) {
  const filters = [];
  const search = String(query || "").trim();

  if (search) {
    const value = `*${search}*`;
    filters.push(
      `or=${encodeURIComponent(`(${[
        `student_name.ilike.${value}`,
        `selected_courses.ilike.${value}`,
        `contact_number.ilike.${value}`,
        `student_code.ilike.${value}`,
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
    throw new Error("Unable to load registration counts.");
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
      const filters = buildRegistrationFilters(request.query?.query);
      const selectPath = appendFilters(
        `/rest/v1/student_registrations?select=id,student_code,student_name,selected_courses,contact_number,admission_date,payment_status,email,gender,parent_contact,address,highest_education,typing_options,created_at&order=id.desc&limit=${limit}&offset=${offset}`,
        filters,
      );

      const [result, total, pending, paid] = await Promise.all([
        supabaseFetch(selectPath, { method: "GET" }),
        fetchCount(appendFilters("/rest/v1/student_registrations?select=id", filters)),
        fetchCount(
          appendFilters("/rest/v1/student_registrations?select=id&payment_status=eq.pending", filters),
        ),
        fetchCount(
          appendFilters(
            "/rest/v1/student_registrations?select=id&payment_status=in.(paid,confirmed)",
            filters,
          ),
        ),
      ]);

      if (!result.ok) {
        return json(response, 500, { rows: [], error: await result.text() });
      }

      return json(response, 200, {
        rows: await result.json(),
        total,
        stats: { total, pending, paid },
        error: null,
      });
    }

    if (request.method === "PATCH") {
      const { id, paymentStatus } = request.body || {};
      if (!id || !paymentStatus) {
        return json(response, 400, { error: "id and paymentStatus are required." });
      }

      const result = await supabaseFetch(`/rest/v1/student_registrations?id=eq.${id}`, {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({ payment_status: paymentStatus }),
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

      const result = await supabaseFetch(`/rest/v1/student_registrations?id=eq.${id}`, {
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
