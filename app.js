import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app-check.js";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
  getDatabase,
  ref,
  set,
  get,
  push,
  update,
  onValue,
  runTransaction,
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";

// =====================================================
// FIREBASE CONFIG
// =====================================================

const firebaseConfig = {
  apiKey: "AIzaSyAAXfSK5HeH0iut4Kda_vcWaDw06p00XDg",
  authDomain: "dnd-roll-tracker.firebaseapp.com",
  databaseURL:
    "https://dnd-roll-tracker-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "dnd-roll-tracker",
  storageBucket: "dnd-roll-tracker.firebasestorage.app",
  messagingSenderId: "159656026743",
  appId: "1:159656026743:web:d4590e238ac5f13ee31c72",
};

// =====================================================
// FIREBASE INIT
// =====================================================

const app = initializeApp(firebaseConfig);
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider(
    "6Lf_mIotAAAAAP-EfSrh3d-lEA_oxWI2kttcxD-M",
  ),
  isTokenAutoRefreshEnabled: true,
});
const auth = getAuth(app);
const db = getDatabase(app);

// =====================================================
// STATE
// =====================================================

let currentUser = null;

// CAMPAIGN

let activeCampaignCode = "";

let campaignData = null;

let unsubscribeCampaign = null;

// SESSION

let activeSessionCode = "";

let sessionData = null;

let unsubscribeSession = null;

// =====================================================
// DOM
// =====================================================

const sessionSetup = document.getElementById("sessionSetup");

const sessionNameInput = document.getElementById("sessionName");

const sessionCodeInput = document.getElementById("sessionCodeInput");

const createSessionButton = document.getElementById("createSessionButton");

const joinSessionButton = document.getElementById("joinSessionButton");

const activeSession = document.getElementById("activeSession");

const activeSessionName = document.getElementById("activeSessionName");

const activeSessionCodeElement = document.getElementById("activeSessionCode");

const leaveSessionButton = document.getElementById("leaveSessionButton");

const playerCard = document.getElementById("playerCard");

const playerRegistration = document.getElementById("playerRegistration");

const myPlayerInfo = document.getElementById("myPlayerInfo");

const myPlayerName = document.getElementById("myPlayerName");

const rollPlayerTitle = document.getElementById("rollPlayerTitle");

const hostPlayerControls = document.getElementById("hostPlayerControls");

const undoButton = document.getElementById("undoButton");
const addPlayerButton = document.getElementById("addPlayerButton");

const rollCard = document.getElementById("rollCard");

const playerSelect = document.getElementById("playerSelect");

const rollButton = document.getElementById("rollButton");

const nat20Button = document.getElementById("nat20Button");

const nat1Button = document.getElementById("nat1Button");

const leaderboardCard = document.getElementById("leaderboardCard");

const leaderboardBody = document.getElementById("leaderboardBody");

const winnerElement = document.getElementById("winner");
const sessionStatus = document.getElementById("sessionStatus");

const finishSessionButton = document.getElementById("finishSessionButton");

const finishedMessage = document.getElementById("finishedMessage");
const campaignSetup = document.getElementById("campaignSetup");

const campaignNameInput = document.getElementById("campaignName");

const campaignCodeInput = document.getElementById("campaignCodeInput");

const createCampaignButton = document.getElementById("createCampaignButton");

const joinCampaignButton = document.getElementById("joinCampaignButton");

const activeCampaign = document.getElementById("activeCampaign");

const activeCampaignName = document.getElementById("activeCampaignName");

const activeCampaignCodeElement = document.getElementById("activeCampaignCode");

const leaveCampaignButton = document.getElementById("leaveCampaignButton");

const campaignPlayerCard = document.getElementById("campaignPlayerCard");

const campaignPlayerSetup = document.getElementById("campaignPlayerSetup");

const campaignPlayerNameInput = document.getElementById("campaignPlayerName");

const saveCampaignPlayerButton = document.getElementById(
  "saveCampaignPlayerButton",
);

const campaignPlayerInfo = document.getElementById("campaignPlayerInfo");

const campaignPlayerDisplayName = document.getElementById(
  "campaignPlayerDisplayName",
);

const sessionCard = document.getElementById("sessionCard");

const createSessionArea = document.getElementById("createSessionArea");

const sessionJoinDivider = document.getElementById("sessionJoinDivider");

const sessionPlayerHint = document.getElementById("sessionPlayerHint");
const allTimeCard = document.getElementById("allTimeCard");

const allTimeEmpty = document.getElementById("allTimeEmpty");

const allTimeContent = document.getElementById("allTimeContent");

const allTimeBody = document.getElementById("allTimeBody");

const campaignTotalSessions = document.getElementById("campaignTotalSessions");

const campaignTotalRolls = document.getElementById("campaignTotalRolls");

const campaignTotalNat20 = document.getElementById("campaignTotalNat20");

const campaignTotalNat1 = document.getElementById("campaignTotalNat1");

const historyCard = document.getElementById("historyCard");

const historyEmpty = document.getElementById("historyEmpty");

const historyList = document.getElementById("historyList");
const recordsCard = document.getElementById("recordsCard");

const recordsEmpty = document.getElementById("recordsEmpty");

const recordsGrid = document.getElementById("recordsGrid");

const recordMostWins = document.getElementById("recordMostWins");

const recordMostNat20 = document.getElementById("recordMostNat20");

const recordMostNat1 = document.getElementById("recordMostNat1");

const recordMostRolls = document.getElementById("recordMostRolls");

const recordSessionNat20 = document.getElementById("recordSessionNat20");

const recordSessionNat1 = document.getElementById("recordSessionNat1");

const recordSessionRolls = document.getElementById("recordSessionRolls");

const recordBestCritRate = document.getElementById("recordBestCritRate");
const campaignPlayerSelect = document.getElementById("campaignPlayerSelect");

