## Area for testing cloud wallets

using local fs for the filestore

export NODE_CONFIG='{"composer":{"wallet":{"type":"composer-wallet-filesystem","options":{"storePath":"./composer-store"}}}}'

export COMPOSER_PROVIDERS='{
  "github": {
    "provider": "github",
    "module": "passport-github",
    "clientID": "872991276bad38936e21",
    "clientSecret": "bd039621fc1810d6d567b1635ee26de387a6c9c6",
    "authPath": "/auth/github",
    "callbackURL": "/auth/github/callback",
    "successRedirect": "/",
    "failureRedirect": "/"
  }
}'
