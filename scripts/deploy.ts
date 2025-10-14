import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying Bring2Life Escrow Contract to Hedera Testnet...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Get account balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "HBAR\n");

  // Set platform treasury (you can change this to your treasury address)
  const platformTreasury = deployer.address; // For testing, use deployer as treasury

  // Deploy the contract
  console.log("Deploying Bring2LifeEscrow contract...");
  const Bring2LifeEscrow = await ethers.getContractFactory("Bring2LifeEscrow");
  const escrow = await Bring2LifeEscrow.deploy(platformTreasury);

  await escrow.waitForDeployment();
  const escrowAddress = await escrow.getAddress();

  console.log("\n✅ Contract deployed successfully!");
  console.log("Contract Address:", escrowAddress);
  console.log("Platform Treasury:", platformTreasury);
  console.log("\n📋 Next Steps:");
  console.log("1. Add this address to your .env.local file:");
  console.log(`   NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=${escrowAddress}`);
  console.log("\n2. Verify contract on HashScan:");
  console.log(`   https://hashscan.io/testnet/contract/${escrowAddress}`);
  console.log("\n3. Run 'pnpm run verify:testnet' to verify the contract source code");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
