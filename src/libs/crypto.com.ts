//  Establish connection to the wallet
export async function connect() {
    return await (window as any).deficonnect?.aptos?.connect()
}


// Check connection status of wallet
export async function isConnected() {
    return await (window as any).deficonnect?.aptos?.isConnected()
}


// Disconnect dApp from the wallet
export async function disconnect(transaction: any) {
    return await (window as any).deficonnect?.aptos?.disconnect()
}

// Send transaction to the extension to be signed and submitted to chain
export async function signAndSubmitTransaction(transaction: any) {
    return await (window as any).deficonnect?.aptos?.signAndSubmitTransaction(transaction)
}

// Send transaction to the extension to be signed and returns
export async function signTransaction(transaction: any) {
    return await (window as any).deficonnect?.aptos?.signTransaction(transaction)
}



export async function cryptocom_submit(fun: string, type_arguments: any[], args: any[], sender: string) {
    const payload = {
        type: "entry_function_payload",
        function: fun,
        type_arguments: type_arguments,
        arguments: [ ...args].map(_ => `${_}`)
    };
    const options = {
        max_gas_amount: '15000', 
    }
    
    console.log('payload', payload)    
    return (window as any).deficonnect?.aptos?.signAndSubmitTransaction(payload, options);    
}

