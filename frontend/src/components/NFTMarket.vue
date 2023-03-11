<script setup lang="ts">
import {defineComponent, defineProps, reactive} from 'vue';
import {approve721, list} from '../domains/usecases/seller/list';
import {
  erc20Contract,
  erc20ContractAddress,
  marketplaceContractAddress,
  nftContract,
  nftContractAddress
} from "../lib/nftmarket";
import {signerAddress} from "../lib/ethereum";
import {approve20, buy} from "../domains/usecases/buyer/buy";

defineProps<{ msg: string }>();
const initialState = {
  signature: "",
  approved: false,
  messageHash: "",
  txHash: "",
  ownerOfTokenId1: "",
  balance20: "",
};
const state = reactive(initialState);
const updateApproved = (newApproved: boolean) => {
  state.approved = newApproved;
};
const updateOwnerOfTokenId1 = (newOwner: string) => {
  state.ownerOfTokenId1 = newOwner;
};
const updateBalance20 = (newBalance: string) => {
  state.balance20 = newBalance;
};

async function _approve() {
  await approve721()
}

async function getApproved() {
  const approved = await nftContract.isApprovedForAll(signerAddress, marketplaceContractAddress);
  console.log({approved});
  updateApproved(approved);
};

setInterval(() => {
  getApproved();
}, 3000);

async function getOwnerOfTokenId1() {
  const owner = await nftContract.ownerOf(1);
  console.log({owner});
  updateOwnerOfTokenId1(owner);
}

setInterval(() => {
  getOwnerOfTokenId1();
}, 3000);

async function getBalance20() {
  const balance = await erc20Contract.balanceOf(signerAddress);
  console.log({balance});
  updateBalance20(balance.toString());
}

setInterval(() => {
  getBalance20();
}, 3000);

async function _list() {
  // MetaMaskのインストール確認
  if (typeof window.ethereum === 'undefined') {
    alert('MetaMaskがインストールされていません。');
    return;
  }
  // MetaMaskの利用承認確認
  await window.ethereum.enable();
  const {signature, messageHash, txHash} = await list()
  state.signature = signature;
  state.messageHash = messageHash;
  state.txHash = txHash;
}

async function _buy() {
  await approve20()
  await buy()
}

defineComponent({
  name: 'NFTMarket',
  setup() {
    return {
      state
    };
  },
});
</script>

<template>
  <div class="nftmarket-container">
    <h1>{{ msg }}</h1>

    <p>Erc20: {{ erc20ContractAddress }}</p>
    <p>Erc721: {{ nftContractAddress }}</p>
    <p>Market: {{ marketplaceContractAddress }}</p>
    <p>Approved: {{ state.approved }}</p>
    <button @click="_approve">Approve</button>

    <p>Signature: {{ state.signature }}</p>
    <p>MessageHash: {{ state.messageHash }}</p>
    <p>TxHash: {{ state.txHash }}</p>
    <button @click="_list">List</button>

    <p>Owner of tokenId 1: {{ state.ownerOfTokenId1}}</p>
    <p>Your 20 balance: {{ state.balance20 }} </p>
    <button @click="_buy">Buy</button>
  </div>
</template>

<style scoped>
.nftmarket-container {
}
</style>
