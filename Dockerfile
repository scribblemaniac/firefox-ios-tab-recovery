FROM node:22.3-bookworm-slim

RUN apt-get update \
    && apt-get install -y file \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /var/cache/apt

COPY src/ /src
WORKDIR /src

# Install dependencies
RUN npm install

ENTRYPOINT ["/src/startup.sh"]
