 import { Card, Descriptions, Divider, List, Button } from 'antd';
import dishes from '../../assets/data/dishes.json';

 
 const DetailedOrder = () => {
  return (
  <Card title={'Order Title'} style={{margin:20}}>
      <Descriptions bordered column={{lg: 1, md: 1, sm: 1}}>
        <Descriptions.Item label='Customer'>Geovanni Estevam</Descriptions.Item>
        <Descriptions.Item label='Customer Address'>271 Francis Way, New Westminster</Descriptions.Item>
      </Descriptions>
      <Divider />
      <List 
        dataSource={dishes}
        renderItem={(dishItem) => (
          <List.Item>
            <div style={{fontWeight: 'bold'}}>{dishItem.name} x{dishItem.quantity}</div>
            <div>${dishItem.price}</div>
          </List.Item>
        )}
      />
      <Divider />
      <div style={styles.totalSumContainer}>
        <h2>Total:</h2>
        <h2 style={styles.totalPrice}>$50.60</h2>
      </div>
      <Divider />
      <div style={styles.buttonsContainer}>
        <Button block type='danger' size='large' style={styles.buttonDeclined}>
          Decline Order
        </Button>
        <Button block type='primary' size='large'style={styles.buttonAccept}>
          Accept Order
        </Button>
      </div>
      <Button block type='primary' size='large'>
        Fode is Done
      </Button>
    </Card>
  );
 };
const styles = {
  totalSumContainer: {
    flexDirection: 'row',
    display: 'flex'
  },
  totalPrice: {
    marginLeft: 'auto',
    fontWeight: 'bold',
  },
  buttonsContainer: {
    display: 'flex',
    paddingBottom: 30,
  },
  buttonDeclined: {
    backgroundColor:'red', 
    color: 'white',
    marginRight: 20,
    marginLeft: 20,
  },
    buttonAccept: {
    marginRight: 20,
    marginLeft: 20,
  }
};

 export default DetailedOrder;