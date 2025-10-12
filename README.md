🧱 Web3 Frontend + Anvil Local Chain

A local development setup for a Web3 DApp using Foundry (Anvil), Next.js, and Otterscan.

🚀 Start the full stack

To build and start all services (frontend, local chain, and explorer):

docker compose up --build

Once everything is up:

🌐 Frontend: http://localhost:3013

⚡ Local Chain (Anvil): http://localhost:8545

🔍 Chain Explorer (Otterscan): http://localhost:5100

Connect your MetaMask wallet to the local network at:

RPC URL: http://localhost:8545
Chain ID: 31337
Currency Symbol: ETH

🧑‍💻 Development mode

For active frontend development with auto-rebuilds:

docker compose up --build -d
docker compose watch web3-frontend

This will:

Run the Anvil local chain and Otterscan in the background

Watch your frontend (web3-frontend) for code changes and rebuild automatically

🧩 Service overview
Service Description URL
web3-frontend Next.js DApp frontend http://localhost:3013

anvil Foundry local blockchain node http://localhost:8545

otterscan Local block explorer for Anvil http://localhost:5100
🧠 Notes

Each time you restart the Anvil container, accounts and balances reset unless you mount a persistent volume (default: ./anvil-data).

Deployed contract addresses are stored in Foundry’s broadcast/ folder.

To rebuild contracts and redeploy:

forge build
forge script script/DeployCounter.s.sol --rpc-url http://localhost:8545 --private-key <PRIVATE_KEY> --broadcast
