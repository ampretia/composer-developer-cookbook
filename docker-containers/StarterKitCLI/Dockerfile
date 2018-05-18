# Extend the IBM Blockchain Composer-CLI
FROM ip-composer-docker-local.artifactory.swg-devops.com/ibmblockchain/composer-cli

USER root
RUN apt-get install jq --assume-yes

USER composer
COPY ./configs /home/composer/.configs
COPY run.sh /home/composer/run.sh


RUN npm install -g boxen-cli
ENTRYPOINT ["/bin/bash"]
CMD ["--init-file","run.sh"]