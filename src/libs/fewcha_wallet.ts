//  Establish connection to the wallet
export async function connect() {
  return await (window as any).fewcha.connect()
}


// Check connection status of wallet
export async function isConnected() {
  return await (window as any).fewcha.isConnected()
}

// Check connection status of wallet
export async function account() {
  return await (window as any).fewcha.account()
}


// Disconnect dApp from the wallet
export async function disconnect(transaction: any) {
  return await (window as any).fewcha.disconnect(transaction)
}

// Send transaction to the extension to be signed and submitted to chain
export async function signAndSubmitTransaction(transaction: any) {
  return await (window as any).fewcha.signAndSubmitTransaction(transaction)
}

// Send transaction to the extension to be signed and returns
export async function signTransaction(transaction: any) {
  return await (window as any).fewcha.signAndSubmitTransaction(transaction)
}


export function createTransaction(receiverAddress: string, amount: number) {
  return {
      type: 'script_function_payload',
      function: '0x1::coin::transfer',
      type_arguments: ['0x1::aptos_coin::AptosCoin'],
      arguments: [receiverAddress, amount]
  }
}

export async function fewcha_submit(fun: string, type_arguments: any[], args: any[], sender:string) {
  const payload = {
      type: "entry_function_payload",
      function: fun,
      type_arguments: type_arguments,
      arguments: args
  };
  const options = {             
    max_gas_amount: '15000', 
  }       
  const txnRequest = await (window as any).fewcha.generateTransaction(payload, options);
  console.log('txnRequest', txnRequest)
  const txnHash = await signAndSubmitTransaction(txnRequest.data);
  console.log('txnHash', txnHash)
  return { hash: txnHash.data }

}



