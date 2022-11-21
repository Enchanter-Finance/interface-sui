
export const walletZip = {
  'aptos':{
    downloadLink:'https://petra.app/',
    uninstallText:'Install Aptos Wallet',
    installedText:'Petra Aptos Wallet',
    logo:'petra.png'
  },
  'martian':{    
    downloadLink:'https://martianwallet.xyz/',
    uninstallText:'Install Martian Wallet',
    installedText:'Martian Wallet',
    logo:'martian.png'
  },
  'fewcha':{    
    downloadLink:'https://fewcha.app/',
    uninstallText:'Install Fewcha Wallet',
    installedText:'Fewcha Wallet',
    logo:'fewcha.png'
  },
  'Crypto.com':{    
    downloadLink:'https://chrome.google.com/webstore/detail/cryptocom-wallet-extensio/hifafgmccdpekplomjjkcfgodnhcellj',
    uninstallText:'Install Crypto.com Wallet',
    installedText:'Crypto.com Wallet',
    logo:'cryptocom.png'
  },
}

export const getWallets = ()=>{
  return [{
    name:'martian',
    isConnected:false,
    logo: walletZip['martian'].logo,
    title: window.martian ? walletZip['martian'].installedText : walletZip['martian'].uninstallText,
    isInstalled: window.martian,
    href:walletZip['martian'].downloadLink
  },
  {
    name:'fewcha',
    isConnected:false,
    logo: walletZip['fewcha'].logo,
    title: window.fewcha ? walletZip['fewcha'].installedText : walletZip['fewcha'].uninstallText,
    isInstalled: window.fewcha,
    href:walletZip['fewcha'].downloadLink
  },
  {
    name:'aptos',
    isConnected:false,
    logo: walletZip['aptos'].logo,
    title: window.aptos ? walletZip['aptos'].installedText : walletZip['aptos'].uninstallText,
    isInstalled: window.aptos,
    href:walletZip['aptos'].downloadLink
  },
  {
    name:'Crypto.com',
    isConnected:false,
    logo: walletZip['Crypto.com'].logo,
    title: window.deficonnect?.aptos? walletZip['Crypto.com'].installedText : walletZip['Crypto.com'].uninstallText,
    isInstalled: window.deficonnect?.aptos,
    href:walletZip['Crypto.com'].downloadLink
  },
]
}
