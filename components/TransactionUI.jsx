import { useState } from 'react';
import { ethers } from 'ethers';
import { ABI, CONTRACT_ADDRESS } from '../constants';
import { useEthers } from '@usedapp/core';
import ErrorMessage, { bodyMessageFilter } from './ErrorMessage';
import { clearPreviewData } from 'next/dist/server/api-utils';

const getProvider = (library, account) =>
  library.getSigner(account).connectUnchecked();

const defaultErrorData = {
  code: 0,
  data: '',
  message: '',
};

const ERROR_CODE = {
  REQUEST_REJECTED: 4001,
  INVALID_VALUE: -32603,
};

export const ChallengeUI = () => {
  const [value, setValue] = useState('0');
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(defaultErrorData);
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
      console.error('res', error);
      if (error.code === ERROR_CODE.REQUEST_REJECTED) {
        return;
      }

      if (
        error.data &&
        error.data.message
        // && error.code === ERROR_CODE.INVALID_VALUE
      ) {
        setError(error.data);
        setHasError(true);
      }
    }
  };

  const forceSendTx = async () => {
    try {
      const instance = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      const tx = await instance.setNumber(value, {
        gasLimit: '6000000',
      });
      await tx.wait();
      setError(defaultErrorData);
      setHasError(false);
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

      <ErrorMessage visible={hasError}>
        <ErrorMessage.Title>Error found</ErrorMessage.Title>
        <ErrorMessage.Body>
          {bodyMessageFilter(error.message)}
        </ErrorMessage.Body>
        <ErrorMessage.Footer>
          <button onClick={() => setHasError(false)}>Cancel</button>
          &nbsp;&nbsp;
          <button onClick={forceSendTx}>Forced Tx</button>
        </ErrorMessage.Footer>
      </ErrorMessage>
    </>
  );
};
