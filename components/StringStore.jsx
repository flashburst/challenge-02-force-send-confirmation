import { useState } from 'react';
import { ethers } from 'ethers';
import {
  ERROR_CODE,
  StrStoreABI,
  STRSTORE_CONTRACT_ADDRESS,
} from '../constants';
import { useEthers } from '@usedapp/core';
import { useErrorModal } from '../contexts/ErrorModalContext';
import { bodyMessageFilter } from '../utils/message';
import { Notify } from './Toast';

const getProvider = (library, account) =>
  library.getSigner(account).connectUnchecked();

export const StrStoreUI = () => {
  const errorModal = useErrorModal();

  const [value, setValue] = useState('');
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
      await instance.setString(value).then((tx) => tx.wait());
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
        STRSTORE_CONTRACT_ADDRESS,
        StrStoreABI,
        provider
      );
      await instance
        .setNumber(value, {
          gasLimit: '6000000',
        })
        .then((tx) => tx.wait());
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
    </>
  );
};