const selectCampaignPlayerButton = document.getElementById(
  "selectCampaignPlayerButton",
);

const changeCampaignPlayerButton = document.getElementById(
  "changeCampaignPlayerButton",
);
// =====================================================
// EVENTS
// =====================================================

createSessionButton.addEventListener("click", createSession);

joinSessionButton.addEventListener("click", joinSession);

leaveSessionButton.addEventListener("click", leaveSession);

addPlayerButton.addEventListener("click", addPlayer);

rollButton.addEventListener("click", () => addRoll("normal"));

nat20Button.addEventListener("click", () => addRoll("nat20"));

nat1Button.addEventListener("click", () => addRoll("nat1"));
undoButton.addEventListener("click", undoLastRoll);
playerSelect.addEventListener("change", updateRollTitle);
finishSessionButton.addEventListener("click", finishSession);
createCampaignButton.addEventListener("click", createCampaign);

joinCampaignButton.addEventListener("click", joinCampaign);

leaveCampaignButton.addEventListener("click", leaveCampaign);

saveCampaignPlayerButton.addEventListener("click", saveCampaignPlayerProfile);
selectCampaignPlayerButton.addEventListener(
  "click",
  selectExistingCampaignPlayer,
);

changeCampaignPlayerButton.addEventListener("click", changeCampaignPlayer);
// =====================================================
// AUTH
// =====================================================

async function authenticate() {
  return new Promise((resolve, reject) => {
    let isSigningIn = false;
    let unsubscribe;

    unsubscribe = onAuthStateChanged(
      auth,

      async (user) => {
        if (user) {
          currentUser = user;

          if (unsubscribe) {
            unsubscribe();
          }

          resolve(user);
          return;
        }

        if (isSigningIn) {
          return;
        }

        isSigningIn = true;

        try {
          await signInAnonymously(auth);
        } catch (error) {
          if (unsubscribe) {
            unsubscribe();
          }

          reject(error);
        }
      },

      reject,
    );
  });
}

// =====================================================
// SESSION CODE
// =====================================================

function generateSessionCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let code = "";

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);

    code += chars[randomIndex];
  }

  return code;
}

// =====================================================
// CREATE SESSION
// =====================================================

async function createSession() {
  if (!activeCampaignCode) {
    alert("Select a campaign first.");

    return;
  }

  const isCampaignHost = campaignData?.createdBy === currentUser.uid;

  if (!isCampaignHost) {
    alert("Only the campaign host can create sessions.");

    return;
  }

  const sessionName = sessionNameInput.value.trim() || "D&D Session";

  let code;

  let available = false;

  try {
    while (!available) {
      code = generateSessionCode();

      const sessionSnapshot = await get(ref(db, `sessions/${code}`));

      available = !sessionSnapshot.exists();
    }

    const createdAt = Date.now();

    const session = {
      campaignCode: activeCampaignCode,

      name: sessionName,

      createdBy: currentUser.uid,

      createdAt: createdAt,

      status: "active",
    };

    const updates = {};

    updates[`sessions/${code}`] = session;

    updates[`campaigns/${activeCampaignCode}/sessions/${code}`] = {
      name: sessionName,

      createdAt: createdAt,

      status: "active",
    };

    await update(ref(db), updates);

    connectToSession(code);
  } catch (error) {
    console.error("Create session error:", error);

    alert("Could not create session.");
  }
}

// =====================================================
// JOIN SESSION
// =====================================================

async function joinSession() {
  try {
    const code = sessionCodeInput.value.trim().toUpperCase();

    if (!code) {
      alert("Enter session code.");
      return;
    }

    const sessionSnapshot = await get(ref(db, `sessions/${code}`));
    if (!sessionSnapshot.exists()) {
      alert("Session not found.");
      return;
    }
    const joiningSession = sessionSnapshot.val();
    if (joiningSession.campaignCode !== activeCampaignCode) {
      alert("This session belongs to another campaign.");

      return;
    }

    connectToSession(code);
  } catch (error) {
    console.error("Join session error:", error);

    alert("Could not join session.");
  }
}

// =====================================================
// CONNECT TO SESSION
// =====================================================

function connectToSession(code) {
  if (unsubscribeSession) {
    unsubscribeSession();
    unsubscribeSession = null;
  }

  activeSessionCode = code;

  localStorage.setItem("dndActiveSessionCode", code);

  const sessionRef = ref(db, `sessions/${code}`);

  unsubscribeSession = onValue(
    sessionRef,

    (snapshot) => {
      if (!snapshot.exists()) {
        alert("This session no longer exists.");

        leaveSession();
        return;
      }

      sessionData = snapshot.val();

      render();
    },

    (error) => {
      console.error("Session listener error:", error);
    },
  );
}

// =====================================================
// LEAVE SESSION
// =====================================================

function leaveSession() {
  if (unsubscribeSession) {
    unsubscribeSession();
    unsubscribeSession = null;
  }

  localStorage.removeItem("dndActiveSessionCode");

  activeSessionCode = "";
  sessionData = null;

  render();
}

// =====================================================
// ADD PLAYER
// =====================================================

