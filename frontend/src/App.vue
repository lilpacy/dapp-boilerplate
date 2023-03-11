<script setup lang="ts">
import NFTMarket from "./components/NFTMarket.vue";
import Listings from "./components/Listings.vue";
import {connectWallet, signerAddress} from "./lib/ethereum";
</script>

<template>
  <h1>simple dapp boilerplate</h1>
  <div class="app-container">
    SignerAddress: {{ signerAddress }}
    <button @click="connectWallet">Connect</button>
    <NFTMarket msg="nft market"/>
    <Listings/>
  </div>
</template>

<style scoped>
.app-container {
}
</style>
