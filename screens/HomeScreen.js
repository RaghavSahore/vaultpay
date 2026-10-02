import React, { useEffect,useState } from "react";
import { View, Text, StyleSheet,Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config";
import { MMKV } from 'react-native-mmkv';

// 🐛 BUG 4 — MMKV instance without encryption key
// Dev assumes "MMKV is secure by default" — it is NOT
const storage = new MMKV();
export default function HomeScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
async function set_itemInAsyncStore() {
  try {
    await AsyncStorage.setItem(
      'user',
      JSON.stringify({
        authToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo.token',
        phone: '+919876543210',
        cardLast4: '4242',
        balance: 42150,
      })
    );
  } catch (error) {
    console.error('Error setting item in async storage:', error);
  }
}

const get_itemFromAsyncStore = async () => {
  try {
    const userData = await AsyncStorage.getItem('user');
    if (userData !== null) {
      const parsedData = JSON.parse(userData);
      setUserData(parsedData);
      console.log('Retrieved user data from async storage:', parsedData);
    } else {
      console.log('No user data found in async storage.');
    }
  } catch (error) {
    console.error('Error retrieving item from async storage:', error);
  }
}
useEffect(() => {
  (async () => {
    await set_itemInAsyncStore();
    await get_itemFromAsyncStore();
    console.log('the BASE_URL:', BASE_URL);
  })();
}, []);

 useEffect(() => {
    (async () => {
      await set_itemInAsyncStore();
      await get_itemFromAsyncStore();
      console.log('the BASE_URL:', BASE_URL);
      
      // 🐛 BUG 4 continued — plaintext PII + credentials in MMKV
      storage.set('user.aadhaar', '1234-5678-9012');
      storage.set('user.pan', 'ABCDE1234F');
      storage.set('user.upi.pin', '4821');
      storage.set('user.secondaryToken', 'refresh_tkn_eyJhbGc...');
    })();
  }, []);


return (<View style={styles.container}>
  <View style={styles.container}>
    <Text style={styles.text}>Welcome {userData?.phone || 'User'} to the Home Screen!</Text>
  </View>
  <View style={styles.cardBody}>
   <View style={{marginTop: 20, marginLeft: 20,flexDirection: 'row',justifyContent: 'space-between',width: '90%',padding: 10,alignItems: 'center',alignContent: 'center'}}>
    <Text style={styles.last4DigitsText}>Your Balance: ₹{userData?.balance || '0.00'}</Text>
    <Text style={styles.last4DigitsText}>Card Last 4 Digits: {userData?.cardLast4 || 'XXXX'}</Text>
    </View> 
    <View style={styles.btns}>
    <Button title="Tansaction" onPress={() => navigation.navigate('Transactions')}/>
    <Button title="Help" onPress={() => navigation.navigate('Help')}/>
    </View>
  </View>
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: "center",
    marginTop: 50,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  cardBody: {
    marginTop: 20,
    width: "90%",
    height: 200,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    // alignItems: "center",
    // justifyContent: "center",
  },
  last4DigitsText: {
    fontSize: 12,
    color: "#666",
    marginTop: 10,
  },
  btns:{
    marginTop: 20,
    paddingHorizontal: 20,
    flexDirection:'row',
    justifyContent:'space-around'
  }
});