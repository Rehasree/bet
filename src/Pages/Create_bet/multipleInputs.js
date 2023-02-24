import { useState } from 'react';

export default function BetForm() {
  const [numInputs, setNumInputs] = useState(1);
  const [inputs, setInputs] = useState([{ odds: '', value: '' }]);

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const newInputs = [...inputs];
    newInputs[index][name] = value;
    setInputs(newInputs);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputs); // log the inputs to the console
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

  return (
    <form onSubmit={handleSubmit}>
      {inputs.map((input, index) => (
        <div key={index}>
          <label htmlFor={`odds-${index}`}>Odds:</label>
          <input
            type="number"
            name="odds"
            id={`odds-${index}`}
            value={input.odds}
            onChange={(e) => handleInputChange(index, e)}
          />
          <label htmlFor={`value-${index}`}>Value:</label>
          <input
            type="number"
            name="value"
            id={`value-${index}`}
            value={input.value}
            onChange={(e) => handleInputChange(index, e)}
          />
        </div>
      ))}
      <button type="button" onClick={addInput}>Add Input</button>
      <button type="button" onClick={removeInput}>Remove Input</button>
      <button type="submit">Submit</button>
    </form>
  );
}
