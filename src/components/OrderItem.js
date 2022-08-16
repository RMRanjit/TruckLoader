
import PropTypes from 'prop-types'

import {useState} from 'react';

import {
 
  Html,
} from "@react-three/drei";

const OrderItem = ({ productName, isDocked, item}) => {

  const [Item] = useState(item);


  return (

    <div draggable style={{margin: "0px", padding: "0px"}} onDrag = {(event)=>{ event.dataTransfer.setData("DragData",JSON.stringify(Item))}} onDrop={(event)=>{console.log("Dropped")}}>
     
      <button
        style={{ pointerEvents: "all" }}
        onClick={(e) => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
          e.nativeEvent.stopPropagation();
        }}
      >
        <div style={{display: "flex", flexDirection: "row", width: "200px"}}>
          <div style={{height:50, width:50, backgroundColor:"red"}}><img height= "50px" src={item.productImage} alt="product Image" /></div>
          <div style={{display: "flex", flexDirection: "column", width: "200px", margin:"2px"}} >
            <div style={{textAlign:"left",fontSize: "10px"}} >{item.productName}</div>
            <div style={{textAlign:"left", fontSize: "8px"}}> Dimensions( L X W X H): {item.length} X { item.width} X {item.height}</div>
            <div style={{textAlign:"left",fontSize: "8px", }}> Weight( lbs): {item.weightInLbs}</div>
            <div style={{textAlign:"left",fontSize: "8px", }}> Order-Item: {item.orderNumber}-{item.itemNumber}</div>
            <div style={{textAlign:"left",fontSize: "8px", }}> Bay: {item.bayName}</div>
          </div>
        </div>
      
      </button>
    </div>

  )
}

OrderItem.propTypes = {}

export default OrderItem