// ************************************************
// API doc: http://milkomedadao.club/web/#/43/258
// ************************************************
import {AptosClient} from "aptos";


const TEST_COIN_ADDRESS = '0xc09a8dbf686d6357293f8c2c93bd9ee2bcabd9645a4db2c5c6d0dc1ca43d2686';
const nodeUrl = "https://fullnode.devnet.aptoslabs.com/v1";


const _client = new AptosClient(nodeUrl)

export async function getAccountResource(address: string, tye: string) {
    return await _client.getAccountResource(address, tye)
}

export async function getAccountResources(address: string) {
    return await _client.getAccountResources(address)
}

/**
 * swap coin list, only three coins offered
*/
export async function getSwapCoins() {
    const coins = [
        {
            address: `0x1::aptos_coin::AptosCoin`,
            name: "Aptos Coin",
            chainId: 'devnet',
            decimals: 8,
            symbol: 'APT',            
            balance: 0
        },
        {
            address: `${TEST_COIN_ADDRESS}::mock_usdt::USDT`,
            name: "Mock USDT",
            chainId: 'devnet',
            decimals: 8,
            symbol: 'mUSDT',            
            balance: 0
        },
        {
            address: `${TEST_COIN_ADDRESS}::enfi_coin::ENFI`,
            name: "ENFI",
            chainId: 'devnet',
            decimals: 8,
            symbol: 'ENFI',            
            balance: 0
        },
    ];
    const resProArr = [];
    for(const coin of coins) {
        const addr = coin.address;
        const type = `0x1::coin::CoinStore<${addr}>`
        const resPro = getAccountResource(TEST_COIN_ADDRESS, type);
        resProArr.push(resPro);
    }
    const resArr = await Promise.all(resProArr);
    for(const idx in coins) {
        const coin = coins[idx];
        const res: any = resArr[idx];
        try {
            coin['balance'] = res.data.coin.value;
        } catch (e) {
            coin['balance'] = 0;
        }
    }
    return coins;
}

/**
 * get rate
 * @param isExactIn 
 * @param value 
 * @param decimals 
 * @param tokenInAddress 
 * @param tokenOutAddress 
 */
export async function getTokenRate(isExactIn: boolean, tokenInAddress: string, tokenOutAddress: string, value: number,
        tokenInDecimal: number, tokenOutDecimal: number) {
    const poolType = `${TEST_COIN_ADDRESS}::pool::Pool<${tokenInAddress}, ${tokenOutAddress}>`;
    const res: any = await getAccountResource(TEST_COIN_ADDRESS, poolType);
    console.log(res);
    const reserveX = parseInt(res.data.reserve_x);
    const reserveY = parseInt(res.data.reserve_y);
    if(isExactIn) {
        const tokenInAmount = value * (10 ** tokenInDecimal);
        const tokenOutAmount = tokenInAmount * reserveY / (tokenInAmount + reserveX);
        return {
            tokenInValue: value,
            tokenOutValue: tokenOutAmount / (10 ** tokenOutDecimal),
            tokenInAmount,
            tokenOutAmount,
            tokenInDecimal,
            tokenOutDecimal,
            rate: tokenInAmount/tokenOutAmount,
            poolTokenInSupply: reserveX,
            poolTokenOutSupply: reserveY
        };
    } else {
        const tokenOutAmount = value * (10 ** tokenOutDecimal);
        const tokenInAmount = tokenOutAmount * reserveX / (tokenOutAmount + reserveY);
        return {
            tokenInValue: tokenInAmount / (10 ** tokenInDecimal),
            tokenOutValue: value,
            tokenInAmount,
            tokenOutAmount,
            tokenInDecimal,
            tokenOutDecimal,
            rate: tokenInAmount / tokenOutAmount,
            poolTokenInSupply: reserveX,
            poolTokenOutSupply: reserveY
        };
    }
}

/**
 * get LP Token
 */
export async function getCurrentLPAmount(account: string, tokenInAddress: string, tokenOutAddress: string) {
    // get total LP amount
    const equity = `${TEST_COIN_ADDRESS}::equity::Equity<${tokenInAddress}, ${tokenOutAddress}>`;
    const coinInfoType = `0x1::coin::CoinInfo<${equity}>`;
    let supply: number;
    let decimals: number = -1;
    try {
        const infoRes: any = await getAccountResource(account, coinInfoType);
        supply = parseInt(infoRes.data.supply.vec[0].integer.vec[0].value);
        decimals = parseInt(infoRes.data.decimals);
    } catch(e) {
        return {
            account,
            lpValue: 0.0,
            lpAmount: 0,
            supply: 0,
            decimals
        };
    }
    

    // get user LP amount
    const equityType = `0x1::coin::CoinStore<${equity}>`;
    let lpAmount: number;
    try {
        const equityRes: any = await getAccountResource(account, equityType);
        lpAmount = parseInt(equityRes.data.coin.value);
    } catch(e) {
        lpAmount = 0;
    }

    return {
        account,
        lpValue: lpAmount / (10 ** decimals),
        lpAmount,
        supply,
        decimals
    };
}

/**
 * get lp list
 * @param account
 * @returns 
 */
