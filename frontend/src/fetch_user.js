import { backend_url } from "./config";

async function fetchRole() {
  const response = await fetch(backend_url + "/auth/get_info", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      Connection: "keep-alive",
    },
    body: JSON.stringify({
      receiver,
      subject,
      content,
    }),
  });
}
export default fetchRole;
