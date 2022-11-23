import { localStorage } from "../utils/localStorage";
export default class EnchanterWallet {
  constructor() {    
  }
  async initLogin(){
    const walletConnected = localStorage.get('localWallet')
    if(this.getIsInstalled('suiWallet') && walletConnected === 'suiWallet'){
      const permission = await suiWallet.hasPermissions()
      if(!permission) return {}
      const address = (await suiWallet.getAccounts())[0]
      return{
        wallet:'suiWallet',
        address
      }
    }else{
      return {}
    }
  }
  getIsInstalled(wallet){    
    return !!window[wallet]
  }
  doConnect(wallet){
    return window[wallet].requestPermissions().then(()=>{      
      return window[wallet].getAccounts().then(r=>{
        return {
          address:r[0]
        }
      })
    }).catch(err=>{      
      return err
    });
  }
  
  disConnect(wallet){
    
  }
};
