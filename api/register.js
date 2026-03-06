import { json, supabaseFetch } from "./_lib/supabase.js";

const requiredFields = ["firstName", "lastName", "gender", "contact", "address"];

function buildStudentCode(nextId) {
  const year = new Date().getFullYear();
  return `PCTI-${year}-${String(nextId).padStart(4, "0")}`;
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return json(response, 405, { error: "Method not allowed." });
  }

  const body = request.body || {};

  for (const field of requiredFields) {
    if (!String(body[field] || "").trim()) {
      return json(response, 400, { error: `${field} is required.` });
    }
  }

  if (!Array.isArray(body.courses) || body.courses.length === 0) {
    return json(response, 400, { error: "At least one course must be selected." });
  }

  const studentName = [body.firstName, body.middleName, body.lastName].filter(Boolean).join(" ").trim();

  try {
    const lastRowResponse = await supabaseFetch(
      "/rest/v1/student_registrations?select=id&order=id.desc&limit=1",
      { method: "GET" },
    );

    if (!lastRowResponse.ok) {
      return json(response, 500, { error: await lastRowResponse.text() });
    }

    const lastRows = await lastRowResponse.json();
    const nextId = (lastRows[0]?.id || 0) + 1;
    const studentCode = buildStudentCode(nextId);

    const insertResponse = await supabaseFetch("/rest/v1/student_registrations", {
      method: "POST",
      headers: {
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        student_code: studentCode,
        student_name: studentName,
        first_name: body.firstName,
        middle_name: body.middleName || null,
        last_name: body.lastName,
        gender: body.gender,
        email: body.email || null,
        contact_number: body.contact,
        parent_contact: body.parentContact || null,
        address: body.address,
        highest_education: Array.isArray(body.highestEducation) ? body.highestEducation.join(", ") : "",
        selected_courses: body.courses.join(", "),
        typing_options: Array.isArray(body.typingOptions) ? body.typingOptions.join(", ") : "",
        payment_status: "pending",
      }),
    });

    if (!insertResponse.ok) {
      return json(response, 500, { error: await insertResponse.text() });
    }

    const [row] = await insertResponse.json();
    return json(response, 201, {
      ok: true,
      studentCode: row.student_code,
      admissionDate: row.admission_date,
      studentName: row.student_name,
      selectedCourses: row.selected_courses,
      paymentStatus: row.payment_status,
    });
  } catch (error) {
    return json(response, 500, { error: error.message || "Unexpected server error." });
  }
}
