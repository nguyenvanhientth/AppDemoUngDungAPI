import React, { Component } from 'react';
import {StyleSheet,Text,TextInput,Button,View,Alert,TouchableOpacity,
  Image,AsyncStorage,ActivityIndicator, ScrollView, Picker,Dimensions} from 'react-native';
import env from '../environment/env';

const BASE_URL = env;
var STORAGE_KEY = 'key_access_token';
const userIcon = require('../image/ic_user.png');
const iconEmail = require('../image/email.png');
const iconPhone = require('../image/phone.png');
const company = require('../image/company.png');
const avatar = require('../image/avatar.png');

export default class SignUpPage extends Component {
    static navigationOptions = {
        title: 'Register',
        headerStyle: {
            backgroundColor: '#29ACE4',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
      };
  constructor(props) {
    super(props);
  
    this.state = {
      userName: '',
      Email: '',
      Position: '',
      PhoneNumber: '',
      data: [],
      gender: [{id:-1,name:'Select Gender'},{id: 0,name:'Nữ'},{id: 1,name: 'Nam'}],
      Sgender: -1,
      loading: true,
    };
  }

  componentDidMount(){
    AsyncStorage.getItem(STORAGE_KEY).then((user_data_json) => {
        let token = user_data_json;   
        if(token === undefined){
          var { navigate } = this.props.navigation;
          navigate('LoginPage');
        }    
        let url = BASE_URL + 'Company/GetAllCompany';
        fetch(url,{
            headers: {
              'cache-control': 'no-cache',
              Authorization: 'Bearer ' + token,
              },
          })
          .then((res) => res.json())
          .then((resData) => { 
              this.setState({
                  data : [{name: 'Select Company'},...resData]
                });
                //console.warn('data',this.state.data);
            })
          .catch((err) => {
            console.warn(' loi update Area1',err);
          })
        });
        this.setState({loading: false});
    }

  _onPressSignUp = () => {
      this.setState({loading: true});
      AsyncStorage.getItem(STORAGE_KEY).then((user_data_json) => {
      let token = user_data_json;  
      let serviceUrl = BASE_URL+  "Account/Register";
      let userName = this.state.userName;
      let Email = this.state.Email;
      let gender = this.state.Sgender;
      let Pos = this.state.Position;
      let PhoneNumber = this.state.PhoneNumber;
      // kiem tra o day 
      if (userName.length === 0 || Email.length === 0||
        gender.length === 0 ||Pos.length === 0 ||PhoneNumber.length === 0) {
        alert('You have not entered enough!');
        this.setState({loading: false})
        } 
        fetch(serviceUrl,{
            method: "POST",          
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
            },
        body: JSON.stringify({
            'UserName': userName,
            'Email': Email,
            'Gender': gender,
            'CompanyId': Pos,
            'PhoneNumber': PhoneNumber,
            
            })
        })
            .then((responseJSON) => {  
                //console.warn('signup',responseJSON)
                    if(responseJSON.ok){
                        var { navigate } = this.props.navigation;
                        navigate('drawerStack');
                        alert('Register Success!');
                    }
                    else {
                        alert('Register False!');
                    }
                    
            })
            .catch((error) => {
                console.warn('asd',error);
            }); 
        this.setState({loading: false}) ;
    })
}
      
