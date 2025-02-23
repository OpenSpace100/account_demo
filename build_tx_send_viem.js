import { createWalletClient, http, parseEther, parseGwei } from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'
import { createPublicClient } from 'viem'

async function sendTransactionExample() {
  try {
    // 1. 生成私钥
    // const privateKey = generatePrivateKey()
    const privateKey = "0x4b1d560fefb0dcfd9d0b27812dd87158119ff502d26f6b697f67cd31ae53b043"
    console.log('Generated Private Key:', privateKey)

    // 2. 创建钱包客户端
    const walletClient = createWalletClient({
      chain: sepolia,
      transport: http('https://eth-sepolia.public.blastapi.io') // 替换为你的RPC节点URL
    })

    // 3. 获取账户地址
    const account = privateKeyToAccount(privateKey)
    const userAddress = account.address
    console.log('Account Address:', userAddress)

    // 查询余额
    const publicClient = createPublicClient({
      chain: sepolia,
      // transport: http('https://eth-sepolia.public.blastapi.io')
      transport: http()
    })

    const balance = await publicClient.getBalance({
      address: userAddress
    })
    console.log('Balance:', balance)

    // 查询nonce
    const nonce = await publicClient.getTransactionCount({
      address: userAddress
    })
    console.log('Nonce:', nonce)

    // 4. 构建交易参数
    const txParams = {
      account: account,
      to: '0xe74c813e3f545122e88A72FB1dF94052F93B808f', // 目标地址
      value: parseEther('0.0001'), // 发送金额（ETH）
      chainId: sepolia.id,
      
      // EIP-1559 交易
      maxFeePerGas: parseGwei('40'), // 最大总费用（基础费用+小费）
      maxPriorityFeePerGas: parseGwei('2'), // 最大小费
      
      // 普通交易 - gas limit 
      gas: 21000n,
      nonce: nonce,
    }

    // 5. 估算gas（可选）
    const gasEstimate = await publicClient.estimateGas(txParams)
    txParams.gas = gasEstimate


    // 方式 1 ： 
    // const txHash = await walletClient.sendTransaction(txParams)

    // 方式 2 ： 
    // 6. 签名交易
    const signedTx = await walletClient.signTransaction(txParams)
    console.log('Signed Transaction:', signedTx)

    // 7. 发送交易
    const txHash = await publicClient.sendRawTransaction({
      serializedTransaction: signedTx
    })

    console.log('Transaction Hash:', txHash)
    return txHash

  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

// 执行示例
sendTransactionExample()