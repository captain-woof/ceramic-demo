import { Box, Heading, Button, Text, Input, FormControl, FormLabel, Textarea, VStack } from "@chakra-ui/react";
import { useViewerRecord, useCore, usePublicRecord } from "@self.id/react";
import { useState } from "react";
import ConnectWalletModal from "../components/organisms/ConnectWalletModal";
import { useWallet } from "../hooks/useWallet";

function App() {
  const { connectWallet, isConnected, isConnecting, disconnectWallet, connectModalOpen, showConnectModal, closeConnectModal, signerAddress, viewerId } = useWallet();
  const [name, setName] = useState<string>("");
  const [postTitle, setPostTitle] = useState<string>("");
  const [postText, setPostText] = useState<string>("");
  const profile = useViewerRecord("basicProfile");
  const posts = useViewerRecord("kjzl6cwe1jw14a8lvjm4ll8pwxqfpcsei8p1kahyrlvykwqrkw8asn1b1l36v5c");
  const posts2 = usePublicRecord("kjzl6cwe1jw14a8lvjm4ll8pwxqfpcsei8p1kahyrlvykwqrkw8asn1b1l36v5c", "");

  console.log(posts2.content)

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

      {isConnected &&
        <>
          {/* Name form */}
          <form onSubmit={async (e) => {
            e.preventDefault();

            if (!!profile?.merge && name !== "") {
              await profile.merge({
                name
              });
            }
          }}>
            <FormControl marginTop="4">
              <FormLabel>Name</FormLabel>
              <Input value={name} onChange={(e) => { setName(e.target.value); }} variant="filled" placeholder="Your DID name..." colorScheme="blue" disabled={profile.isMutating} />
            </FormControl>

            <Button type="submit" marginTop="4" isLoading={profile.isLoading || profile.isMutating} loadingText="Submitting" colorScheme="blue" display="block" marginLeft="auto">Submit</Button>
          </form>

          {/* Post form */}
          <form onSubmit={async (e) => {
            e.preventDefault();

            if (!!posts?.merge && postText !== "" && postTitle !== "") {
              const newPost = {
                postTitle,
                postText
              };
              await posts.merge({
                posts: !!posts?.content?.posts ? [...posts.content.posts, newPost] : [newPost]
              });

              setPostTitle("");
              setPostText("");
            }
          }}>
            <Box paddingY="4" paddingX="6" marginTop="16" border="2px solid" borderColor="blue.200" borderRadius="md">
              <Input value={postTitle} onChange={(e) => { setPostTitle(e.target.value); }} variant="unstyled" placeholder="Post title" size="lg" fontSize="2xl" colorScheme="blue" color="blue.400" fontWeight="600" disabled={posts.isMutating} />

              <Textarea value={postText} onChange={(e) => { setPostText(e.target.value); }} variant="unstyled" placeholder="Type your post..." colorScheme="blue" marginTop="2" resize="vertical" disabled={posts.isMutating} />
            </Box>
            <Button type="submit" marginTop="4" isLoading={posts.isMutating} loadingText="Posting" colorScheme="blue" display="block" marginLeft="auto" width="max-content">Post</Button>
          </form>

          {/* Posts */}
          {posts?.content?.posts &&
            <VStack gap="4" marginTop="8">
              {posts?.content?.posts.map((post: Post, index: number) => (
                <Box key={index} borderRadius="md" padding="6" border="2px solid" borderColor="blue.400" width="full">
                  <Heading fontSize="2xl">{post.postTitle}</Heading>
                  <Text marginTop="6">{post.postText}</Text>
                </Box>
              ))}
            </VStack>
          }

        </>
      }

    </Box>
  )
}

export default App
