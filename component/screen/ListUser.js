import React, { Component } from "react";
import { Text, TouchableOpacity, View, StyleSheet, FlatList, AsyncStorage,
    Image, ToastAndroid } from "react-native";
import Dialog from "react-native-dialog";
import env from '../environment/env';

const BASE_URL = env;
var avatar = require('../image/avatar.png');
var dung = require('../image/true.png');
var sai = require('../image/false.png');
var STORAGE_KEY = 'key_access_token';
 
export default class ListUser extends Component {
    static navigationOptions = {
        title: 'List Users',
        headerStyle: {
            backgroundColor: '#29ACE4',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
    };
    constructor(props){
        super(props);
        this.state = {
            data: [],
            id: '',
            dialogStatus: false
    }
  };
  componentDidMount(){
    AsyncStorage.getItem(STORAGE_KEY).then((user_data_json) => {
        let token = user_data_json;   
        if(token === undefined){
          var { navigate } = this.props.navigation;
          navigate('LoginPage');
        }    
        let url = BASE_URL + 'Account/GetStaffByAdmin';
        fetch(url,{
            headers: {
              'cache-control': 'no-cache',
              Authorization: 'Bearer ' + token,
              },
          })
          .then((res) => res.json())
          .then((resData) => { 
              this.setState({
                  data : resData
                });
                //console.warn('data',this.state.data);
            })
          .catch((err) => {
            console.warn(' Error Update!',err);
          })
        })
    }
 
  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          flex: 1,
          backgroundColor: "#607D8B",
          paddingHorizontal: 5,
        }}
      />
    );
  }

  _renderList = ({ item }) => {
    return (
     <TouchableOpacity style={styles.flatview} onPress={() =>this.changeActivate(item.id)}>
        {
            item.avatar ? 
            <Image style = {styles.anh} source= {{uri: item.avatar}} resizeMode="contain"/>:
            <Image style = {styles.anh} source= {avatar} resizeMode="contain"/>
        }
        <View style = {styles.nameList}>
            <Text style={styles.name} >UserName: {item.userName}</Text>
            <Text style={styles.email} >Email: {(item.email)}</Text>
            <Text style={styles.email} >Role: {(item.role)}</Text>
        </View>
        <View style = {styles.iconWrap}>{this.status(item.isEnabled)}</View>
     </TouchableOpacity>
    );

  }
  status = (status) =>{
    if(status === true){
      return <Image style = {styles.status} source = {dung}/>
    }
    else {
      return <Image style = {styles.status} source = {sai}/>
    }
}
    changeActivate = (id)=>{
        this.setState({
            dialogStatus: true,
            id: id,
        })
    }
    handleChange = () =>{
        AsyncStorage.getItem(STORAGE_KEY).then((user_data_json) => {
            let token = user_data_json;  
            let serviceUrl = BASE_URL+  "Account/BlockAndOpenAcount";
            let id = this.state.id;
            // kiem tra o day 
              fetch(serviceUrl,{
                  method: "PUT",          
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + token,
                  },
              body: JSON.stringify({
                  'UserId': id,
                  })
              })
                  .then((responseJSON) => {  
                      //console.warn('creacte company',responseJSON)
                          if(responseJSON.ok){
                              this.componentDidMount();
                              ToastAndroid.show('Change Success!', ToastAndroid.SHORT)
                          }
                          else {
                              ToastAndroid.show('Change False!', ToastAndroid.SHORT)
                          }
                          
                  })
                  .catch((error) => {
                      console.warn('Error: ',error);
                  });  
          })
          this.setState({
              dialogStatus:false,
          })
      }
      handleCancel = ()=>{
        this.setState({
            dialogStatus: false,
        })
      }

  render() {
    return (
      <View style={styles.container} > 
          <FlatList
          data={this.state.data}
          ItemSeparatorComponent = {this.FlatListItemSeparator}
          renderItem={this._renderList}
          keyExtractor={item => item.id}
        />
        <Dialog.Container visible = {this.state.dialogStatus}>
            <Dialog.Title> You are want change activate or deactivate! </Dialog.Title>
            <Dialog.Button label="Cancel" onPress={this.handleCancel} />
            <Dialog.Button label="Ok" onPress={this.handleChange} />
        </Dialog.Container>
      </View>
    );
  }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      //alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    h2text: {
      marginTop: 10,
      fontFamily: 'Helvetica',
      fontSize: 36,
      fontWeight: 'bold',
      alignItems: 'center',
      textAlign: 'center'
    },
    flatview: {
        justifyContent: 'flex-start',
        flex: 1,
        flexDirection: 'row',
        paddingRight: 10,
        paddingTop: 15,
        paddingBottom: 15
      },
    name: {
      fontFamily: 'Verdana',
      fontSize: 18,
    },
    email: {
        color: '#4000FF',
        justifyContent: 'flex-start'
    },
    footer: {
        flex:1,
        backgroundColor:'#1C1C1C',
        height: 1,
    },
    anh: {
        width: 80,
        height: 80,
        borderRadius: 160
      },
      nameList: {
        left: 0,
        padding: 10,
    },
    iconWrap:{
        alignItems: "center",
        justifyContent: "center",
        marginLeft:10,
        position: 'absolute',
        right: 10,
        top: 15
        },
    status: {
        width: 50,
        height: 50, 
        },
})