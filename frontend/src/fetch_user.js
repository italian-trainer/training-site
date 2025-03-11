import { backend_url } from "./config";

export default async function fetchRole() {
  const response = await fetch(backend_url + "/auth/get_info", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      Connection: "keep-alive",
    },
  });

  const data = await response.json();
  if (data.data.role == "employee") {
    return "/employee";
  } else {
    return "/manager";
  }
}
