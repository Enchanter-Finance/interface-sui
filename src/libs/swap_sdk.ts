/// swap amm sdk

import {swap_address, test_coin_address} from "./address";
import {martian_submit} from "./martian_wallet";
import {aptos_submit} from "./aptos_wallet";
import {getAccountResource, getAccountResources, getCoinBalance} from "./aptos_sdk";

export async function submit(fun: string, type_arguments: any[], args: any[], sender:string) {
    
    const wallet: string = localStorage.getItem('localWallet') || 'aptos'
    switch (wallet) {
        case "aptos": {
            return await aptos_submit(fun, type_arguments, args, sender)
        }
        case "martian": {
            return await martian_submit(fun, type_arguments, args, sender)
        }
        default: {
            return await aptos_submit(fun, type_arguments, args, sender)
        }

    }
}

/// amount 1- 100000
export async function mint(coin: "eth" | "usdt" | "usd", amount: number) {
    return await submit(`${test_coin_address}::mock_${coin}::mint_me`, [], [amount])
}


export async function exchange(in_coin: string, out_coin: string, in_amount: number, out_amount: number, impact_rate: number, sender:string) {
   return  await submit(`${swap_address}::ui_call::exchange`, [in_coin, out_coin], [in_amount, out_amount, impact_rate], sender)
}

export async function add_equity(coin_x: string, amount_x: number, coin_y: string, amount_y: number, impact_rate: number, sender:string) {
    return  await submit(`${swap_address}::ui_call::add_equity`, [coin_x, coin_y], [amount_x, amount_y, impact_rate], sender)
}

export async function remove_equity(coin_x: string, coin_y: string, equity_amount: number, amount_x: number, amount_y: number, impact_rate: number, sender:string) {
    return await submit(`${swap_address}::ui_call::remove_equity`, [coin_x, coin_y], [equity_amount, amount_x, amount_y, impact_rate], sender)
}


export function get_swap_coins(){
    return new Promise((resolve)=>{
        setTimeout(() => {
            resolve([
                {
                    address: `0x1::aptos_coin::AptosCoin`,
                    name: "APT",
                    logo: "aptos.png",
                    symbol:'APT',
                    value:'',
                    balance:0
                },
                {
                    address: `${test_coin_address}::mock_usdt::USDT`,
                    name: "USDT",
                    logo: "usdt.png",
                    symbol:'USDT',
                    value:'',
                    balance:0
                },
                {
                    address: `${test_coin_address}::mock_usd::USD`,
                    name: "USD",
                    logo: "usdc.png",
                    symbol:'USDC',
                    value:'',
                    balance:0
                },
                {
                    address: `${test_coin_address}::mock_eth::ETH`,
                    name: "ETH",
                    logo: "eth.png",
                    symbol:'ETH',
                    value:'',
                    balance:0
                },
                {
                    address: '',
                    name: "",
                    logo: "",
                    symbol:'',
                    value:'',
                    balance:0
                },
             ])
        }, 150);
    })
}

export async function getBalanceOf(address:string) {
    const r = await getAccountResources(address)
    const list = await get_swap_coins()
    // @ts-ignore: Unreachable code error
    list.forEach(item => {
        const coin = r.find(_ => _.type === `0x1::coin::CoinStore<${item.address}>`)
        // @ts-ignore: Unreachable code error
        item.balance = coin?.data?.coin?.value || 0
    })
    return list
}

export async function getBalanceOfAptos(address:string, coins: any) {
    const r = await getAccountResources(address)
    const aptosAddress = coins.find((_:any) => _.symbol === 'APT').address
    const apt = r.find(_ => _.type === `0x1::coin::CoinStore<${aptosAddress}>`)
    // @ts-ignore: Unreachable code error
    return apt?.data?.coin?.value
}

// get pool info
export async function get_pool(coin_x: string, coin_y: string) {
    const data = await getAccountResource(swap_address, `${swap_address}::pool::Pool<${coin_x},${coin_y}>`)
    return data
}


