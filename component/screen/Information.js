import React, { Component } from 'react';
import {StyleSheet,Text,View,Image,ScrollView,ToastAndroid,ActivityIndicator,TextInput,
    AsyncStorage,TouchableOpacity,StatusBar,NativeModules} from 'react-native';
import DateTimePicker from "react-native-modal-datetime-picker";
import env from '../environment/env';
import Dialog from "react-native-dialog";
import Communications from 'react-native-communications';
import HeaderNavigation from './header/HeaderNavigation';


var STORAGE_KEY = 'key_access_token';
const date = require('../image/date.png') ;
const image = require('../image/image.png') ;
const phone = require('../image/phone.png') ;
const address = require('../image/address.png') ;
const email = require('../image/email.png') ;
const update = require('../image/update.png') ;
const dob = require('../image/dob.png') ;
const name = require('../image/ic_user.png') ;
const information = require('../image/information.png') ;
var avatar = require('../image/avatar.png');
var done = require('../image/done.png');
const BASE_URL = env;
var ImagePicker = NativeModules.ImageCropPicker;

export default class Information extends Component {
    static navigationOptions = {
        title: 'Personal Information',
        drawerIcon: ({icon}) =>(
            <Image source = {information} resizeMode="contain" style = {[styles.icon]} />
        ),
      };
    constructor(props) {
    super(props);
  
    this.state = {
      firstName: '',
      lastName: '',
      userName: '',
      Email: '',
      DOB: '',
      Address: '',
      Gender: '',
      Position: '',
      PhoneNumber: '',
      isDateTimePickerVisible: false,
      avatar: null,
      source: avatar,
      updateAvata: false,
      loading: true,
      input: false,
      input1: false,
      DOB1: null,
    };
  }
  
