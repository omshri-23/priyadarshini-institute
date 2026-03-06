import { json, supabaseFetch } from "./_lib/supabase.js";

function maskName(fullName) {
  const parts = String(fullName || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "Student";
  }

  return parts
    .map((part, index) => {
      if (index === 0) {
        return part;
      }
      return `${part.charAt(0)}.`;
    })
    .join(" ");
}

export default async function handler(request, response) {
  if (request.method !== "GET") {
    return json(response, 405, { error: "Method not allowed." });
  }

  try {
    const latestResult = await supabaseFetch(
      "/rest/v1/student_registrations?select=student_code,student_name,selected_courses,admission_date,payment_status&order=id.desc&limit=3",
      { method: "GET" },
    );

    const countResult = await supabaseFetch(
      "/rest/v1/student_registrations?select=id&order=id.desc",
      {
        method: "GET",
        headers: {
          Prefer: "count=exact",
          Range: "0-0",
        },
      },
    );

    if (!latestResult.ok || !countResult.ok) {
      return json(response, 500, { error: "Unable to load highlights." });
    }

    const rows = await latestResult.json();
    const totalAdmissions = Number(countResult.headers.get("content-range")?.split("/")?.[1] || 0);

    return json(response, 200, {
      totalAdmissions,
      rows: rows.map((row) => ({
        studentCode: row.student_code,
        studentName: maskName(row.student_name),
        selectedCourses: row.selected_courses,
        admissionDate: row.admission_date,
        paymentStatus: row.payment_status,
      })),
    });
  } catch (error) {
    return json(response, 500, { error: error.message || "Unexpected server error." });
  }
}