export async function getLPList(account: string) {
    const data = await getAccountResources(account);
    const equityTypePrefix = `0x1::coin::CoinStore<${TEST_COIN_ADDRESS}::equity::Equity<`;
    const prefixNum = equityTypePrefix.length;
    const pairs = data.filter((item: any) => {
        return item.type.startsWith(equityTypePrefix) && item.data.coin.value > 0;
    });
    const lpList = [];
    for(const idx in pairs) {
        const item: any = pairs[idx];
        try {
            const typePair = item.type.slice(prefixNum).slice(0, -2);
            const [tokenA, tokenB] = typePair.split(', ');
            const coinInfoType = `0x1::coin::CoinInfo<${TEST_COIN_ADDRESS}::equity::Equity<${typePair}>>`;
            const infoRes: any = await getAccountResource(account, coinInfoType);
            const supply = parseInt(infoRes.data.supply.vec[0].integer.vec[0].value);
            const equityDecimal = parseInt(infoRes.data.decimals);
            const lpValue = parseInt(item.data.coin.value) / (10 ** equityDecimal);
            const lp = {
                pair: item.type,
                tokenA,
                tokenB,
                lpValue,
                decimals: equityDecimal,
                supply
            };
            lpList.push(lp);
        } catch(e) {
            continue;
        }
        
    }
    return lpList;
}

/**
 * get LP Token amount
 */
export async function getLPAmountByPairs(isExactIn: boolean, tokenInAddress: string, tokenOutAddress: string, value: number,
        tokenInDecimal: number, tokenOutDecimal: number, lpSupply: number) {
    const poolType = `${TEST_COIN_ADDRESS}::pool::Pool<${tokenInAddress}, ${tokenOutAddress}>`;
    const res: any = await getAccountResource(TEST_COIN_ADDRESS, poolType);
    const reserveX = parseInt(res.data.reserve_x);
    const reserveY = parseInt(res.data.reserve_y);
    if(isExactIn) {
        const xAmount = value * (10 ** tokenInDecimal);
        const xLP = lpSupply * xAmount / reserveX;
        const tokenOutValue = reserveY * value / reserveX;
        return {
            tokenInValue: value,
            tokenOutValue,
            tokenInAmount: xAmount,
            tokenOutAmount: tokenOutValue * (10 ** tokenInDecimal),
            tokenInDecimal,
            tokenOutDecimal,
            rate: value / tokenOutValue,
            poolTokenInSupply: reserveX,
            poolTokenOutSupply: reserveY,
            lpValue: xLP
        };
    } else {
        const yAmount = value * (10 ** tokenOutDecimal);
        const yLP = lpSupply * yAmount / reserveY;
        const tokenInValue = reserveX * value / reserveY;
        return {
            tokenInValue,
            tokenOutValue: value,
            tokenInAmount: tokenInValue * (10 ** tokenInDecimal),
            tokenOutAmount: yAmount,
            tokenInDecimal,
            tokenOutDecimal,
            rate: tokenInValue / value,
            poolTokenInSupply: reserveX,
            poolTokenOutSupply: reserveY,
            lpValue: yLP
        };
    }
}

/**
 * Pair Token amount
 */
export async function getPairAmountByLPToken(tokenInAddress: string, tokenOutAddress: string, lpAmount: number, totalLpAmount: number,
    tokenInDecimal: number, tokenOutDecimal: number) {
    const poolType = `${TEST_COIN_ADDRESS}::pool::Pool<${tokenInAddress}, ${tokenOutAddress}>`;
    const res: any = await getAccountResource(TEST_COIN_ADDRESS, poolType);
    const reserveX = parseInt(res.data.reserve_x);
    const reserveY = parseInt(res.data.reserve_y);

    const userRatio = lpAmount / totalLpAmount;
    const tokenXAmount = userRatio * reserveX;
    const tokenYAmount = userRatio * reserveY;
    const tokenXValue = tokenXAmount / (10 ** tokenInDecimal);
    const tokenYValue = tokenYAmount / (10 ** tokenOutDecimal);
    return {
        tokenXValue,
        tokenYValue,
        tokenXAmount,
        tokenYAmount
    }
}


if(process.argv.length === 3) {
    const funcId = parseInt(process.argv[2]);
    console.log(funcId);
    if(funcId === 0) {
        getSwapCoins().then(coins => {
            console.log(coins);
        });
    } else if(funcId === 1) {
        // execIn
        getTokenRate(true, '0x1::aptos_coin::AptosCoin', `${TEST_COIN_ADDRESS}::mock_usdt::USDT`, 0.001, 8, 8).then(rate => {
            console.log(rate);
        });
        // execOut
        getTokenRate(false, '0x1::aptos_coin::AptosCoin', `${TEST_COIN_ADDRESS}::mock_usdt::USDT`, 0.001, 8, 8).then(rate => {
            console.log(rate);
        });
    } else if(funcId === 2) {
        getCurrentLPAmount(TEST_COIN_ADDRESS, '0x1::aptos_coin::AptosCoin', `${TEST_COIN_ADDRESS}::mock_usdt::USDT`).then(lp => {
            console.log(lp);
        });
    } else if(funcId === 3) {
        getLPList(TEST_COIN_ADDRESS).then(lps => {
            console.log(lps);
        });
    } else if(funcId === 4) {
        // execIn
        getLPAmountByPairs(true, '0x1::aptos_coin::AptosCoin', `${TEST_COIN_ADDRESS}::mock_usdt::USDT`, 0.001, 8, 8, 0.1).then(lp => {
            console.log(lp);
        });
        // execOut
        getLPAmountByPairs(false, '0x1::aptos_coin::AptosCoin', `${TEST_COIN_ADDRESS}::mock_usdt::USDT`, 0.001, 8, 8, 0.1).then(lp => {
            console.log(lp);
        });
    } else if(funcId === 5) {
        getPairAmountByLPToken('0x1::aptos_coin::AptosCoin', `${TEST_COIN_ADDRESS}::mock_usdt::USDT`, 0.1, 0.66405717, 8, 8).then(pair => {
            console.log(pair);
        });
    }
}
