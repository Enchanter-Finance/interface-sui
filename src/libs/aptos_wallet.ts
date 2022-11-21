//  Establish connection to the wallet
export async function connect() {
    return await (window as any).aptos.connect()
}


// Check connection status of wallet
export async function isConnected() {
    return await (window as any).aptos.isConnected()
}

// Check connection status of wallet
export async function account() {
    return await (window as any).aptos.account()
}


// Disconnect dApp from the wallet
export async function disconnect(transaction: any) {
    return await (window as any).aptos.disconnect(transaction)
}

// Send transaction to the extension to be signed and submitted to chain
export async function signAndSubmitTransaction(transaction: any) {
    return await (window as any).aptos.signAndSubmitTransaction(transaction)
}

// Send transaction to the extension to be signed and returns
export async function signTransaction(transaction: any) {
    return await (window as any).aptos.signAndSubmitTransaction(transaction)
}


export function createTransaction(receiverAddress: string, amount: number) {
    return {
        type: 'script_function_payload',
        function: '0x1::coin::transfer',
        type_arguments: ['0x1::aptos_coin::AptosCoin'],
        arguments: [receiverAddress, amount]
    }
}

export async function aptos_submit(fun: string, type_arguments: any[], args: any[], sender:string) {
    const payload = {
        type: "entry_function_payload",
        function: fun,
        type_arguments: type_arguments,
        arguments: args.map((item) => {
            return `${item}`
        })
    };
    const options = {             
        max_gas_amount: '15000', 
    }       
    console.log('payload', payload)
    return (window as any).aptos.signAndSubmitTransaction(payload, options);
}



export const toFixed = (x:any) => {
    if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split('e-')[1]);
      if (e) {
          x *= Math.pow(10,e-1);
          x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
      }
    } else {
      var e = parseInt(x.toString().split('+')[1]);
      if (e > 20) {
          e -= 20;
          x /= Math.pow(10,e);
          x += (new Array(e+1)).join('0');
      }
    }
    return x;
  }
