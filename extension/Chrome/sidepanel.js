const trackerFrame = document.getElementById("trackerFrame");

const trackerOrigin = new URL(trackerFrame.src).origin;

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type !== "DDB_ROLL_DETECTED") {
    return;
  }

  console.log("Side panel received DDB roll:", message.roll);

  trackerFrame.contentWindow?.postMessage(
    {
      source: "dnd-roll-tracker-extension",

      type: "DDB_ROLL_DETECTED",

      roll: message.roll,
    },

    trackerOrigin,
  );
});
