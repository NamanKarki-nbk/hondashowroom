import makeWASocket, { useMultiFileAuthState, DisconnectReason } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import path from "path";

// Global cache to persist socket across Next.js API reloads in development
let sock: ReturnType<typeof makeWASocket> | null = null;
let qrCodeUrl: string | null = null;
let isConnected = false;

export async function initWhatsApp() {
  if (sock) return; // already initialized

  console.log("Initializing WhatsApp Baileys...");

  const authPath = path.join(process.cwd(), "auth_info_baileys");
  const { state, saveCreds } = await useMultiFileAuthState(authPath);

  sock = makeWASocket({
    auth: state,
    printQRInTerminal: true, // Also prints to terminal for convenience
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("WhatsApp QR received");
      qrCodeUrl = qr; // Save raw QR code string for API
      isConnected = false;
    }

    if (connection === "close") {
      const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log("WhatsApp connection closed due to ", lastDisconnect?.error, ", reconnecting ", shouldReconnect);
      isConnected = false;
      
      // Reconnect if not logged out
      if (shouldReconnect) {
        sock = null;
        initWhatsApp();
      } else {
        console.log("WhatsApp logged out. Delete the 'auth_info_baileys' folder to restart.");
      }
    } else if (connection === "open") {
      console.log("WhatsApp connected successfully!");
      isConnected = true;
      qrCodeUrl = null; // Clear QR code as it's no longer needed
    }
  });
}

// Auto-init on file import (useful for keeping it alive in Dev, but Next.js might reload it)
// We will trigger init from an API route when needed.
initWhatsApp();

export async function getWhatsAppQR() {
  if (!sock) await initWhatsApp();
  return qrCodeUrl;
}

export function isWhatsAppConnected() {
  return isConnected;
}

export async function sendWhatsAppMessage(toPhone: string, text: string) {
  if (!sock || !isConnected) {
    throw new Error("WhatsApp is not connected");
  }

  // Format phone number for Baileys (e.g. 97798xxxxxxx@s.whatsapp.net)
  let formattedPhone = toPhone.replace(/\D/g, ""); // Remove non-digits
  if (!formattedPhone.endsWith("@s.whatsapp.net")) {
    formattedPhone = `${formattedPhone}@s.whatsapp.net`;
  }

  await sock.sendMessage(formattedPhone, { text });
}
