import React, { Component } from 'react';
import {StyleSheet,Text,View,Image,ScrollView,AsyncStorage,TouchableOpacity,
    ActivityIndicator,ToastAndroid,TouchableHighlight} from 'react-native';
import ImageSlider from 'react-native-image-slider';
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
            loadding: true,
            finish: []
        }
    }
    componentDidMount(){
        AsyncStorage.getItem(STORAGE_KEY).then((user_data_json) => {
            let token = user_data_json;   
            if(token === undefined){
              var { navigate } = this.props.navigation;
              navigate('LoginPage');
              this.setState({loadding: false})
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
                      finish: resData.pictureFinish,
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
                        loadding: false
                    });   
                   // console.warn(this.state.Position)    
                })
                .catch ((error) => {
                    this.setState({loadding: false});
                    console.warn('AsyncStorage error:' + error.message);
                }) 
                
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
                        this.setState({loadding: false})
                        ToastAndroid.show('Reqair Success!', ToastAndroid.CENTER);
                    }
                    else {
                        this.setState({loadding: false})
                        ToastAndroid.show('Reqair False!', ToastAndroid.CENTER);
                    }
                    
                })
                .catch((err) => {
                    this.setState({loadding: false})
                    console.warn('Error: ',err);
                })
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
                        this.setState({loadding: false})
                        alert('Confirm Success!');
                    }
                    else {
                        alert('Confirm False!');
                        this.setState({loadding: false})
                    }
                    
                })
                .catch((err) => {
                    this.setState({loadding: false})
                    console.warn('Error: ',err);
                })
            
        })
    }
    render(){
        const image = this.state.images;
        if(this.state.loadding){
            return(
                <View style = {{flex: 1,  justifyContent:'center',backgroundColor: '#ECF8FB'}}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )
        }else{

        if(this.state.Position !== "Supervisor"){
            if (this.state.status === "Waiting") {
                return (
                    // <ScrollView >
                    // <View style = {styles.container}>
                    //     <View style = {{paddingBottom: 20}}>
                    //         <View style = {{alignItems: "center", backgroundColor: 'gray', shadowColor: 100,}}>
                    //             <Image style={{width: 300,height:300,justifyContent:'center',flex:1,alignItems:'center', marginTop: 10, marginBottom: 10,
                    //              borderRadius:10}} resizeMode = "contain" source = {{uri: this.state.selectImage}} />
                    //         <ScrollView horizontal = {true} style = {{marginTop: 10, borderColor: 'black', borderWidth: 1,}}>
                    //         {this.state.images ? this.state.images.map(i => <View key={i.uri}>{this.renderAsset(i)}</View>) : null}
                    //         </ScrollView>
                    //         </View>
                    //         <Text style= {[styles.textTitle,{alignItems:'center'}]}> {this.state.content}</Text>
                    //         <Text style={styles.textTitle}><Image style = {styles.time} source = {address}/> <Text style = {styles.text}>{this.state.address}</Text> </Text>
                    //         <Text style={styles.textTitle}><Image style = {styles.time} source = {time} /> <Text style = {styles.text}>{this.state.repairPersonId}</Text></Text>
                    //     </View>
                    //     <TouchableOpacity activeOpacity={.5} onPress={()=> this._receive()} keyboardShouldPersistTaps={true}>
                    //         <View style={styles.button}>
                    //             <Text style={styles.buttonText}> Receive </Text>
                    //         </View>      
                    //     </TouchableOpacity>
                    // </View>
                    // </ScrollView>
                    <View style={styles.container}>
                        <View style={styles.content1}>
                        <Text style={styles.contentText}>{this.state.content}</Text>
                        </View>
                        <ImageSlider
                        loop
                        autoPlayWithInterval={3000}
                        images={image}
                        onPress={({ index }) => alert(index)}
                        customSlide={({ index, item, style, width }) => (
                            // It's important to put style here because it's got offset inside
                            <View
                            key={index}
                            style={[
                                style,
                                styles.customSlide,
                            ]}
                            >
                            <Image source={{ uri: item }} style={styles.customImage} />
                            </View>
                        )}
                        customButtons={(position, move) => (
                            <View style={styles.buttons}>
                            {image.map((image, index) => {
                                return (
                                <TouchableHighlight
                                    key={index}
                                    underlayColor="#ccc"
                                    onPress={() => move(index)}
                                    style={styles.button}
                                >
                                    {/* <Text style={position === index && styles.buttonSelected}>
                                    {index + 1}
                                    </Text> */}
                                    {
                                        image.length > 0 && <View style={[styles.slideDot, position === index && styles.dotActive]}>  
                                        </View>
                                    }
                                    
                                </TouchableHighlight>
                                );
                            })}
                            </View>
                        )}
                        />
                        <View style={styles.content2}>
                            <Text style={styles.contentText}><Image style = {styles.time} source = {address}/> <Text style = {styles.text}>{this.state.address}</Text></Text>
                            <Text style={styles.contentText}><Image style = {styles.time} source = {time} /> <Text style = {styles.text}>{this.state.repairPersonId}</Text></Text>
                        <TouchableOpacity activeOpacity={.5} onPress={()=> this._receive()} keyboardShouldPersistTaps={true}>
                             <View style={styles.buttonClick}>
                                <Text style={styles.buttonText}> Receive </Text>
                            </View>      
                        </TouchableOpacity>
                        </View>
                    </View>
                )
            } else {
                return (
                    <View style={styles.container}>
                        <View style={styles.content1}>
                        <Text style={styles.contentText}>{this.state.content}</Text>
                        </View>
                        <ImageSlider
                        loop
                        autoPlayWithInterval={3000}
                        images={image}
                        onPress={({ index }) => alert(index)}
                        customSlide={({ index, item, style, width }) => (
                            // It's important to put style here because it's got offset inside
                            <View
                            key={index}
                            style={[
                                style,
                                styles.customSlide,
                            ]}
                            >
                            <Image source={{ uri: item }} style={styles.customImage} />
                            </View>
                        )}
                        customButtons={(position, move) => (
                            <View style={styles.buttons}>
                            {image.map((image, index) => {
                                return (
                                <TouchableHighlight
                                    key={index}
                                    underlayColor="#ccc"
                                    onPress={() => move(index)}
                                    style={styles.button}
                                >
                                     {/* <Text style={position === index && styles.buttonSelected}>
                                    {index + 1}
                                    </Text> */}
                                    {
                                        image.length > 0 && <View style={[styles.slideDot, position === index && styles.dotActive]}>
                                        
                                        </View>
                                    }
                                </TouchableHighlight>
                                );
                            })}
                            </View>
                        )}
                        />
                        <View style={styles.content2}>
                        <Text style={styles.contentText}><Image style = {styles.time} source = {address}/> <Text style = {styles.text}>{this.state.address}</Text></Text>
                        <Text style={styles.contentText}><Image style = {styles.time} source = {time} /> <Text style = {styles.text}>{this.state.repairPersonId}</Text></Text>
                        <TouchableOpacity activeOpacity={.5} onPress={()=> this.props.navigation.navigate('FinishPage',{id:this.state.id})} keyboardShouldPersistTaps={true}>
                            <View style={styles.buttonClick}>
                                <Text style={styles.buttonText}> Finish </Text>
                            </View>      
                        </TouchableOpacity>
                        </View>
                    </View>
                )                
            }
        }
        else {
            if (this.state.status === "Done") {
                return (
                    <View style={styles.container}>
                        <View style={styles.content1}>
                            <Text style={styles.contentText}>{this.state.content}</Text>
                        </View>
                        <ImageSlider
                        loop
                        autoPlayWithInterval={3000}
                        images={image}
                        onPress={({ index }) => alert(index)}
                        customSlide={({ index, item, style, width }) => (
                            // It's important to put style here because it's got offset inside
                            <View
                            key={index}
                            style={[
                                style,
                                styles.customSlide,
                            ]}
                            >
                            <Image source={{ uri: item }} style={styles.customImage} />
                            </View>
                        )}
                        customButtons={(position, move) => (
                            <View style={styles.buttons}>
                            {image.map((image, index) => {
                                return (
                                <TouchableHighlight
                                    key={index}
                                    underlayColor="#ccc"
                                    onPress={() => move(index)}
                                    style={styles.button}
                                >
                                    {/* <Text style={position === index && styles.buttonSelected}>
                                    {index + 1}
                                    </Text> */}
                                    {
                                        image.length > 0 && <View style={[styles.slideDot, position === index && styles.dotActive]}>
                                        
                                        </View>
                                    }
                                </TouchableHighlight>
                                );
                            })}
                            </View>
                        )}
                        />
                    <View style={styles.content2}>
                        <Text style={styles.contentText}><Image style = {styles.time} source = {address}/> <Text style = {styles.text}>{this.state.address}</Text></Text>
                        <Text style={styles.contentText}><Image style = {styles.time} source = {time} /> <Text style = {styles.text}>{this.state.repairPersonId}</Text></Text>
                        <TouchableOpacity activeOpacity={.5} onPress={()=> this._finish()} keyboardShouldPersistTaps={true}>
                            <View style={styles.buttonClick}>
                                <Text style={styles.buttonText}> Confirm </Text>
                            </View>      
                        </TouchableOpacity>
                    </View>
                    </View>
                    )
            } else {
                return (
                    <View style={styles.container}>
                        <View style={styles.content1}>
                        <Text style={styles.contentText}>{this.state.content}</Text>
                        </View>
                        <ImageSlider
                        loop
                        autoPlayWithInterval={3000}
                        images={image}
                        onPress={({ index }) => alert(index)}
                        customSlide={({ index, item, style, width }) => (
                            // It's important to put style here because it's got offset inside
                            <View
                            key={index}
                            style={[
                                style,
                                styles.customSlide,
                            ]}
                            >
                            <Image source={{ uri: item }} style={styles.customImage} />
                            </View>
                        )}
                        customButtons={(position, move) => (
                            <View style={styles.buttons}>
                            {image.map((image, index) => {
                                return (
                                <TouchableHighlight
                                    key={index}
                                    underlayColor="#ccc"
                                    onPress={() => move(index)}
                                    style={styles.button}
                                >
                                    {/* <Text style={position === index && styles.buttonSelected}>
                                    {index + 1}
                                    </Text> */}
                                    {
                                        image.length > 0 && <View style={[styles.slideDot, position === index && styles.dotActive]}>
                                        
                                        </View>
                                    }
                                </TouchableHighlight>
                                );
                            })}
                            </View>
                        )}
                        />
                        <View style={styles.content2}>
                        <Text style={styles.contentText}><Image style = {styles.time} source = {address}/> <Text style = {styles.text}>{this.state.address}</Text></Text>
                        <Text style={styles.contentText}><Image style = {styles.time} source = {time} /> <Text style = {styles.text}>{this.state.repairPersonId}</Text></Text>
                        </View>
                    </View>
                    )
                }
            }
        }
    }
}
const styles = StyleSheet.create({
    text: {
       padding: 5,
        marginTop: 1,
        justifyContent: 'flex-start',
        fontSize: 15,
        color: 'black',
        fontWeight: '100'

    },
    buttonClick:{
        backgroundColor:"#2ECCFA",
        paddingVertical: 8,
        marginVertical:8,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        margin: 15,
        },
    time: {
         width: 30,
         height: 30
     },
    buttonText: {
        fontSize: 16,
        color:'#000000',
        textAlign: 'center',
       
     },
    container: {
        flex: 1,
        backgroundColor: '#ECF8FB',
      },
      slider: { backgroundColor: '#000', height: '50%' },
      content1: {
        width: '100%',
        height: '10%',
        marginBottom: 10,
        backgroundColor: '#ECF8FB',
        justifyContent: 'center',
        alignItems: 'center',
      },
      content2: {
        width: '100%',
        height: '40%',
        margin: 5,
        backgroundColor: '#ECF8FB',
        padding: 5
      },
      contentText: { 
        color: '#fff',
        padding: 5,
        justifyContent: 'flex-start',
        fontSize: 23,
        color: '#0101DF',
        fontFamily: 'Helvetica',
        fontWeight:'bold',
        fontStyle: 'italic'
        },
      buttons: {
        zIndex: 1,
        height: 15,
        marginTop: -25,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      },
      button: {
        margin: 3,
        width: 15,
        height: 15,
        opacity: 0.9,
        alignItems: 'center',
        justifyContent: 'center',
      },
      buttonSelected: {
        opacity: 1,
        color: '#AFEFF9',
      },
      customSlide: {
        backgroundColor: '#ECF8FB',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
      },
      customImage: {
        width: '100%',
        height: '100%',
      },
      slideDot:{
          backgroundColor: '#fff',
          width: 8,
          height: 8,
          borderRadius: 50
      },
      dotActive:{
        width: 11,
        height: 11,
      }
})