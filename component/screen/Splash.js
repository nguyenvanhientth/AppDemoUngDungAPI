import React, { Component } from 'react';
import {Image,Text,View,AsyncStorage,} from 'react-native';
 
var STORAGE_KEY = "access_token";
const logo = require('../image/logo.png');

class SplashPage extends Component {
    static navigationOptions = {
        headerModel: 'none',
      };
   constructor(props) {
	  super(props); 
    }
    
  componentWillMount() {
    var pageUrl='LoginPage';  // login show defaul
    try { 
        AsyncStorage.getItem(STORAGE_KEY).then((user_data_json) => {
        let userData = JSON.parse(user_data_json);
        if(userData != undefined){      
            pageUrl = 'drawerStack';
        }                        
        });
    } catch (error) {
        console.log('AsyncStorage error: ' + error.message);
        }
    var { navigate } = this.props.navigation;
    setTimeout(() => {
      navigate (pageUrl, null);
    }, 2000);
  }

  render() {
    return (
        <View style={{flex: 1, backgroundColor: '#E5E5E5', alignItems: 'center', justifyContent: 'center'}}>
            <Image
                style={{width: '60%', height: '60%', }}
                source={logo}
                resizeMode = 'center'
                />
        </View>
    );
  }
}

module.exports = SplashPage;