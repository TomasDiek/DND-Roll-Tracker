const processedRollIds = new Set();

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    try {
      if (!details.requestBody?.raw?.length) {
        return;
      }

      const bodyText = decodeRequestBody(
        details.requestBody.raw
      );

      if (!bodyText) {
        return;
      }

      const payload = JSON.parse(bodyText);

      processDndBeyondPayload(payload);
    } catch (error) {
      console.error(
        "DDB roll listener error:",
        error
      );
    }
  },
  {
    urls: [
      "https://api.dndbeyond.com/bi/events"
    ],
    types: [
      "xmlhttprequest"
    ]
  },
  [
    "requestBody"
  ]
);

function decodeRequestBody(rawParts) {
  const decoder =
    new TextDecoder("utf-8");

  let text = "";

  for (const part of rawParts) {
    if (!part.bytes) {
      continue;
    }

    text += decoder.decode(
      part.bytes,
      {
        stream: true
      }
    );
  }

  text += decoder.decode();

  return text;
}

function processDndBeyondPayload(payload) {
  const entries =
    payload?.Entries;

  if (!Array.isArray(entries)) {
    return;
  }

  for (const entry of entries) {
    if (!entry?.Detail) {
      continue;
    }

    let detail;

    try {
      detail =
        JSON.parse(entry.Detail);
    } catch {
      continue;
    }

    if (
      detail.MESSAGE_NAME !==
        "GAME_ACTION" ||
      detail.ACTION_TAKEN !==
        "dice_roll"
    ) {
      continue;
    }

    const actions =
      detail.ACTION_DESCRIPTORS;

    if (!Array.isArray(actions)) {
      continue;
    }

    for (const action of actions) {
      processDiceAction(action);
    }
  }
}

function processDiceAction(action) {
  const d20Results =
    action?.RESULTS?.D20;

  if (
    !Array.isArray(d20Results) ||
    d20Results.length === 0
  ) {
    return;
  }

  const rollId =
    action.ROLL_ID;

  if (
    rollId &&
    processedRollIds.has(rollId)
  ) {
    console.log(
      "Ignoring duplicate DDB roll:",
      rollId
    );

    return;
  }

  if (rollId) {
    processedRollIds.add(rollId);
  }

  const trackerRolls =
    d20Results
      .filter(
        (value) =>
          Number.isInteger(value) &&
          value >= 1 &&
          value <= 20
      )
      .map((value) => ({
        value,
        type:
          value === 20
            ? "nat20"
            : value === 1
              ? "nat1"
              : "normal"
      }));

  if (trackerRolls.length === 0) {
    return;
  }

  console.log(
    "🎲 D&D Beyond roll detected",
    {
      rollId,
      action: action.ACTION,
      rollType: action.TYPE,
      d20Results,
      total: action.TOTAL,
      trackerRolls
    }
  );

  chrome.runtime
    .sendMessage({
      type:
        "DDB_ROLL_DETECTED",

      roll: {
        rollId:
          action.ROLL_ID,

        action:
          action.ACTION || "",

        rollType:
          action.TYPE || "",

        d20Results:
          trackerRolls.map(
            (roll) =>
              roll.value
          ),

        total:
          action.TOTAL ?? null
      }
    })
    .catch(() => {
      // Sidebar panel may be closed.
    });
}