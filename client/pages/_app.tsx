import type { AppProps } from 'next/app'
import React from 'react'
import { ChakraProvider } from "@chakra-ui/react";
import { Web3ReactProvider } from "@web3-react/core";
import { providers } from "ethers";
import {Provider as SelfIdProvider} from "@self.id/react";

const getLibrary = (provider: any) => (new providers.Web3Provider(provider));


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <SelfIdProvider client={{ ceramic: 'testnet-clay' }}>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </SelfIdProvider>
    </Web3ReactProvider>
  )
}

export default MyApp