import { useState } from 'react';
import { ethers } from 'ethers';
import {
  ERROR_CODE,
  NumStoreABI,
  NUMSTORE_CONTRACT_ADDRESS,
} from '../constants';
import { useEthers } from '@usedapp/core';
import { useErrorModal } from '../contexts/ErrorModalContext';
import { bodyMessageFilter } from '../utils/message';
import { Notify } from './Toast';

const getProvider = (library, account) =>
  library.getSigner(account).connectUnchecked();

export const NumStoreUI = () => {
  const errorModal = useErrorModal();

  const [value, setValue] = useState('0');
  const { account, library, chainId } = useEthers();

  if (!account || !library) {
    return <h2>Please Connect your wallet</h2>;
  }

  if (chainId !== 80001) {
    return <h2>Switch to mumbai</h2>;
  }

  const onChange = (event) => {
    setValue(String(Math.abs(parseInt(event.target.value) || 0)));
  };

  const provider = getProvider(library, account);

  const sendTx = async () => {
    try {
      const instance = new ethers.Contract(
        NUMSTORE_CONTRACT_ADDRESS,
        NumStoreABI,
        provider
      );
      await instance.setNumber(value).then((tx) => tx.wait());
    } catch (error) {
      if (error.code === ERROR_CODE.REQUEST_REJECTED) {
        Notify.emit({
          message: bodyMessageFilter(error.message),
        });
        return;
      }

      if (error.data && error.data.message) {
        errorModal.showModal({
          data: {
            message: bodyMessageFilter(error.data.message),
          },
          okButton: {
            onClick: forceSendTx,
          },
        });
      }
    }
  };

  const forceSendTx = async () => {
    try {
      const instance = new ethers.Contract(
        NUMSTORE_CONTRACT_ADDRESS,
        NumStoreABI,
        provider
      );
      await instance
        .setNumber(value, {
          gasLimit: '6000000',
        })
        .then((tx) => tx.wait());
    } catch (error) {
      console.log('force send error', error);
    }
  };

  return (
    <>
      <h2>Num Store</h2>

      <label>
        <div>Number</div>
        <input value={value} onChange={onChange} type="text" />
      </label>

      <br />
      <br />

      <button onClick={sendTx}>Normal Tx</button>
    </>
  );
};
