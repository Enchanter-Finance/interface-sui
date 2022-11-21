import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { debounce, HexAddressEnsure } from "@/utils/index";
import { MutationType } from "@/store/mutations";
import fuzzysort from 'fuzzysort'

export default function (type) {
  
  const getImgUrl = (logo) => new URL(`../assets/images/${logo || "default_token_logo.png"}`, import.meta.url).href;
  const store = useStore();
  const address = computed(() => store.state.address);
  const selectedTokenTop = computed(() => store.state.selectedTokenTop);
  const selectedTokenBottom = computed(() => store.state.selectedTokenBottom);


  const isGray = (token) => {
    return (selectedTokenTop.value.address === token.address || selectedTokenBottom.value.address === token.address);
  };

  const position = computed( () => {
    return type === 'swap' ? store.state.isSwapSelectTokenModalOpen.position : store.state.isLpSelectTokenModalOpen.position
  });

  const isSelected = (token) => {
    return (
      (position.value === "top" && selectedTokenTop.value.address === token.address) || (position.value === "bottom" && selectedTokenBottom.value.address === token.address)
    );
  };

  const getTotalList = ()=>{
    const addFuzzyList = store.state.tokenList.map((item) => {
      item.fuzzyText = item.symbol + item.name
      return item
    })
    return addFuzzyList.filter((_) => _.address)
  }

  // search
  const isLoading = ref(false);
  const isSearched = ref(false);
  const showList = ref(getTotalList());

  const resetList = ()=>{
    isLoading.value = false
    isSearched.value = false
  }

  const handleInput = (e)=>{

    const text = e.target.value.trim();
    if(!text.length) return showList.value = getTotalList()
    const totalList = getTotalList()
    
    // if is not hex string, go local fuzzy search
    if(!HexAddressEnsure(text)){    

      const results = fuzzysort.go(text, totalList, { key:'fuzzyText'})
      const list = results.map( item => item.obj)
      showList.value = list
      isSearched.value = false

    }else if(HexAddressEnsure(text)){

      // if is hex address and exist in local list, show it
      const findOne = totalList.find(item => item.address === text)
      if(findOne){
        isSearched.value = false
        showList.value = [findOne]
        return 
      }

      // online research
      isLoading.value = true;
      showList.value = []
      debounceMethod(text)
    }
  }

  const debounceMethod = debounce((coinAddress) => {
    window.SDK.getCoinInfo(coinAddress, address.value).then((res) => {
      if(!res) return resetList()
      showList.value = [res];
      isLoading.value = false;
      isSearched.value = true
    });
  }, 600);


  // auto focus
  const inputRef = ref();
  onMounted(() => {
    inputRef.value && inputRef.value.focus()
  });

  const showTokenConfirmModal = (token)=>{
    store.commit(MutationType.SetShowTokenConfirmModal, {
      token,
      visible: true,
    });
  }


  return {
    getImgUrl,
    address,
    selectedTokenTop,
    selectedTokenBottom,
    isLoading,
    isSearched,
    showList,
    handleInput,
    inputRef,
    isGray,
    showTokenConfirmModal,
    position,
    isSelected
  }
}
