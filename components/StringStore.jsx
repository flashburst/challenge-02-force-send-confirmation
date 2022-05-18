import { useState } from "react";
import { ethers } from "ethers";
import { StrStoreABI, STRSTORE_CONTRACT_ADDRESS } from "../constants";
import { useEthers } from "@usedapp/core";

const getProvider = (library, account) =>
  library.getSigner(account).connectUnchecked();

export const StrStoreUI = () => {
  const [value, setValue] = useState("");
  const { account, library, chainId } = useEthers();

  if (!account || !library) {
    return <h2>Please Connect your wallet</h2>;
  }

  if (chainId !== 80001) {
    return <h2>Switch to mumbai</h2>;
  }

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const provider = getProvider(library, account);

  const sendTx = async () => {
    try {
      const instance = new ethers.Contract(
        STRSTORE_CONTRACT_ADDRESS,
        StrStoreABI,
        provider
      );
      const tx = await instance.setString(value);
      await tx.wait();
    } catch (error) {
      console.error(error);
    }
  };

  const forceSendTx = async () => {
    try {
      const instance = new ethers.Contract(
        STRSTORE_CONTRACT_ADDRESS,
        StrStoreABI,
        provider
      );
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
      <h2>Str Store</h2>

      <label>
        <div>String</div>
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
