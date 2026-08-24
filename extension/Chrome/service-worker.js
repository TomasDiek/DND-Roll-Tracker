chrome.sidePanel
  .setPanelBehavior({
    openPanelOnActionClick: true,
  })
  .catch((error) => {
    console.error("Could not configure side panel:", error);
  });