async function addPlayer() {
  if (sessionData?.status !== "active") {
    alert("This session is already finished.");

    return;
  }

  if (!activeSessionCode) {
    return;
  }

  const campaignPlayerEntry = getMyCampaignPlayerEntry();

  if (!campaignPlayerEntry) {
    alert("Select your campaign player first.");

    return;
  }

  const campaignPlayerId = campaignPlayerEntry.id;

  const campaignPlayer = campaignPlayerEntry.player;

  const existingPlayer = sessionData?.players?.[campaignPlayerId];

  // Jei playeris jau yra session,
  // nieko naujo nekuriam.
  if (existingPlayer) {
    render();

    return;
  }

  try {
    await set(
      ref(db, `sessions/${activeSessionCode}/players/${campaignPlayerId}`),

      {
        campaignPlayerId: campaignPlayerId,

        name: campaignPlayer.name,

        rolls: 0,

        nat20: 0,

        nat1: 0,
      },
    );

    render();
  } catch (error) {
    console.error("Join session error:", error);

    alert("Could not join session as player.");
  }
}
function getMyPlayerEntry() {
  const campaignPlayerEntry = getMyCampaignPlayerEntry();

  if (!campaignPlayerEntry) {
    return null;
  }

  const playerId = campaignPlayerEntry.id;

  const player = sessionData?.players?.[playerId];

  if (!player) {
    return null;
  }

  return {
    id: playerId,

    player: player,
  };
}
function getControlledPlayerId() {
  const isHost = sessionData?.createdBy === currentUser.uid;

  if (isHost) {
    return playerSelect.value;
  }

  const myPlayer = getMyPlayerEntry();

  return myPlayer?.id || null;
}
// =====================================================
// ADD ROLL
// =====================================================

async function addRoll(type) {
  const playerId = getControlledPlayerId();
  if (sessionData?.status !== "active") {
    alert("This session is already finished.");

    return;
  }
  if (!playerId) {
    alert("No player selected.");

    return;
  }

  const playerRef = ref(
    db,
    `sessions/${activeSessionCode}/players/${playerId}`,
  );

  try {
    await runTransaction(
      playerRef,

      (player) => {
        if (!player) {
          return player;
        }

        player.rolls = (player.rolls || 0) + 1;

        if (type === "nat20") {
          player.nat20 = (player.nat20 || 0) + 1;
        }

        if (type === "nat1") {
          player.nat1 = (player.nat1 || 0) + 1;
        }

        // ----------------------------
        // ROLL HISTORY
        // ----------------------------

        if (!Array.isArray(player.rollHistory)) {
          player.rollHistory = [];
        }

        player.rollHistory.push(type);

        // Nereikia saugoti
        // begalinės istorijos.
        if (player.rollHistory.length > 20) {
          player.rollHistory.shift();
        }

        return player;
      },
    );
  } catch (error) {
    console.error("Roll error:", error);

    alert("You cannot modify this player.");
  }
}
async function undoLastRoll() {
  if (sessionData?.status !== "active") {
    alert("This session is already finished.");

    return;
  }
  const playerId = getControlledPlayerId();

  if (!playerId) {
    alert("No player selected.");

    return;
  }

  const playerRef = ref(
    db,
    `sessions/${activeSessionCode}/players/${playerId}`,
  );

  try {
    await runTransaction(
      playerRef,

      (player) => {
        if (!player) {
          return player;
        }

        if (
          !Array.isArray(player.rollHistory) ||
          player.rollHistory.length === 0
        ) {
          // Nieko neatšaukiam.
          return player;
        }

        const lastRoll = player.rollHistory.pop();

        player.rolls = Math.max(0, (player.rolls || 0) - 1);

        if (lastRoll === "nat20") {
          player.nat20 = Math.max(0, (player.nat20 || 0) - 1);
        }

        if (lastRoll === "nat1") {
          player.nat1 = Math.max(0, (player.nat1 || 0) - 1);
        }

        return player;
      },
    );
  } catch (error) {
    console.error("Undo error:", error);

    alert("Could not undo roll.");
  }
}
function updateRollTitle() {
  const playerId = playerSelect.value;

  if (!playerId) {
    rollPlayerTitle.textContent = "Select a player";

    return;
  }

  const player = sessionData?.players?.[playerId];

  if (!player) {
    return;
  }

  rollPlayerTitle.textContent = `Rolling as ${player.name}`;
}
// =====================================================
// RENDER
// =====================================================

function render() {
  // =====================================
  // CAMPAIGN
  // =====================================

  const hasCampaign = Boolean(activeCampaignCode && campaignData);

  campaignSetup.hidden = hasCampaign;

  activeCampaign.hidden = !hasCampaign;

  campaignPlayerCard.hidden = !hasCampaign;

  sessionCard.hidden = !hasCampaign;

  if (!hasCampaign) {
    activeSession.hidden = true;

    playerCard.hidden = true;

    rollCard.hidden = true;

    leaderboardCard.hidden = true;

    allTimeCard.hidden = true;

    recordsCard.hidden = true;

    historyCard.hidden = true;

    return;
  }

  activeCampaignName.textContent = campaignData.name;

  activeCampaignCodeElement.textContent = activeCampaignCode;

  const isCampaignHost = campaignData.createdBy === currentUser.uid;

  createSessionArea.hidden = !isCampaignHost;

  sessionJoinDivider.hidden = !isCampaignHost;

  renderCampaignPlayer();
  allTimeCard.hidden = false;

  recordsCard.hidden = false;

  historyCard.hidden = false;

  renderAllTimeStats();

  renderCampaignRecords();

  renderCampaignHistory();

  // =====================================
  // SESSION
  // =====================================

  const hasSession = Boolean(activeSessionCode && sessionData);

  sessionSetup.hidden = hasSession;

  activeSession.hidden = !hasSession;

  leaderboardCard.hidden = !hasSession;

  if (!hasSession) {
    playerCard.hidden = true;

    rollCard.hidden = true;

    return;
  }

  activeSessionName.textContent = sessionData.name;

  activeSessionCodeElement.textContent = activeSessionCode;

  const isHost = sessionData.createdBy === currentUser.uid;

  const isFinished = sessionData.status === "finished";

  sessionStatus.textContent = isFinished ? "FINISHED" : "ACTIVE";

  sessionStatus.className = isFinished ? "status-finished" : "status-active";

  finishSessionButton.hidden = !isHost || isFinished;

  playerCard.hidden = isFinished;

  rollCard.hidden = isFinished;

  finishedMessage.hidden = !isFinished;

  if (isFinished) {
    finishedMessage.textContent = "🏁 Session finished";
  }

  renderPlayerSelect();

  renderLeaderboard();

  renderWinner();

  renderCampaignPlayer();
}

