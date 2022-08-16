import { packageData } from "./packageData";


const LoadStartX =-10;
const LoadStartY = -1;
const LoadStartZ = 8;
const frameIncrements = 2;
const maxItemsInRow = 8;
const maxItemsInSide = maxItemsInRow * 4;


export function getItems() {

  console.log(packageData);

  let items = [];

  let LoadXIncrement = LoadStartX;
  let LoadYIncrement = LoadStartY;
  let LoadZIncrement = LoadStartZ;

  for (let order = 0; order < 10; order++) {
    let itemCount = Math.floor(Math.random() * 10);

    for (let itemIterator = 0; itemIterator < itemCount; itemIterator++) {
      let item = {
        orderNumber: order.toString().padStart(4, "0"),
        itemNumber: itemIterator.toString().padStart(5, "0"),
        position: [
          LoadXIncrement,
          LoadYIncrement,
          LoadZIncrement,
        ],
      };
      items = [...items, item];
      LoadXIncrement += frameIncrements;
      if (items.length % maxItemsInRow === 0) {
        LoadXIncrement = LoadStartX;
        LoadYIncrement -= frameIncrements;
      }

      if (items.length % maxItemsInSide === 0) {
        LoadXIncrement = LoadStartX;
        LoadYIncrement = LoadStartY;
        LoadZIncrement = LoadStartZ * -1;
      }
    }
  }
  return items;
}

// export const items = Array.from({ length: 45 }, (item, index) => ({
//   id: index,
//   orderNumber: index.toString().padStart(4, "0"),
//   itemNumber: Math.floor(Math.random() * 10)
//     .toString()
//     .padStart(5, "0"),
// }));

