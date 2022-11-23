import { AptosClient, HexString, MaybeHexString } from "aptos";
import { OpenAPIConfig } from "aptos/dist/generated";
import { aptos_submit, toFixed } from "./aptos_wallet";
import { SwapDirection, TokenInfo } from "./types/types";
import { Token, TokenAmount, Pair, Trade, BestTradeOptions } from "./entities/entities";
import { localStorage } from "../utils/localStorage";

const TEST_NET_NODE = "https://fullnode.testnet.aptoslabs.com/v1";
export const APTOS_ADDRESS = "0x1::aptos_coin::AptosCoin";
const EXCHANGE_ADDRESS = "0x5c4c2c3cca40700918a7274b67358882cda52c794d6fb82c6bceab94b6054841";
const COIN_ADDRESS = "0x65e19821611674c956792db3e859ae5b0270a87712cce57d0c9c2af55380b440";
const POOL_ADDRESS = "0x2fc13da1ab45503a041e2a43eabf56cab79faf6f913705ad79445206d771129f";
export const CELER_COIN_ADDRESS = '0xbc954a7df993344c9fec9aaccdf96673a897025119fc38a8e0f637598496b47a';

export class EnchanterAptosClient extends AptosClient {
    constructor(nodeUrl?: string, config?: Partial<OpenAPIConfig>, doNotFixNodeUrl: boolean = false) {
        nodeUrl = nodeUrl || TEST_NET_NODE;
        super(nodeUrl, config, doNotFixNodeUrl);
        //this._coinClient = new CoinClient(this);
        this.enchanterAddress = "";
    }
    //_coinClient: CoinClient
    enchanterAddress: MaybeHexString

    readonly BASES: Token[] = [
        // new Token('0x1::aptos_coin::AptosCoin'),
        new Token(`${COIN_ADDRESS}::usdt::USDT`, 8),
        new Token(`${COIN_ADDRESS}::usdc::USDC`, 8),
    ];

    getCoinBalance(addr: HexString, resource: string) {
        const address = HexString.ensure(addr);
        return this.getAccountResource(address, resource);
    }

