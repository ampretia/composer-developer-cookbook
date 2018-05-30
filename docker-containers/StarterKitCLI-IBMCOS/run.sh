
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
export PS1="ibp-\u cos \\$ "
# Parse_Arguments $@
#boxen --margin=1 --padding=1 $(echo "${NODE_CONFIG}" | jq -C . )

echo "${NODE_CONFIG}" | jq -C .

composer --version
composer card list
# assert that the local card store has been mapped in
# if /home/composer/.cwdwallet

# set the NODE_CONFIG to be the local card store

 



