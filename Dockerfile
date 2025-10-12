FROM debian:12.10

ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    git \
    bash \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Foundry (forge, cast, anvil)
RUN curl -L https://foundry.paradigm.xyz | bash && \
    /root/.foundry/bin/foundryup

# Add Foundry binaries to PATH
ENV PATH="/root/.foundry/bin:${PATH}"

# Verify installation (optional)
RUN forge --version && cast --version && anvil --version


COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN chmod +x entrypoint.sh
EXPOSE 3013
ENTRYPOINT [ "./entrypoint.sh" ]