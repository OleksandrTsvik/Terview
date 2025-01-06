# Setup

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

## Api/.env.production

```
Serilog__MinimumLevel=Warning
Serilog__WriteTo__0__Name=Console
Serilog__WriteTo__1__Name=MongoDBBson
Serilog__WriteTo__1__Args__databaseUrl=
Serilog__WriteTo__1__Args__collectionName=logs

Cors__Origins__0=

MongoDb__ConnectionString=
MongoDb__DatabaseName=

Cloudinary__CloudName=
Cloudinary__ApiKey=
Cloudinary__ApiSecret=

Email__Host=smtp.gmail.com
Email__Port=587
Email__SenderName=Terview
Email__SenderEmail=oleksandr.zwick@gmail.com
Email__Username=
Email__Password=

Files__MaxImageSizeInBytes=10485760

Jwt__AccessTokenExpirationInMinutes=
Jwt__RefreshTokenExpirationInDays=
Jwt__SecretKey=
Jwt__Issuer=
Jwt__Audience=

Security__EmailVerificationTokenExpirationInHours=
Security__EmailVerificationRedirectUrl=
Security__MaxUserPasswordResetTokens=
Security__PasswordResetTokenExpirationInMinutes=
Security__PasswordResetRedirectUrl=

Outbox__PeriodInSeconds=
Outbox__BatchSize=

Scheduler__PeriodInSeconds=
Scheduler__BatchSize=

Jobs__DeleteLogsSkipCount=
Jobs__DeleteNotesAfterDays=
Jobs__DeleteProcessedOutboxMessagesAfterDays=
Jobs__DeleteUsersAfterDays=

Seed__Users__0__Email=
Seed__Users__0__Password=
```
