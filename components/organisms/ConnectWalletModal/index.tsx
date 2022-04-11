import { Button, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, VStack } from "@chakra-ui/react"
import { WalletType } from "../../../types/wallet";

const MetamaskIcon = "./assets/icons/metamask.svg";
const OtherIcon = "./assets/icons/other.svg";
const WalletConnectIcon = "./assets/icons/walletconnect.svg";
const WalletLinkIcon = "./assets/icons/walletlink.svg";

interface ConnectWalletModal {
    isOpen: boolean,
    onClose: () => any,
    connectWallet: (walletType: WalletType) => Promise<void>
}

export default function ConnectWalletModal({ isOpen, onClose, connectWallet }: ConnectWalletModal) {

    return (
        <Modal isOpen={isOpen} isCentered closeOnEsc closeOnOverlayClick autoFocus onClose={onClose}>
            <ModalOverlay />
            <ModalContent paddingY="8" paddingX="4">
                <ModalHeader>Connect wallet</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack gap="4">
                        <Button display="flex" justifyContent="center" gap="4" alignItems="center" width="full" variant="solid" aria-label="Connect your wallet with Metamask" onClick={() => { connectWallet("metamask") }} size="lg">
                            <Image src={MetamaskIcon} alt="Metamask icon" height="8" width="8" />
                            Metamask
                        </Button>

                        <Button display="flex" justifyContent="center" gap="4" alignItems="center" width="full" variant="solid" aria-label="Connect your wallet with Wallet Connect" onClick={() => { connectWallet("walletconnect") }} size="lg">
                            <Image src={WalletConnectIcon} alt="Wallet connect icon" height="8" width="8" />
                            Wallet Connect
                        </Button>

                        <Button display="flex" justifyContent="center" gap="4" alignItems="center" width="full" variant="solid" aria-label="Connect your wallet with Wallet Link" onClick={() => { connectWallet("walletlink") }} size="lg">
                            <Image src={WalletLinkIcon} alt="Wallet link icon" height="8" width="8" />
                            Wallet Link
                        </Button>

                        <Button display="flex" justifyContent="center" gap="4" alignItems="center" width="full" variant="solid" aria-label="Connect your wallet with any injected wallet provider" onClick={() => { connectWallet("injected") }} size="lg">
                            <Image src={OtherIcon} alt="Generic wallet icon" height="8" width="8" />
                            Others (injected)
                        </Button>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    )

}

