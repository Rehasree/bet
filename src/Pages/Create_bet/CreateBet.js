import React,{useState,useEffect} from 'react'
import {
  FormControl,
  FormLabel,
  Container,
  Heading,
  Button,
  Card, CardBody,
  HStack,
  Input,
  Textarea,FormHelperText
} from '@chakra-ui/react'
import './createbet.css'
import Web3 from 'web3';
import { useNavigate } from "react-router-dom";



function CreateBet() {

  const [formData, setFormData] = useState({});
  const [numInputs, setNumInputs] = useState(1);
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputs, setInputs] = useState([{ odds: '', value: '' }]);
  const [uid, setUid] = useState("")
  const navigate = useNavigate ();
  const web3 = new Web3(window.ethereum);

 
  
  const multihandleInputChange = (index, e) => {
    const { name, value } = e.target;
    const newInputs = [...inputs];
    newInputs[index][name] = value;
    setInputs(newInputs);
    setFormData((prevData) => ({
      ...prevData,
      "odds": inputs
    }));
  };
  const addInput = () => {
    setNumInputs(numInputs + 1);
    setInputs([...inputs, { odds: '', value: '' }]);
    
  };
  const removeInput = () => {
    if (numInputs > 1) {
      setNumInputs(numInputs - 1);
      setInputs(inputs.slice(0, -1));
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setFormData((prevData) => ({
      ...prevData,
    }));
  };
  const handleSubmit= async()=>{
     setFormData((prevData) => ({
      ...prevData,
      "odds": inputs
    }));
    console.log('formdata',formData)
    const response = await fetch('https://bet-platform.rehasreekoneru.repl.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      
    const responseMessage = await  response.text();
    const regex = /UID: (\S+)/;
    const match = responseMessage.match(regex);
    const duid = match ? match[1] : "";
    setUid(duid)
    if(duid){
      navigate(`/bet/${duid}`);
    }
    
  }

 
 

  return (
   
      <Container className="form">
        <Card>
        <CardBody>
        <Heading className='heading'>Create your bet</Heading>
        <FormControl>
          <FormLabel>Name of the Bet</FormLabel>
          <Input isRequired type='text' name="name" onChange={handleInputChange} />
          {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
        </FormControl>
        <FormControl>
          <FormLabel>Bet Statement</FormLabel>
          <Textarea isRequired placeholder='Here is a sample placeholder' name="statement" onChange={handleInputChange} />
        </FormControl>
       
          {inputs.map((input, index) => (
          <div key={index}>
             <HStack>
            <FormControl>
            <FormLabel htmlFor={`value-${index}`}>Odds for</FormLabel>
            <Input
               type="text"
               name="value"
               id={`value-${index}`}
               value={input.value}
               onChange={(e) => multihandleInputChange(index, e)}
            />
            </FormControl>
            <FormControl>
            <FormLabel htmlFor={`odds-${index}`}>Odds value:</FormLabel>
            <Input
             type="text"
             name="odds"
             id={`odds-${index}`}
             value={input.odds}
             onChange={(e) => multihandleInputChange(index, e)}
            />
            </FormControl>
            </HStack>
          </div>
        ))}
      <Button margin="10px 40px" type="button" onClick={addInput}>Add Odds</Button>
      <Button margin="10px 40px" type="button" onClick={removeInput}>Remove Odds</Button>
        <FormControl>
          <FormLabel>Bet End time</FormLabel>
            <Input
            isRequired
              placeholder="Select Date and Time"
              size="md"
              type="datetime-local"
              name="endTime" onChange={handleInputChange}
            />
        </FormControl>
        <FormControl>
          <FormLabel>Bet Amount</FormLabel>
          <Input  type='number' name="amount" onChange={handleInputChange} />
          <FormHelperText>Skip if not interested in real-money betting</FormHelperText>
        </FormControl>
      <HStack  flexDirection="column-reverse" marginTop="2rem">
        <Button  onClick={handleSubmit} minW="250px" colorScheme='messenger'>Submit</Button>
      </HStack>
        </CardBody>
        </Card>
      </Container>
    
  )
}

export default CreateBet
