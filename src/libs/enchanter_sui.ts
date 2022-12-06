import { JsonRpcProvider, Network, SUI_TYPE_ARG, SuiObject, getObjectFields, SuiObjectInfo, Coin } from '@mysten/sui.js';
import { localStorage } from "../utils/localStorage";
import { sui_submit, toFixed } from "./sui_wallet";
import { SwapDirection, TokenInfo } from "./types/types";
import { groupBy, map } from 'lodash'
const PACKAGE_ADDRESS = "0x1318d6fb6fb904f4707e97d41428cf00fbfefe0d";
const POOL_ADDRESS = "0xd9cb31218db2e0ffeccfd57fae1733f55082148f";
const COIN_ADDRESS = "0xb123efd724d209eadb24fe1c11b96433be87b944";

export const CELER_COIN_ADDRESS = 'CELER_COIN_ADDRESS';
export const SUI_ADDRESS = SUI_TYPE_ARG

export class EnchanterSuiClient {
    private provider;
    private defaultDecimals;

    constructor() {
        this.provider = new JsonRpcProvider(Network.DEVNET);
        this.defaultDecimals = 9;
    }

    private _getfixedTokenList() {
        return [
          {
            address: SUI_TYPE_ARG,
            name: "SUI",
            chainId: 1,
            decimals: 9,
            symbol: 'SUI',
            value:'',
            logo: "sui.png",
            isOfficial: true,
            balance: 0
          },
          {
            address: `${COIN_ADDRESS}::btc::BTC`,
            name: "BTC",
            chainId: 1,
            decimals: 9,
            symbol: 'BTC',
            value:'',
            logo: "btc.png",
            isOfficial: true,
            balance: 0
          },
          {
            address: `${COIN_ADDRESS}::usdc::USDC`,
            name: "USDC",
            chainId: 1,
            decimals: 9,
            symbol: 'USDC',
            value:'',
            logo: "usdc.png",
            isOfficial: true,
            balance: 0
          },
          {
            address:'',
            name: '',
            chainId: 0,
            decimals: 0,
            symbol: '',
            value:'',                
            logo: '',
            isOfficial:true,
            balance: 0
        },
        ]
    }

    // 给展示的token列表注入余额
    async getTokenList(address?: string) {
        const addedList = localStorage.get('userAddedTokens') || []
        let coinList = this._getfixedTokenList();
        if (addedList.length > 0) coinList = addedList.concat(coinList);
          
          if(address) {
              let coinMoveObjects:any
              let balanceObj:any = {}
              try {
                coinMoveObjects = await this.provider.getCoinBalancesOwnedByAddress(address);
              } catch (error) {
                  return coinList
              }
              const coins = coinMoveObjects.map((i:any) =>({ balance:Coin.getBalance(i), coinTypeArg:Coin.getCoinTypeArg(i) }))
              const groupsCoin = groupBy(coins, 'coinTypeArg')
              Object.keys(groupsCoin).forEach(key =>{                
                const total = groupsCoin[key].reduce( (partialSum, c:any) => partialSum + c.balance, BigInt(0) );
                balanceObj[key] = total
            })
            coinList.forEach(item => {
                if(item.address in balanceObj){
                    const balance = balanceObj[item.address]
                    item.balance = toFixed(this._amountToDecimal(Number(balance), item.decimals))
                }                
            })
          }
          return coinList;
    }

    // 拿到sui的余额
    async getBalanceOfSui(address: string) {
        let suiBalance = await this.getExactCoinBalance(address, SUI_TYPE_ARG)        
        return toFixed(this._amountToDecimal(Number(suiBalance), this.defaultDecimals))
    }

    // 拿到指定的币的余额
    async getExactCoinBalance(address:string,coinTypeArg:string) {
        const coinMoveObjects = await this.provider.getCoinBalancesOwnedByAddress(address);
        const balanceObjects: any = [];
        coinMoveObjects.forEach(object => {
            if (!Coin.isCoin(object)) {
                return;
            }
            if (coinTypeArg != Coin.getCoinTypeArg(object)) {
                return;
            }            
            const balance = Coin.getBalance(object)
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const coinSymbol = Coin.getCoinSymbol(coinTypeArg!);
            
            balanceObjects.push({                
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                balance: balance!,
                coinSymbol: coinSymbol
            })
        })
        
        const total = balanceObjects.reduce( (partialSum:any, c:any) => partialSum + c.balance, BigInt(0) );
        return total
    }

    
    /**
     * 获取所有的流动性池
     */
    async getAllPools() {
        const pools = await this.provider.getObjectsOwnedByObject(POOL_ADDRESS);
        const objectIds1 = map(pools, 'objectId');
        const list1 = await this.provider.getObjectBatch(objectIds1)
        const objectIds2 = list1.reduce( (prev:any, c:any) => [...prev, c.details.data.fields.value], []);
        const list2 = await this.provider.getObjectBatch(objectIds2)
        let coinsArr = list2.map((item:any) => {
            const startStr = `${PACKAGE_ADDRESS}::pool::Pool<`
            return item.details.data.type.slice(startStr.length).slice(0, -1).split(', ')
        })
        let coinsIds = list2.map((item:any) => {
            const startStr = `${PACKAGE_ADDRESS}::pool::Pool<`
            return [item.details.data.type.slice(startStr.length).slice(0, -1).split(', '), item.details.reference.objectId]
        })
        return {
            coinsArr,
            coinsIds
        }
    }