  componentDidMount() {
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
                    userName: resJson.userName,
                    Email: resJson.email,
                    Address: resJson.address,
                    Position: resJson.role,
                    PhoneNumber: resJson.phoneNumber,
                    DOB: resJson.dateOfBirth,
                    Gender: resJson.gender,
                    avatar: resJson.avatar,
                    loading: false
                }); 
            })
            .catch ((error) => {
                console.warn('AsyncStorage error:' + error.message);
                this.setState({loading: false});
            })
        });


    } catch (error) {
        this.setState({loading: false});
        console.log('AsyncStorage error: ' + error.message);
    }            
  }
    handleCancelAvatar =()=>{
        this.setState({
            updateAvata: false,
            source: avatar
        })
    }
    handleUpdate = ()=>{
        this.setState({loading: true});
        AsyncStorage.getItem(STORAGE_KEY).then((user_data_json) => {
            let token = user_data_json; 
            let dateOfBirth = null; 
            if (this.state.DOB1 !== this.state.DOB) {
                dateOfBirth = this.state.DOB1;
            }
            let serviceUrl = BASE_URL+  "Account/ChangeInformationUser";
            let firstName = this.state.firstName;
            let lastName = this.state.lastName;
            
            let address = this.state.Address;
            let PhoneNumber = this.state.PhoneNumber;
            // kiem tra o day 
              fetch(serviceUrl,{
                  method: "PUT",          
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + token,
                  },
              body: JSON.stringify({
                  'FirstName': firstName,
                  'LastName': lastName,
                  'DateOfBirth': dateOfBirth,
                  'Address': address,
                  'PhoneNumber': PhoneNumber,
                  
                  })
              })
                  .then((responseJSON) => {  
                      console.warn('signup',responseJSON)
                          if(responseJSON.ok){
                              this.componentWillMount();
                              this.setState({loading: false, input: false, input1: false})
                              ToastAndroid.show('Update Success!', ToastAndroid.CENTER);
                          }
                          else {
                                this.componentWillMount();
                                this.setState({loading: false, input: false, input1: false})
                                ToastAndroid.show('Update False!', ToastAndroid.LONG);
                          }      
                  })
                  .catch((error) => {
                        this.setState({loading: false, input: false, input1: false})
                      console.warn('Error Update',error);
                  });  
          })
    }
    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true, input1: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

     _handleDatePicked = date => {
        this.setState({ DOB1: date.toString() });
        this._hideDateTimePicker();
    };
    _show =() =>{
        alert(this.state.Email)
    }
    pickMultiple() {
        ImagePicker.openPicker({
          multiple: false,
          waitAnimationEnd: false,
          includeExif: true,
          forceJpg: true,
        }).then(images => {
            this.setState({
              source: {uri: images.path, width: images.width, height: images.height, mime: images.mime},
              updateAvata: true
            });
        }).catch(e => console.log(e));
      }
      handleOk = ()=>{
        this.setState({loading: true});
        AsyncStorage.getItem(STORAGE_KEY).then((user_data_json) => {
            let token = user_data_json;
            let url = BASE_URL + 'Account/UpdateAvatar';
            let data = new FormData();
            const sessionId = new Date().getTime();
            data.append("FileAvatar",{
                uri: this.state.source.uri,
                type: 'image/jpg',
                name: `${sessionId}.jpg`,
            });
            fetch(url,{
                method: 'PUT',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: 'Bearer '+token,
                },
                body: data
            })
            .then((response) =>{
                if(response.ok){
                    this.componentWillMount();
                    this.setState({loading: false,updateAvata: false})
                    ToastAndroid.show('Update Avatar Success!', ToastAndroid.CENTER);
                }
                else{
                    this.setState({loading: false,updateAvata: false})
                    ToastAndroid.show('Update Avatar False!', ToastAndroid.CENTER);
                }
            })
            .catch((error) =>{
                this.setState({loading: false,updateAvata: false})
                console.warn('Update Avatar Error!', error);
            })
        })
      }
      show_input = (text,image,a) =>{
        return (
            this.state.input ? 
            <View style={styles.text}> 
                <Image style = {styles.icon} resizeMode="contain" source = {image} /> 
                <TextInput autoFocus = {true} style = {styles.text1} onChangeText = {(text)=> this._changeText(text,a)}>{text}</TextInput>
            </View>:
            <View style={styles.text}> 
                <Image style = {styles.icon} resizeMode="contain" source = {image} /> 
                <Text style = {styles.text1}> {text} </Text> 
            </View>
            )
      }
      _changeText = (text,a) => {
        switch (a) {
            case 1:
                this.setState({lastName: text})
                break;
            case 2:
                this.setState({Address: text})
                break;
            case 3:
                this.setState({PhoneNumber: text})
                break;
            default:
            this.setState({firstName: text})
                break;
        }
      }
 render() {
    const { isDateTimePickerVisible } = this.state;
    if (this.state.loading) {
        return(
           <View style = {{flex: 1,justifyContent:'center',backgroundColor: '#ECF8FB'}}>
             <ActivityIndicator size="large" color="#0000ff" />
           </View>
         )
      } else {
        return (
            <ScrollView>
            <View style={styles.container}>
                <StatusBar hidden={false}></StatusBar>
                <HeaderNavigation {...this.props}></HeaderNavigation>
                <View style = {styles.contentName}>
                    <Text style = {{color: "#fff", fontSize: 30}}> Hi {this.state.firstName} {this.state.lastName}</Text>
                    <Text style = {{color: "#fff", fontSize: 20}}>Active | {this.state.Gender} | {this.state.Position}</Text>
                        <TouchableOpacity onPress = {() =>this.pickMultiple()}>
                        {
                            this.state.avatar ? 
                            <Image style = {{width: 100,height: 100,borderRadius: 100, margin: 10}} source={{uri: this.state.avatar}} /> :
                            <Image style = {{width: 100,height: 100,borderRadius: 100, margin: 10}} source={this.state.source} />
                        }
                        </TouchableOpacity>
                    <View style = {{flexDirection: 'row'}}>
                        <TouchableOpacity onPress = {()=>Communications.phonecall(this.state.PhoneNumber,true)}>
                            <Image source = {phone} style = {{width: 25,height: 25,margin: 10}} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress = {()=>Communications.phonecall(this.state.PhoneNumber,true)}>
                            <Image source = {image} style = {{width: 25,height: 25,margin: 10}} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress = {()=>this._show()}>
                            <Image source = {email} style = {{width: 25,height: 25,margin: 10}} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.ThongTin}>
                    {this.show_input(this.state.firstName,name)}
                    {this.show_input(this.state.lastName,name,1)}
                    {this.show_input(this.state.Address,address,2)}
                    <View style = {styles.text}>
                        <Image style = {styles.icon} resizeMode="contain" source = {dob} />
                        <Text style = {styles.text1}>{this.state.DOB}</Text> 
                        <TouchableOpacity style={{position: 'absolute', right: 10, top: 15}} onPress={this._showDateTimePicker}>
                            <Image style = {styles.iconDate} source={date}></Image>
                        </TouchableOpacity>
                        <DateTimePicker
                            isVisible={isDateTimePickerVisible}
                            onConfirm={this._handleDatePicked}
                            onCancel={this._hideDateTimePicker}
                            mode= {'date'}
                            is24Hour = {false}
                        />
                    </View>
                    {this.show_input(this.state.PhoneNumber,phone,3)}
                </View>
                <View style={styles.footer}>
                        {
                            this.state.input | this.state.input1 ? 
                            <TouchableOpacity activeOpacity={.5} onPress = {()=>this.handleUpdate()} keyboardShouldPersistTaps={true}>
                                <View style={[styles.button,]}>
                                    <Image style = {[styles.iconAdd,{backgroundColor: '#29ACE4'}]} source = {done} />
                                </View>   
                            </TouchableOpacity>:
                            <TouchableOpacity activeOpacity={.5} onPress = {()=>this.setState({input: true})} keyboardShouldPersistTaps={true}>
                                <View style={[styles.button,]}>
                                    <Image style = {[styles.iconAdd,{backgroundColor: '#29ACE4'}]} source = {update} />
                                </View>   
                            </TouchableOpacity>
                        }     
                </View>
                <Dialog.Container visible = {this.state.updateAvata}>
                    <Dialog.Title> Are you want change Avatar? </Dialog.Title>
                    <Dialog.Button label="Cancel" onPress={this.handleCancelAvatar} />
                    <Dialog.Button label="Ok" onPress={this.handleOk} />
                </Dialog.Container>
            </View>
            </ScrollView>
        );}
    } 
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,  
    backgroundColor: '#E0F7FE'  
  },
  container1: {
    flex: 0.8,
    height: '50%'  
  },
  footer: {
    position: 'absolute',
    flex:1,
    right: 0,
    bottom: 10,
    },
  wrapper:{
      paddingHorizontal:15,
  },
    button:{
        paddingVertical: 8,
        marginVertical:3,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 15,
        marginLeft: 20,
        marginRight: 20
    },
  text: {
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    borderBottomWidth: 2,
    borderBottomColor: 'gray',
    padding: 20,
    width: '100%',
    flexDirection: 'row'
  },
  text1: {
    color: 'gray',
    fontSize: 20,
    textAlign: 'center',
    marginLeft: 15,
    width: '80%',
  },
  textDate: {
    color: '#424040',
    fontSize: 16,
    justifyContent: 'flex-start',
    alignContent: 'center',
    width: '70%',
  },
  ThongTin: {
    alignItems: "flex-start",
    position: "relative",
    borderRadius: 20,
    margin: 10,
    paddingTop: 10,
    paddingBottom: 20
  },
  iconAdd:{
    marginTop: 10,
    width:50,
    height:50,
    borderRadius: 50
    },
    DOB: {
        flexDirection: 'row',
        flex: 0.2,
        width: '100%',
        alignItems:"flex-start",
        paddingTop: 10,
        paddingBottom: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 2,
        borderBottomColor: 'gray',
    },
    iconDate: {
        width:40,
        height: 40,
    },
    icon: {
        width: 25,
        height: 25
    },
    contentName: {
        alignItems: "center",
        backgroundColor: '#29ACE4',
        padding: 20
    },
    icon1: {
        width: 30,
        height: 30,
        position: 'absolute',
        right: 0,
        top: 20,
    }
});