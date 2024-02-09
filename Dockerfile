FROM node:18.14.2-slim
USER root
# fix node container exited when file change / saved
# https://github.com/nestjs/nest-cli/issues/484
RUN apt-get update \
    && apt-get install -y procps
# if error "docker Temporary failure resolving 'deb.debian.org'", try:
# disable vpn or warp
# sudo service NetworkManager restart
# sudo systemctl restart docker