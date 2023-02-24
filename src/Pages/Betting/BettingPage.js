import React ,{useEffect,useId,useState}from 'react'
import { useParams } from 'react-router-dom'
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import detectEthereumProvider from '@metamask/detect-provider';

import Web3 from 'web3';
import './bettingpage.css'
import {
    Table,
    Thead,
    Tbody,
    Tfoot,Text,
    Tr,
    Th,
    Td,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,Button,HStack,
    TableContainer,
    Card,Container,FormControl,FormLabel,Input
  } from '@chakra-ui/react'
function BettingPage() {
    const {uid} = useParams()
    const [user, setUser] = useState(null);
    const [oddsData,setoddsData] = useState({})
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [TotalBetAmount, setTotalBetAmount] = useState(0)
    const [maxPotentialReturn  , setmaxPotentialReturn] = useState(0);
    const [name, setName] = useState('');
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);  
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
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('https://bet-platform.rehasreekoneru.repl.co/userdetails', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ uid: uid })
            });
            const data = await response.json();
            setUser(data);
            const modifiedData = data?.odds.map(item => ({
                ...item,
                amount: 0 // Set the amount property to 0 for now
              }));
            setoddsData(modifiedData)
          } catch (error) {
            console.error(error);
          }
        };
        fetchData();
        localStorage.removeItem("name",name);
      }, []);
 
    const JoinGame=()=>{
        localStorage.setItem("name",name);
        onClose();
    }
    
    const handleIncreaseAmount = (index) => {
        setoddsData((prevOddsData) => {
          const newOddsData = [...prevOddsData];
          newOddsData[index] = {
            ...newOddsData[index],
            amount: newOddsData[index].amount + 5,
          };
          let amount = 0;
          newOddsData.forEach((info) => {
            amount += info.amount;
          });
          setTotalBetAmount(amount);
          let profitArray = [];
          let betArray = [];
          newOddsData.forEach((horse)=>{
            profitArray.push(eval(horse.odds) * horse.amount + horse.amount);
            betArray.push(horse.amount);
          })
            let highestReturn = Math.max.apply(null, profitArray);
            let highestReturnIndex = profitArray.indexOf(highestReturn);
            let outlay = betArray.reduce(function(total, bet) {
                return total + bet;
            }, 0)
            let profit = highestReturn - outlay + newOddsData[highestReturnIndex].amount
            setmaxPotentialReturn(Math.round(profit))
          return newOddsData;
        });
      };
      const handleDecreaseAmount = (index) => {
        setoddsData((prevOddsData) => {
          const newOddsData = [...prevOddsData];
          newOddsData[index] = {
            ...newOddsData[index],
            amount: newOddsData[index].amount>=5 ? newOddsData[index].amount-5:0 ,
          };
          let amount = 0;
          newOddsData.forEach((info) => {
            amount += info.amount;
          });
          setTotalBetAmount(amount);
          let profitArray = [];
          let betArray = [];
          newOddsData.forEach((horse)=>{
            profitArray.push(eval(horse.odds) * horse.amount + horse.amount);
            betArray.push(horse.amount);
          })
            let highestReturn = Math.max.apply(null, profitArray);
            let highestReturnIndex = profitArray.indexOf(highestReturn);
            let outlay = betArray.reduce(function(total, bet) {
                return total + bet;
            }, 0)
            let profit = highestReturn - outlay + newOddsData[highestReturnIndex].amount
            setmaxPotentialReturn(Math.round(profit))
          return newOddsData;
        });
      };



      const handleSubmit = async(event) => {
        event.preventDefault();
       
        const betData = {
          TotalBetAmount: TotalBetAmount,
          maxPotentialReturn: maxPotentialReturn,
          name: name,
        };
        console.log(betData); // For debugging purposes
        const sendData = async () => {
          try {
            const response = await fetch(`https://bet-platform.rehasreekoneru.repl.co/submit-form/${uid}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({betData: betData})
            });
            if (!response.ok) {
              throw new Error('Failed to fetch data from server');
            }
            const data = await response.json();
            console.log('response', data);
          } catch (error) {
            console.error(error);
          }
        };
        sendData();
      };
     
    
      const  signTransaction=async()=> {
        const provider = await detectEthereumProvider();
      if (provider) {
        // Request permission to access the user's Ethereum account
        await provider.request({ method: 'eth_requestAccounts' });
    
        // Create a Web3 instance with the injected provider
        const web3 = new Web3(window.ethereum);
    
        // Construct the transaction object
        const transaction = {
          to: user?.CryptoAccount.AccountAddress,
          value: web3.utils.toWei('1', 'ether'),
          gas: 21000,
          gasPrice: await web3.eth.getGasPrice(),
        };
    
        // Sign the transaction using the user's Ethereum account
        const [account] = await web3.eth.getAccounts();
        const privateKey = await web3.eth.getPrivateKey(account);
        
        const signedTransaction = await web3.eth.accounts.signTransaction(transaction,privateKey);
    
        // Send the signed transaction to the Ethereum network
        const result = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
        console.log('Transaction successful:', result);
      } else {
        console.error('MetaMask not installed');
      }
    }
    

   console.log(user)      
  return (
    <div>
        <Container className='table'>
          {/* <Button onClick={signTransaction}>Test transaction</Button> */}
            <Card>
            <h2 className='heading'>{user?.name}</h2>
            <HStack marginLeft="20px">
                <p>Total Bet Amount:{TotalBetAmount}</p>
                <p>Max Potential return:{maxPotentialReturn}</p>
            </HStack>
            {!name &&<Button onClick={onOpen}>Join Game</Button>}
            <TableContainer>
                <Table variant='simple'>
                    <Thead>
                    <Tr>
                        <Th>Name</Th>
                        <Th>Value</Th>
                        {name&&<Th> </Th>}
                        <Th isNumeric>Amount</Th>
                    </Tr>
                    </Thead>
                    <Tbody>
                    {Array.isArray(oddsData) && oddsData?.map((info,index)=>{
                        return(
                        <Tr  key={index}>
                            <Td>{info.value}</Td>
                            <Td>{info.odds}</Td>
                            {name&&<Td> 
                                <Button onClick={() => handleIncreaseAmount(index)}>+</Button>
                                <Button onClick={() => handleDecreaseAmount(index)}>-</Button>
                                </Td>}
                            <Td isNumeric>{info.amount}</Td>
                        </Tr>
                        )
                    })}
                    
                    </Tbody>
                </Table>
            </TableContainer>
            <Button onClick={handleSubmit}>Place bet</Button>
            </Card>
        </Container>

        <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create your account</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>First name</FormLabel>
              <Input ref={initialRef} placeholder='First name'  value={name}
            onChange={(e) => setName(e.target.value)} />
            </FormControl>
            {!walletAddress &&<Button margin="20px" onClick={connectWallet}>Connect Wallet</Button>}
            <HStack>
            <Text  margin="20px" >{`Wallet Connection Status: `}</Text>
            {walletAddress ? (
              <CheckCircleIcon color="green" />
            ) : (
              <WarningIcon color="#cd5700" />
            )}
          </HStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={JoinGame}>
              Join
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default BettingPage