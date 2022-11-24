import { JsonRpcProvider, Network, SUI_TYPE_ARG, SuiObject, getObjectFields, SuiObjectInfo, Coin } from '@mysten/sui.js';

const PACKAGE_ADDRESS = "0xc40f171e64fce180c5bfc07ac7ef847a3c6450a9";
const POOL_ADDRESS = "0x6033264da76004ab84de07c49988d4fb59a0f579";
const COIN_ADDRESS = "0x6098ccc37775c29da39dc926f2c0229a55ceed4e";

export class EnchanterAptosClient {
    private provider;

    constructor() {
        this.provider = new JsonRpcProvider(Network.DEVNET);
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
            logo: "",
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
            logo: "",
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
            logo: "",
            isOfficial: true,
            balance: 0
          }
        ]
    }
      
    /**
     * 获取address在typeArg上的余额
     * @param address 用户地址
     * @param typeArg coin的类型，比如：0x2::sui::SUI, ${COIN_ADDRESS}::btc::BTC
     * @returns 
     */
    async getCoinBalance(address: string, typeArg: string) {
        const coins = await this.provider.getCoinBalancesOwnedByAddress(address, typeArg);
        const balace = Coin.totalBalance(coins);
        return balace;
    }
    
    /**
     * 获取所有的流动性池
     */
    async getAllPools() {
        const pools = await this.provider.getObjectsOwnedByObject(POOL_ADDRESS);
        const allPools = [];
        for(const pool of pools) {
            const poolInfoObjectId = pool.objectId;
            const poolInfoObj: any = await this.provider.getObject(poolInfoObjectId);
            const poolObjectId = poolInfoObj.details.data.fields.value;
            const poolObj: any = await this.provider.getObject(poolObjectId);
            allPools.push(poolObj.details.data.fields);
        }
        return allPools;
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
}