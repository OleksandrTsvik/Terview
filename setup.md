# Setup

## .env.production

```
Cors__Origins__0=

MongoDb__ConnectionString=
MongoDb__DatabaseName=

Jwt__AccessTokenExpirationInMinutes=
Jwt__RefreshTokenExpirationInDays=
Jwt__SecretKey=
Jwt__Issuer=
Jwt__Audience=

Seed__Users__0__Email=
Seed__Users__0__Password=
```

## .vscode

### settings.json

```json
{
  "terminal.integrated.persistentSessionReviveProcess": "never",
  "terminal.integrated.enablePersistentSessions": false
}
```

### terminals.json

[Terminals Manager](https://marketplace.visualstudio.com/items?itemName=fabiospampinato.vscode-terminals)

```json
{
  "autorun": true,
  "autokill": true,
  "terminals": [
    {
      "name": "api",
      "icon": "server",
      "color": "terminal.ansiGreen",
      "commands": [
        "cd Api",
        "dotnet watch --no-hot-reload --environment Local --launch-profile Local"
      ],
      "execute": false,
      "shellPath": "C:\\Program Files\\Git\\bin\\bash.exe"
    },
    {
      "name": "web",
      "icon": "globe",
      "color": "terminal.ansiCyan",
      "commands": ["cd Web", "npm run dev"],
      "execute": false,
      "shellPath": "C:\\Program Files\\Git\\bin\\bash.exe"
    },
    {
      "name": "web cli",
      "icon": "terminal",
      "color": "terminal.ansiYellow",
      "commands": ["cd Web"],
      "shellPath": "C:\\Program Files\\Git\\bin\\bash.exe"
    },
    {
      "name": "root",
      "icon": "file-directory",
      "color": "terminal.ansiBlue",
      "shellPath": "C:\\Program Files\\Git\\bin\\bash.exe"
    }
  ]
}
```
