module.exports = {
  discord: {
    clientId: process.env.DISCORD_CLIENT_ID || 'YOUR_DISCORD_CLIENT_ID',
    clientSecret: process.env.DISCORD_CLIENT_SECRET || 'YOUR_DISCORD_CLIENT_SECRET',
    redirectUri: process.env.DISCORD_REDIRECT_URI || 'http://localhost:5173',
    atlantisGuildId: '740908503585259553',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  },
}
