import React, { Component } from 'react';
import {StyleSheet,Text,View,Image,ScrollView,AsyncStorage,TouchableOpacity} from 'react-native';
import env from '../environment/env';

const BASE_URL = env;
const receive = require('../image/confirm.png');
const confirm = require('../image/confirmRequest.png');
const finish = require('../image/finish.png');
const time = require('../image/timeRequest.png');
const address = require('../image/address.jpg');
var STORAGE_KEY = 'key_access_token';

export default class Request extends Component{
    static navigationOptions = {
        title: 'Detail',
        headerStyle: {
            backgroundColor: '#1583F8',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
      };
    constructor(props){
        super(props);
        this.state = {
            images: [],
            id: this.props.navigation.getParam('id'),
            content:'',
            address:'',
            repairPersonId: '',
            PersonName: '',
            Position:'',
            selectImage: null
        }
    }
    componentDidMount(){
        AsyncStorage.getItem(STORAGE_KEY).then((user_data_json) => {
            let token = user_data_json;   
            if(token === undefined){
              var { navigate } = this.props.navigation;
              navigate('LoginPage');
            } 
            let id = this.state.id;   
            let url = BASE_URL + 'Request/GetRequestById?requestId=' + id;
            fetch(url,{
                headers: {
                  Authorization: 'Bearer ' + token,
                  },
              })
                .then((res) => res.json())
                .then((resData) => { 
                  this.setState({
                      images : resData.pictureRequest,
                      content: resData.content,
                      address: resData.address,
                      repairPersonId: resData.timeBeginRequest,
                      selectImage: resData.pictureRequest[0],
                    });
                    //console.warn('data',this.state.repairPersonId);
                })
                .catch((err) => {
                    console.warn('Error: ',err);
                })
            //   //person
            // let urlPerson = BASE_URL + 'Account/GetStaffInfoById?staffId=' + this.state.repairPersonId;
            // fetch(urlPerson,{
            //     headers: {
            //       'cache-control': 'no-cache',
            //       Authorization: 'Bearer ' + token,
            //       },
            //   })
            //     .then((res) => res.json())
            //     .then((resData) => { 
            //       this.setState({
            //         PersonName: resData.lastName + resData.firstName,
            //         });
            //         console.warn('data',this.state.PersonName);
            //     })
            //     .catch((err) => {
            //         console.warn('Error: ',err);
            //   })
            //})
            //----------------------------------------------------------------------------
            fetch(BASE_URL + "Account/GetUserInformation",{
                //method: "GET",
                headers:{ 
                    'cache-control': 'no-cache',
                    Authorization: 'Bearer ' + token,
                    }
                })
                .then((res)=>res.json())
                .then((resJson) => {
                    //console.warn("resJson",resJson);debugger;
                    this.setState({
                        Position: resJson.role,
                    });   
                   // console.warn(this.state.Position)    
                })
                .catch ((error) => {
                    console.warn('AsyncStorage error:' + error.message);
                }) 
            })
    }
    renderImage(image) {
        return <TouchableOpacity onPress = {()=>this.setState({selectImage: image})}><Image style={styles.image} source={{uri:image}} /></TouchableOpacity>
    }
    
    renderAsset(image) {
        return this.renderImage(image);
    }
    _receive = () =>{
        AsyncStorage.getItem(STORAGE_KEY).then((user_data_json) => {
            let token = user_data_json;   
            if(token === undefined){
              var { navigate } = this.props.navigation;
              navigate('LoginPage');
            } 
            let id = this.state.id;   
            let url = BASE_URL + 'Request/RepairPersonReceive';
            fetch(url,{
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                  },
                body: JSON.stringify({
                    'RequestId': id
                })
              })
              .then((responseJSON) => {  
                  //console.warn(responseJSON);
                    if(responseJSON.ok){
                        this.props.navigation.navigate('drawerStack');
                        alert('Reqair Success!');
                    }
                    else {
                        alert('Reqair False!');
                    }
                    
                })
                .catch((err) => {
                    console.warn('Error: ',err);
                })
        })
    }
    _finish = () =>{
        AsyncStorage.getItem(STORAGE_KEY).then((user_data_json) => {
            let token = user_data_json;   
            if(token === undefined){
              var { navigate } = this.props.navigation;
              navigate('LoginPage');
            } 
            let id = this.state.id;   
            let url = BASE_URL + 'Request/SupervisorConfirm';
            fetch(url,{
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                  },
                body: JSON.stringify({
                    'RequestId': id
                })
              })
              .then((responseJSON) => {  
                  console.warn(responseJSON);
                    if(responseJSON.ok){
                        this.props.navigation.navigate('drawerStack');
                        alert('Confirm Success!');
                    }
                    else {
                        alert('Confirm False!');
                    }
                    
                })
                .catch((err) => {
                    console.warn('Error: ',err);
                })
        })
    }
    render(){
        if(this.state.Position !== "Supervisor"){
            return (
                <View style = {styles.container}>
                    <ScrollView >
                    <View style = {{paddingBottom: 70}}>
                        <Image style={{width: 300,height:300,justifyContent:'center',flex:1,alignItems:'center', paddingTop: 10}} source = {{uri: this.state.selectImage}} />
                        <ScrollView horizontal = {true} style = {{marginTop: 10}}>
                        {this.state.images ? this.state.images.map(i => <View key={i.uri}>{this.renderAsset(i)}</View>) : null}
                        </ScrollView>
                        <Text style= {[styles.textTitle,{alignItems:'center'}]}> {this.state.content}</Text>
                        <Text style={styles.textTitle}><Image style = {styles.time} source = {address}/> <Text style = {styles.text}>{this.state.address}</Text> </Text>
                        <Text style={styles.textTitle}><Image style = {styles.time} source = {time} /> <Text style = {styles.text}>{this.state.repairPersonId}</Text></Text>
                    </View>
                    </ScrollView>
                    <View style={styles.footer}>
                        <TouchableOpacity  onPress={this._receive.bind(this)} keyboardShouldPersistTaps={true}>
                            <Image style = {styles.confirm} source = {receive} resizeMode="contain" />
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={.5} onPress={()=>this.props.navigation.navigate('FinishPage',{id:this.state.id})} keyboardShouldPersistTaps={true}>
                        <Image style = {styles.confirm} source = {finish} resizeMode="contain" />
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
        else {
            return (
                <View style = {styles.container}>
                <ScrollView >
                    <View style = {{paddingBottom: 70}}>
                        <ScrollView horizontal = {true}>
                        {this.state.images ? this.state.images.map(i => <View key={i.uri}>{this.renderAsset(i)}</View>) : null}
                        </ScrollView>
                        <Text style= {[styles.textTitle,{alignItems:'center',justifyContent:'center'}]}> {this.state.content}</Text>
                        <Text style={styles.textTitle}><Image style = {styles.time} source = {address}/> <Text style = {styles.text}>{this.state.address}</Text> </Text>
                        <Text style={styles.textTitle}><Image style = {styles.time} source = {time}/> <Text style = {styles.text}>{this.state.repairPersonId}</Text></Text>
                    </View>
                </ScrollView>
                <View style={styles.footer}>
                    <TouchableOpacity  onPress={this._finish.bind(this)} keyboardShouldPersistTaps={true}>
                            <Image style = {styles.confirm} resizeMode = "contain" source = {confirm} />
                    </TouchableOpacity>
                </View>
                </View>
            )
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal:15,
        backgroundColor: '#E5E5E5'
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginLeft: 10
    },
    text: {
        padding: 10,
        marginTop: 1,
        justifyContent: 'flex-start',
        fontSize: 20,
        color: 'black'

    },
    textTitle: {
        padding: 10,
        justifyContent: 'flex-start',
        fontSize: 23,
        color: '#0101DF',
        fontFamily: 'Helvetica',
        fontWeight:'bold',
        fontStyle: 'italic'
    },
    footer: {
        flexDirection: 'row',
        flex:1,
        right: 0,
        left: 0,
        position: 'absolute',
        alignItems: "center",
        justifyContent: "center",
        bottom: 15,
        opacity: 1
    },
    button:{
        backgroundColor:"#5858FA",
        paddingVertical: 8,
        marginVertical:13,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 15,
        padding: 25,
        width: '100%',
    },
    buttonText: {
        fontSize: 16,
        color:'#FFFFFF',
        textAlign: 'center',   
    },
    confirm: {
        width: 160,
        height: 40,
    },
    time: {
        width: 30,
        height: 30
    }
})