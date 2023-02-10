const makeWASocket = require("@adiwajshing/baileys").default;
const express  = require("express")
const {handleAudio} = require("./ytaudio")
const {handleVideo} = require("./ytvideo")
const {
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
} = require("@adiwajshing/baileys");
// start a connection
const startSock = async () => {
const { version } = await fetchLatestBaileysVersion();
const { state, saveCreds } = await useMultiFileAuthState("auth_info_multi");
const sock = makeWASocket({
  version,
  printQRInTerminal: true,
  auth: state,
  browserer: ["YoutubeDl v1 "],
});

var mimetype;
var body;
var command;
var requests_today = 0;
const PORT = process.env.PORT || 8000
const app = express()
app.listen(PORT, (req, res)=>{
  console.log("Server Running")
})
  
app.get("/", (req, res)=>{res.send("YoutubeDL running")})
  sock.ev.on("messages.upsert", async ({ messages }) => {
    let m = messages[0];
    if (m.message != undefined && m.message != null) {
      if (m.key.fromMe == false) {
        if (m.key.remoteJid.split("@")[1] !== "g.us") {
          console.log("Inbox")
          sock.sendMessage(m.key.remoteJid, { text: "Please create a group and add this Bot. For use in group only!"}, {quoted: m})
        }else{
          mimetype = 
          Object.keys(m.message) == "imageMessage"
          ? "image"
          : Object.keys(m.message) == "videoMessage"
          ? "video"
          : Object.keys(m.message) == "conversation"
          ? "convo"
          : Object.keys(m.message) == "extendedTextMessage"
          ? "ex-text"
          : "other";
          body =
          mimetype == "ex-text"
          ? m.message.extendedTextMessage.text
          : mimetype == "convo"
          ? m.message.conversation
          : "";
          if(body.substring(0, 1) == "!" || body.substring(0, 1) == "."){
            command = body.substring(1);
            requests_today = requests_today+1
            if(body.split(" ")[0].substring(1) == "audio")
            {
              sock.sendMessage(m.key.remoteJid, { text: "🎶🎵🎵🎵Getting audio🎵🎵🎵🎶"}, {quoted: m})
              handleAudio({args: command, sock: sock, m: m, reg_no: requests_today})
            }
            if(body.split(" ")[0].substring(1) == "video")
            {
              sock.sendMessage(m.key.remoteJid, { text: "📽️📸📸📸Getting Video📸📸📸📽️"}, {quoted: m})
              handleVideo({args: command, sock: sock, m: m, reg_no: requests_today})
            }
            if(body.split(" ")[0].substring(1) == "dev" || body.split(" ")[0].substring(1) == "help" || body.split(" ")[0].substring(1) == "dm")
            {
              const templateButtons = [
                {index: 1, urlButton: {displayText: '💬 DM Now', url: 'https://wa.me/254759439032'}},
                {index: 2, callButton: {displayText: 'Call me', phoneNumber: '+254 7594 39032'}},
                ]
        
                const templateMessage = {
                    text: "「「   *YoutubeDL Bot* 」」\n",
                    // footer: "Creator: Muthembwa ©2022",
                    templateButtons: templateButtons
                }
                sock.sendMessage(m.key.remoteJid, templateMessage, {quoted: m})
              }
            
          }

          
        }
      }
    }
  });

  // sock.ev.on('message-receipt.update', m => console.log(m))
  // sock.ev.on('presence.update', m => console.log(m))
  // sock.ev.on('chats.upsert', m => console.log(m))
  // sock.ev.on('contacts.upsert', m => console.log(m))

  //  this is a conection update

  //Connection Update
  sock.ev.on("connection.update", (update) => {
    const { connection } = update;
    if (connection === "close") {
      startSock();
    }

    console.log("connection update", update);
  });
  // listen for when the auth credentials is updated
  sock.ev.on("creds.update", saveCreds);

  return sock;
};
//Starting AlitaBot
startSock();
