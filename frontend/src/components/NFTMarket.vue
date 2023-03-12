<template>
  <div  class="nftmarket-container">
    <h1>{{ msg }}</h1>
      {{ state.sign }}
      <button @click="_signMessage">Sign</button>
      <button @click="list">List</button>
  </div>
</template>

<script setup lang="ts">
import {defineProps, reactive} from 'vue';
import {ethers} from 'ethers';
import {signMessage} from './../domains/usecases/sign';
import {onListButtonClick} from './../domains/usecases/list';

defineProps<{ msg: string }>();
const state = reactive({sign: ''})
const updateSign = (sign: string) => {
  state.sign = sign
}

async function _signMessage() {
  const sign = await signMessage()
  updateSign(sign)
}

async function list() {
  // MetaMaskのインストール確認
  if (typeof window.ethereum === 'undefined') {
    alert('MetaMaskがインストールされていません。');
    return;
  }

  // MetaMaskの利用承認確認
  await window.ethereum.enable();

  // Ethereumプロバイダの作成
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner()

  await onListButtonClick(signer)
}

// async function purchaseToken(): Promise<void> {
//   // MetaMaskのインストール確認
//   if (typeof window.ethereum === 'undefined') {
//     alert('MetaMaskがインストールされていません。');
//     return;
//   }
//
//   // MetaMaskの利用承認確認
//   await window.ethereum.request({method: 'eth_requestAccounts'});
//
//   // Ethereumプロバイダの作成
//   const provider = new ethers.providers.Web3Provider(window.ethereum);
//
//   // コントラクトアドレス
//   const contractAddress = '0x...'; // Purchaseコントラクトのアドレス
//
//   // コントラクトのABI
//   const contractAbi = [
//     'function purchase() public',
//   ];
//
//   // コントラクトインスタンスの作成
//   const contract = new ethers.Contract(contractAddress, contractAbi, provider.getSigner());
//
//   // Purchaseメソッドを呼び出し
//   const tx = await contract.purchase();
//
//   console.log(`Transaction hash: ${tx.hash}`);
// }
</script>

<style scoped>
.nftmarket-container {
}
</style>
