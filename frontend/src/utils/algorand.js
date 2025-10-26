import algosdk from 'algosdk';

const ALGOD_SERVER = 'https://testnet-api.algonode.cloud';
const ALGOD_PORT = '';
const ALGOD_TOKEN = '';

export const algodClient = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_SERVER, ALGOD_PORT);

/**
 * Convert base64 to Uint8Array (works in browser)
 */
function base64ToUint8Array(base64String) {
  const binaryString = atob(base64String);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Convert Uint8Array to base64
 */
function uint8ArrayToBase64(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Deploy Digital Will Smart Contract
 */
export async function deployDigitalWill(assetId, releaseTime, sender) {
  try {
    console.log(' Deploying contract...');
    console.log('Sender:', sender);
    console.log('Asset ID:', assetId);
    console.log('Release Time:', releaseTime);
    
    const suggested = await algodClient.getTransactionParams().do();
    
    // TEAL approval program
    const approvalSource = `#pragma version 8
txn ApplicationID
int 0
==
bnz create
err
create:
byte "owner"
txn Sender
app_global_put
byte "asset_id"
txna ApplicationArgs 0
btoi
app_global_put
byte "release_time"
txna ApplicationArgs 1
btoi
app_global_put
int 1
return`;
    
    // TEAL clear program
    const clearSource = `#pragma version 8
int 1
return`;
    
    // Compile programs
    console.log(' Compiling approval program...');
    const approvalResp = await algodClient.compile(approvalSource).do();
    const approvalProgram = base64ToUint8Array(approvalResp.result);
    
    console.log(' Compiling clear program...');
    const clearResp = await algodClient.compile(clearSource).do();
    const clearProgram = base64ToUint8Array(clearResp.result);
    
    console.log(' Programs compiled!');
    
    // Create app args
    const appArgs = [
      algosdk.encodeUint64(assetId),
      algosdk.encodeUint64(releaseTime)
    ];
    
    console.log(' Creating transaction...');
    
    const txn = algosdk.makeApplicationCreateTxnFromObject({
      from: sender,
      approvalProgram,
      clearProgram,
      appArgs,
      numGlobalInts: 2,
      numGlobalByteSlices: 1,
      numLocalInts: 0,
      numLocalByteSlices: 0,
      suggestedParams: suggested,
      onComplete: algosdk.OnApplicationComplete.NoOpOC
    });
    
    console.log(' Signing with AlgoSigner...');
    
    // Sign with AlgoSigner (use string encoding, not Buffer)
    const txn_b64 = uint8ArrayToBase64(txn.toByte());
    const signedTxn = await window.AlgoSigner.signTxn([{ txn: txn_b64 }]);
    
    console.log(' Sending transaction...');
    
    // Send transaction
    const raw = base64ToUint8Array(signedTxn[0].blob);
    const sendTx = await algodClient.sendRawTransaction(raw).do();
    
    console.log(' Waiting for confirmation... TX ID:', sendTx.txId);
    
    // Wait for confirmation
    const confirmedTxn = await algosdk.waitForConfirmation(
      algodClient,
      sendTx.txId,
      4
    );
    
    const appId = confirmedTxn['application-index'];
    
    console.log(' Contract deployed! App ID:', appId);
    
    return {
      success: true,
      txId: sendTx.txId,
      appId: appId
    };
    
  } catch (error) {
    console.error(' Deployment error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    throw error;
  }
}
