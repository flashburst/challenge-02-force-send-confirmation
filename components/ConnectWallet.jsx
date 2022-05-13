import { useEthers } from "@usedapp/core";

export function ConnectWallet() {
  const { activateBrowserWallet, account, deactivate } = useEthers();
  return (
    <div>
      {!account && <button onClick={activateBrowserWallet}> Connect </button>}
      {account && <p>Account: {account}</p>}

      {account && <button onClick={deactivate}>Disconnect</button>}
    </div>
  );
}