    _onChaneUserName = (userName) =>{
        this.setState({userName});
    }
    _onChaneEmail = (Email) =>{
        this.setState({Email});
    }
    _onChanePhoneNumber = (PhoneNumber) =>{
        this.setState({PhoneNumber});
    }
    _updatePosition = (Position) => {
        this.setState({Position: Position})
    }
    _updateGender = (id) =>{
        this.setState({Sgender:id})
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
        <View style={ styles.background}>
            <View style = {[{alignItems: "center"},styles.container]}>
                <Image source={avatar} resizeMode="contain" style={styles.logo}/>
            </View>
                <View style={styles.wrapper}>
                    <View style={styles.inputWrap}>
                        <View style={styles.iconWrap}>
                            <Image source={userIcon} resizeMode="contain" style={styles.icon}/>
                        </View>
                        <TextInput  style={styles.input} placeholder="Username" onChangeText={this._onChaneUserName.bind(this)} underlineColorAndroid="transparent"/>
                    </View>
                    <View style={styles.inputWrap}>
                        <View style={styles.iconWrap}>
                            <Image source={iconEmail} resizeMode="contain" style={styles.icon}/>
                        </View>
                        <TextInput  style={styles.input} placeholder="Email" onChangeText={this._onChaneEmail.bind(this)} underlineColorAndroid="transparent"/>
                    </View>
                    <View style={styles.inputWrap}>
                        <View style={styles.iconWrap}>
                            <Image source={company} resizeMode="contain" style={styles.icon}/>
                        </View>
                        <Text style = {styles.label}> Company </Text>
                        <Picker
                            selectedValue={this.state.Position}
                            style={styles.combobox}
                            onValueChange={this._updatePosition.bind(this)}>
                            {
                                this.state.data && this.state.data.map((item,index) =>{
                                   return <Picker.Item key = {index} label = {item.name} value = {item.id} />
                                })
                            }
                        </Picker>
                    </View>
                    <View style={styles.inputWrap}>
                        <View style={styles.iconWrap}>
                            <Image source={userIcon} resizeMode="contain" style={styles.icon}/>
                        </View>
                        <Text style = {styles.label}> Gender </Text>
                        <Picker
                            selectedValue={this.state.Sgender}
                            style={styles.combobox}
                            onValueChange={this._updateGender.bind(this)}>
                            {
                                this.state.gender.map((item,index) =>{
                                   return <Picker.Item key = {index} label = {item.name} value = {item.id} />
                                })
                            }
                        </Picker>
                    </View>
                    <View style={styles.inputWrap}>
                        <View style={styles.iconWrap}>
                            <Image source={iconPhone} resizeMode="contain" style={styles.icon}/>
                        </View>
                        <TextInput  style={styles.input} placeholder="PhoneNumber" onChangeText={this._onChanePhoneNumber.bind(this)} underlineColorAndroid="transparent"/>
                    </View>
                    <TouchableOpacity activeOpacity={.5} onPress={this._onPressSignUp.bind(this)} keyboardShouldPersistTaps={true}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}> Sign Up</Text>
                        </View>           
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={.5} onPress={() => navigate('drawerStack')}>
                        <View >
                            <Text style={styles.forgotPasswordText}>Cancel</Text>        
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
    background:{
        width: Dimensions.get('window').width,
        height:  Dimensions.get('window').height,
        flex: 1,
        backgroundColor: '#E0F7FE'
    },
    wrapper:{
      paddingHorizontal:15,
    },
    inputWrap:{
      flexDirection:"row",
      marginVertical: 5,
      height:36,
      backgroundColor:"transparent",
    },
    input:{
        flex: 1,
        paddingHorizontal: 5,
        backgroundColor:'#FFF',
    },
    combobox: {
        backgroundColor: '#F2F2F2',
        height: 36,
        width: 200,
        paddingHorizontal: 5,
        alignItems: 'center'

    },
    label: {
        flex: 1, 
        backgroundColor: '#585858',
        marginRight: 10,
        textAlign: "center",
        paddingHorizontal: 5,
        paddingTop: 5,
        fontSize: 20,
        color: "#FFF"
    },
    iconWrap:{
        paddingHorizontal:7,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:"#d73352"
    },
    icon:{
        width:20,
        height:20,
    },
    button:{
        backgroundColor:"#d73352",
        paddingVertical: 8,
        marginVertical:8,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20
    },
    buttonText: {
      fontSize: 16,
      color:'#FFFFFF',
      textAlign: 'center',
     
    },
    forgotPasswordText:{
        color:'#0404B4',
        backgroundColor:"transparent",
        textAlign: 'center',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    logo: {
        width: '100%',
        height: '100%'
    }
});

 

module.exports = SignUpPage;