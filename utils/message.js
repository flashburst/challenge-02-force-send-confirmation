const EXECUTION_REVERTED = 'execution reverted: ';
const METAMAST_REJECT_TRANSACTION = 'MetaMask Tx Signature: ';
export function bodyMessageFilter(message) {
  if (message.startsWith(EXECUTION_REVERTED)) {
    return message.slice(EXECUTION_REVERTED.length);
  }

  if (message.startsWith(METAMAST_REJECT_TRANSACTION)) {
    return message.slice(METAMAST_REJECT_TRANSACTION.length);
  }

  return message;
}