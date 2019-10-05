const Bot = require("keybase-bot");
const dotenv = require("dotenv");

dotenv.config();

async function main() {
  const server_bot = new Bot();
  const server_username = process.env.SERVER_KB_USERNAME;
  const server_paperkey = process.env.SERVER_KB_PAPERKEY;

  const bot = new Bot();
  const username = process.env.KB_USERNAME;
  const paperkey = process.env.KB_PAPERKEY;

  let pendingAgree = false;
  let pendingConfirm = false;

  try {
    await bot.init(username, paperkey);
    await server_bot.init(server_username, server_paperkey);

    const info = bot.myInfo();
    console.log(`bot initialized with username ${info.username}.`);
    const channel = {
      name: "vpnbot," + info.username,
      public: false,
      topicType: "chat"
    };

    const onMessage = async message => {
      if (message.content.type === "text") {
        // TODO: could probably normalize the body a little more before comparisons
        const messageBody = message.content.text.body.toLowerCase();
        switch (messageBody) {
          case "new":
            await requestLumens(server_bot, channel);
            pendingAgree = true;
            break;
          case "yes":
          case "y":
            if (pendingAgree) {
              await confirmLumens(server_bot, channel);
              pendingConfirm = true;
              pendingAgree = false;
            } else if (pendingConfirm) {
              await sendLumens(server_bot, bot, channel);
              pendingConfirm = false;
            }
            break;
          default:
            break;
        }
      }
    };

    await server_bot.chat.send(channel, { body: ":wave: Welcome to VPN Bot." });
    await server_bot.chat.send(channel, {
      body: 'To spin up a new VPN, type "new".'
    });

    const onError = e => console.error(e);
    console.log(`Listening in the general channel of ${channel.name}...`);
    await bot.chat.watchChannelForNewMessages(channel, onMessage, onError);
  } catch (error) {
    console.error(error);
  }
}

// to send request of lumens
async function requestLumens(server, channel) {
  await server.chat.send(channel, {
    body: "Great! Unlimited private browsing is only 10 lumens a month"
  });
  await server.chat.send(channel, {
    body: 'If you agree, please send 10 lumens by typing "yes" or "y"'
  });
}

// Confirm sending lumens
async function confirmLumens(server, channel) {
  await server.chat.send(channel, {
    body: "Are you sure to send your lumens to vpnbot?"
  });
  await server.chat.send(channel, {
    body: 'to confirm, type "yes" or "y"'
  });
}

// send lumnes to VPN Bot
async function sendLumens(server, bot, channel) {
  await server.chat.send(channel, {
    body: "Sending lumens to vpnbot..."
  });
  bot.wallet
    .send("vpnbot", "2.99", "USD")
    .then(async tr => {
      console.log(tr);
      await server.chat.send(channel, {
        body: ":wave: Thanks for using VPN bot."
      });
      await server.chat.send(channel, {
        body: ":tada: Login with folling credentials:"
      });
      await server.chat.attach(channel, "/path/to/server/wg0.conf");
    })
    .catch(err => {
      server.chat.send(channel, {
        body: "Sorry, we did not receive your lumens"
      });
    });
}

async function shutDown() {
  await bot.deinit();
  process.exit();
}

process.on("SIGINT", shutDown);
process.on("SIGTERM", shutDown);

main();
