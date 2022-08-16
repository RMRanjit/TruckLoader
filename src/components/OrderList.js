
import PropTypes from 'prop-types'
import OrderItem from './OrderItem'

const OrderList = ({orders}) => {
  return (
    <div style={{fontColor:"white"}}> 
    {/* {orders.map((item, index) => (<div key={index}>{item.orderNumber}-{item.itemNumber}</div>))} */}
    {orders.map((item, index) => (<OrderItem key={index} item={item} productName={item.productName} />))}
    </div>
  )
}

OrderList.propTypes = {}

export default OrderList