import { AptosClient } from "aptos";


// const nodeUrl = "https://fullnode.devnet.aptoslabs.com"
const nodeUrl = "https://fullnode.testnet.aptoslabs.com/v1"


const _client = new AptosClient(nodeUrl)


export async function client() {
    return _client
}

export async function getAccountResource(address: string, tye: string) {
    return await _client.getAccountResource(address, tye)
}

export async function getAccountResources(address: string) {
    return await _client.getAccountResources(address)
}


export async function getTransactionByHash(txnHash: string) {
    try {
        return await _client.getTransactionByHash(txnHash)
    }catch (e){
        console.error(e);
        return  false
    }
}

// get coin balance
export async function getCoinBalance(address: string, coin: string) {
    try {
        const data: any = await getAccountResource(address, `0x1::coin::CoinStore<${coin}>`)
        console.info(data)
        return data.data.coin.value;
    } catch (e) {
        console.error(e);
        return 0
    }
}