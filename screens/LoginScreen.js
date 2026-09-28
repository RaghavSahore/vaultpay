import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput,
  Button,
  Alert,

} from 'react-native';


export default function LoginScreen({ navigation }) {
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [otp, setOtp] = React.useState('');
    const [enteredOtp, setEnteredOtp] = React.useState('');
    const createOTP_func = () => {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log('DEV OTP is:', generatedOtp);   // 🐛 BUG 3 — this leaks to the device log
      setOtp(generatedOtp);
    }
    const reset_func = () => {
      setOtp('');
      setPhoneNumber('');
      setEnteredOtp('');
    }
    const verify_otp_func = () => {
      if (enteredOtp === otp) {
        console.log('OTP verified successfully!');
        navigation.navigate('Home')
      } else {
        console.log('Invalid OTP. Please try again.');
        Alert.alert('Invalid OTP', 'Please enter a valid OTP.');
      }}
    return(
        <View>
        <View style={styles.loginView}><Text style={{color: 'black'}}>Login</Text></View>
        <View style={styles.inputField}>
            <Text>Phone Number</Text>
            <TextInput
                placeholder="Enter your phone number"
                style={{ borderWidth: 1, padding: 10, marginTop: 10 }}
                inputMode='numeric'
                value={phoneNumber}
                onChangeText={setPhoneNumber}
            />
        </View>
        <View style={styles.inputField}>
            <Text>Enter OTP</Text>
            <TextInput
                placeholder="Enter your OTP"
                style={{ borderWidth: 1, padding: 10, marginTop: 10 }}
                inputMode='numeric'
                value={enteredOtp}
                onChangeText={setEnteredOtp}
            />
        </View>
        <View style={styles.btns}>
            <Button title={otp===''?"Get OTP":"Verify OTP"} 
            onPress={()=>{otp==='' ? createOTP_func() : verify_otp_func()}}
            disabled={phoneNumber.length !== 10}
            />
            <Button title='Resend OTP' onPress={reset_func}/>
            </View>
        </View>
        
    )
}

const styles = StyleSheet.create({
    loginView:{
       marginTop:100, alignItems: 'center'

    },
    inputField:{
        // borderWidth:1,
        marginTop:20,
        paddingHorizontal:20,

    },
    btns:{
        marginTop:20,
        paddingHorizontal:20,
        flexDirection:'row',
        justifyContent:'space-around'
    }
})