    // 获取交易信息
    async quote(type: SwapDirection, coinTypeTagX: string, coinTypeTagY: string, amount: number, decimalsArr:Array<number>) {
        const allPools = localStorage.get('allPools')
        const coinsIds = localStorage.get('coinsIds')
        let [topDecimals, botDecimals] = decimalsArr
        let quote = 0;
        let res:any;

        const lp = this._getLpDirection(allPools, coinTypeTagX, coinTypeTagY)
        const objectId:any = this._getObjectId(coinsIds, coinTypeTagX, coinTypeTagY)
        try {
            res = await this.provider.getObject(objectId)
        } catch (error) {
            return null
        }
        const fields = res.details.data.fields
        let reserveX = parseInt(fields.reserve_x);
        let reserveY = parseInt(fields.reserve_y);
        
        if(lp === 'yx'){
            [reserveX, reserveY] = [reserveY, reserveX];
        }
        if(type == "exactIn") {
            amount = amount * (1-0.0030)
            quote = Math.floor(amount * reserveY / (amount + reserveX));            
        } else {
            let nonFee = (amount * reserveX) / (reserveY - amount)
            quote = Math.floor(nonFee / (1-0.0030)) + 1;
        }
        let amountDecimals = this._amountToDecimal(amount, type == "exactIn" ? topDecimals : botDecimals);
        let quoteDecimals = this._amountToDecimal(quote, type == "exactIn" ? botDecimals : topDecimals);

        let rate = reserveX / reserveY

        return {            
            amount,
            amountDecimals,
            quote,
            quoteDecimals,
            reserveX,
            reserveY,
            rate,
            lp
        }
    }



    /**
     * 获取address在typeArg上的objects，这些objects的金额加起来大于等于amount
     * @param amount 目标金额
     * @param typeArg coin的类型，比如：0x2::sui::SUI, ${COIN_ADDRESS}::btc::BTC
     */
    async getBalnaceGreaterThan(address: string, amount: bigint, typeArg: string) {
        const coins = await this.provider.selectCoinSetWithCombinedBalanceGreaterThanOrEqual(address, amount, typeArg);
        return coins.map(coin => Coin.getID(coin));
    }
    
     async _submit(fun: string, type_arguments: any[], args: any[]) {
        const wallet: string = localStorage.get("localWallet") || "suiWallet";
        switch (wallet) {
            case "suiWallet": {
                return await sui_submit(fun, type_arguments, args, PACKAGE_ADDRESS);
            }            
            default:{

            }
        }
    }


    async getReserveData(coinTypeTagX:string, coinTypeTagY:string) {
        
        let allPools = localStorage.get('allPools') || []
        let coinsIds = localStorage.get('coinsIds') || []
        if(!allPools.length || !coinsIds.length){
            const data = await this.getAllPools()  
            localStorage.set('allPools', data.coinsArr || [])
            localStorage.set('coinsIds', data.coinsIds || [])
            allPools = data.coinsArr
            coinsIds = data.coinsIds            
        } 

        let res:any;
        const lp = this._getLpDirection(allPools, coinTypeTagX, coinTypeTagY)
        const objectId:any = this._getObjectId(coinsIds, coinTypeTagX, coinTypeTagY)

        try {
            res = await this.provider.getObject(objectId)
        } catch (error) {
            return null
        }

        const fields = res.details.data.fields
        
        let reserveX = parseInt(fields.reserve_x);
        let reserveY = parseInt(fields.reserve_y);

        let rate = reserveX / reserveY
        

        if(lp === 'yx'){
            [reserveX, reserveY] = [reserveY, reserveX]
            rate = 1 / rate
        }
        return {
            rate,
            x: reserveX,
            y: reserveY,
            lp
        }
    }

