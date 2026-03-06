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

export function isAuthorized(request) {
  const username = request.headers["x-admin-user"];
  const password = request.headers["x-admin-pass"];

  return (
    username &&
    password &&
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  );
}

export async function supabaseFetch(path, options = {}) {
  const { supabaseUrl, serviceRoleKey } = getSupabaseConfig();
  return fetch(`${supabaseUrl}${path}`, {
    ...options,
    headers: supabaseHeaders(serviceRoleKey, options.headers),
  });
}
