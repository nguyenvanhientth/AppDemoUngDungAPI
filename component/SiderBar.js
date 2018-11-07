import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, AsyncStorage } from 'react-native';
import { DrawerItems } from 'react-navigation';
import profileIcon from './image/ic_user.png';
const logout = require('./image/logout.png');

export default class SiderBar extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        const props = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.profileContainer}>
                    <Image source={profileIcon}></Image>
                    <Text style={styles.userInfoText}>REFERRAL USER</Text>
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
        backgroundColor: '#D7C3FC', 
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