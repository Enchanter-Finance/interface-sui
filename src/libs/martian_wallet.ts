
//  Establish connection to the wallet
export async function connect() {
    return await (window as any).martian.connect()
}


// Check connection status of wallet
export async function isConnected() {
    return await (window as any).martian.isConnected()
}

// Check connection status of wallet
export async function account() {
    return await (window as any).martian.account()
}


// Disconnect dApp from the wallet
export async function disconnect(transaction: any) {
    return await (window as any).martian.disconnect(transaction)
}

// Send transaction to the extension to be signed and submitted to chain
export async function signAndSubmitTransaction(transaction: any) {
    return await (window as any).martian.signAndSubmitTransaction(transaction)
}

// Send transaction to the extension to be signed and returns
export async function signTransaction(transaction: any) {
    return await (window as any).martian.signAndSubmitTransaction(transaction)
}


export function createTransaction(receiverAddress: string, amount: number) {
    return {
        type: 'script_function_payload',
        function: '0x1::coin::transfer',
        type_arguments: ['0x1::martian_coin::martianCoin'],
        arguments: [receiverAddress, amount]
    }
}


export async function martian_submit(fun: string, type_arguments: any[], args: any[], sender: string) {
    try {
        const payload = {
            type: "entry_function_payload",
            function: fun,
            type_arguments: type_arguments,
            arguments: args.map(_ => `${_}`)
        };
        console.log('payload', payload)
        const options = {             
            max_gas_amount: '15000', 
        }            
        const transaction = await (window as any).martian.generateTransaction(sender, payload, options);   
        const txnHash = await (window as any).martian.signAndSubmitTransaction(transaction);
        return { hash: txnHash }
    } catch (e) {        
       return Promise.reject(e)   
    }

}

