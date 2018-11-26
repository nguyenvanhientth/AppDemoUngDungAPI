import React, { Component } from 'react';
import {StyleSheet,Text,TextInput,View,TouchableOpacity,ToastAndroid,
  Image,AsyncStorage, ScrollView,Dimensions,NativeModules} from 'react-native';
import env from '../environment/env';

const BASE_URL = env;
var STORAGE_KEY = 'key_access_token';
const company = require('../image/company.png');
const address = require('../image/address.png');
const logocompany = require('../image/logocompany.jpg');
var ImagePicker = NativeModules.ImageCropPicker;

export default class CreateCompany extends Component {
    static navigationOptions = {
        title: 'Create Company',
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
        image: null,
        companyName: '',
        address: '',
        loading: false,
    };
  }

  componentDidMount(){
    }
      
    _onChaneCompanyName = (companyName) =>{
        this.setState({companyName});
    }
    _onchaneAddress = (address) =>{
        this.setState({address});
    }
    _onCreate = () =>{
        this.setState({loading: true});
        AsyncStorage.getItem(STORAGE_KEY).then((user_data_json) => {
            let token = user_data_json;  
            let serviceUrl = BASE_URL+  "Company/AddCompany";
            const sessionId = new Date().getTime();
            let data = new FormData();
            if (this.state.companyName.length === 0 || this.state.address.length === 0||
                this.state.image === null) {
                alert('You have not entered enough!');
                this.setState({loading: false})
            } 
            else {
                data.append("CompanyName",this.state.companyName);
                data.append("Address",this.state.address);
                data.append("Logo",{
                  uri: this.state.image.uri,
                  type: 'image/jpg',
                  name: `${sessionId}.jpg`,
                });
                // kiem tra o day 
                fetch(serviceUrl,{
                    method: 'POST',
                    headers: {
                    //   'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                    Authorization: 'Bearer ' + token,
                    },
                    body: data,
                    })
                    .then((responseJSON) => {  
                        //console.warn('creacte company',responseJSON)
                            if(responseJSON.ok){
                                var { navigate } = this.props.navigation;
                                navigate('ListCompanyPage');
                                ToastAndroid.show('Create Success!', ToastAndroid.CENTER);
                            }
                            else {
                                ToastAndroid.show('Create False!', ToastAndroid.CENTER);                           
                            }
                            
                    })
                    .catch((error) => {
                        console.warn('Error: ',error);
                    });
                }
          }).then(this.setState({loading: false}))
    }
    pickMultiple() {
        ImagePicker.openPicker({
          multiple: false,
          waitAnimationEnd: false,
          includeExif: true,
          forceJpg: true,
        }).then(images => {
          this.setState({
            image: {uri: images.path, width: images.width, height: images.height, mime: images.mime},
            });
        }).catch(e => ToastAndroid.show(e,ToastAndroid.CENTER));
      }
    render() {
        var { navigate } = this.props.navigation;
        if(this.state.loading){
            return(
                <View style = {styles.background}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )
        }
        else{
            return (
                <ScrollView>
                <View style={ styles.background}>
                        <View style={styles.wrapper}>
                            <View style={{alignItems: "center", height: '40%', margin: 20}}>
                            <TouchableOpacity style = {{alignItems:'center',width: '50%',height: '100%', margin: 10,borderRadius: 100}} onPress = {() =>this.pickMultiple()}>
                                {
                                    this.state.image ? 
                                    <Image style = {{width: '100%', height: '100%',borderRadius: 150}} resizeMode="contain" source={this.state.image}  /> :
                                    <Image style = {{width: '100%', height: '100%',borderRadius: 150,}} resizeMode="contain" source = {logocompany} /> 
                                }
                            </TouchableOpacity>
                            </View>
                            <View style={styles.inputWrap}>
                                <View style={styles.iconWrap}>
                                    <Image source={company} resizeMode="contain" style={styles.icon}/>
                                </View>
                                <TextInput  style={styles.input} placeholder="CompanyName" onChangeText={this._onChaneCompanyName.bind(this)} underlineColorAndroid="transparent"/>
                            </View>
                            <View style={styles.inputWrap}>
                                <View style={styles.iconWrap}>
                                    <Image source={address} resizeMode="contain" style={styles.icon}/>
                                </View>
                                <TextInput  style={styles.input} placeholder="Address" onChangeText={this._onchaneAddress.bind(this)} underlineColorAndroid="transparent"/>
                            </View>
                            <TouchableOpacity disabled= {this.state.loading} activeOpacity={.5} onPress={this._onCreate.bind(this)} keyboardShouldPersistTaps={true}>
                                <View style={styles.button}>
                                    <Text style={styles.buttonText}> Create </Text>
                                </View>           
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={.5} onPress={() => navigate('ListCompanyPage')}>
                                <View >
                                    <Text style={styles.forgotPasswordText}>Cancel</Text>        
                                </View>      
                            </TouchableOpacity>
                        </View>                        
                    <View style={styles.container}/>
                </View>
                </ScrollView>
            );
        }
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
        backgroundColor:"#2E64FE",
        paddingVertical: 8,
        marginVertical:8,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 25,
        shadowOpacity: 20
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
});

 

module.exports = CreateCompany;