// =====================================================
// PLAYER SELECT
// =====================================================

function renderPlayerSelect() {
  const players = sessionData.players || {};

  const isHost = sessionData.createdBy === currentUser.uid;

  const myPlayer = getMyPlayerEntry();

  // =====================================
  // MY PLAYER
  // =====================================

  if (myPlayer) {
    playerRegistration.hidden = true;

    myPlayerInfo.hidden = false;

    myPlayerName.textContent = myPlayer.player.name;
  } else {
    playerRegistration.hidden = false;

    myPlayerInfo.hidden = true;
  }

  // =====================================
  // HOST
  // =====================================

  if (isHost) {
    hostPlayerControls.hidden = false;

    const selectedPlayer = playerSelect.value;

    playerSelect.innerHTML = '<option value="">Select player</option>';

    Object.entries(players).forEach(([playerId, player]) => {
      const option = document.createElement("option");

      option.value = playerId;

      option.textContent = player.name;

      playerSelect.appendChild(option);
    });

    if (selectedPlayer && players[selectedPlayer]) {
      playerSelect.value = selectedPlayer;
    } else if (myPlayer) {
      playerSelect.value = myPlayer.id;
    }

    updateRollTitle();

    return;
  }

  // =====================================
  // NORMAL PLAYER
  // =====================================

  hostPlayerControls.hidden = true;

  if (myPlayer) {
    rollPlayerTitle.textContent = `Rolling as ${myPlayer.player.name}`;
  } else {
    rollPlayerTitle.textContent = "Join as a player first";
  }
}

// =====================================================
// LEADERBOARD
// =====================================================

function renderLeaderboard() {
  leaderboardBody.innerHTML = "";

  const players = Object.values(sessionData.players || {});

  const sortedPlayers = [...players].sort(comparePlayers);

  sortedPlayers.forEach((player) => {
    const row = document.createElement("tr");

    const critRate =
      player.rolls > 0
        ? ((player.nat20 / player.rolls) * 100).toFixed(2)
        : "0.00";
    const failRate =
      player.rolls > 0
        ? ((player.nat1 / player.rolls) * 100).toFixed(2)
        : "0.00";
    const score = (player.nat20 || 0) - (player.nat1 || 0);
    row.innerHTML = `
  <td>${escapeHtml(player.name)}</td>
  <td>${player.rolls || 0}</td>
  <td>${player.nat20 || 0}</td>
  <td>${player.nat1 || 0}</td>
  <td>  ${score > 0 ? "+" : ""}${score}</td>
  <td>${critRate}%</td>
  <td>${failRate}%</td>
`;

    leaderboardBody.appendChild(row);
  });
}

// =====================================================
// RANKING
// =====================================================

function comparePlayers(a, b) {
  const nat20A = a.nat20 || 0;
  const nat20B = b.nat20 || 0;

  const nat1A = a.nat1 || 0;
  const nat1B = b.nat1 || 0;

  const rollsA = a.rolls || 0;
  const rollsB = b.rolls || 0;

  // =====================================
  // SCORE
  // NAT20 = +1
  // NAT1  = -1
  // =====================================

  const scoreA = nat20A - nat1A;

  const scoreB = nat20B - nat1B;

  // 1. Highest score

  if (scoreA !== scoreB) {
    return scoreB - scoreA;
  }

  // 2. Best score efficiency

  const scoreRateA = rollsA > 0 ? scoreA / rollsA : 0;

  const scoreRateB = rollsB > 0 ? scoreB / rollsB : 0;

  if (scoreRateA !== scoreRateB) {
    return scoreRateB - scoreRateA;
  }

  // 3. More NAT20

  if (nat20A !== nat20B) {
    return nat20B - nat20A;
  }

  // 4. Less NAT1

  if (nat1A !== nat1B) {
    return nat1A - nat1B;
  }

  return 0;
}

// =====================================================
// WINNER
// =====================================================

