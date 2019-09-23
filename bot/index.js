const Bot = require('keybase-bot')
const dotenv = require('dotenv')

dotenv.config()

async function main() {
  const server_bot = new Bot()
  const server_username = process.env.SERVER_KB_USERNAME
  const server_paperkey = process.env.SERVER_KB_PAPERKEY

  const bot = new Bot()
  const username = process.env.KB_USERNAME
  const paperkey = process.env.KB_PAPERKEY

  try {
    await bot.init(username, paperkey)
    await server_bot.init(server_username, server_paperkey)

    const info = bot.myInfo()
    console.log(`bot initialized with username ${info.username}.`)
    const channel = {name: 'vpnbot,' + info.username, public: false, topicType: 'chat'}

    const onMessage = async message => {
      if (message.content.type === 'text') {
        // TODO: could probably normalize the body a little more before comparisons
        const messageBody = message.content.text.body.toLowerCase()
        switch (messageBody) {
          case 'new':
            console.log('Starting a new vpn!')
            // Todo: run script to build a vpn
            await server_bot.chat.send(channel, {body: 'Starting a new vpn..'})
            await server_bot.chat.attach(channel, '/server/path/here/wg0.conf')
            break
          default:
            break
        }
      }
    }

    await server_bot.chat.send(channel, {body: ':wave: Welcome to VPN Bot.'})
    await server_bot.chat.send(channel, {body: 'To spin up a new VPN, type "new".'})

    const onError = e => console.error(e)
    console.log(`Listening in the general channel of ${channel.name}...`)
    await bot.chat.watchChannelForNewMessages(channel, onMessage, onError)
  } catch (error) {
    console.error(error)
  }
}

async function shutDown() {
  await bot.deinit()
  process.exit()
}

process.on('SIGINT', shutDown)
process.on('SIGTERM', shutDown)

main()
