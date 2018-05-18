
function install_jq {
    curl -o jq -L https://github.com/stedolan/jq/releases/download/jq-1.5/jq-linux64
    chmod +x jq
    export PATH=${PATH}:${PWD}
}

# assert that the local card store has been mapped in
# if /home/composer/.cwdwallet
export PS1="ibp-\u \\$ "
# set the NODE_CONFIG to be the local card store

export NODE_CONFIG=$(jq .composer.wallet.options.storePath=\"/home/composer/.fswallet\" /home/composer/.configs/cardstore-dir.json)          

boxen --margin=1 --padding=1 $(echo "${NODE_CONFIG}" | jq -C . )


