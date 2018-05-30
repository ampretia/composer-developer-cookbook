
CMD_PROMPT=none

Parse_Arguments() {
	while [ $# -gt 0 ]; do
		case $1 in
			--help)
				HELPINFO=true
				;;
			--cmd | -c)
                shift
				CMD_PROMPT="$1"
				;;
		esac
		shift
	done
}
export PS1="ibp-\u \\$ "
# Parse_Arguments $@
export NODE_CONFIG=$(jq .composer.wallet.options.storePath=\"/home/composer/.fswallet\" /home/composer/.configs/cardstore-dir.json)       

env

boxen --margin=1 --padding=1 $(echo "${NODE_CONFIG}" | jq -C . )

composer --version

# assert that the local card store has been mapped in
# if /home/composer/.cwdwallet

# set the NODE_CONFIG to be the local card store

 


