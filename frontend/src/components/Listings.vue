<script lang="ts">
import {defineComponent, reactive} from 'vue';
import {marketplaceContract} from "../lib/nftmarket";

const state = reactive({listings:[]});
const updateListings = (newListings: any) => {
  state.listings = newListings;
};

async function getListings() {
  const listing = await marketplaceContract.listings(1);
  console.log({listing})
  updateListings([listing])
}

setInterval(() => {
  getListings();
}, 3000);

export default defineComponent({
  name: 'Listings',
  setup() {
    return {
      state
    };
  },
});
</script>

<template>
  <div>
    <h1>listings</h1>
    <ul>
      <li v-for="listing in state.listings" :key="listing.tokenId">
        <div>Token ID: {{ listing.tokenId }}</div>
        <div>Price: {{ listing.price }}</div>
        <div>Seller: {{ listing.seller }}</div>
        <div>MessageHash: {{ listing.messageHash }}</div>
        <div>Is Sold: {{ listing.isSold }}</div>
      </li>
    </ul>
  </div>
</template>
