
export const walletZip = {
  'suiWallet':{
    downloadLink:'https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil',
    uninstallText:'Install Sui Wallet',
    installedText:'Sui Wallet',
    logo:'suiWallet.png'
  }  
}

export const getWallets = ()=>{
  return [{
    name:'suiWallet',
    isConnected:false,
    logo: walletZip['suiWallet'].logo,
    title: window.suiWallet ? walletZip['suiWallet'].installedText : walletZip['suiWallet'].uninstallText,
    isInstalled: window.suiWallet,
    href:walletZip['suiWallet'].downloadLink
  }  
]
}
