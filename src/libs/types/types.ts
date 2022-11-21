import { HexString } from "aptos"

export declare type TokenInfo = {  
  address: string,
  chainId: number,
  decimals: number,
  name: string,
  value:string,
  symbol: string,
  logo: string,
  isOfficial:boolean,
  add_by_user?:boolean,
  balance: number
}

export declare type SwapDirection = "exactOut" | "exactIn";