    /**
     * 获取address的LP Token
     * @param address 用户地址
     * @returns 
     */
    async getUserLPList(address: string) {
        const objects = await this.provider.getObjectsOwnedByAddress(address);                
        const coinIds = objects
            .filter(
            (obj: SuiObjectInfo) => {
                const typeArg: any = Coin.getCoinTypeArg(obj);
                return Coin.isCoin(obj) && (!typeArg ? false: typeArg.includes(`${PACKAGE_ADDRESS}::pool::LPCoin`));
            })
            .map((c) => c.objectId);

        const list = await this.provider.getObjectBatch(coinIds);
        
        const coinsIds = localStorage.get('coinsIds')
        const lpList = [];
        for(const item of list) {
            try {
                const { fields, type } = item.details.data
                const lpAmount = fields.balance
                const decimals = 9
                const startStr = `0x2::coin::Coin<${PACKAGE_ADDRESS}::pool::LPCoin<`                
                const [tokenX, tokenY] = type.slice(startStr.length).slice(0, -2).split(', ')
                const objectId:any = this._getObjectId(coinsIds, tokenX, tokenY)
                const LpData:any = await this.provider.getObject(objectId)
                const supply = LpData.details.data.fields.lp_supply.fields.value                
                const share = lpAmount / supply
                const lp = {
                    pairs: [tokenX, tokenY],
                    tokenX,
                    tokenY,
                    lpAmount,
                    decimals,
                    supply,
                    share
                };
                const idx = lpList.findIndex(i => i.tokenX === lp.tokenX && i.tokenY === lp.tokenY)
                if(idx !== -1){
                    lpList[idx].lpAmount = lpList[idx].lpAmount + lp.lpAmount
                    lpList[idx].share = lpList[idx].lpAmount / supply
                }else{
                    lpList.push(lp);
                }
                
            } catch (error) {
                continue
            }
        }
        return lpList;
    }

    async exchange(in_coin: string, out_coin: string, in_amount: number, out_amount: number, impact_rate: number, sender:string, type?:string) {
        const allPools = localStorage.get('allPools')
        const coinsIds = localStorage.get('coinsIds')

        in_amount = Math.floor(in_amount)
        out_amount = Math.floor(out_amount)
        
        const lp = this._getLpDirection(allPools, in_coin, out_coin)
        const poolId:any = this._getObjectId(coinsIds, in_coin, out_coin)

        let coin_numbers:any = await this.getBalnaceGreaterThan(sender, BigInt(in_amount), in_coin)

        let min_out;
        let max_in;

        const dir = lp === 'xy' ? 'swap_x_to_y_' : 'swap_y_to_x_'

        if(type === 'exactIn'){
            min_out = this._calculateMinimum(out_amount, impact_rate, type);
            const strArgs = [poolId, coin_numbers, in_amount, min_out]
            return await this._submit(`${dir}exact_in`, [in_coin, out_coin], strArgs);
        }else{
            max_in = this._calculateMinimum(in_amount, impact_rate, type);
            const strArgs = [poolId, coin_numbers, out_amount, max_in]
            return await this._submit(`${dir}exact_out`, [in_coin, out_coin], strArgs);
        }
     }
     
    async addLiquidity(coin_x: string, amount_x: number, coin_y: string, amount_y: number, impact_rate: number, sender:string, type?:string) {
        const coinsIds = localStorage.get('coinsIds')
        const poolId:any = this._getObjectId(coinsIds, coin_x, coin_y)
        const min_x = this._calculateMinimum(amount_x, impact_rate);
        const min_y = this._calculateMinimum(amount_y, impact_rate);
        let coin_numbers_x:any = await this.getBalnaceGreaterThan(sender, BigInt(amount_x), coin_x)
        let coin_numbers_y:any = await this.getBalnaceGreaterThan(sender, BigInt(amount_y), coin_y)
        const strArgs = [poolId, coin_numbers_x, coin_numbers_y, amount_x, min_x, amount_y, min_y]
        const typeMethod = type === 'create' ? 'swap::create_pool_and_add_liquidity' : 'add_liquidity';
        return await this._submit(typeMethod, [coin_x, coin_y], strArgs);
    }

    async removeLiquidity(coin_x: string, coin_y: string, equity_amount: number, amount_x: number, amount_y: number, impact_rate: number, sender:string) {

        const coinsIds = localStorage.get('coinsIds')
        const poolId:any = this._getObjectId(coinsIds, coin_x, coin_y)

        const min_x = this._calculateMinimum(amount_x, impact_rate);
        const min_y = this._calculateMinimum(amount_y, impact_rate);
        
        let typeStr = `${PACKAGE_ADDRESS}::pool::LPCoin<${coin_x}, ${coin_y}>`
        let coin_numbers_lp:any = await this.getBalnaceGreaterThan(sender, BigInt(equity_amount), typeStr)
        
        const strArgs = [poolId, coin_numbers_lp, equity_amount, min_x, min_y]

        return await this._submit('remove_liquidity', [coin_x, coin_y], strArgs);
    }
    

