import { JsonRpcProvider, Network, SUI_TYPE_ARG, SuiObject, getObjectFields, SuiObjectInfo, Coin } from '@mysten/sui.js';
import { localStorage } from "../utils/localStorage";
import { sui_submit, toFixed } from "./sui_wallet";
import { SwapDirection, TokenInfo } from "./types/types";
import { groupBy, map } from 'lodash'
const PACKAGE_ADDRESS = "0xc40f171e64fce180c5bfc07ac7ef847a3c6450a9";
const POOL_ADDRESS = "0x6033264da76004ab84de07c49988d4fb59a0f579";
const COIN_ADDRESS = "0x6098ccc37775c29da39dc926f2c0229a55ceed4e";

export const CELER_COIN_ADDRESS = '123';
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
        console.log('fields', fields)
        
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
        
        console.log(coinIds);
        return await this.provider.getObjectBatch(coinIds);
    }

    private async _getDecimals(typeArg: string) {
        const events = await this.provider.getEvents({ "MoveEvent": `0x2::coin::CurrencyCreated<${typeArg}>` }, null, null)
        const event: any = events.data[0].event;
        return event.moveEvent?.fields?.decimals;
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
        return exactPair[1]
    }
}