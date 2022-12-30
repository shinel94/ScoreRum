export const getIsExistId: (id: string) => Promise<boolean> = (id) => {
  const url = new URL(window.location.origin + "/api/auth/exist");
  const params = new URLSearchParams(url.search);
  params.set("id", id);
  url.search = params.toString();
  return fetch(url.toString(), {
    method: "GET",
  }).then((response) => {
    if (response.ok) {
      return response.json().then((data) => {
        return data.exist;
      });
    }
  });
};
