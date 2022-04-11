import { Box, Heading, Button, Text, Input, FormControl, FormLabel } from "@chakra-ui/react";
import { useViewerRecord } from "@self.id/react";
import { useEffect, useState } from "react";
import ConnectWalletModal from "../components/organisms/ConnectWalletModal";
import { useWallet } from "../hooks/useWallet";

function App() {
  const { connectWallet, isConnected, isConnecting, disconnectWallet, connectModalOpen, showConnectModal, closeConnectModal, signerAddress, viewerId } = useWallet();
  const [name, setName] = useState<string>("");
  const [anything, setAnything] = useState<string>("");
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
          <Text>Your 3ID is <b>{viewerId?.id}</b></Text>
        </>
      }

      {/* Connect wallet modal */}
      <ConnectWalletModal connectWallet={connectWallet} isOpen={connectModalOpen} onClose={closeConnectModal} />

      {/* Form */}
      {isConnected &&
        <>
          <form onSubmit={(e) => {
            e.preventDefault();

            if (!!profile?.set) {
              if (name !== "") {
                profile.merge({
                  name: name
                });
              }

              if (anything !== "") {
                profile.merge({
                  data: anything
                });
              }
            }
          }}>
            <FormControl marginTop="8">
              <FormLabel>Name</FormLabel>
              <Input value={name} onChange={(e) => { setName(e.target.value); }} variant="filled" placeholder="Your DID name..." />
            </FormControl>

            <FormControl marginTop="8">
              <FormLabel>Anything</FormLabel>
              <Input value={anything} onChange={(e) => { setAnything(e.target.value); }} variant="filled" placeholder="Anything you'd like to store..." />
            </FormControl>

            <Button type="submit" marginTop="4" isLoading={profile.isLoading || profile.isMutating} loadingText="Submitting">Submit</Button>
          </form>

          <Text marginTop="6" color="gray.500" fontWeight="500">
            Your data is: <b>{JSON.stringify(profile.content)}</b>
          </Text>
        </>
      }

    </Box>
  )
}

export default App
