import React, { Component } from 'react';
import {Image,Text,View,StyleSheet,TextInput,TouchableOpacity,ActivityIndicator
    ,ScrollView,Dimensions} from 'react-native';
import env from '../environment/env';

const BASE_URL = env;
const EmailIcon = require('../image/email.png');
const userIcon = require('../image/ic_user.png');
const logo = require('../image/forgot.png');

class ForgotPassword extends Component {
   
    static navigationOptions = {
        header: null
        // title: 'Forgot Password',
        // headerStyle: {
        // backgroundColor: '#29ACE4',
        // },
        // headerTintColor: '#fff',
        // headerTitleStyle: {
        // fontWeight: 'bold',
        // },
      };
      constructor(props) {
        super(props);
        this.state = {
          userNames: '',
          Email: '',
          loading: false,
        };
      }
      _onChaneText = (userNames) => {
          this.setState({
            userNames,
          })
      }
      _onChaneEmail = (Email) => {
        this.setState({Email})
      }
      _onPressForgot = () => {
            let url = BASE_URL + "Account/ForgotPassword";
            let userName = this.state.userNames;
            let Email = this.state.Email;
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
            if (userName === '' ||Email === "") {
                alert('Ban chua nhap day du! ');
            } else if (reg.test(Email) === false)
            {
                alert('Email is not correct!');
                this.setState({Email:''})
            } 
            else {
                this.setState({loading: true});
                fetch(url,{
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                      },
                    body: JSON.stringify({
                        'UserName' : userName,
                        'Email' :Email
                        })
                })
                .then((resJson) => {
                    if (resJson.ok) {
                        alert(`Yeu cau thanh cong! Ban vao email: ${Email} de lay mat khau moi!`);
                        this.setState({loading: false});
                    } else {
                        this.setState({loading: false});
                        alert('Request false! You checking!');
                    }
                })
                .catch((err) => {
                    this.setState({loading: false});
                    console.log(err);
                })
            }

      }
  render() {
    var { navigate } = this.props.navigation;
    if (this.state.loading) {
        return(
            <View style = {styles.background}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )
    } else {
        return (
            <ScrollView>
            <View style={styles.background}>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Image
                        style={{width: '100%', height: '100%', }}
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
                            <Image source={EmailIcon} resizeMode="contain" style={styles.icon}/>
                        </View>
                        <TextInput style={styles.input} placeholder="example@gmail.com" textContentType = {"emailAddress"}  onChangeText={this._onChaneEmail.bind(this)} underlineColorAndroid="transparent"/>
                    </View>
                    <TouchableOpacity activeOpacity={.5} onPress={this._onPressForgot.bind(this)} keyboardShouldPersistTaps={true}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}> Change Password </Text>
                        </View>      
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={.5} onPress={() => navigate('LoginPage')}>
                        <View >
                        <Text style={styles.cancle}> Go back login! </Text>        
                        </View>      
                    </TouchableOpacity> 
                </View>  
                <View style={styles.container}/>       
        </View>
        </ScrollView>
        );}
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    wrapper:{
        paddingHorizontal:15,
    },
    background:{
        width: Dimensions.get('window').width,
        height:  Dimensions.get('window').height,
        flex: 1,
        backgroundColor: '#E0F7FE',
      },
    inputWrap:{
        flexDirection:"row",
        marginVertical: 5,
        height:36,
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
      },
  
  
    buttonText: {
        fontSize: 16,
        color:'#000000',
        textAlign: 'center',
       
    },
    cancle:{
        color:'#0404B4',
        backgroundColor:"transparent",
        textAlign: 'center',
      },
})

module.exports = ForgotPassword;