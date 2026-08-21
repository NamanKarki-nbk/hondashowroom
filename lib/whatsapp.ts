import makeWASocket, { useMultiFileAuthState, DisconnectReason } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import path from "path";

declare global {
  var _waSock: ReturnType<typeof makeWASocket> | null;
  var _waQr: string | null;
  var _waIsConnected: boolean;
}

export async function initWhatsApp() {
  if (global._waSock) return; // already initialized across HMR

  console.log("Initializing WhatsApp Baileys...");

  const authPath = path.join(process.cwd(), "auth_info_baileys");
  const { state, saveCreds } = await useMultiFileAuthState(authPath);

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
  });

  global._waSock = sock;
  global._waIsConnected = false;
  global._waQr = null;

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("WhatsApp QR received");
      global._waQr = qr; // Save raw QR code string for API
      global._waIsConnected = false;
    }

    if (connection === "close") {
      const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log("WhatsApp connection closed due to ", lastDisconnect?.error, ", reconnecting ", shouldReconnect);
      global._waIsConnected = false;
      
      // Reconnect if not logged out
      if (shouldReconnect) {
        global._waSock = null;
        initWhatsApp();
      } else {
        console.log("WhatsApp logged out. Delete the 'auth_info_baileys' folder to restart.");
      }
    } else if (connection === "open") {
      console.log("WhatsApp connected successfully!");
      global._waIsConnected = true;
      global._waQr = null; // Clear QR code as it's no longer needed
    }
  });
}

// Auto-init on file import
// Auto-init on file import is disabled to prevent Vercel build crash

export async function getWhatsAppQR() {
  if (!global._waSock) await initWhatsApp();
  return global._waQr;
}

export function isWhatsAppConnected() {
  return global._waIsConnected || false;
}

export async function sendWhatsAppMessage(toPhone: string, text: string) {
  if (!global._waSock) {
    await initWhatsApp();
  }

  // Wait up to 10 seconds for the connection to establish (useful for cold starts in dev mode)
  let retries = 100;
  while (!global._waIsConnected && retries > 0) {
    await new Promise(r => setTimeout(r, 100));
    retries--;
  }

  if (!global._waSock || !global._waIsConnected) {
    throw new Error("WhatsApp is not connected or took too long to initialize.");
  }

  // Format phone number for Baileys (e.g. 97798xxxxxxx@s.whatsapp.net)
  let formattedPhone = toPhone.replace(/\D/g, ""); // Remove non-digits
  if (!formattedPhone.endsWith("@s.whatsapp.net")) {
    formattedPhone = `${formattedPhone}@s.whatsapp.net`;
  }

  await global._waSock.sendMessage(formattedPhone, { text });
}
