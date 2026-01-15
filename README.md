# n8n Telegram Relay Automation (Workflow + JS Function)

An n8n workflow that controls a relay via Telegram commands (`on`, `off`, `status`) while using Google Sheets as a persistent log + last-known-state store. The workflow prevents redundant actions like turning ON a relay that is already ON.

## What’s inside this repo
- `n8n/workflows/telegram-relay-automation.json` → n8n export you can import directly
- `js/determine-relay-command.js` → the Function node logic used to interpret messages + decide actions
- `docs/` → workflow notes + (optional) screenshots

## Workflow overview (nodes)
1. **Telegram Trigger**
   - Captures `message.text` and `message.chat.id`
2. **Google Sheets (Get last row / last known status)**
   - Reads the most recent relay state (`on` / `off`) from the sheet
3. **Function node (Determine Relay Command)**
   - Detects user intent using phrase matching (on/off/status)
   - Compares requested action with last known state to output:
     - `on`, `off`, `ALREADY_ON`, `ALREADY_OFF`, `STATUS`
4. **(Optional) HTTP Request**
   - Sends `on/off` to the relay device endpoint only when needed
5. **Google Sheets (Append log)**
   - Logs timestamp, command executed, and resulting relay state
6. **Telegram Send Message**
   - Replies to the same chat with the relay state / confirmation

## Command behavior
| User message | Last state | Output |
|------------|------------|--------|
| "on"       | "on"       | ALREADY_ON |
| "on"       | "off"      | on |
| "off"      | "off"      | ALREADY_OFF |
| "off"      | "on"       | off |
| "status"   | any        | STATUS |

## Importing the workflow
1. Open n8n
2. Go to **Workflows → Import from File**
3. Select: `n8n/workflows/telegram-relay-automation.json`
4. Update credentials in nodes:
   - Telegram Bot token
   - Google Sheets credentials + spreadsheet ID
   - (Optional) relay HTTP endpoint URL

## Notes
- Google Sheets acts as the single source of truth for last relay state, so the workflow can avoid duplicate toggles.
- The Function node preserves `chatId` so replies go to the correct Telegram conversation.
