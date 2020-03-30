import React, {useState} from 'react';
import {
  SafeAreaView,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import axios from 'axios';

const App = () => {
  const [id, setId] = useState('');
  const [orderRef, setOrderRef] = useState(0);
  const [status, setStatus] = useState({});
  const [progress, setProgress] = useState('not started');

  const handleIdSubmit = () => {
    axios
      .get(`http://localhost:3001/api/auth?id=${encodeURIComponent(id)}`)
      .then(data => {
        setOrderRef(data.data.orderRef);
      })
      .catch(err => console.log('IN SUBMIT', err));
  };

  const handleIdCollect = () => {
    console.log('time to see if there is anything to collect...');
    axios
      .post(
        // prettier-ignore
        `http://localhost:3001/api/collect?orderRef=${encodeURIComponent(orderRef)}`,
      )
      .then(data => {
        setStatus(data.data);
        setProgress(data.data.status);
      })
      .then(() => {
        if (status.status === 'complete') {
          console.log('THE ORDER WAS COMPLETED!!!!!');
          return;
        } else {
          console.log('status.status wasnt complete it was', status);
          setTimeout(() => handleIdCollect(), 1500);
        }
      })
      .catch(err => console.log('IN COLLECT', err));
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <TextInput
          style={{height: 40, borderColor: '#DDDDDD', borderWidth: 1}}
          onChangeText={text => setId(text)}
          value={id}
        />
        <Text>Orderref {orderRef}</Text>
        <Text>The current status is {progress}</Text>
        <TouchableOpacity style={styles.button} onPress={handleIdSubmit}>
          <Text>SUBMIT</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleIdCollect}>
          <Text>COLLECT</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginVertical: 5,
  },
});

export default App;
