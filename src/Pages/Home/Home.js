import React,{useEffect,useState} from 'react'
import { VStack, Text, HStack,Button} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Web3 from 'web3';

function Home(){
    const navigate = useNavigate ();
    const [walletAddress, setWalletAddress] = useState(null);

  useEffect(() => {
    async function loadWalletAddress() {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          console.log("Successfully connected to Ethereum wallet.");
          const accounts = await web3.eth.getAccounts();
          setWalletAddress(accounts[0]);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.error("No Ethereum wallet found. Please install MetaMask.");
      }
    }
    loadWalletAddress();
  }, []);

    console.log("web3",walletAddress)
    const handleClick = () => {
        navigate("/create-bet");
    };
  
  return (
    <div>
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
            <Button onClick={handleClick} >Create your bet</Button>
        <HStack>
        </HStack>

      </VStack>
    </div>
  )
}

export default Home
