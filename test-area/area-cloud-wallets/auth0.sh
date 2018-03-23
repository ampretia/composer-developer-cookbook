export COMPOSER_PROVIDERS='{ 
    "auth0": {
        "provider": "auth0",
        "module": "passport-auth0",
        "domain": "ampretia.eu.auth0.com",
        "clientID": "Y95oj9EUlB4HpANHJFTJC8xY5Hp9AOUt",
        "clientSecret": "yD1oLFvkaYM5sDc59Ca5wjcgpfGYGU3kv9Ulb6fxVM9igYrSiIOLksynpjYaErCZ",
        "callbackURL": "/auth/auth0/callback",
        "authPath" : "/auth/auth0/", 
        "successRedirect": "/",
        "failureRedirect": "/",
        "audience":"http://localhost/composer","grant_type":"client_credentials"
    }
}'