function renderWinner() {
  const players = sessionData.players || {};

  const playerValues = Object.values(players);

  if (playerValues.length === 0) {
    winnerElement.style.display = "none";

    return;
  }

  winnerElement.style.display = "block";

  // =====================================
  // FINISHED SESSION
  // =====================================

  if (sessionData.status === "finished") {
    const winners = getWinningPlayers(players);

    if (winners.length === 0) {
      winnerElement.textContent = "No winner";

      return;
    }

    if (winners.length === 1) {
      const winner = winners[0].player;

      winnerElement.innerHTML = `
        🏆 Session Winner:
        <strong>
          ${escapeHtml(winner.name)}
        </strong>

        <br>

        ⭐ ${winner.nat20 || 0} NAT20
        ·
        💀 ${winner.nat1 || 0} NAT1
        ·
        🎲 ${winner.rolls || 0} rolls
      `;

      return;
    }

    const winnerNames = winners
      .map((winner) => escapeHtml(winner.player.name))
      .join(" & ");

    winnerElement.innerHTML = `
      🤝 Session Tie:
      <strong>
        ${winnerNames}
      </strong>
    `;

    return;
  }

  // =====================================
  // ACTIVE SESSION
  // =====================================

  const sortedPlayers = [...playerValues].sort(comparePlayers);

  const leader = sortedPlayers[0];

  winnerElement.textContent = `🏆 Current leader: ${leader.name}`;
}
async function finishSession() {
  if (!activeSessionCode) {
    return;
  }

  const isHost = sessionData?.createdBy === currentUser.uid;

  if (!isHost) {
    alert("Only the session host can finish the session.");
    return;
  }

  if (sessionData.status === "finished") {
    return;
  }

  const confirmed = confirm(
    "Finish this session?\n\n" +
      "Players will no longer be able to add or undo rolls.",
  );

  if (!confirmed) {
    return;
  }

  try {
    // =====================================
    // 1. LOCK SESSION
    // =====================================

    const statusRef = ref(db, `sessions/${activeSessionCode}/status`);

    const result = await runTransaction(statusRef, (currentStatus) => {
      if (currentStatus !== "active") {
        return;
      }

      return "finished";
    });

    if (!result.committed) {
      alert("Session is already finished.");
      return;
    }

    // =====================================
    // 2. READ FINAL SESSION DATA
    // =====================================

    const sessionSnapshot = await get(ref(db, `sessions/${activeSessionCode}`));

    if (!sessionSnapshot.exists()) {
      return;
    }

    const finalSession = sessionSnapshot.val();

    const finishedAt = Date.now();

    // =====================================
    // 3. CALCULATE WINNERS
    // =====================================

    const winners = getWinningPlayers(finalSession.players || {});

    const winnersObject = {};

    winners.forEach((winner) => {
      winnersObject[winner.id] = {
        name: winner.player.name,

        rolls: winner.player.rolls || 0,

        nat20: winner.player.nat20 || 0,

        nat1: winner.player.nat1 || 0,
      };
    });

    // =====================================
    // 4. CREATE CLEAN HISTORY PLAYERS
    // =====================================

    const historyPlayers = {};

    Object.entries(finalSession.players || {}).forEach(([playerId, player]) => {
      historyPlayers[playerId] = {
        campaignPlayerId: player.campaignPlayerId || playerId,

        name: player.name,

        rolls: player.rolls || 0,

        nat20: player.nat20 || 0,

        nat1: player.nat1 || 0,
      };
    });

    // =====================================
    // 5. HISTORY SNAPSHOT
    // =====================================

    const historyEntry = {
      sessionCode: activeSessionCode,

      name: finalSession.name,

      createdAt: finalSession.createdAt || null,

      finishedAt: finishedAt,

      players: historyPlayers,

      result: {
        tie: winners.length > 1,

        winners: winnersObject,
      },
    };

    // =====================================
    // 6. SAVE EVERYTHING
    // =====================================

    const campaignCode = finalSession.campaignCode;

    const updates = {};

    // Final session data

    updates[`sessions/${activeSessionCode}/finishedAt`] = finishedAt;

    updates[`sessions/${activeSessionCode}/result`] = {
      tie: winners.length > 1,

      winners: winnersObject,
    };

    // Campaign session index

    if (campaignCode) {
      updates[
        `campaigns/${campaignCode}/sessions/${activeSessionCode}/status`
      ] = "finished";

      updates[
        `campaigns/${campaignCode}/sessions/${activeSessionCode}/finishedAt`
      ] = finishedAt;

      // Campaign history snapshot

      updates[`campaigns/${campaignCode}/history/${activeSessionCode}`] =
        historyEntry;
    }

    await update(ref(db), updates);
  } catch (error) {
    console.error("Finish session error:", error);

    alert("Could not finish session.");
  }
}
function getWinningPlayers(players) {
  const playerEntries = Object.entries(players).map(([id, player]) => ({
    id,
    player,
  }));

  if (playerEntries.length === 0) {
    return [];
  }

  playerEntries.sort((a, b) => comparePlayers(a.player, b.player));

  const first = playerEntries[0];

  return playerEntries.filter((entry) =>
    playersHaveSameRank(first.player, entry.player),
  );
}
function playersHaveSameRank(a, b) {
  const nat20A = a.nat20 || 0;
  const nat20B = b.nat20 || 0;

  const nat1A = a.nat1 || 0;
  const nat1B = b.nat1 || 0;

  const rollsA = a.rolls || 0;
  const rollsB = b.rolls || 0;

  const scoreA = nat20A - nat1A;

  const scoreB = nat20B - nat1B;

  if (scoreA !== scoreB) {
    return false;
  }

  const scoreRateA = rollsA > 0 ? scoreA / rollsA : 0;

  const scoreRateB = rollsB > 0 ? scoreB / rollsB : 0;

  if (scoreRateA !== scoreRateB) {
    return false;
  }

  if (nat20A !== nat20B) {
    return false;
  }

  if (nat1A !== nat1B) {
    return false;
  }

  return true;
}
// =====================================================
// SECURITY HELPER
// =====================================================

