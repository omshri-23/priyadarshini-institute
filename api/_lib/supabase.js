import crypto from "node:crypto";

export function json(response, statusCode, payload) {
  response.status(statusCode).setHeader("Content-Type", "application/json");
  response.end(JSON.stringify(payload));
}

export function getSupabaseConfig() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  return { supabaseUrl, serviceRoleKey };
}

export function supabaseHeaders(serviceRoleKey, extraHeaders = {}) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
    ...extraHeaders,
  };
}

export async function supabaseFetch(path, options = {}) {
  const { supabaseUrl, serviceRoleKey } = getSupabaseConfig();
  return fetch(`${supabaseUrl}${path}`, {
    ...options,
    headers: supabaseHeaders(serviceRoleKey, options.headers),
  });
}

export function hashPassword(password) {
  return crypto.createHash("sha256").update(String(password)).digest("hex");
}

export async function verifyAdminCredentials(username, password) {
  if (!username || !password) {
    return false;
  }

  const response = await supabaseFetch(
    `/rest/v1/admin_users?select=username,password_hash,is_active&username=eq.${encodeURIComponent(username)}&limit=1`,
    { method: "GET" },
  );

  if (!response.ok) {
    throw new Error("Unable to verify admin credentials.");
  }

  const rows = await response.json();
  const admin = rows[0];
  if (!admin || admin.is_active === false) {
    return false;
  }

  return admin.password_hash === hashPassword(password);
}

export async function authorizeAdmin(request, response) {
  const username = request.headers["x-admin-user"];
  const password = request.headers["x-admin-pass"];

  const valid = await verifyAdminCredentials(username, password);
  if (!valid) {
    json(response, 401, { error: "Invalid admin credentials." });
    return false;
  }

  return true;
}
