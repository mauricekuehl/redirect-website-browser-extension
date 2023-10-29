function load() {
  chrome.storage.sync.get("redirects", ({ redirects }) => {
    const parent = document.querySelector(".redirects");
    parent.innerHTML = "";
    redirects.forEach((redirect, index) => {
      parent.innerHTML += `
      <div class="redirect">
        <div>
          <div>From: <span>${redirect.from}</span></div>
          <div>To: <span>${redirect.to}</span></div>
        </div>
        <div class="extra-boolean">with Path: ${redirect.withPath}</div>
        <div class="extra-boolean">with search: ${redirect.withSearch}</div>
        <button class="trash" data-index="${index}">delete</button>
      </div>
      `;
    });
    document.querySelectorAll(".trash").forEach((elm) =>
      elm.addEventListener("click", (event) => {
        chrome.storage.sync.set({
          redirects: redirects.filter(
            (value, index) => index !== parseInt(event.target.dataset.index)
          ),
        });
        load();
      })
    );
  });
}

document.querySelector("form").addEventListener("submit", (form) => {
  form.preventDefault();
  const formData = new FormData(document.querySelector("form"));
  const newRedirect = {
    from: formData.get("from"),
    to: formData.get("to"),
    withPath: formData.get("path") === "on",
    withSearch: formData.get("search") === "on",
  };
  chrome.storage.sync.get("redirects", ({ redirects }) => {
    if (!redirects) {
      redirects = [];
    }
    redirects.push(newRedirect);
    chrome.storage.sync.set({
      redirects: redirects,
    });
    document.querySelector("form").reset();
    load();
  });
});
load();
