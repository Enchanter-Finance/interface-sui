

export class Token {
  readonly chainId: number;
  readonly address: string;
  readonly decimals: number;
  // readonly symbol: string | undefined;
  // readonly name: string | undefined;

  constructor(address: string, decimals: number, chainId: number=27) {
    this.address = address;
    this.chainId = chainId;
    this.decimals = decimals;
  }

  public equals(other: Token): boolean {
    if(this.address !== other.address) return false;
    return true;
  }
}


export class TokenAmount {
  readonly token: Token;
  readonly amount: number;

  constructor(token: Token, amount: number) {
    this.token = token;
    this.amount = amount;
  }
}


export class Pair {
  readonly tokenAmounts: [TokenAmount, TokenAmount];

  constructor(tokenAmountA: TokenAmount, tokenAmountB: TokenAmount) {
    this.tokenAmounts = [tokenAmountA, tokenAmountB];
  }
  
  public get token0(): Token {
    return this.tokenAmounts[0].token;
  }

  public get token1(): Token {
    return this.tokenAmounts[1].token;
  }

  public get reserve0(): number {
    return this.tokenAmounts[0].amount;
  }

  public get reserve1(): number {
    return this.tokenAmounts[1].amount;
  }

  public getOutputAmount(inputAmount: TokenAmount): TokenAmount {
    const inputAmountWithoutFee = inputAmount.amount * 0.97;
    const isToken0: boolean = inputAmount.token.equals(this.token0);
    const [inputReserve, outputReserve] = isToken0 ?
      [this.reserve0, this.reserve1]: [this.reserve1, this.reserve0];
    const quote = Math.floor(inputAmountWithoutFee * outputReserve / (inputAmountWithoutFee + inputReserve));
    
    return new TokenAmount(isToken0 ? this.token1: this.token0, quote);
  }

  public getInputAmount(outputAmount: TokenAmount): TokenAmount {
    const isToken1: boolean = outputAmount.token.equals(this.token1);
    const outputAmountWithFee = outputAmount.amount;
    const [inputReserve, outputReserve] = isToken1 ?
      [this.reserve0, this.reserve1]: [this.reserve1, this.reserve0];
    const quote = Math.floor(outputAmountWithFee * inputReserve * 1000 / ((outputReserve - outputAmountWithFee) * 997)) + 1;
    return new TokenAmount(isToken1 ? this.token0: this.token1, quote);
  }
}

export class Trade {
  readonly pairs: Pair[];
  readonly amount: TokenAmount;

  constructor(pairs: Pair[], amount: TokenAmount) {
    this.pairs = pairs;
    this.amount = amount;
  }
}

export interface BestTradeOptions {
  // how many results to return
  maxNumResults?: number
  // the maximum number of hops a trade should contain
  maxHops?: number
}