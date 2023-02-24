import React,{useEffect,useState} from 'react'
import { VStack, Text, HStack,Button,useDisclosure} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Web3 from 'web3';
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";

function Home(){
    const navigate = useNavigate ();
    const [walletAddress, setWalletAddress] = useState(null);
    //const { isOpen, onOpen, onClose } = useDisclosure();
    const web3 = new Web3(window.ethereum);

    const connectWallet = async () => {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        // The user's accounts are returned as an array. We can use the first account for this example.
        const connectedAddress = accounts[0];
        setWalletAddress(accounts[0]);
        console.log('Connected wallet address:', connectedAddress);
      } catch (err) {
        console.error('Failed to connect wallet:', err);
      }
    };
    console.log("web3",walletAddress)
    const handleClick = () => {
        navigate("/create-bet");
    };
  
  return (
    <div>
      {/* <Button onClick={connectWallet}>Connect wallet</Button> */}
      <VStack justifyContent="center" alignItems="center" h="100vh">
       <HStack marginBottom="10px">
          <Text
            margin="0"
            lineHeight="1.15"
            fontSize={["1.5em", "2em", "3em", "4em"]}
            fontWeight="600"
          >
            Luck. Strategy.
          </Text>
          <Text
            margin="0"
            lineHeight="1.15"
            fontSize={["1.5em", "2em", "3em", "4em"]}
            fontWeight="600"
            sx={{
              background: "linear-gradient(90deg, #1652f0 0%, #b9cbfb 70.35%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
             Win!
          </Text>
        </HStack>
            {walletAddress?<Button onClick={handleClick} >Create your bet</Button>
            :<Button onClick={connectWallet}>Connect Wallet</Button>}
            <HStack>
            <Text>{`Wallet Connection Status: `}</Text>
            {walletAddress ? (
              <CheckCircleIcon color="green" />
            ) : (
              <WarningIcon color="#cd5700" />
            )}
          </HStack>
        <HStack>
        </HStack>

      </VStack>
    </div>
  )
}

export default Home
