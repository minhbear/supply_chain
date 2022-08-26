import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(
    async artifact => {
      if (artifact) {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
        const accounts = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();
        const artifactItemManager = require("../../contracts/ItemManager.json");
        const abiItemManager = artifactItemManager.abi
        let addressItemManager, contractItemManager;

        const artifactItem = require("../../contracts/Item.json");
        const abiItem = artifactItem.abi;
        let addressItem, contractItem;
        let artifactAll = {artifactItemManager, artifactItem};
        try {
          addressItemManager = artifactItemManager.networks[networkID].address;
          //create ItemManager contract
          contractItemManager = new web3.eth.Contract(abiItemManager, addressItemManager);

          // addressItem = artifactItem.networks[networkID].address;
          // //create Item contract
          // contractItem = new web3.eth.Contract(abiItem, addressItem);
        } catch (err) {
          console.error(err);
        }
        dispatch({
          type: actions.init,
          data: { artifactAll, web3, accounts, networkID, contractItemManager,  contractItem}
        });
      }
    }, []);

  //run the first time when component render, get artifacr is jsonRPC of contract and call init-callback function
  useEffect(() => {
    const tryInit = async () => {
      try {
        // const artifact = require("../../contracts/ItemManager.json");
        let artifact = ["../../contracts/ItemManager.json", "../../contracts/Item.json"]
        // const a = require(list.b);
        init(artifact);
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
  }, [init]);


  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(state.artifact);
    };

    events.forEach(e => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach(e => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, state.artifact]);

  return (
    <EthContext.Provider value={{
      state,
      dispatch
    }}>
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
