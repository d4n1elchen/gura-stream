import axios from 'axios'
import config from 'config'

export type DiscordToken = {
  access_token: string
  expires_in: number
  refresh_token: string
  scope: string
  token_type: string
}

export type DiscordUser = {
  id: string
  username: string
  avatar: string
}

export type DiscordRole = {
  id: string
  name: string
  icon: string
}

export type DiscordGuildMember = {
  user: DiscordUser
  roles: DiscordRole[]
}

class Discord {
  private clientId: string
  private clientSecret: string
  private redirectUri: string
  private atlantisGuildId: string

  constructor() {
    this.clientId = config.get('discord.clientId')
    this.clientSecret = config.get('discord.clientSecret')
    this.redirectUri = config.get('discord.redirectUri')
    this.atlantisGuildId = config.get('discord.atlantisGuildId')
  }

  async getToken(code: string): Promise<DiscordToken> {
    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      grant_type: 'authorization_code',
      code,
    })

    const response = await axios.post<DiscordToken>(
      'https://discord.com/api/v10/oauth2/token',
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    return response.data
  }

  async getAtlantisMember(token: string): Promise<DiscordGuildMember> {
    return await this.getGuildMember(this.atlantisGuildId, token)
  }

  async getGuildMember(guildId: string, token: string): Promise<DiscordGuildMember> {
    const response = await axios.get<DiscordGuildMember>(
      `https://discord.com/api/v10/users/@me/guilds/${guildId}/member`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    )

    return {
      user: {
        id: response.data.user.id,
        username: response.data.user.username,
        avatar: response.data.user.avatar,
      },
      roles: response.data.roles.map((role: any) => ({
        id: role.id,
        name: role.name,
        icon: role.icon,
      })),
    }
  }
}

export const discord = new Discord()
