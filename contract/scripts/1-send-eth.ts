import { ethers } from "hardhat";

async function main() {
  // 環境に応じて変更すること
  const recipientAddress = "0xD75F45a1922869fEE15f87EC5451772c087347D9";
  const amountToSend = ethers.utils.parseEther("100");

  // 現在のアカウントを取得する
  const [sender] = await ethers.getSigners();

  // 送信トランザクションを準備する
  const tx = await sender.sendTransaction({
    to: recipientAddress,
    value: amountToSend,
  });

  // トランザクションがマイニングされるまで待つ
  await tx.wait();

  console.log(`Sent ${amountToSend.toString()} ETH to ${recipientAddress}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
