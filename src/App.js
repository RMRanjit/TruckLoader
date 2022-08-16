import { useEffect, useState } from "react";
import "./App.css";

import TruckLoad from "./components/TruckLoad";
import OrderList from "./components/OrderList";
import { getLoadData } from "./dummy_data/itemData";

function App() {

  const [isBayProjected, setBayProjection] = useState(false);
  const [isTruckVisible, setTruckVisibility] = useState(false);
  const [orders,setOrders] = useState([]);
  const [isWeightScaleVisible,setWeightScaleVisibility] = useState(false);
  const [isAxisVisible,setAxisVisibility] = useState(false);

  useEffect(() => {
    // setOrders(getLoadData("useState and App.js"));
    setOrders(getLoadData("Calling from App.js & useEffect"));
  }, []);

  // const getData=()=>{
  //   fetch('packageData.json'
  //   ,{
  //     headers : { 
  //       'Content-Type': 'application/json',
  //       'Accept': 'application/json'
  //      }
  //   }
  //   )
  //     .then(function(response){
  //       console.log(response);
  //       return response.json();
  //     })
  //     .then(function(packageData) {
  //       // console.log(JSON.stringify(packageData));
  //       //setOrders(packageData)
  //     });
  // }

  const toggleTruckVisibility = () => {
    setTruckVisibility(!isTruckVisible);
  }

  const toggleBayProjection = () => {
    setBayProjection(!isBayProjected);
  }

  const toggleWeightScale = () => {
    setWeightScaleVisibility(!isWeightScaleVisible);
  }

  const toggleAxisVisibility = () => {
    setAxisVisibility(!isAxisVisible);
  }

  return (
    <div style={{ display: "flex" }}>
      <div style={{ position: "absolute", top: 10, left: 10 }}>
        <img src="./Pepsico_logo.png" style={{ height: "15px" }} alt="Logo" />
      </div>
      
 
      <div style={{ flex: "85%", overflow: "auto", height: "800px" }}>
        <TruckLoad orders={orders} projection={isBayProjected} isTruckVisible={isTruckVisible} isWeightScaleVisible={isWeightScaleVisible} isAxisVisible={isAxisVisible}/>
        <div style={{ display: "flex", flexDirection:"row" }}>
          <div ><button onClick={(toggleBayProjection)}> {isBayProjected?"Hide Bays": "Show Bays"}</button></div>
          <div ><button onClick={(toggleTruckVisibility)}> {isTruckVisible?"Hide Truck": "Show Truck"}</button></div>
          <div ><button onClick={(toggleWeightScale)}> {isWeightScaleVisible?"Hide Weightscale": "Show Weightscale"}</button></div>  
          <div><button onClick={(toggleAxisVisibility)}> {isAxisVisible?"Hide Axis": "Show Axis"}</button></div>
        </div>
      </div>
      <div style={{ flex: "15%" }}>
        <OrderList orders={orders}/>
      </div>
      
    </div>
  );
}

export default App;
