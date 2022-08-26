import React, { useEffect, useState } from 'react';
import { useEth } from '../contexts/EthContext';


const ItemManagerList = () => {
    
    const {state} = useEth();
    const contractItemManager = state.contractItemManager;
    const [loadCreateItem, setLoadCreateItem] = useState(false);
    // console.log(state.accounts)

    useEffect(() => {
        const listenToPayMentEvent = () => {
            contractItemManager.events.SupplyChainStep().on("data", async (evt) => {
                if(evt.returnValues._step == 1) {
                    let item = await contractItemManager.methods.items(evt.returnValues._itemIndex).call();
                    console.log(item);
                    alert("Item" + item._identifier + "was paid, deliver it now!");
                }
                console.log(evt)
            })
        }
        if(loadCreateItem)
            listenToPayMentEvent();
    }, [loadCreateItem])

    const [cost, setCost] = useState(0);
    const [itemName, setItemName] = useState('');

    const handleChange = (event) => {
        if (event.target.name === 'cost') {
            setCost(event.target.value);
        } else {
            setItemName(event.target.value);
        }

    }

    const handleSubmit = async () => {
        const result = await contractItemManager.methods.createItem(itemName, cost).send({ from: state.accounts[0]});
        alert("Send "+cost+" Wei to "+result.events.SupplyChainStep.returnValues._address);
        setLoadCreateItem(true);
    }


    return (
        <div id='triggerEvent'>
            <label for="cost">Cost in wei</label>
            <input id='cost' value={cost} name="cost" onChange={handleChange} />

            <label for="itemName">Item Name</label>
            <input id='itemName' value={itemName} name="itemName" onChange={handleChange} />

            <button onClick={handleSubmit}>Submit</button>
        </div>
    )
}

export default ItemManagerList