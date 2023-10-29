chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    chrome.storage.sync.get("redirects", ({ redirects }) => {
      const url = new URL(changeInfo.url);
      redirects.forEach((redirect) => {
        if (url.href.includes(redirect.from)) {
          let newUrl = redirect.to;
          newUrl += redirect.withPath ? url.pathname : "";
          newUrl += redirect.withSearch ? url.search : "";
          chrome.tabs.update({
            url: newUrl,
          });
        }
      });
    });
  }
});
