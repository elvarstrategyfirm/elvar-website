#!/usr/bin/env node
// One-on-One Partner Portal data tool. No secrets live in this file.
// Recaps are stored encrypted in /one-on-one-partner-portal/recaps.json:
// each athlete's profile + sessions are AES-GCM-256 encrypted with a key derived
// from their password (PBKDF2-SHA256, 250k iterations). Passwords are never stored here.
//
// Commands (run from the repo root):
//   node tools/one-on-one-portal.js read   <INITIALS> <password>             -> prints the athlete's decrypted JSON
//   node tools/one-on-one-portal.js add    <INITIALS> <password> <session.json>  -> adds/replaces a session (matched by date)
//   node tools/one-on-one-portal.js new    <athlete.json> <password>          -> adds a new athlete tile
//   node tools/one-on-one-portal.js repass <INITIALS> <old> <new>             -> changes an athlete's password
//   node tools/one-on-one-portal.js build  <athletes.json> <passwords.json>   -> rebuilds the whole file from plaintext
// Session shape: {date:"YYYY-MM-DD", title, mainFocus, actions[], coachNoted[], athleteNoted[], parentNotes[], extras?[{heading, items[]}], tip}
// Passwords ignore case, spaces and symbols ("EOlson" = "eolson").
const fs = require("fs"), path = require("path"), { webcrypto: crypto } = require("crypto");
const FILE = path.join(__dirname, "..", "one-on-one-partner-portal", "recaps.json");
const ITER = 250000;
const norm = p => String(p).toUpperCase().replace(/[^A-Z0-9]/g, "");
const b64 = u => Buffer.from(u).toString("base64"), unb64 = s => new Uint8Array(Buffer.from(s, "base64"));
async function key(pw, salt, use) {
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(norm(pw)), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: ITER, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, [use]);
}
async function seal(a, pw) {
  const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await key(pw, salt, "encrypt"), new TextEncoder().encode(JSON.stringify(a)));
  const last = (a.sessions || []).map(s => s.date).sort().pop() || null;
  return { initials: a.initials, team: a.team, last, salt: b64(salt), iv: b64(iv), iter: ITER, data: b64(new Uint8Array(ct)) };
}
async function open_(e, pw) {
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(e.iv) }, await key(pw, unb64(e.salt), "decrypt"), unb64(e.data));
  return JSON.parse(new TextDecoder().decode(pt));
}
const load = () => JSON.parse(fs.readFileSync(FILE, "utf8"));
const save = d => { d.updated = new Date().toISOString().slice(0, 10); fs.writeFileSync(FILE, JSON.stringify(d, null, 1) + "\n"); };
const find = (d, ini) => { const i = d.athletes.findIndex(a => a.initials.toUpperCase() === ini.toUpperCase()); if (i < 0) throw new Error("No tile with initials " + ini); return i; };
(async () => {
  const [cmd, ...a] = process.argv.slice(2);
  if (cmd === "read") { const d = load(); console.log(JSON.stringify(await open_(d.athletes[find(d, a[0])], a[1]), null, 1)); }
  else if (cmd === "add") {
    const d = load(), i = find(d, a[0]), ath = await open_(d.athletes[i], a[1]);
    const s = JSON.parse(fs.readFileSync(a[2], "utf8")); const list = Array.isArray(s) ? s : [s];
    for (const x of list) { if (!/^\d{4}-\d{2}-\d{2}$/.test(x.date)) throw new Error("Bad date " + x.date); ath.sessions = ath.sessions.filter(y => y.date !== x.date).concat(x); }
    d.athletes[i] = await seal(ath, a[1]); save(d); console.log(`${ath.name}: ${ath.sessions.length} sessions`);
  }
  else if (cmd === "new") { const d = load(), ath = JSON.parse(fs.readFileSync(a[0], "utf8")); ath.sessions = ath.sessions || []; d.athletes.push(await seal(ath, a[1])); save(d); console.log("Added " + ath.name); }
  else if (cmd === "repass") { const d = load(), i = find(d, a[0]); d.athletes[i] = await seal(await open_(d.athletes[i], a[1]), a[2]); save(d); console.log("Password changed for " + a[0]); }
  else if (cmd === "build") {
    const ath = JSON.parse(fs.readFileSync(a[0], "utf8")), pws = JSON.parse(fs.readFileSync(a[1], "utf8"));
    const d = { athletes: [] }; for (const x of ath) d.athletes.push(await seal(x, pws[x.id] || x.initials)); save(d); console.log(`Built ${ath.length} athletes`);
  }
  else { console.log(fs.readFileSync(__filename, "utf8").split("\n").slice(1, 16).join("\n")); process.exit(1); }
})().catch(e => { console.error("Error: " + (e.message.includes("operation-specific") || e.name === "OperationError" ? "wrong password" : e.message)); process.exit(1); });
