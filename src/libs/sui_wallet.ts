
export async function signAndSubmitTransaction(transaction: any) {
    return await (window as any).suiWallet.signAndSubmitTransaction(transaction)
}

// Send transaction to the extension to be signed and returns
export async function signTransaction(transaction: any) {
    return await (window as any).suiWallet.signAndSubmitTransaction(transaction)
}




export async function sui_submit(fun: string, type_arguments: any[], args: any[], packageId:string) {
    const payload = {        
        packageObjectId: packageId,
        module: 'swap',
        function: fun,
        typeArguments: type_arguments,
        arguments: args,
        gasBudget: 10000,
    };
    console.log('payload', payload)
    return (window as any).suiWallet.executeMoveCall(payload);
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
