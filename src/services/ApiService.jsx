const BASE_URL = "http://127.0.0.1:5000"; // Define your API base URL

export async function apiRequest({
  url,
  method = "GET",
  data = null,
  headers = {},
  params = {},
  isFormData = false,
}) {
  try {
    // ✅ Ensure URL is absolute or relative
    const fullUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;

    // ✅ Query Parameters Handle (e.g., ?id=5&type=school)
    const queryString = new URLSearchParams(params).toString();
    const requestUrl = queryString ? `${fullUrl}?${queryString}` : fullUrl;

    let options = { method, headers };

    // ✅ Handle Body Data
    if (data) {
      if (isFormData) {
        options.body = data; // FormData directly
      } else {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(data);
      }
    }

    let response = await fetch(requestUrl, options);
    let result = await response.json();

    if (!response.ok) {
      throw new Error(
        `HTTP Error! Status: ${response.status}, Message: ${
          result.message || "Unknown error"
        }`
      );
    }

    return result;
  } catch (error) {
    console.error("API Request Error:", error);
    return null; // ✅ Return null on error
  }
}
