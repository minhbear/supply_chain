const ItemManager = artifacts.require("ItemManager");

contract("ItemManager", accounts => {
    it("Can create new Item", async () => {
        const itemManagerInstance = await ItemManager.deployed();
        const itemName = 'iron-man';
        const itemPrice = 500;

        const result = await itemManagerInstance.createItem(itemName, itemPrice, {from: accounts[0]});
        assert.equal(result.logs[0].args._itemIndex, 0, "There should be one iten in smart contract");
        const item = await itemManagerInstance.items(0);
        assert.equal(item._identifier, itemName, "The item has a different identifier");
    })
})