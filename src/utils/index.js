export const masacAddress = str => str.substring(0, 6) + '...' + str.substr(-4)


export const debounce = (func, delay = 200, { leading } = {}) => {
  let timerId

  return (...args) => {
    if (!timerId && leading) {
      func(...args)
    }
    clearTimeout(timerId)

    timerId = setTimeout(() => func(...args), delay)
  }
}


export const toFixed = x => {  
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

export const isHttpLink = url => {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" +
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
      "((\\d{1,3}\\.){3}\\d{1,3}))" +
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
      "(\\?[;&a-z\\d%_.~+=-]*)?" +
      "(\\#[-a-z\\d_]*)?$",
    "i"
  )
  return pattern.test(link)
}



function truncateTwoDecimals(num, dec = 2) {
  const totalDecimal = countDecimals(num);
  if (totalDecimal === 1) {
    dec = 1;
  }
  if (totalDecimal === 2) {
    return num;
  }
  const calcDec = Math.pow(10, dec);
  return Math.trunc(num * calcDec) / calcDec;
}
function countDecimals(value) {
  if(Math.floor(value) === value) return 0;
  return value.toString().split(".")[1].length || 0; 
}


export const formatDecimalsNum = (x, type = 'string', digit = 3) => {
  x = Number(x) || 0
  if(x < 1.0){
    let r = parseFloat(x.toFixed(8))
    if(type === 'string') return toFixed(r)
    return r
  }else{

    let r = parseFloat(truncateTwoDecimals(x, digit))
    r = truncateTwoDecimals(r, digit)
    // let r = parseFloat(x.toFixed(3)).toFixed(2)
    if(type === 'string') return toFixed(r)
    return r
  }
}


export const amountToDecimal = (amount, decimals) => {
  return amount / (10 ** decimals);
}

export const decimalToAmount = (amountWithDecimal, decimals)=> {
  return amountWithDecimal * (10 ** decimals);
}

export const HexAddressEnsure = (address)=> {
  return /^(0x|0X)[a-fA-F0-9]+/.test(address)
}

export function sleep(duration) {
  return new Promise(resolve => {
      setTimeout(resolve, duration);
  })
}

export const findToken = (list, address) => {
  
}
