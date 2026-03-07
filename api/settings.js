import { json, supabaseFetch } from "./_lib/supabase.js";

const defaults = {
  institute_name: "Priyadarshini Computer & Typewriting Institute, Shirol",
  short_name: "Priyadarshini Computer & Typewriting Institute",
  location:
    "Near Tahsildar Office Main Road, Shirol, Kolhapur. 2nd address: Bhaji Mandai, front of Hanuman Temple, Shirol.",
  whatsapp_number: "917558628660",
  contact_phone: "+91 755 862 8660",
  upi_id: "",
  upi_payee_name: "Priyadarshini Institute",
  upi_qr_image_url: "",
  upi_payment_note: "Admission fee payment",
};

export default async function handler(request, response) {
  if (request.method !== "GET") {
    return json(response, 405, { error: "Method not allowed." });
  }

  try {
    const result = await supabaseFetch("/rest/v1/site_settings?select=setting_key,setting_value", {
      method: "GET",
    });

    if (!result.ok) {
      return json(response, 500, { error: await result.text() });
    }

    const rows = await result.json();
    const settings = { ...defaults };
    rows.forEach((row) => {
      settings[row.setting_key] = row.setting_value;
    });

    return json(response, 200, { settings });
  } catch (error) {
    return json(response, 500, { error: error.message || "Unexpected server error." });
  }
}
