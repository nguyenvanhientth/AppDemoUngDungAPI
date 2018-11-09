import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, AsyncStorage } from 'react-native';
import { DrawerItems } from 'react-navigation';
import profileIcon from './image/ic_user.png';
import env from './environment/env';
const logout = require('./image/logout.png');

var STORAGE_KEY = 'key_access_token';
const BASE_URL = env;
export default class SiderBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName:'',
            lastName: ''
        }
    }
    componentWillMount() {
        try {
            AsyncStorage.getItem(STORAGE_KEY).then((user_data_json) => {
                let token = user_data_json;        
                //console.warn(token);
                fetch(BASE_URL + "Account/GetUserInformation",{
                    //method: "GET",
                    headers:{ 
                        'cache-control': 'no-cache',
                        Authorization: 'Bearer ' + token,
                    }
                }).then((res)=>res.json())
                .then((resJson) => {
                    //console.warn("resJson",resJson);debugger;
                    this.setState({
                        firstName: resJson.firstName,
                        lastName: resJson.lastName,
                    });       
                })
                .catch ((error) => {
                    console.warn('AsyncStorage error:' + error.message);
                })
            });
        }catch (error) {
            console.log('AsyncStorage error: ' + error.message);
            }            
      }

    render(){
        const props = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.profileContainer}>
                    <Image source={profileIcon}></Image>
                    <Text style={styles.userInfoText}>Hi {this.state.lastName} {this.state.firstName}</Text>
                </View>
                <View>
                    <DrawerItems {...props}/>
                </View>
                <TouchableOpacity onPress={this.signOut} style={styles.btnSignOut}>
                    <Image source = {logout} resizeMode="contain" style = {styles.icon} />
                    <Text style={styles.signOutText}>Sign out</Text>
                </TouchableOpacity>
            </View>
        )
    }

    signOut = ()=>{
        AsyncStorage.clear();
        setTimeout(()=>{
            this.props.navigation.navigate('LoginPage');
        }, 500)
        
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1
    },
    profileContainer:{
        backgroundColor: '#29ACE4', 
        alignItems: 'center', 
        padding: 20
    },
    userInfoText:{
        color: '#fff', 
        fontSize: 18, 
        marginTop: 10
    },
    btnSignOut:{
      flexDirection: 'row',
      height: 50,
      alignItems: 'center',
      justifyContent: 'flex-start'
    },
    icon: {
        width: 25,
        height: 25,
        marginLeft: 20,
    },
    signOutText:{
      fontSize: 14,
      color: 'black',
      fontWeight: '500',
      marginLeft: 20,
    }
  })