    _getfixedTokenList(): Array<TokenInfo> {
        return [
            {
                address:APTOS_ADDRESS,
                name: "Aptos Coin",
                chainId: 27,
                decimals: 8,
                symbol: 'APT',
                value:'',
                logo: "aptos.png",
                isOfficial:true,
                balance: 0
            },
            {
                address:`${COIN_ADDRESS}::usdt::USDT`,
                name: "ENFI USDT",
                chainId: 27,
                decimals: 8,
                symbol: 'USDT',
                value:'',                
                logo: "usdt.png",
                isOfficial:true,
                balance: 0
            },
            {
                address:`${COIN_ADDRESS}::usdc::USDC`,
                name: "usdc",
                chainId: 27,
                decimals: 8,
                symbol: 'USDC',
                value:'',                
                logo: "usdc.png",
                isOfficial:true,
                balance: 0
            },
            {
                address:`${COIN_ADDRESS}::xbtc::XBTC`,
                name: "xbtc",
                chainId: 27,
                decimals: 8,
                symbol: 'XBTC',
                value:'',                
                logo: "btc.png",
                isOfficial:true,
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
        ];
    }

    _getCelerWhiteList(): Array<any> {
        return [
            [`${CELER_COIN_ADDRESS}::test_mint_dai_coin::TestMintCoin`, APTOS_ADDRESS],
            [`${CELER_COIN_ADDRESS}::test_mint_usdc_coin::TestMintCoin`, APTOS_ADDRESS],
            [`${CELER_COIN_ADDRESS}::test_mint_usdt_coin::TestMintCoin`, APTOS_ADDRESS],
            [`${CELER_COIN_ADDRESS}::test_mint_wbtc_coin::TestMintCoin`, APTOS_ADDRESS],
            [`${CELER_COIN_ADDRESS}::test_mint_weth_coin::TestMintCoin`, APTOS_ADDRESS]
        ]
    }

    _amountToDecimal(amount: number, decimals: number) {
        return amount / (10 ** decimals);
    }
    
    _decimalToAmount(amountWithDecimal: number, decimals: number) {
        return amountWithDecimal * (10 ** decimals);
    }

    async getTokenList(address?: HexString): Promise<Array<TokenInfo>> {
      const addedList = localStorage.get('userAddedTokens') || []
      let coinList = this._getfixedTokenList();
      if (addedList.length > 0) coinList = addedList.concat(coinList);
        
        if(address) {
            let resources:any
            try {
                resources = await this.getAccountResources(address);
            } catch (error) {
                return coinList
            }
            coinList.forEach(item => {
                const coin = resources.find((_:any) => _.type === `0x1::coin::CoinStore<${item.address}>`)
                // @ts-ignore: Unreachable code error
                const balance = coin?.data?.coin?.value || 0
                item.balance = toFixed(this._amountToDecimal(balance, item.decimals))

            })
        }
        return coinList;
    }

    async getBalanceOfAptos(address: HexString) {
        const coinList = this._getfixedTokenList();
        let resources;
        try {
            resources = await this.getAccountResources(address);
        } catch (error) {
            return 0
        }
        // @ts-ignore: Unreachable code error
        const { address: AptAddress, decimals } = coinList.find((_) => _.address === APTOS_ADDRESS)
        const aptResource = resources.find(_ => _.type === `0x1::coin::CoinStore<${AptAddress}>`)
        // @ts-ignore: Unreachable code error
        const balance = aptResource?.data?.coin?.value || 0
        return toFixed(this._amountToDecimal(balance, decimals))
    }

    async getReserveData(coinTypeTagX:string, coinTypeTagY:string) {
        let allPools = localStorage.get('allPools') || []
        if(!allPools.length){
            allPools = await this.getAllPools()  
            localStorage.set('allPools', allPools || [])
        } 

        let res:any;        
        let poolType:any;
        const lp = this._getLpDirection(allPools, coinTypeTagX, coinTypeTagY)
        
        if(lp){
            poolType = lp === 'xy' ? `${EXCHANGE_ADDRESS}::pool::Pool<${coinTypeTagX}, ${coinTypeTagY}>` : `${EXCHANGE_ADDRESS}::pool::Pool<${coinTypeTagY}, ${coinTypeTagX}>`;
        }else{
            // todolist -> auto router?
            return null
        }
        
        try {
            res = await this.getAccountResource(POOL_ADDRESS, poolType);
        } catch (error) {
            return null
        }
        
        let reserveX = parseInt(res.data.reserve_x.value);
        let reserveY = parseInt(res.data.reserve_y.value);
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

    async quote(type: SwapDirection, coinTypeTagX: string, coinTypeTagY: string, amount: number, decimalsArr:Array<number>) {
        const allPools = localStorage.get('allPools')
        let [topDecimals, botDecimals] = decimalsArr
        const legerInfo = await this.client.general.getLedgerInfo();
        let quote = 0;
        let res:any;        
        let poolType:any;

        const lp = this._getLpDirection(allPools, coinTypeTagX, coinTypeTagY)
        if(lp){
            poolType = (lp === 'xy' ? `${EXCHANGE_ADDRESS}::pool::Pool<${coinTypeTagX}, ${coinTypeTagY}>` : `${EXCHANGE_ADDRESS}::pool::Pool<${coinTypeTagY}, ${coinTypeTagX}>`) ;
        }else{
            // todolist -> auto router?
            return null
        }
        
        try {
            res = await this.getAccountResource(POOL_ADDRESS, poolType);
        } catch (error) {
            return null
        }
        let reserveX = parseInt(res.data.reserve_x.value);
        let reserveY = parseInt(res.data.reserve_y.value);
        
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
            blockNumber: legerInfo.block_height,
            version: legerInfo.ledger_version,
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

    async getTotalLpAmount(coinX: string, coinY: string) {        
        let poolType:any;
        let LpData:any;
        const allPools = localStorage.get('allPools')
        const lp = this._getLpDirection(allPools, coinX, coinY)
        poolType = (lp === 'xy' ? `${POOL_ADDRESS}::lp_coin::LPCoin<${coinX}, ${coinY}>` : `${POOL_ADDRESS}::lp_coin::LPCoin<${coinY}, ${coinX}>`) ;

        try {
            LpData = await this.getAccountResource(POOL_ADDRESS, `0x1::coin::CoinInfo<${poolType}>`);
        } catch (error) {
            return null
        }
        return {
            decimals:LpData.data.decimals,
            lpAmount:LpData.data.supply.vec[0].integer.vec[0].value
        }
    }
    

    async getCurrentLPAmount(account: HexString, coinTypeTagIn: string, coinTypeTagOut: string) {        
        const equity = `${POOL_ADDRESS}::lp_coin::LPCoin<${coinTypeTagIn}, ${coinTypeTagOut}>`;
        const coinInfoType = `0x1::coin::CoinInfo<${equity}>`;
        let supply: number;
        let decimals: number = -1;
        try {
            const infoRes: any = await this.getAccountResource(POOL_ADDRESS, coinInfoType);
            supply = parseInt(infoRes.data.supply.vec[0].integer.vec[0].value);
            decimals = parseInt(infoRes.data.decimals);
        } catch(e) {
            return {
                account,
                lpValue: 0.0,
                lpAmount: 0,
                supply: 0,
                decimals,
                share:0
            };
        }
        
    
        // get user LP amount
        const equityType = `0x1::coin::CoinStore<${equity}>`;
        let lpAmount: number;
        try {
            const equityRes: any = await this.getAccountResource(account, equityType);
            lpAmount = parseInt(equityRes.data.coin.value);
        } catch(e) {
            lpAmount = 0;
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


    // how much lp amount can get
    async getLPAmountByPairs(type: SwapDirection, coinTypeTagIn: string, coinTypeTagOut: string, amount: number,
        tokenInDecimal: number, tokenOutDecimal: number, lpSupply: number) {
        const poolType = `${EXCHANGE_ADDRESS}::pool::Pool<${coinTypeTagIn}, ${coinTypeTagOut}>`;
        const res: any = await this.getAccountResource(POOL_ADDRESS, poolType);
        const reserveX = parseInt(res.data.reserve_x.value);
        const reserveY = parseInt(res.data.reserve_y.value);
        if(type == "exactIn") {
            const xAmount = amount * (10 ** tokenInDecimal);
            const xLP = lpSupply * xAmount / reserveX;
            const tokenOutValue = reserveY * amount / reserveX;
            return {
                tokenInValue: amount,
                tokenOutValue,
                tokenInAmount: xAmount,
                tokenOutAmount: tokenOutValue * (10 ** tokenInDecimal),
                tokenInDecimal,
                tokenOutDecimal,
                rate: amount / tokenOutValue,
                poolTokenInSupply: reserveX,
                poolTokenOutSupply: reserveY,
                lpValue: xLP
            };
        } else {
            const yAmount = amount * (10 ** tokenOutDecimal);
            const yLP = lpSupply * yAmount / reserveY;
            const tokenInValue = reserveX * amount / reserveY;
            return {
                tokenInValue,
                tokenOutValue: amount,
                tokenInAmount: tokenInValue * (10 ** tokenInDecimal),
                tokenOutAmount: yAmount,
                tokenInDecimal,
                tokenOutDecimal,
                rate: tokenInValue / amount,
                poolTokenInSupply: reserveX,
                poolTokenOutSupply: reserveY,
                lpValue: yLP
            };
        }
    }

    // burn token or remove token
    async getPairAmountByLPToken(tokenInAddress: string, tokenOutAddress: string, lpAmount: number, totalLpAmount: number,
        tokenInDecimal: number, tokenOutDecimal: number) {
        const poolType = `${EXCHANGE_ADDRESS}::pool::Pool<${tokenInAddress}, ${tokenOutAddress}>`;
        const res: any = await this.getAccountResource(POOL_ADDRESS, poolType);
        const reserveX = parseInt(res.data.reserve_x.value);
        const reserveY = parseInt(res.data.reserve_y.value);
    
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

    async getAllPools() {
        const data = await this.getAccountResources(POOL_ADDRESS);
        let pairs = data.filter((item: any) => {
            return item.type.startsWith(`${EXCHANGE_ADDRESS}::pool::Pool`) && item.data.reserve_x.value > 0;
        })
        let arr  = pairs.map(item => {
            const startStr = `${EXCHANGE_ADDRESS}::pool::Pool<`
            return item.type.slice(startStr.length).slice(0, -1).split(', ')
        })
        return arr 
    }

    // get all users' lp
    async getUserLPList(account: string) {
        const data = await this.getAccountResources(account);
        const equityTypePrefix = `0x1::coin::CoinStore<${POOL_ADDRESS}::lp_coin::LPCoin<`;
        const prefixNum = equityTypePrefix.length;
        const pairs = data.filter((item) => {
            return item.type.startsWith(equityTypePrefix) && (item.data as any).coin.value > 0;
        });
        const lpList = [];
        for(const idx in pairs) {
            const item: any = pairs[idx];
            try {
                const typePair = item.type.slice(prefixNum).slice(0, -2);
                const [tokenX, tokenY] = typePair.split(', ');
                let coinInfoType = `${POOL_ADDRESS}::lp_coin::LPCoin<${typePair}>`;
                const coinAddress = `0x1::coin::CoinInfo<${coinInfoType}>`
                const infoRes: any = await this.getAccountResource(POOL_ADDRESS, coinAddress);
                const supply = parseInt(infoRes.data.supply.vec[0].integer.vec[0].value);
                const equityDecimal = parseInt(infoRes.data.decimals);
                const lpAmount = item.data.coin.value
                const share = lpAmount / supply

                const lp = {
                    pairs: [tokenX, tokenY],
                    tokenX,
                    tokenY,
                    lpAmount,
                    decimals: equityDecimal,
                    supply,
                    share
                };
                lpList.push(lp);
            } catch(e) {
                continue;
            }
            
        }
        return lpList;
    }




    async createPool(coin_x: string, coin_y: string, sender:string, ) {
        return  await this._submit(`${EXCHANGE_ADDRESS}::swap::create_pool`, [coin_x, coin_y], [], sender);
    }

    async addLiquidity(coin_x: string, amount_x: number, coin_y: string, amount_y: number, impact_rate: number, sender:string, type?:string) {
        const min_x = this._calculateMinimum(amount_x, impact_rate);
        const min_y = this._calculateMinimum(amount_y, impact_rate);
        const typeMethod = type === 'create' ? 'swap::create_pool_and_add_liquidity' : 'swap::add_liquidity';
        return  await this._submit(`${EXCHANGE_ADDRESS}::${typeMethod}`, [coin_x, coin_y], [amount_x, amount_y, min_x, min_y], sender);
    }

    async removeLiquidity(coin_x: string, coin_y: string, equity_amount: number, amount_x: number, amount_y: number, impact_rate: number, sender:string) {
        const  min_x = this._calculateMinimum(amount_x, impact_rate);
        const  min_y = this._calculateMinimum(amount_y, impact_rate);
        return await this._submit(`${EXCHANGE_ADDRESS}::swap::remove_liquidity`, [coin_x, coin_y], [equity_amount, min_x, min_y], sender);
    }

    async exchange(in_coin: string, out_coin: string, in_amount: number, out_amount: number, impact_rate: number, sender:string, type?:string) {
        in_amount = Math.floor(in_amount)
        out_amount = Math.floor(out_amount)
        let min_out;
        let max_in;
        if(type === 'exactIn'){
            min_out = this._calculateMinimum(out_amount, impact_rate, type);
            return await this._submit(`${EXCHANGE_ADDRESS}::swap::swap_exact_in`, [in_coin, out_coin], [in_amount, min_out], sender);
        }else{
            max_in = this._calculateMinimum(in_amount, impact_rate, type);
            return await this._submit(`${EXCHANGE_ADDRESS}::swap::swap_exact_out`, [in_coin, out_coin], [out_amount, max_in], sender);
        }
     }

    async _submit(fun: string, type_arguments: any[], args: any[], sender:string) {
        const wallet: string = localStorage.get("localWallet") || "aptos";
        switch (wallet) {
            case "aptos": {                
                return await aptos_submit(fun, type_arguments, args, sender);
            }            
            default:{

            }
        }
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
    
    async getCoinInfo(tokenAddress: string, userAddress?: any): Promise<TokenInfo | null> {
      const tokenInfo = {
        address: tokenAddress,
        name: "",
        chainId: 27,
        decimals: 0,
        symbol: "",
        value: "",
        logo: "",
        isOfficial:false,
        balance: 0      
      };
      const accountAddr = tokenAddress.split("::")[0];
      const accountAddrHex = HexString.ensure(accountAddr);
      const tokenCoinInfo = `0x1::coin::CoinInfo<${tokenAddress}>`;
      try {
        const tokenInfoRes: any = await this.getAccountResource(accountAddrHex, tokenCoinInfo);        
        if(userAddress){
            let resources = await this.getAccountResources(userAddress);
            const coin = resources.find((_: any) => _.type === `0x1::coin::CoinStore<${tokenAddress}>`);      
            // @ts-ignore: Unreachable code error
            const balance = coin?.data?.coin?.value || 0;
            tokenInfo.balance = this._amountToDecimal(balance, tokenInfo.decimals)
        }
        tokenInfo.decimals = parseInt(tokenInfoRes.data.decimals);
        tokenInfo.name = tokenInfoRes.data.name;
        tokenInfo.symbol = tokenInfoRes.data.symbol;        
      } catch (e) {      
        return null;
      }
  
      return tokenInfo;
    }

    private async _getCommonPairs(tokenA: Token, tokenB: Token): Promise<Pair[]> {
        const basePairs = [];
        const pairNum = this.BASES.length;
        for(let i = 0; i < pairNum; i++) {
            for(let j = i + 1; j < pairNum; j++) {
                if(i !== j) {
                    basePairs.push([this.BASES[i], this.BASES[j]]);
                }
            }
        }

        const allPairs = [
            [tokenA, tokenB],
            ...this.BASES.map((base): [Token, Token] => [tokenA, base]),
            ...this.BASES.map((base): [Token, Token] => [tokenB, base]),
            ...basePairs
        ].filter(([t0, t1]) => !t0.equals(t1));
        const uniPair = new Set();
        const validPairs: Pair[] = [];
        for(const pair of allPairs) {
            const [token0, token1] = pair[0].address < pair[1].address ? [pair[0], pair[1]]: [pair[1], pair[0]];
            const pairConcat = `${token0.address}-${token1.address}`;
            if(!uniPair.has(pairConcat)) {
                let rev: any;
                try {
                    rev = await this.getReserveData(token0.address, token1.address);
                } catch(error) {
                    continue
                }
                const tokenAmountA = new TokenAmount(token0, rev.x);
                const tokenAmountB = new TokenAmount(token1, rev.y);
                const clsPair = new Pair(tokenAmountA, tokenAmountB);
                validPairs.push(clsPair);
                uniPair.add(pairConcat);
            }
        }

        return validPairs;
    }

    private _findSwapPath(trade: Trade, tokenIn: Token): string {
        const pairs = trade.pairs;
        const line = [];
        let head: Token = tokenIn;
        const items = head.address.split('::');
        line.push(items[items.length - 1]);
        for(let idx in pairs) {
            const pair = pairs[idx];
            if(pair.token0.equals(head)) {
                const items = pair.token1.address.split('::');
                line.push(items[items.length - 1]);
                head = pair.token1;
            } else {
                const items = pair.token0.address.split('::');
                line.push(items[items.length - 1]);
                head = pair.token0;
            }
        }
        return line.join('::');
    }

    private _bestTradeExactIn(
        pairs: Pair[],
        currencyAmountIn: TokenAmount,
        currencyOut: Token,
        { maxNumResults = 2, maxHops = 2 }: BestTradeOptions = {},
        // used in recursion.
        currentPairs: Pair[] = [],
        nextAmountIn: TokenAmount = currencyAmountIn,
        bestTrades: Trade[] = []
      ): Trade[] {
        const amountIn = nextAmountIn;
        const tokenOut = currencyOut;
        for (let i = 0; i < pairs.length; i++) {
          const pair = pairs[i]
          // pair irrelevant
          if (!pair.token0.equals(amountIn.token) && !pair.token1.equals(amountIn.token)) continue
          if (pair.reserve0 === 0 || pair.reserve1 === 0) continue
    
          let amountOut: TokenAmount;
          try {
            amountOut = pair.getOutputAmount(amountIn);
          } catch (error) {
            throw error
          }

          // we have arrived at the output token, so this is the final trade of one of the paths
          if (amountOut.token.equals(tokenOut)) {
            const trade = new Trade([...currentPairs, pair], amountOut);
            bestTrades.push(trade); 
          } else if (maxHops > 1 && pairs.length > 1) {
            const pairsExcludingThisPair = pairs.slice(0, i).concat(pairs.slice(i + 1, pairs.length))
    
            // otherwise, consider all the other paths that lead from this token as long as we have not exceeded maxHops
            this._bestTradeExactIn(
              pairsExcludingThisPair,
              currencyAmountIn,
              currencyOut,
              {
                maxNumResults,
                maxHops: maxHops - 1
              },
              [...currentPairs, pair],
              amountOut,
              bestTrades
            )
          }
        }
    
        return bestTrades
    }

    private async _routerQuoteIn(trades: Trade[], tokenAmount: TokenAmount, token: Token) {
        const sortedTrades = trades.sort((trade0, trade1) => {
            return trade1.amount.amount - trade0.amount.amount;
        });
        const bestTrade = sortedTrades[0];
        const legerInfo = await this.client.general.getLedgerInfo();
        return {
            blockNumber: legerInfo.block_height,
            version: legerInfo.ledger_version,
            amount: tokenAmount.amount,
            amountDecimals: this._amountToDecimal(tokenAmount.amount, tokenAmount.token.decimals),
            quote: bestTrade.amount.amount,
            quoteDecimals: this._amountToDecimal(bestTrade.amount.amount, bestTrade.amount.token.decimals),
            path: this._findSwapPath(bestTrade, token),
        }
    }
    
    async findBestTradeExactIn(in_coin: string, out_coin: string, in_amount: number) {
        const tokenA = new Token(in_coin, 8);
        const tokenB = new Token(out_coin, 8);
        const allPairs = await this._getCommonPairs(tokenA, tokenB);
        if(allPairs.length === 0) return {}
        const tokenAmountIn = new TokenAmount(tokenA, in_amount);
        const trades = this._bestTradeExactIn(allPairs, tokenAmountIn, tokenB);
        if(trades.length === 0) return {}
        return await this._routerQuoteIn(trades, tokenAmountIn, tokenA);
    }

    private _bestTradeExactOut(
        pairs: Pair[],
        currencyIn: Token,
        currencyAmountOut: TokenAmount,
        { maxNumResults = 2, maxHops = 2 }: BestTradeOptions = {},
        // used in recursion.
        currentPairs: Pair[] = [],
        nextAmountOut: TokenAmount = currencyAmountOut,
        bestTrades: Trade[] = []
      ): Trade[] {
        const amountOut = nextAmountOut;
        const tokenIn = currencyIn;
        for (let i = 0; i < pairs.length; i++) {
          const pair = pairs[i]
          // pair irrelevant
          if (!pair.token0.equals(amountOut.token) && !pair.token1.equals(amountOut.token)) continue
          if (pair.reserve0 === 0 || pair.reserve1 === 0) continue
    
          let amountIn: TokenAmount;
          try {
            amountIn = pair.getInputAmount(amountOut);
          } catch (error) {
            throw error
          }

          // we have arrived at the output token, so this is the final trade of one of the paths
          if (amountIn.token.equals(tokenIn)) {
            const trade = new Trade([pair, ...currentPairs], amountIn);
            bestTrades.push(trade);
          } else if (maxHops > 1 && pairs.length > 1) {
            const pairsExcludingThisPair = pairs.slice(0, i).concat(pairs.slice(i + 1, pairs.length));
            // otherwise, consider all the other paths that lead from this token as long as we have not exceeded maxHops
            this._bestTradeExactOut(
              pairsExcludingThisPair,
              currencyIn,
              currencyAmountOut,
              {
                maxNumResults,
                maxHops: maxHops - 1
              },
              [pair, ...currentPairs],
              amountIn,
              bestTrades
            )
          }
        }
    
        return bestTrades
      }
    
    private async _routerQuoteOut(trades: Trade[], tokenAmount: TokenAmount, token: Token) {
        const sortedTrades = trades.sort((trade0, trade1) => {
            return trade0.amount.amount - trade1.amount.amount;
        });
        const bestTrade = sortedTrades[0];
        const legerInfo = await this.client.general.getLedgerInfo();
        return {
            blockNumber: legerInfo.block_height,
            version: legerInfo.ledger_version,
            amount: tokenAmount.amount,
            amountDecimals: this._amountToDecimal(tokenAmount.amount, tokenAmount.token.decimals),
            quote: bestTrade.amount.amount,
            quoteDecimals: this._amountToDecimal(bestTrade.amount.amount, bestTrade.amount.token.decimals),
            path: this._findSwapPath(bestTrade, token)
        };
    }
    
    async findBestTradeExactOut(in_coin: string, out_coin: string, out_amount: number) {
        const tokenA = new Token(in_coin, 8);
        const tokenB = new Token(out_coin, 8);
        const allPairs = await this._getCommonPairs(tokenA, tokenB);
        if(allPairs.length === 0) return {};
        const tokenAmountOut = new TokenAmount(tokenB, out_amount);
        const trades = this._bestTradeExactOut(allPairs, tokenA, tokenAmountOut);
        if(trades.length === 0) return {};
        return await this._routerQuoteOut(trades, tokenAmountOut, tokenA);
    }

}