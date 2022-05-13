import { useState } from "react";
import { ethers } from "ethers";
import { ABI, CONTRACT_ADDRESS } from "../constants";
import { useEthers } from "@usedapp/core";

const getProvider = (library, account) =>
  library.getSigner(account).connectUnchecked();

export const ChallengeUI = () => {
  const [value, setValue] = useState("0");
  const { account, library, chainId } = useEthers();

  if (!account || !library) {
    return <h2>Please Connect your wallet</h2>;
  }

  if (chainId !== 80001) {
    return <h2>Switch to mumbai</h2>;
  }

  const onChange = (event) => {
    setValue(Math.abs(parseInt(event.target.value) || 0));
  };

  const provider = getProvider(library, account);

  const sendTx = async () => {
    try {
      const instance = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      const tx = await instance.setNumber(value);
      await tx.wait();
    } catch (error) {
      console.error(error);
    }
  };

  const forceSendTx = async () => {
    try {
      const instance = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      const tx = await instance.setNumber(value, {
        gasLimit: "6000000",
      });
      await tx.wait();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1>Send transactions</h1>

      <label>
        <div>Number</div>
        <input value={value} onChange={onChange} type="text" />
      </label>

      <br />
      <br />

      <button onClick={sendTx}>Normal Tx</button>
      <span>&nbsp; &nbsp;</span>
      <button onClick={forceSendTx}>Forced Tx</button>
    </>
  );
};
