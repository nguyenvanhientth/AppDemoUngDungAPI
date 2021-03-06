import React, { Component } from 'react';
import {Image,Text,View,StyleSheet,TextInput,TouchableOpacity,AsyncStorage,StatusBar, 
    ScrollView,ToastAndroid,ActivityIndicator} from 'react-native';
import env from '../environment/env';
import HeaderNavigation from './header/HeaderNavigation';

const BASE_URL = env;
const icon = require('../image/ic_lock.png');
const change = require('../image/changePassword.png');
var STORAGE_KEY = 'key_access_token';

class ChanePassword extends Component {
   
    static navigationOptions = {
        title: 'Change Password',
        headerStyle: {
            backgroundColor: '#1583F8',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          drawerIcon: ({icon}) =>(
            <Image source = {change} resizeMode="contain" style = {styles.icon1} />
        )
      };
      constructor(props) {
        super(props);
        this.state = {
          OldPassWord: '',
          NewPassword: '',
          ConPassword: '',
          loading: false
        };
      }
      _onChaneOld = (OldPassWord) => {
          this.setState({
            OldPassWord,
          })
      }
      _onChaneNew = (NewPassword) => {
        this.setState({NewPassword})
      }
      _onChaneConfim = (ConPassword) => {
        this.setState({ConPassword})
      }
      _onPressForgot = () => {
        AsyncStorage.getItem(STORAGE_KEY).then((user_data_json) => {
            this.setState({loading: true});
          let token = user_data_json;
          if (token === undefined) {
              var{navigate} = this.props.navigation;
              navigate('LoginPage');
              this.setState({loading: false});
          }
          let passN = this.state.NewPassword;
          let passO = this.state.OldPassWord;
          let passC = this.state.ConPassword;
          if (passN !== passC) {
              alert('You input password new and confirm not duplicate!')
          } else {
              let url = BASE_URL + 'Account/ChangePassword'
              fetch(url,{
                  method: 'POST',
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                       Authorization: 'Bearer ' + token,
                  },
                  body: JSON.stringify({
                      'CurrentPassword':passO,
                      'NewPassword': passN,
                      'NewPasswordConfirm': passC
                  })
              })
              .then((res) => {
                  if (res.ok) {
                      var {navigate} = this.props.navigation;
                      navigate('Main');
                      this.setState({loading: false});
                      ToastAndroid.show('Change Success!', ToastAndroid.CENTER);
                  } else {
                    ToastAndroid.show('Change False!', ToastAndroid.CENTER);
                    this.setState({loading: false});
                  }
              })
              .catch((err) => {
                  console.log(err);
                  this.setState({loading: false});
              })
          }
      })
    }
  render() {
    if (this.state.loading) {
        return(
           <View style = {{flex: 1,justifyContent:'center',}}>
             <ActivityIndicator size="large" color="#0000ff" />
           </View>
         )
      } else {
    return (
        <View style={ styles.background}>
            <StatusBar hidden={false}></StatusBar>
            <HeaderNavigation {...this.props}></HeaderNavigation>
            <ScrollView><View style={styles.container}/></ScrollView>
            <ScrollView>
            <View style={styles.wrapper}>
                <View style={styles.inputWrap}>
                    <View style={styles.iconWrap}>
                        <Image source={icon} resizeMode="contain" style={styles.icon}/>
                    </View>
                    <TextInput  style={styles.input} placeholder="OldPassword" secureTextEntry={true} onChangeText={this._onChaneOld.bind(this)} underlineColorAndroid="transparent"/>
                </View>
                <View style={styles.inputWrap}>
                    <View style={styles.iconWrap}>
                        <Image source={icon} resizeMode="contain" style={styles.icon}/>
                    </View>
                    <TextInput style={styles.input} placeholder="NewPassword" secureTextEntry={true} onChangeText={this._onChaneNew.bind(this)} underlineColorAndroid="transparent"/>
                </View>
                <View style={styles.inputWrap}>
                    <View style={styles.iconWrap}>
                        <Image source={icon} resizeMode="contain" style={styles.icon}/>
                    </View>
                    <TextInput style={styles.input} placeholder="ConfirmPassword" secureTextEntry={true} onChangeText={this._onChaneConfim.bind(this)} underlineColorAndroid="transparent"/>
                </View>
                <TouchableOpacity activeOpacity={.5} onPress={this._onPressForgot.bind(this)} keyboardShouldPersistTaps={true}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}> Change </Text>
                    </View>      
                </TouchableOpacity>
            </View>  
            </ScrollView>      
        </View>
    );}
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,  
     },
     background:{
       flex: 1,
       justifyContent: "center",
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
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10
      },
    icon:{
      width:20,
      height:20,
      },
    icon1:{
        width:25,
        height:25,
        },
    button:{
      backgroundColor:"#2ECCFA",
      paddingVertical: 8,
      marginVertical:8,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 1,
      },
  
  
    buttonText: {
        fontSize: 16,
        color:'#000000',
        textAlign: 'center',
       
    },
})

module.exports = ChanePassword;