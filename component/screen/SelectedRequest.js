import React, { Component } from 'react';
import {StyleSheet,Text,View,Image,ScrollView,AsyncStorage,TouchableOpacity,
    ActivityIndicator,ToastAndroid} from 'react-native';
import env from '../environment/env';

const BASE_URL = env;
const time = require('../image/timeRequest.png');
const address = require('../image/address.png');
var STORAGE_KEY = 'key_access_token';

export default class Request extends Component{
    static navigationOptions = {
        title: 'Detail',
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
            images: [],
            id: this.props.navigation.getParam('id'),
            status: this.props.navigation.getParam('status'),
            content:'',
            address:'',
            repairPersonId: '',
            PersonName: '',
            Position:'',
            selectImage: null,
            loadding: true
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
                this.setState({loadding: false});
            });
    }
    renderImage(image) {
        return <TouchableOpacity onPress = {()=>this.setState({selectImage: image})}><Image style={styles.image} source={{uri:image}} /></TouchableOpacity>
    }
    
    renderAsset(image) {
        return this.renderImage(image);
    }
    _receive = () =>{
        this.setState({loadding: true});
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
                        ToastAndroid.show('Reqair Success!', ToastAndroid.CENTER);
                    }
                    else {
                        ToastAndroid.show('Reqair False!', ToastAndroid.CENTER);
                    }
                    
                })
                .catch((err) => {
                    console.warn('Error: ',err);
                })
            this.setState({
                loadding:false
            });
        })
    }
    _finish = () =>{
        this.setState({loadding: true});
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
                  //console.warn(responseJSON);
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
            this.setState({loadding: false})
        })
    }
    render(){
        if(this.state.loadding){
            return(
                <View style = {styles.container}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )
        }else{

        if(this.state.Position !== "Supervisor"){
            if (this.state.status === "Waiting") {
                return (
                    <ScrollView >
                    <View style = {styles.container}>
                        <View style = {{paddingBottom: 20}}>
                            <View style = {{alignItems: "center"}}>
                                <Image style={{width: 300,height:300,justifyContent:'center',flex:1,alignItems:'center', marginTop: 10, marginBottom: 10,
                                 borderRadius:10}} resizeMode = "contain" source = {{uri: this.state.selectImage}} />
                            <ScrollView horizontal = {true} style = {{marginTop: 10, borderColor: 'gray', borderWidth: 1}}>
                            {this.state.images ? this.state.images.map(i => <View key={i.uri}>{this.renderAsset(i)}</View>) : null}
                            </ScrollView>
                            </View>
                            <Text style= {[styles.textTitle,{alignItems:'center'}]}> {this.state.content}</Text>
                            <Text style={styles.textTitle}><Image style = {styles.time} source = {address}/> <Text style = {styles.text}>{this.state.address}</Text> </Text>
                            <Text style={styles.textTitle}><Image style = {styles.time} source = {time} /> <Text style = {styles.text}>{this.state.repairPersonId}</Text></Text>
                        </View>
                        <View style={styles.footer}>
                            <TouchableOpacity  onPress={this._receive.bind(this)} keyboardShouldPersistTaps={true} style = {{margin: 10}}>
                                <Text style = {styles.button}>Receive</Text>
                            </TouchableOpacity>
                        </View>
                    </View></ScrollView>
                )
            } else {
                return (
                    <ScrollView >
                    <View style = {styles.container}>
                        <View style = {{paddingBottom: 20}}>
                            <View style = {{alignItems: "center"}}>
                                <Image style={{width: 300,height:300,justifyContent:'center',flex:1,alignItems:'center', marginTop: 10, marginBottom: 10,
                                borderRadius:10}} resizeMode = "contain" source = {{uri: this.state.selectImage}} />
                            <ScrollView horizontal = {true} style = {{marginTop: 10, borderColor: 'gray', borderWidth: 1}}>
                            {this.state.images ? this.state.images.map(i => <View key={i.uri}>{this.renderAsset(i)}</View>) : null}
                            </ScrollView>
                            </View>
                            <Text style= {[styles.textTitle,{alignItems:'center'}]}> {this.state.content}</Text>
                            <Text style={styles.textTitle}><Image style = {styles.time} source = {address}/> <Text style = {styles.text}>{this.state.address}</Text> </Text>
                            <Text style={styles.textTitle}><Image style = {styles.time} source = {time} /> <Text style = {styles.text}>{this.state.repairPersonId}</Text></Text>
                        </View>
                        <View style={styles.footer}>
                            <TouchableOpacity style = {{margin:10}} activeOpacity={.5} onPress={()=>this.props.navigation.navigate('FinishPage',{id:this.state.id})} keyboardShouldPersistTaps={true}>
                                <Text style = {styles.button}>Finish</Text>
                            </TouchableOpacity>
                        </View>
                    </View></ScrollView>
                )                
            }
        }
        else {
            if (this.state.status === "Done") {
                return (
                    <ScrollView >
                    <View style = {styles.container}>
                        <View style = {{paddingBottom: 20}}>
                            <View style = {{alignItems: 'center'}}>
                                <Image resizeMode = "contain" style={{width: 300,height:300,justifyContent:'center',flex:1,alignItems:'center', marginTop: 10, borderRadius: 10, marginBottom: 10, 
                                    }} source = {{uri: this.state.selectImage}} />
                                <ScrollView horizontal = {true} style = {{marginTop: 10,borderColor: 'gray', borderWidth: 1}}>
                                    {this.state.images ? this.state.images.map(i => <View key={i.uri}>{this.renderAsset(i)}</View>) : null}
                                </ScrollView>
                            </View>
                            <Text style= {[styles.textTitle,{alignItems:'center',justifyContent:'center'}]}> {this.state.content}</Text>
                            <Text style={styles.textTitle}><Image style = {styles.time} source = {address}/> <Text style = {styles.text}>{this.state.address}</Text> </Text>
                            <Text style={styles.textTitle}><Image style = {styles.time} source = {time}/> <Text style = {styles.text}>{this.state.repairPersonId}</Text></Text>
                        </View>
                        <View style={styles.footer}>
                            <TouchableOpacity  onPress={this._finish.bind(this)} keyboardShouldPersistTaps={true}>
                                <Text style = {styles.button}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    </ScrollView>
                    )
            } else {
                return (
                    <ScrollView >
                    <View style = {styles.container}>
                        <View style = {{paddingBottom: 20}}>
                            <View style = {{alignItems: 'center'}}>
                                <Image resizeMode = "contain" style={{width: 300,height:300,justifyContent:'center',flex:1,alignItems:'center', marginTop: 10, borderRadius: 10, marginBottom: 10, 
                                    }} source = {{uri: this.state.selectImage}} />
                                <ScrollView horizontal = {true} style = {{marginTop: 10,borderColor: 'gray', borderWidth: 1}}>
                                    {this.state.images ? this.state.images.map(i => <View key={i.uri}>{this.renderAsset(i)}</View>) : null}
                                </ScrollView>
                            </View>
                            <Text style= {[styles.textTitle,{alignItems:'center',justifyContent:'center'}]}> {this.state.content}</Text>
                            <Text style={styles.textTitle}><Image style = {styles.time} source = {address}/> <Text style = {styles.text}>{this.state.address}</Text> </Text>
                            <Text style={styles.textTitle}><Image style = {styles.time} source = {time}/> <Text style = {styles.text}>{this.state.repairPersonId}</Text></Text>
                        </View>
                    </View>
                    </ScrollView>
                    )
                }
            }
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal:15,
        backgroundColor: '#E5E5E5',
        justifyContent: 'center'
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        margin: 5
    },
    text: {
        padding: 10,
        marginTop: 1,
        justifyContent: 'flex-start',
        fontSize: 15,
        color: 'black',
        fontWeight: '100'

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
        paddingVertical: 8,
        marginVertical:8,
        alignItems: "center",
        justifyContent: "center",
    },
    button:{
        backgroundColor:"#5858FA",
        color: '#fff',
        borderRadius: 15,
        flex:1,
        textAlign:'center',
        padding: 12,
        fontSize: 16,
    },
    time: {
        width: 30,
        height: 30
    }
})