

export PS1="ibp-\u cards \\$ "
# Parse_Arguments $@
boxen --margin=1 --padding=1 "Cloud Wallet implementation: $(echo "${NODE_CONFIG}" | jq -C .composer.wallet.type )"
composer card list


 



