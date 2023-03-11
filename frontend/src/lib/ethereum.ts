import {ethers} from "ethers";

export async function connectWallet() {
  // MetaMaskがインストールされているかどうかを確認する
  if (typeof window.ethereum === "undefined") {
    alert("MetaMaskがインストールされていません。");
    return;
  }

  // MetaMaskの利用承認を求める
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);

  // ユーザーのアドレスを取得する
  const signer = provider.getSigner();
  const signerAddress = await signer.getAddress();

  console.log("Connected to wallet:", signerAddress);

  return { provider, signer, signerAddress };
}

connectWallet()

export const provider = new ethers.providers.Web3Provider(window.ethereum);
export const signer = provider.getSigner()
export const signerAddress = await signer.getAddress();

export type Signer = ethers.providers.JsonRpcSigner;
