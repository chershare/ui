/* A helper file that simplifies using the wallet selector */

// near api js
import { providers } from 'near-api-js'

// wallet selector UI
import '@near-wallet-selector/modal-ui/styles.css'
import { setupModal } from '@near-wallet-selector/modal-ui'
import LedgerIconUrl from '@near-wallet-selector/ledger/assets/ledger-icon.png'
import MyNearIconUrl from '@near-wallet-selector/my-near-wallet/assets/my-near-wallet-icon.png'
import NearIconUrl from '@near-wallet-selector/near-wallet/assets/near-wallet-icon.png'

// wallet selector options
import { setupWalletSelector } from '@near-wallet-selector/core'
import type { WalletSelector } from '@near-wallet-selector/core'
import type { Wallet } from '@near-wallet-selector/core'
import { setupLedger } from '@near-wallet-selector/ledger'
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet'
import { setupNearWallet } from '@near-wallet-selector/near-wallet'

import { defineStore } from 'pinia'

import config from '../config'

const THIRTY_TGAS = '30000000000000'
const NO_DEPOSIT = '0'

export const useNear = defineStore('near', {
  state() {
    return {
      contractId: config.contract, 
      network: config.network, 
      walletSelector: null as WalletSelector | null, 
      testMessage: "unknown", 
      signedIn: false, 
      wallet: null as Wallet | null, 
      accountId: undefined as string | undefined, 
    }
  }, 
  actions: {
    async startUp() {
      this.walletSelector = await setupWalletSelector({
        network: this.network, 
        modules: [
          setupNearWallet({iconUrl: NearIconUrl}), 
          setupMyNearWallet({ iconUrl: MyNearIconUrl }),
          setupLedger({ iconUrl: LedgerIconUrl })
        ]
      })

      this.signedIn = this.walletSelector.isSignedIn()

      if (this.signedIn) {
        this.wallet = await this.walletSelector.wallet()
        this.accountId = this.walletSelector.store.getState().accounts[0].accountId
      }

    }, 
    signIn() {
      if(this.walletSelector) { 
        const description = 'Please select a wallet to sign in.'
        const modal = setupModal(this.walletSelector, { contractId: this.contractId, description })
        modal.show()
      } else {
        console.log("can't sign in because walletSelector is null") 
      }
    }, 
    signOut() {
      if(this.wallet) {
        this.wallet.signOut()
        this.wallet = null
        this.accountId = undefined
        window.location.replace(window.location.origin + window.location.pathname)
      } else {
        console.log("can't signed out because wallet is null") 
      }
    }, 
    getTest() {
      this.viewMethod(
        config.contract, 
        "test"
      ).then((result: any) => {
        this.testMessage = result
      }) 
    },
    createResource() {
    },
    async viewMethod(method: string, args = {}) {
      if(this.walletSelector) {
        const { network } = this.walletSelector.options
        const provider = new providers.JsonRpcProvider({ url: network.nodeUrl })

        let res = await provider.query({
          request_type: 'call_function',
          account_id: this.contractId,
          method_name: method,
          args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
          finality: 'optimistic',
        })
        return JSON.parse(Buffer.from((res as any).result).toString())
      }
    }, 
    async callMethod(method: string, args = {}, gas = THIRTY_TGAS, deposit = NO_DEPOSIT) {
      if(this.wallet) {
        // Sign a transaction with the "FunctionCall" action
        return await this.wallet.signAndSendTransaction({
          signerId: this.accountId ?? undefined,
          receiverId: this.contractId,
          actions: [
            {
              type: 'FunctionCall',
              params: {
                methodName: method,
                args,
                gas,
                deposit,
              },
            },
          ],
        })
      }
    }, 
    // Get transaction result from the network
    async getTransactionResult(txhash: string) {
      if(this.walletSelector) {
        const { network } = this.walletSelector.options
        const provider = new providers.JsonRpcProvider({ url: network.nodeUrl })

        // Retrieve transaction result from the network
        const transaction = await provider.txStatus(txhash, 'unnused')
        return providers.getTransactionLastResult(transaction)
      }
    }
  }, 
}) 

