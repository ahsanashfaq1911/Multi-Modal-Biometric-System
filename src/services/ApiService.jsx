import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000";

export async function apiRequest({
  url,
  method = "GET",
  data = null,
  headers = {},
  params = {},
  isFormData = false,
}) {
  try {
    const fullUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;

    const config = {
      method,
      url: fullUrl,
      headers,
      params,
    };

    if (data) {
      config.data = isFormData ? data : JSON.stringify(data);
      if (!isFormData) {
        config.headers["Content-Type"] = "application/json";
      }
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("API Request Error:", error);
    return null;
  }
}
