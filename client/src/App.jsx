import { EthProvider } from "./contexts/EthContext";
import "./App.css";
import ItemManagerList from "./components/ItemManagerList";

function App() {
  return (
    <EthProvider>
      <div id="App" >
        <h1>Supply Chain</h1>
        <h3>Add Item</h3>
        <ItemManagerList />
      </div>
    </EthProvider>
  );
}

export default App;
