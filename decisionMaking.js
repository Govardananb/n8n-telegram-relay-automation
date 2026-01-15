const allInputs = $input.all();

// Get Telegram input (raw)
const telegramInputRaw = allInputs[0].json.message.text; // original user text
const telegramInput = telegramInputRaw.toLowerCase();
const lastState = allInputs[1].json.lastStatus.toLowerCase();

// Phrase definitions
const onPhrases = ["switch on", "light on", "activate", "start", "on"];
const offPhrases = ["switch off", "light off", "deactivate", "stop", "off"];
const statePhrases = ["status", "state", "current", "condition", "running"];
let command = "STATUS"; // default

// Determine normalized command
if (onPhrases.some(p => telegramInput.includes(p))) {
    command = lastState === "on" ? "ALREADY_ON" : "on";
} else if (offPhrases.some(p => telegramInput.includes(p))) {
    command = lastState === "off" ? "ALREADY_OFF" : "off";
} else if (statePhrases.some(p => telegramInput.includes(p))) {
    command = "STATUS"; // user asked current state
}

// Extract Telegram user details
const user = allInputs[0].json.message.from;
const userName = user.username 
    ? `@${user.username}` 
    : `${user.first_name || ""} ${user.last_name || ""}`.trim();

return {
    chatId: allInputs[0].json.message.chat.id, // for Telegram reply
    userName,   // telegram username or full name
    rawCommand: telegramInputRaw, // what user actually typed
    command,    // interpreted result: "on", "off", "ALREADY_ON", "ALREADY_OFF", or "STATUS"
    relayState: lastState
};

