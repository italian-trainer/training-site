import { backend_url } from "./config";

export default async function fetchRole() {
  try {
    const response = await fetch(backend_url + "/auth/get_info", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        Connection: "keep-alive",
      },
    });
    if (response.status == 401) {
      return "/login";
    }
    const data = await response.json();
    if (data.data.role == "employee") {
      return "/employee";
    } else {
      return "/manager";
    }
  } catch (err) {
    return "/login";
  }
}