function escapeHtml(value) {
  const div = document.createElement("div");

  div.textContent = value;

  return div.innerHTML;
}
// =====================================================
// Campaign
// =====================================================
function generateCampaignCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let code = "";

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);

    code += chars[randomIndex];
  }

  return code;
}
async function createCampaign() {
  if (!currentUser) {
    alert("Firebase authentication is not ready.");

    return;
  }

  const campaignName = campaignNameInput.value.trim() || "D&D Campaign";

  let code;

  let available = false;

  try {
    while (!available) {
      code = generateCampaignCode();

      const snapshot = await get(ref(db, `campaigns/${code}`));

      available = !snapshot.exists();
    }

    await set(
      ref(db, `campaigns/${code}`),

      {
        name: campaignName,

        createdBy: currentUser.uid,

        createdAt: Date.now(),

        status: "active",
      },
    );

    connectToCampaign(code);
  } catch (error) {
    console.error("Create campaign error:", error);

    alert("Could not create campaign.");
  }
}
async function joinCampaign() {
  const code = campaignCodeInput.value.trim().toUpperCase();

  if (!code) {
    alert("Enter campaign code.");

    return;
  }

  try {
    const snapshot = await get(ref(db, `campaigns/${code}`));

    if (!snapshot.exists()) {
      alert("Campaign not found.");

      return;
    }

    connectToCampaign(code);
  } catch (error) {
    console.error("Join campaign error:", error);

    alert("Could not join campaign.");
  }
}
function connectToCampaign(code) {
  if (unsubscribeCampaign) {
    unsubscribeCampaign();

    unsubscribeCampaign = null;
  }

  activeCampaignCode = code;

  localStorage.setItem("dndActiveCampaignCode", code);

  const campaignRef = ref(db, `campaigns/${code}`);

  unsubscribeCampaign = onValue(
    campaignRef,

    (snapshot) => {
      if (!snapshot.exists()) {
        alert("Campaign no longer exists.");

        leaveCampaign();

        return;
      }

      campaignData = snapshot.val();

      render();
    },

    (error) => {
      console.error("Campaign listener error:", error);
    },
  );
}
function leaveCampaign() {
  // Pirma paliekame aktyvią sesiją,
  // nes session be campaign neturi prasmės.
  leaveSession();

  if (unsubscribeCampaign) {
    unsubscribeCampaign();

    unsubscribeCampaign = null;
  }

  localStorage.removeItem("dndActiveCampaignCode");

  activeCampaignCode = "";

  campaignData = null;

  render();
}
async function saveCampaignPlayerProfile() {
  if (!activeCampaignCode) {
    return;
  }

  const name = campaignPlayerNameInput.value.trim();

  if (!name) {
    return;
  }

  const members = campaignData?.members || {};

  const duplicate = Object.values(members).some(
    (member) => member.name?.toLowerCase() === name.toLowerCase(),
  );

  if (duplicate) {
    alert(
      "Player with this name already exists. Select the existing player instead.",
    );

    return;
  }

  try {
    const membersRef = ref(db, `campaigns/${activeCampaignCode}/members`);

    // Firebase sugeneruoja stabilų
    // Campaign Player ID.
    const newMemberRef = push(membersRef);

    const campaignPlayerId = newMemberRef.key;

    await set(newMemberRef, {
      name: name,

      joinedAt: Date.now(),

      linkedUids: {
        [currentUser.uid]: true,
      },
    });

    setMyCampaignPlayerId(campaignPlayerId);

    campaignPlayerNameInput.value = "";
  } catch (error) {
    console.error("Campaign player error:", error);

    alert("Could not create campaign player.");
  }
}
function setMyCampaignPlayerId(campaignPlayerId) {
  localStorage.setItem(
    `dndCampaignPlayer_${activeCampaignCode}`,
    campaignPlayerId,
  );
}

function getSavedCampaignPlayerId() {
  if (!activeCampaignCode) {
    return null;
  }

  return localStorage.getItem(`dndCampaignPlayer_${activeCampaignCode}`);
}

