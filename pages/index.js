import { useState } from 'react'
import { useWeb3React } from "@web3-react/core"
import { injected } from "../components/wallet/connectors"

export default function Home() {
  const { active, account, library, connector, activate, deactivate } = useWeb3React()
  const [zeeBalance, setZeeBalance] = useState(0);
  const [access, setAccess] = useState(false);
  

  async function connect() {
    try {
      await activate(injected)
      const res = await fetch("https://deep-index.moralis.io/api/v2/0xeD411A988b7cC9099E0f8339eC50F42Dc11E3fb2/erc20?chain=polygon", {
        headers: {
          Accept: "application/json",
          "X-Api-Key": "doL8l2c6RRUxHWqxwVWziCzzZTa1WBofnqW68iYzbE5LimtVvLiQPnp0GVRwFwXU"
        }
      }).then(function(response) {
        // The response is a Response instance.
        // You parse the data into a useable format using `.json()`
        return response.json();
      }).then(function(data) {
        // `data` is the parsed version of the JSON returned from the above endpoint.
        console.log("res",data);  // { "userId": 1, "id": 1, "title": "...", "body": "..." }
        var zeeToken = data.filter(function(tokens) {
          return tokens.token_address === "0x76df17e2ac56ba739ce374dd23eccfa863fb4902";
        })[0];
        console.log("zee balance",zeeToken.balance)
        setZeeBalance(Number(Number(zeeToken.balance)/1000000000000000000).toLocaleString())
        if(Number(Number(zeeToken.balance)/1000000000000000000) > 2 ) {
          setAccess(true)
        }
      });
      
    } catch (ex) {
      console.log(ex)
    }
  }

  async function disconnect() {
    try {
      deactivate()
    } catch (ex) {
      console.log(ex)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <button onClick={connect} className="py-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800">Connect to MetaMask</button>
      {active ? <span>Connected with <b>{account}</b></span> : <span>Not connected</span>}
      <p><b>ZEE Balance : </b>{zeeBalance}</p>
      <br/>
      <hr/>
      {access ? <><h1><b>Welcome to ZEEDAO!</b></h1> <br/><p>Check weekly for blog posts covering all the new crypto tech news.</p></> : <span>You need 2 ZEE coins to get access to the blogs</span>}
    </div>
  )
}
