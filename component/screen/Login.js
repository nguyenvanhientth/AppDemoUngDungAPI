import React, { Component } from 'react';
import {StyleSheet,Text,TextInput,Button,View,Alert,TouchableOpacity,DeviceEventEmitter,
    Image,AsyncStorage,ActivityIndicator,ScrollView,Dimensions, PermissionsAndroid} from 'react-native';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import env from '../environment/env';

const BASE_URL = env;
const lockIcon = require('../image/ic_lock.png');
const userIcon = require('../image/ic_user.png');
var STORAGE_KEY = 'key_access_token';
const logo = require('../image/logo.png');

export default class Login extends Component {
  static navigationOptions = {
    header: null,
    // headerMode: 'none',
    // title: 'Login',
    // headerStyle: {
    //   backgroundColor: '#29ACE4',
    // },
    // headerTintColor: '#fff',
    // headerTitleStyle: {
    //   fontWeight: 'bold',
    // },
    // headerLeft: null
  };
  constructor(props) {
    super(props);
    this.state = {
      userNames: '',
      passwords: '',
      loading: false,
    };
  }
  componentDidMount(){
    this.requestCameraPermission();
    LocationServicesDialogBox.checkLocationServicesIsEnabled({
      message: "<h2>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
      ok: "YES",
      cancel: "NO",
      enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
      showDialog: true, // false => Opens the Location access page directly
      openLocationServices: true, // false => Directly catch method is called if location services are turned off
      preventOutSideTouch: false, //true => To prevent the location services popup from closing when it is clicked outside
      preventBackClick: false, //true => To prevent the location services popup from closing when it is clicked back button
      providerListener: true // true ==> Trigger "locationProviderStatusChange" listener when the location state changes
    }).then(function(success) {
      // success => {alreadyEnabled: true, enabled: true, status: "enabled"} 
          navigator.geolocation.getCurrentPosition((position) => {
              let initialPosition = JSON.stringify(position);
              this.setState({ initialPosition });
          }, error => console.log(error), { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 });
      }.bind(this)
    ).catch((error) => {
      console.log(error.message);
    });
  
    DeviceEventEmitter.addListener('locationProviderStatusChange', function(status) { // only trigger when "providerListener" is enabled
      console.log(status); //  status => {enabled: false, status: "disabled"} or {enabled: true, status: "enabled"}
  });
  }
 requestCameraPermission = async() => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Cool App ACCESS_FINE_LOCATION Permission',
          'message': 'Cool  App needs access to your ACCESS_FINE_LOCATION '
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the ACCESS_FINE_LOCATION")
      } else {
        console.log("ACCESS_FINE_LOCATION permission denied")
      }
    } catch (err) {
      console.warn(err)
    }
  }
  _onPressLogin = () => {
      let serviceUrl =  BASE_URL + "Account/login";
      let userName = this.state.userNames;
      let password = this.state.passwords;
      var access_token = '';
      if(userName.length === 0 || password.length === 0){
        alert('Ban chua nhap day du! ')
      }
      else{
        this.setState({loading: true})     
        fetch(serviceUrl,{
          method: "POST",  
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
              body: JSON.stringify({
                'UserName' : userName,
                'PassWord' :password
              })
        })
          .then((response) => response.json())
          .then((responseJSON) => {      
              //console.warn('asdasd',JSON.stringify(responseJSON.token)) ; 
              var { navigate } = this.props.navigation;
               access_token = responseJSON.token; 
               //console.warn('access_token',access_token) ; 
               if(access_token !=undefined){
                          try {
                              AsyncStorage.setItem(STORAGE_KEY, access_token);
                              this.setState({loading:false})
                                navigate('drawerStack');
                            } catch (error) {
                              console.log('AsyncStorage error: ' + error.message);
                              this.setState({loading:false})
                            }    
               }
               else{
                  this.setState({loading:false})
                  Alert.alert('Login failure');
               }  
          })
          .catch((error) => {
            Alert.alert('Login failure');
            this.setState({loading:false})
            //console.warn('asdsad',error);
          }); 
      }
      
  }
  _onChaneText = (userNames) =>{
    this.setState({userNames});
  }
  _onChanePassWord = (passwords) =>{
    this.setState({passwords}); 
  }
  render() {
     var { navigate } = this.props.navigation;
     if (this.state.loading) {
       return(
          <View style = {{flex: 1,justifyContent:'center',backgroundColor: '#ECF8FB'}}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )
     } else {
      return (
        <ScrollView horizontal={false}>
          <View style={ styles.background}>
              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center',margin: 20,backgroundColor: '#E0F7FE',}}>
              <Image
                  style={{width: '100%',
                     height: '100%',
                     shadowColor: '#000',
                     shadowOffset: { width: 0, height: 2 },
                     shadowOpacity: 0.8,
                     shadowRadius: 2,
                     elevation: 15, }}
                  source={logo}
                  resizeMode = 'center'
                  />
              </View>
                <View style={styles.wrapper}>
                  <View style={styles.inputWrap}>
                      <View style={styles.iconWrap}>
                          <Image source={userIcon} resizeMode="contain" style={styles.icon}/>
                      </View>
                      <TextInput  style={styles.input} placeholder="Username" onChangeText={this._onChaneText.bind(this)} underlineColorAndroid="transparent"/>
                  </View>
                  <View style={styles.inputWrap}>
                      <View style={styles.iconWrap}>
                          <Image source={lockIcon} resizeMode="contain" style={styles.icon}/>
                      </View>
                      <TextInput style={styles.input} placeholder="Password" secureTextEntry={true}  onChangeText={this._onChanePassWord.bind(this)} underlineColorAndroid="transparent"/>
                  </View>
                  <TouchableOpacity activeOpacity={.5} onPress={this._onPressLogin.bind(this)} keyboardShouldPersistTaps={true}>
                      <View style={styles.button}>
                          <Text style={styles.buttonText}> Login</Text>
                      </View>      
                  </TouchableOpacity>
                  <TouchableOpacity  activeOpacity={.5} onPress={() => navigate('ForgotPassPage')}>
                      <View >
                      <Text style={styles.forgotPasswordText}>Forgot password?</Text>        
                      </View>      
                  </TouchableOpacity> 
              </View>   
            <View style = {styles.container} />                     
        </View>
        </ScrollView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
     flex: 1,  
  },
  background:{
    width: Dimensions.get('window').width,
    height:  Dimensions.get('window').height,
    flex: 1,
    backgroundColor: '#E0F7FE'
  },
  wrapper:{
      paddingHorizontal:15,
  },
  inputWrap:{
      flexDirection:"row",
      marginVertical: 5,
      height:45,
      backgroundColor:"transparent",
      borderBottomWidth: 0,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 15,
  },
  input:{
    flex: 1,
    paddingHorizontal: 5,
    backgroundColor:'#FFF',
    borderTopRightRadius: 20,        
    borderBottomRightRadius: 20,
    },
  iconWrap:{
    paddingHorizontal:7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:"#2E9AFE",
    borderBottomLeftRadius: 10,        
    borderTopLeftRadius: 10,
    },
  icon:{
    width:20,
    height:20,
    },
  button:{
    backgroundColor:"#2ECCFA",
    paddingVertical: 8,
    marginVertical:8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 15,
    borderBottomWidth: 0,
    },
  buttonText: {
      fontSize: 16,
      color:'#fff',
      textAlign: 'center',
     
  },
  forgotPasswordText:{
    color:'#0404B4',
    backgroundColor:"transparent",
    textAlign: 'center',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
});
module.exports = Login;