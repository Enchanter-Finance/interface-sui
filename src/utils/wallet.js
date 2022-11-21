import { localStorage } from "../utils/localStorage";
export default class EnchanterWallet {
  constructor() {    
  }
  async initLogin(){
    const walletConnected = localStorage.get('localWallet')
    if(this.getIsInstalled('aptos') && walletConnected === 'aptos'){
      const response = await window.aptos.connect();
      localStorage.set('localWallet', 'aptos')
      return {
        wallet:'aptos',
        address:response?.address
      }
    }else if(this.getIsInstalled('martian') && walletConnected === 'martian'){
      const response = await window.martian.connect();
      localStorage.set('localWallet', 'martian')
      return {
        wallet:'martian',
        address:response?.address
      }
    }else if(this.getIsInstalled('fewcha') &&  walletConnected === 'fewcha'){      
      let response = await window.fewcha.connect();
      localStorage.set('localWallet', 'fewcha')
      let address = response?.data?.address
      return {
        wallet:address ? 'fewcha' : '',
        address
      }
    }
    else if(this.getIsInstalled('Crypto.com') &&  walletConnected === 'Crypto.com'){
      let response = await window.deficonnect?.aptos.connect();
      localStorage.set('localWallet', 'Crypto.com')
      let address = response?.address
      return {
        wallet:address ? 'Crypto.com' : '',
        address
      }
    }
    else{
      return {}
    }    
  }
  getIsInstalled(wallet){
    if(wallet === 'Crypto.com') return !!window.deficonnect?.aptos
    return !!window[wallet]
  }  
  doConnect(wallet){
    if(wallet === 'Crypto.com'){
      return window.deficonnect?.aptos.connect().then(res=>{
        return res
      }).catch(err=>{
        return err
      });  
    } 
    return window[wallet].connect().then(res=>{
      return res
    }).catch(err=>{
      return err
    });  
  }
  getIsConnected(name){
    if(wallet === 'Crypto.com'){
      return window.deficonnect.aptos.isConnected().then(res=>{
        return res
      }).catch(err=>{
        return err
      });  
    } 
    return window[name].isConnected().then(res=>{
      return res
    }).catch(err=>{
      return false
    });  
  }
  disConnect(wallet){
    if(wallet === 'Crypto.com'){
      return window.deficonnect.aptos.disconnect().then(res=>{
        return res
      }).catch(err=>{
        return err
      });  
    } 
    return window[wallet].disconnect();
  }
};
