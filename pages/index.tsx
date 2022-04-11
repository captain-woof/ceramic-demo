import { Box, Heading, Button, Text, Input, FormControl, FormLabel } from "@chakra-ui/react";
import { useViewerRecord } from "@self.id/react";
import { useEffect, useState } from "react";
import ConnectWalletModal from "../components/organisms/ConnectWalletModal";
import { useWallet } from "../hooks/useWallet";

function App() {
  const { connectWallet, isConnected, isConnecting, disconnectWallet, connectModalOpen, showConnectModal, closeConnectModal, signerAddress, viewerId } = useWallet();
  const [name, setName] = useState<string>("");
  const profile = useViewerRecord("basicProfile");

  return (
    <Box as="main" maxWidth="5xl" marginX="auto" padding={{ base: "2", md: "8" }}>
      {/* Header */}
      <Heading size="3xl" marginTop="8">
        {profile?.content?.name ? `Hi, ${profile?.content?.name}` : "Ceramic (Self.ID) Demo"}
      </Heading>
      <Button marginTop="4" isLoading={isConnecting} loadingText="Connecting" onClick={isConnected ? disconnectWallet : showConnectModal} variant="solid" colorScheme="blue">
        {isConnected ? "Disconnect" : "Connect"}
      </Button>
      {isConnected &&
        <>
          <Text marginTop="2" color="gray.500" fontSize="sm" fontWeight="600" aria-label="Wallet address">{signerAddress}</Text>
          <Text>Your 3ID is {viewerId?.id}</Text>
        </>
      }

      {/* Connect wallet modal */}
      <ConnectWalletModal connectWallet={connectWallet} isOpen={connectModalOpen} onClose={closeConnectModal} />

      {/* Form */}
      {isConnected &&
        <form onSubmit={(e) => {
          e.preventDefault();
          if (!!profile?.set) {
            profile.set({
              name: name
            });
          }
        }}>
          <FormControl marginTop="8">
            <FormLabel>Name</FormLabel>
            <Input value={name} onChange={(e) => { setName(e.target.value); }} variant="filled" placeholder="Your DID name..." />
          </FormControl>

          <Button type="submit" marginTop="4" isLoading={profile.isLoading || profile.isMutating} loadingText="Submitting">Submit</Button>
        </form>
      }

    </Box>
  )
}

export default App