export async function get_all_pools() {
    const data = await getAccountResources(swap_address)
    const pairs = data.filter((item: any) => {
        return item.type.startsWith(`${swap_address}::pool::Pool`) && item.data.reserve_x > 0;
    })
    return pairs
}

export async function get_my_pool(address: string) {
    const data = await getAccountResources(address)
    const pairs = data.filter((item: any) => {
        return item.type.startsWith(`0x1::coin::CoinStore<${swap_address}::equity::Equity`) && item.data.coin.value > 0;
    })    
    return pairs
}


export function get_coin_pair_by_lp(pair_lp: string) {
    return pair_lp.replace(`0x1::coin::CoinStore<${swap_address}::equity::Equity<`, "")
        .replace(">>", "")
        .split(",").map(_ => _.trim());
}

export function get_coin_short_name(name: string) {
    return name.split("::")[2];
}


export async function get_pool_by_coin(coinX: string, CoinY: string) {
    const lp_X_Y = `${swap_address}::pool::Pool<${coinX}, ${CoinY}>`
    const lp_Y_X = `${swap_address}::pool::Pool<${CoinY}, ${coinX}>`
    let data;
    let lp;
    try {
        data = await getAccountResource(swap_address, lp_X_Y)
        console.info("xy")
        lp = "xy"
    } catch (e) {
    }

    if (!data) {
        try {
            data = await getAccountResource(swap_address, lp_Y_X)
            console.info("yx")
            lp = "yx"
        } catch (e) {
        }
    }


    return {"lp": lp, data}
}

export async function get_reserve_rate(coinX: string, CoinY: string) {
    const {lp, data} = await get_pool_by_coin(coinX, CoinY)
    if (data) {
        let data1: any = data.data
        if (lp === "xy") {
            return {
                rate: data1.reserve_x / data1.reserve_y,
                x: data1.reserve_x,
                y: data1.reserve_y,
                lp
            }
        }
        if (lp === "yx") {
            return {
                rate: data1.reserve_y / data1.reserve_x,
                x: data1.reserve_y,
                y: data1.reserve_x,
                lp
            }
        }
    }

}


export async function get_lp_coin_balance(address: string, coinX: string, CoinY: string) {
    const coin = `${address}::equity::Equity<${coinX},${CoinY}>`
    const amount = await getCoinBalance(address, coin)
    return amount
}


export function calculateExchangeOutAmount(coin_x_reserve: number, coin_y_reserve: number, in_coin_amount: number, based_position:string) {
    
    if (coin_y_reserve === 0) {
        return 0;
    }
    if(based_position === 'top'){
        return  parseInt ( (coin_y_reserve- (coin_x_reserve * coin_y_reserve  / (1*coin_x_reserve + 1*in_coin_amount))).toFixed(0))
    }else if(based_position === 'bottom'){
        return  parseInt ( (coin_x_reserve- (coin_x_reserve * coin_y_reserve  / (1*coin_y_reserve + 1*in_coin_amount))).toFixed(0))        
    }
}


export function calculateRemoveEquityOutAmount(equity_amount: number, coin_reserve: number, total_equity_supply: number) {    
    if (coin_reserve === 0) {
        return 0;
    }
    return parseInt((equity_amount * total_equity_supply / coin_reserve).toFixed(0))
}



export async function get_coin_info(coin: string) {
    // @ts-ignore
    return await getAccountResource(swap_address, `0x1::coin::CoinInfo<${coin}>`)
}


export async function get_coin_pool_xy_info(coinX: string, coinY: string) {
    // @ts-ignore
    return await get_coin_info(`${swap_address}::equity::Equity<${coinX}, ${coinY}>`)
}

export async function get_coin_pool_xy_supply(coinX: string, coinY: string) {
    const info: any = await get_coin_pool_xy_info(coinX, coinY)
    if (!info) {
        return 0;
    }
    return info.data.supply.vec[0].integer.vec[0].value
}




