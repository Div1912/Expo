import * as StellarSdk from '@stellar/stellar-sdk';

const RPC_URL = 'https://soroban-testnet.stellar.org';
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;
const CONTRACT_ID = process.env.SOROBAN_CONTRACT_ID!;
const PLATFORM_SECRET = process.env.PLATFORM_SECRET_KEY!;

export const server = new StellarSdk.rpc.Server(RPC_URL);
export const horizonServer = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');

export async function createStellarAccount() {
  const keypair = StellarSdk.Keypair.random();
  const publicKey = keypair.publicKey();
  const secretKey = keypair.secret();

  // Fund with Friendbot for Testnet
  try {
    await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);
  } catch (error) {
    console.error('Friendbot funding failed:', error);
  }

  return { publicKey, secretKey };
}

export async function registerUniversalId(username: string, address: string) {
  // In a real scenario, we would call the Soroban contract.
  // Since we are mocking/simulating for the purpose of this architecture,
  // we will simulate the delay and return a mock transaction hash.
  
  // Real implementation structure:
  /*
  const source = StellarSdk.Keypair.fromSecret(PLATFORM_SECRET);
  const account = await server.getAccount(source.publicKey());
  const contract = new StellarSdk.Contract(CONTRACT_ID);
  
  const tx = new StellarSdk.TransactionBuilder(account, { fee: '1000', networkPassphrase: NETWORK_PASSPHRASE })
    .addOperation(contract.call('register', StellarSdk.nativeToScVal(username), StellarSdk.nativeToScVal(address)))
    .setTimeout(30)
    .build();
    
  tx.sign(source);
  const result = await server.sendTransaction(tx);
  */
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  return 'tx_' + Math.random().toString(36).substring(7);
}

export async function resolveUniversalId(username: string): Promise<string | null> {
  // Simulate Soroban resolve call
  // For the purpose of this platform, we will also check our local DB
  // because the backend handles the mapping.
  return null; // Local DB check will be the primary source for this demo
}

export async function sendPayment(fromSecret: string, toAddress: string, amount: string) {
  const sourceKeypair = StellarSdk.Keypair.fromSecret(fromSecret);
  const sourceAccount = await horizonServer.loadAccount(sourceKeypair.publicKey());

  const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination: toAddress,
        asset: StellarSdk.Asset.native(), // For Testnet demo we use XLM, but could be USDC
        amount: amount,
      })
    )
    .setTimeout(30)
    .build();

  transaction.sign(sourceKeypair);
  const result = await horizonServer.submitTransaction(transaction);
  return result.hash;
}

export async function getBalances(address: string) {
  try {
    const account = await horizonServer.loadAccount(address);
    return account.balances.map(b => ({
      asset: b.asset_type === 'native' ? 'XLM' : b.asset_code,
      balance: b.balance,
    }));
  } catch (error) {
    console.error('Balance fetch failed:', error);
    return [];
  }
}
