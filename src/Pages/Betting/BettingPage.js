import React ,{useEffect,useId,useState}from 'react'
import { useParams } from 'react-router-dom'
import './bettingpage.css'
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
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
      const handleSubmit = (event) => {
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
      
  return (
    <div>
        <Container className='table'>
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