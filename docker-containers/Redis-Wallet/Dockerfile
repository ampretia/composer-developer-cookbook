# Extend the IBM Blockchain Composer-CLI
FROM redis:4

# Install the latest version of composer by default.
ARG VERSION=latest

# update and install all required packages (no sudo required as root)
# https://gist.github.com/isaacs/579814#file-only-git-all-the-way-sh
RUN apt-get update -yq && apt-get upgrade -yq && \
apt-get install -yq curl git nano

# install from nodesource using apt-get
# https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-an-ubuntu-14-04-server
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash - && \
apt-get install -yq nodejs build-essential

# Create the composer user ID.
RUN useradd --user-group --create-home --shell=/bin/false composer

# Run as the composer user ID.
USER composer

# Run in the composer users home directory.
WORKDIR /home/composer

# Install composer CLI
RUN mkdir /home/composer/.npm-global && \
    npm config set prefix '/home/composer/.npm-global' && \
    npm install --production -g composer-cli@${VERSION}  composer-wallet-redis && \
    rm -rf /home/composer/.config /home/composer/.node-gyp /home/composer/.npm

ENV PATH /home/composer/.npm-global/bin:$PATH
ENV NODE_CONFIG '{"composer":{"wallet":{"type":"composer-wallet-redis","desc":"redis","options":{}}}}'
