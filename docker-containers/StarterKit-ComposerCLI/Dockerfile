# Extend the IBM Blockchain Composer-CLI
FROM ibmblockchain/composer-cli

USER root
RUN apt-get install jq --assume-yes

USER composer
COPY ./configs /home/composer/.configs
COPY *.sh /home/composer/

RUN npm install -g boxen-cli
ENTRYPOINT ["/bin/bash"]
CMD ["--init-file","run.sh"]