import { useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react"
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { useWeb3React } from "@web3-react/core";
import { useLocalStorage } from "./useLocalStorage";
import { WalletType } from "../types/wallet";
import { useViewerConnection, useViewerID } from "@self.id/react";
import { EthereumAuthProvider } from "@self.id/web";

const POLYGON_MUMBAI_RPC_URL = "https://rpc-mumbai.matic.today";
const SUPPORTED_CHAIN_IDS = [80001];

const injectedConnector = new InjectedConnector({ supportedChainIds: SUPPORTED_CHAIN_IDS });
const walletlinkConnector = new WalletLinkConnector({ url: POLYGON_MUMBAI_RPC_URL, appName: "Ceramic Demo", supportedChainIds: SUPPORTED_CHAIN_IDS });
const walletconnectConnector = new WalletConnectConnector({ rpc: { 80001: POLYGON_MUMBAI_RPC_URL }, supportedChainIds: SUPPORTED_CHAIN_IDS, chainId: SUPPORTED_CHAIN_IDS[0] });

export const useWallet = () => {
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
    const [signer, setSigner] = useState<ethers.Signer | null>(null);
    const [isConnecting, setIsConnecting] = useState<boolean>(false);
    const toast = useToast();
    const { activate, library, active, deactivate, account, connector } = useWeb3React();
    const [connectModalOpen, setConnectModalOpen] = useState<boolean>(false);
    const { value: connectorName, setValue: setConnectorName } = useLocalStorage<WalletType>("connectorName");
    const [selfIdConnection, selfIdConnect, selfIdDisconnect] = useViewerConnection();
    const viewerId = useViewerID();

    // First time connection ONLY if user had pre-connected
    useEffect(() => {
        (async () => {
            if (connectorName !== "") {
                await connectWallet(connectorName as WalletType);
            }
        })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connectorName])

    // Keeps provider, signer and selfIfConnection updated
    useEffect(() => {
        if (!!library) {
            (async () => {
                const signer = library?.getSigner();
                const signerAddr: string = await signer.getAddress();
                const ethAuthProvider = new EthereumAuthProvider(library.provider, signerAddr);

                selfIdConnect(ethAuthProvider);
                setProvider(library);
                setSigner(signer);
            })()
        } else {
            setProvider(null);
            setSigner(null);
            selfIdDisconnect();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [library])

    // Attach listeners to provider
    useEffect(() => {
        if (!!connector) {
            const handleWalletDisconnect = () => {
                setConnectorName("");
                selfIdDisconnect();
                deactivate();
                toast({
                    title: "WALLET DISCONNECTED!",
                    description: "Your wallet is now disconnected!",
                    status: "warning"
                });
            }
            connector.on("Web3ReactDeactivate", handleWalletDisconnect);
            return () => {
                connector.off("Web3ReactDeactivate", handleWalletDisconnect);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connector, toast])

    // Function to show connect wallet modal
    const showConnectModal = useCallback(() => { setConnectModalOpen(true); }, [])

    // Function to close connect wallet modal
    const closeConnectModal = useCallback(() => { setConnectModalOpen(false); }, [])

    // Function to connect wallet
    const connectWallet = useCallback(async (walletType: WalletType) => {
        if (!active) {
            try {
                setIsConnecting(true);

                switch (walletType) {
                    case "walletconnect":
                        await activate(walletconnectConnector, (e) => { throw new Error(e.message); });
                        break;
                    case "walletlink":
                        await activate(walletlinkConnector, (e) => { throw new Error(e.message); });
                        break;
                    default:
                        await activate(injectedConnector, (e) => { throw new Error(e.message); });
                        break;
                }
                setConnectorName(walletType);
                toast({
                    title: "WALLET CONNECTED!",
                    description: "Your wallet is successfully connected!",
                    status: "success"
                });
            } catch (e: any) {
                console.error(e);
                toast({
                    title: "ERROR!",
                    description: e?.message || "Unexpected error! Please try again!",
                    status: "error"
                });
            } finally {
                setIsConnecting(false);
                setConnectModalOpen(false);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [toast, activate, active]);

    // Function to disconnect wallet
    const disconnectWallet = useCallback(() => {
        if (active) {
            deactivate();
            setConnectorName("");
            selfIdDisconnect();
            setProvider(null);
            setSigner(null);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deactivate, connector, active]);

    return {
        provider,
        connectWallet,
        disconnectWallet,
        signer,
        isConnecting: isConnecting || selfIdConnection.status === "connecting",
        isConnected: active && selfIdConnection.status === "connected",
        connectModalOpen,
        signerAddress: account,
        showConnectModal,
        closeConnectModal,
        viewerId
    }
}