    private async _getDecimals(typeArg: string) {
        const events = await this.provider.getEvents({ "MoveEvent": `0x2::coin::CurrencyCreated<${typeArg}>` }, null, null)
        const event: any = events.data[0].event;
        return event.moveEvent?.fields?.decimals;
    }

    async getTotalLpAmount(coinX: string, coinY: string) {
        const coinsIds = localStorage.get('coinsIds')
        const objectId:any = this._getObjectId(coinsIds, coinX, coinY)
        let LpData:any;
        try {
            LpData = await this.provider.getObject(objectId)
        } catch (error) {
            return null
        }
        return{
            decimals:9,
            lpAmount:LpData.details.data.fields.lp_supply.fields.value
        }
    }


    async getCurrentLPAmount(account: string, tokenX: string, tokenY: string) {
        const coinsIds = localStorage.get('coinsIds')
        const objectId:any = this._getObjectId(coinsIds, tokenX, tokenY)        
        let supply: number;        
        try {
            let LpData:any = await this.provider.getObject(objectId)            
            supply = parseInt(LpData.details.data.fields.lp_supply.fields.value);
        } catch(e) {
            return {
                account,
                lpValue: 0.0,
                lpAmount: 0,
                supply: 0,
                decimals:9,
                share:0
            };
        }
        
        let lpAmount: number;
        let decimals:number
        try {
            const objects = await this.provider.getObjectsOwnedByAddress(account);        
            const coinIds = objects
                .filter(
                (obj: SuiObjectInfo) => {
                    const typeArg: any = Coin.getCoinTypeArg(obj);
                    return Coin.isCoin(obj) && (!typeArg ? false: typeArg.includes(`${PACKAGE_ADDRESS}::pool::LPCoin`));
                })
                .map((c) => c.objectId);
            const list = await this.provider.getObjectBatch(coinIds);            
            const items = list.filter(i => i.details.data.type.includes(tokenX) && i.details.data.type.includes(tokenY))
            const total = items.reduce((prev, cur)=> (prev + cur.details.data.fields.balance), 0)
            lpAmount = total
            decimals = 9
        } catch(e) {
            lpAmount = 0;
            decimals = 9
        }
    
        return {
            account,
            lpValue: lpAmount / (10 ** decimals),
            lpAmount,
            supply,
            decimals,
            share: lpAmount / supply
        };
    }

    
    /**
     * 
     * @param typeArg coin的类型，比如：${COIN_ADDRESS}::btc::BTC
     * @returns 
     */
    async getCoinInfo(typeArg: string, userAddress:string) {
        const tokenInfo = {
            address: typeArg,
            name: "",
            chainId: 1,
            decimals: 0,
            symbol: "",
            value: "",
            logo: "",
            isOfficial:false,
            balance: 0      
        };
        try {
            tokenInfo.symbol = Coin.getCoinSymbol(typeArg);
            tokenInfo.name = tokenInfo.symbol;
            const decimals = await this._getDecimals(typeArg);
            if(userAddress){
                let coinBalance = await this.getExactCoinBalance(userAddress, '')
                tokenInfo.balance = toFixed(this._amountToDecimal(Number(coinBalance), decimals))
            }            
            tokenInfo.decimals = decimals ? decimals: this.defaultDecimals;
        } catch(e) {
        }
        
        return tokenInfo;
    }
    
    _amountToDecimal(amount: number, decimals: number) {
        return amount / (10 ** decimals);
    }
    
    _decimalToAmount(amountWithDecimal: number, decimals: number) {
        return amountWithDecimal * (10 ** decimals);
    }

    _calculateMinimum(num:number,impact_rate:number, type?:string): number{
        if(type === 'exactIn'){
           return Math.floor(num * (1 - (impact_rate / 100000)))
        }else if(type === 'exactOut'){
           return Math.ceil(num * (1 + (impact_rate/ 100000)))
        }else{
            return Math.floor(num * (1 - (impact_rate/ 100000)))
        }
    }

    _getLpDirection(allPools:Array<Array<string>>, coinX:string, coinY:string): string|undefined{
        const exactPair = allPools.find(lp => lp.indexOf(coinX) !== -1 && lp.indexOf(coinY) !== -1)
        let lp;
        if(exactPair){
            if(exactPair[0] === coinX){
                lp = 'xy';         
            }else{
                lp = 'yx';          
            }
        }
        return lp
    }
    _getObjectId(coinsIds:Array<any>, coinX:string, coinY:string): string|undefined{        
        const exactPair = coinsIds.find(lp => lp[0].indexOf(coinX) !== -1 && lp[0].indexOf(coinY) !== -1)        
        return exactPair && exactPair[1] || null
    }
    async handleRequest(account:string){
        return await this.provider.requestSuiFromFaucet(account);
    }
}