function clearMyCampaignPlayerId() {
  if (!activeCampaignCode) {
    return;
  }

  localStorage.removeItem(`dndCampaignPlayer_${activeCampaignCode}`);
}
function getMyCampaignPlayerEntry() {
  if (!campaignData) {
    return null;
  }

  const members = campaignData.members || {};

  const savedPlayerId = getSavedCampaignPlayerId();

  if (!savedPlayerId || !members[savedPlayerId]) {
    return null;
  }

  return {
    id: savedPlayerId,

    player: members[savedPlayerId],
  };
}
function getMyCampaignPlayer() {
  return getMyCampaignPlayerEntry()?.player || null;
}
async function selectExistingCampaignPlayer() {
  const campaignPlayerId = campaignPlayerSelect.value;

  if (!campaignPlayerId) {
    alert("Select a player first.");

    return;
  }

  const player = campaignData?.members?.[campaignPlayerId];

  if (!player) {
    alert("Player not found.");

    return;
  }

  try {
    // Susiejame naują Firebase anonymous UID
    // su tuo pačiu Campaign Player.
    await set(
      ref(
        db,
        `campaigns/${activeCampaignCode}/members/${campaignPlayerId}/linkedUids/${currentUser.uid}`,
      ),
      true,
    );

    setMyCampaignPlayerId(campaignPlayerId);

    render();
  } catch (error) {
    console.error("Select campaign player error:", error);

    alert("Could not select campaign player.");
  }
}
function changeCampaignPlayer() {
  clearMyCampaignPlayerId();

  render();
}
function renderCampaignPlayer() {
  const campaignPlayerEntry = getMyCampaignPlayerEntry();

  const members = campaignData?.members || {};

  // =====================================
  // PLAYER SELECT
  // =====================================

  campaignPlayerSelect.innerHTML = '<option value="">Select player</option>';

  Object.entries(members)
    .sort((a, b) => a[1].name.localeCompare(b[1].name))
    .forEach(([playerId, player]) => {
      const option = document.createElement("option");

      option.value = playerId;

      option.textContent = player.name;

      campaignPlayerSelect.appendChild(option);
    });

  // =====================================
  // CURRENT PLAYER
  // =====================================

  if (campaignPlayerEntry) {
    campaignPlayerSetup.hidden = true;

    campaignPlayerInfo.hidden = false;

    campaignPlayerDisplayName.textContent = campaignPlayerEntry.player.name;
  } else {
    campaignPlayerSetup.hidden = false;

    campaignPlayerInfo.hidden = true;
  }

  // =====================================
  // SESSION JOIN HINT
  // =====================================

  if (sessionPlayerHint) {
    if (campaignPlayerEntry) {
      sessionPlayerHint.textContent = `Join this session as ${campaignPlayerEntry.player.name}.`;

      addPlayerButton.disabled = false;
    } else {
      sessionPlayerHint.textContent = "Select your campaign player first.";

      addPlayerButton.disabled = true;
    }
  }
}
function calculateAllTimeStats() {
  const history = campaignData?.history || {};

  const stats = {};

  Object.values(history).forEach((session) => {
    const players = session.players || {};

    Object.entries(players).forEach(([playerId, player]) => {
      if (!stats[playerId]) {
        stats[playerId] = {
          id: playerId,

          name: player.name,

          sessions: 0,

          rolls: 0,

          nat20: 0,

          nat1: 0,

          wins: 0,

          ties: 0,
        };
      }

      const stat = stats[playerId];

      // Jei campaign profilio
      // vardas pakeistas, rodome naujausią.
      const currentMember = campaignData?.members?.[playerId];

      stat.name = currentMember?.name || player.name;

      stat.sessions += 1;

      stat.rolls += player.rolls || 0;

      stat.nat20 += player.nat20 || 0;

      stat.nat1 += player.nat1 || 0;
    });

    // =================================
    // WIN / TIE
    // =================================

    const result = session.result;

    if (!result?.winners) {
      return;
    }

    const winnerIds = Object.keys(result.winners);

    winnerIds.forEach((winnerId) => {
      if (!stats[winnerId]) {
        return;
      }

      if (result.tie) {
        stats[winnerId].ties += 1;
      } else {
        stats[winnerId].wins += 1;
      }
    });
  });

  return stats;
}
function renderAllTimeStats() {
  const history = campaignData?.history || {};

  const sessions = Object.values(history);

  const hasHistory = sessions.length > 0;

  allTimeEmpty.hidden = hasHistory;

  allTimeContent.hidden = !hasHistory;

  if (!hasHistory) {
    allTimeBody.innerHTML = "";

    return;
  }

  const stats = calculateAllTimeStats();

  const players = Object.values(stats);

  // =====================================
  // CAMPAIGN TOTALS
  // =====================================

  const totalRolls = players.reduce((total, player) => total + player.rolls, 0);

  const totalNat20 = players.reduce((total, player) => total + player.nat20, 0);

  const totalNat1 = players.reduce((total, player) => total + player.nat1, 0);

  campaignTotalSessions.textContent = sessions.length;

  campaignTotalRolls.textContent = totalRolls;

  campaignTotalNat20.textContent = totalNat20;

  campaignTotalNat1.textContent = totalNat1;

  // =====================================
  // SORT
  // =====================================

  players.sort((a, b) => {
    // Most wins
    if (a.wins !== b.wins) {
      return b.wins - a.wins;
    }

    // Most NAT20
    if (a.nat20 !== b.nat20) {
      return b.nat20 - a.nat20;
    }

    // Least NAT1
    if (a.nat1 !== b.nat1) {
      return a.nat1 - b.nat1;
    }

    // Crit rate
    const rateA = a.rolls > 0 ? a.nat20 / a.rolls : 0;

    const rateB = b.rolls > 0 ? b.nat20 / b.rolls : 0;

    return rateB - rateA;
  });

  // =====================================
  // TABLE
  // =====================================

  allTimeBody.innerHTML = "";

  players.forEach((player) => {
    const critRate =
      player.rolls > 0
        ? ((player.nat20 / player.rolls) * 100).toFixed(2)
        : "0.00";

    const failRate =
      player.rolls > 0
        ? ((player.nat1 / player.rolls) * 100).toFixed(2)
        : "0.00";

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>
          ${escapeHtml(player.name)}
        </td>

        <td>
          ${player.sessions}
        </td>

        <td>
          ${player.rolls}
        </td>

        <td>
          ${player.nat20}
        </td>

        <td>
          ${player.nat1}
        </td>

        <td>
          ${critRate}%
        </td>

        <td>
          ${failRate}%
        </td>

        <td>
          ${player.wins}
        </td>

        <td>
          ${player.ties}
        </td>
      `;

    allTimeBody.appendChild(row);
  });
}
function renderCampaignHistory() {
  const history = campaignData?.history || {};

  const sessions = Object.values(history);

  sessions.sort((a, b) => (b.finishedAt || 0) - (a.finishedAt || 0));

  historyEmpty.hidden = sessions.length > 0;

  historyList.innerHTML = "";

  sessions.forEach((session) => {
    const players = Object.values(session.players || {});

    const winners = Object.values(session.result?.winners || {});

    let winnerText;

    if (winners.length === 0) {
      winnerText = "No winner";
    } else if (session.result?.tie) {
      winnerText = `🤝 ${winners.map((winner) => winner.name).join(" & ")}`;
    } else {
      winnerText = `🏆 ${winners[0].name}`;
    }

    const formattedDate = formatHistoryDate(session.finishedAt);

    const details = document.createElement("details");

    details.className = "history-item";

    const playerRows = [...players]
      .sort(comparePlayers)
      .map((player) => {
        const critRate =
          player.rolls > 0
            ? ((player.nat20 / player.rolls) * 100).toFixed(2)
            : "0.00";

        const failRate =
          player.rolls > 0
            ? ((player.nat1 / player.rolls) * 100).toFixed(2)
            : "0.00";

        return `
                <tr>

                  <td>
                    ${escapeHtml(player.name)}
                  </td>

                  <td>
                    ${player.rolls || 0}
                  </td>

                  <td>
                    ${player.nat20 || 0}
                  </td>

                  <td>
                    ${player.nat1 || 0}
                  </td>

                  <td>
                    ${critRate}%
                  </td>

                  <td>
                    ${failRate}%
                  </td>

                </tr>
              `;
      })
      .join("");

    details.innerHTML = `

        <summary>

          <div class="history-header">

            <div>

              <div class="history-title">
                ${escapeHtml(session.name || "D&D Session")}
              </div>

              <div class="history-winner">
                ${escapeHtml(winnerText)}
              </div>

            </div>

            <div class="history-date">
              ${formattedDate}
            </div>

          </div>

        </summary>


        <div class="history-details">

          <div class="table-wrapper">

            <table>

              <thead>
                <tr>
                  <th>Player</th>
                  <th>Rolls</th>
                  <th>NAT20</th>
                  <th>NAT1</th>
                  <th>Crit %</th>
                  <th>Fail %</th>
                </tr>
              </thead>

              <tbody>
                ${playerRows}
              </tbody>

            </table>

          </div>

        </div>
      `;

    historyList.appendChild(details);
  });
}
function formatHistoryDate(timestamp) {
  if (!timestamp) {
    return "";
  }

  const date = new Date(timestamp);

  return date.toLocaleDateString("lt-LT", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
function findMaxRecords(items, getValue) {
  let maxValue = null;

  let winners = [];

  items.forEach((item) => {
    const value = getValue(item);

    if (value === null || value === undefined) {
      return;
    }

    if (maxValue === null || value > maxValue) {
      maxValue = value;

      winners = [item];

      return;
    }

    if (value === maxValue) {
      winners.push(item);
    }
  });

  return {
    value: maxValue,

    winners: winners,
  };
}
function calculateCampaignRecords() {
  const history = campaignData?.history || {};

  const allTimeStats = Object.values(calculateAllTimeStats());

  // =====================================
  // ALL-TIME RECORDS
  // =====================================

  const mostWins = findMaxRecords(allTimeStats, (player) => player.wins);

  const mostNat20 = findMaxRecords(allTimeStats, (player) => player.nat20);

  const mostNat1 = findMaxRecords(allTimeStats, (player) => player.nat1);

  const mostRolls = findMaxRecords(allTimeStats, (player) => player.rolls);

  // =====================================
  // BUILD SESSION PLAYER LIST
  // =====================================

  const sessionPlayers = [];

  Object.entries(history).forEach(([sessionCode, session]) => {
    Object.entries(session.players || {}).forEach(([playerId, player]) => {
      sessionPlayers.push({
        playerId: playerId,

        name: player.name,

        sessionCode: sessionCode,

        sessionName: session.name || "D&D Session",

        rolls: player.rolls || 0,

        nat20: player.nat20 || 0,

        nat1: player.nat1 || 0,
      });
    });
  });

  // =====================================
  // SESSION RECORDS
  // =====================================

  const sessionNat20 = findMaxRecords(sessionPlayers, (entry) => entry.nat20);

  const sessionNat1 = findMaxRecords(sessionPlayers, (entry) => entry.nat1);

  const sessionRolls = findMaxRecords(sessionPlayers, (entry) => entry.rolls);

  // =====================================
  // BEST CRIT RATE
  // =====================================

  const MIN_RATE_ROLLS = 20;

  const validCritPlayers = sessionPlayers.filter(
    (player) => player.rolls >= MIN_RATE_ROLLS,
  );

  const bestCritRate = findMaxRecords(
    validCritPlayers,

    (player) => (player.rolls > 0 ? player.nat20 / player.rolls : 0),
  );

  return {
    mostWins,

    mostNat20,

    mostNat1,

    mostRolls,

    sessionNat20,

    sessionNat1,

    sessionRolls,

    bestCritRate,
  };
}
function renderAllTimeRecord(element, record, suffix) {
  if (!record || record.value === null || record.winners.length === 0) {
    element.textContent = "—";

    return;
  }

  const names = record.winners
    .map((player) => escapeHtml(player.name))
    .join(" & ");

  element.innerHTML = `

    <span class="record-player">
      ${names}
    </span>

    <span class="record-number">
      ${record.value}
      ${suffix}
    </span>

  `;
}
function renderSessionRecord(element, record, suffix) {
  if (!record || record.value === null || record.winners.length === 0) {
    element.textContent = "—";

    return;
  }

  const entries = record.winners
    .map((winner) => {
      return `

            <div>

              <span class="record-player">
                ${escapeHtml(winner.name)}
              </span>

              <span class="record-number">
                ${record.value}
                ${suffix}
              </span>

              <span class="record-session">
                ${escapeHtml(winner.sessionName)}
              </span>

            </div>

          `;
    })
    .join("");

  element.innerHTML = entries;
}
function renderCritRateRecord(element, record) {
  if (!record || record.value === null || record.winners.length === 0) {
    element.textContent = "No qualifying session";

    return;
  }

  const percent = (record.value * 100).toFixed(2);

  element.innerHTML = record.winners
    .map(
      (winner) => `

          <div>

            <span class="record-player">
              ${escapeHtml(winner.name)}
            </span>

            <span class="record-number">
              ${percent}%
            </span>

            <span class="record-session">
              ${escapeHtml(winner.sessionName)}
              ·
              ${winner.nat20} NAT20 /
              ${winner.rolls} rolls
            </span>

          </div>

        `,
    )
    .join("");
}
function renderCampaignRecords() {
  const history = campaignData?.history || {};

  const hasHistory = Object.keys(history).length > 0;

  recordsEmpty.hidden = hasHistory;

  recordsGrid.hidden = !hasHistory;

  if (!hasHistory) {
    return;
  }

  const records = calculateCampaignRecords();

  renderAllTimeRecord(recordMostWins, records.mostWins, "wins");

  renderAllTimeRecord(recordMostNat20, records.mostNat20, "NAT20");

  renderAllTimeRecord(recordMostNat1, records.mostNat1, "NAT1");

  renderAllTimeRecord(recordMostRolls, records.mostRolls, "rolls");

  renderSessionRecord(recordSessionNat20, records.sessionNat20, "NAT20");

  renderSessionRecord(recordSessionNat1, records.sessionNat1, "NAT1");

  renderSessionRecord(recordSessionRolls, records.sessionRolls, "rolls");

  renderCritRateRecord(recordBestCritRate, records.bestCritRate);
}
// =====================================================
// START
// =====================================================

async function start() {
  try {
    await authenticate();

    console.log("Firebase authenticated:", currentUser.uid);

    const savedCampaign = localStorage.getItem("dndActiveCampaignCode");

    if (savedCampaign) {
      connectToCampaign(savedCampaign);
    }

    const savedSession = localStorage.getItem("dndActiveSessionCode");

    if (savedSession) {
      connectToSession(savedSession);
    }

    render();
  } catch (error) {
    console.error("Firebase authentication failed:", error);

    alert("Firebase authentication failed.");
  }
}

start();
