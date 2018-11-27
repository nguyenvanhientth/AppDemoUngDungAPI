import React, { Component } from 'react';
import {StyleSheet,Text,TextInput,View,TouchableOpacity,ToastAndroid,ActivityIndicator,
  Image,AsyncStorage, ScrollView,Dimensions,NativeModules} from 'react-native';
import env from '../environment/env';

const BASE_URL = env;
var STORAGE_KEY = 'key_access_token';
const company = require('../image/company.png');
const address = require('../image/address.png');
var ImagePicker = NativeModules.ImageCropPicker;

export default class EditCompany extends Component {
    static navigationOptions = {
        title: 'Edit Company',
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
        e: this.props.navigation.getParam('image'),
        companyName: this.props.navigation.getParam('name'),
        address: this.props.navigation.getParam('address'),
        id: this.props.navigation.getParam('id'),
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
    _onEdit = () =>{
        AsyncStorage.getItem(STORAGE_KEY).then((user_data_json) => {
            this.setState({loading: true})
            let token = user_data_json;  
            let serviceUrl = BASE_URL+  "Company/ChangeInformationCompany";
            const sessionId = new Date().getTime();
            let data = new FormData();
            data.append("CompanyId",this.state.id)
            data.append("Name",this.state.companyName);
            data.append("Address",this.state.address);
            if (this.state.image !== undefined) {
                data.append("Logo",{
                    uri: this.state.image.uri,
                    type: 'image/jpg',
                    name: `${sessionId}.jpg`,
                  });
            }
            console.warn('data',data)
            // kiem tra o day 
            fetch(serviceUrl,{
                method: 'PUT',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'multipart/form-data',
                  Authorization: 'Bearer ' + token,
                  },
                body: data,
                })
                  .then((responseJSON) => {  
                    console.warn('edit company',responseJSON)
                          if(responseJSON.ok){
                              var { navigate } = this.props.navigation;
                              navigate('ListCompanyPage');
                              this.setState({loading: false});
                              ToastAndroid.show('Edit Success!', ToastAndroid.CENTER);
                          }
                          else {
                            ToastAndroid.show('Edit False!', ToastAndroid.CENTER);
                            this.setState({loading: false});
                          }
                          
                  })
                  .catch((error) => {
                      console.warn('Error: ',error);
                      this.setState({loading: false});
                  });  
          })
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
        }).catch(e => console.log(e));
      }
    render() {
        var { navigate } = this.props.navigation;
        if (this.state.loading) {
            return(
               <View style = {{flex: 1,justifyContent:'center',}}>
                 <ActivityIndicator size="large" color="#0000ff" />
               </View>
             )
          } else {
            return (
                <ScrollView>
                <View style={ styles.background}>
                    <View style={styles.wrapper}>
                        <View style= {{alignItems: 'center', height: '40%', margin: 20}}>
                            <TouchableOpacity style = {{alignItems:'center',width: '50%',height: '100%', margin: 10,borderRadius: 100, backgroundColor: '#fff'}} onPress = {() =>this.pickMultiple()}>
                            {
                                this.state.image ? <Image style = {{width: '100%', height: '100%',borderRadius: 150}} resizeMode="contain" source={this.state.image}  />
                                : <Image style = {{width: '100%', height: '100%',borderRadius: 150}} resizeMode="contain" source={{uri: this.state.e}}  />
                            }
                            </TouchableOpacity>
                        </View>
                        <View style={styles.inputWrap}>
                            <View style={styles.iconWrap}>
                                <Image source={company} resizeMode="contain" style={styles.icon}/>
                            </View>
                            <TextInput  style={styles.input} placeholder="CompanyName" onChangeText={this._onChaneCompanyName.bind(this)} underlineColorAndroid="transparent" value = {this.state.companyName}/>
                        </View>
                        <View style={styles.inputWrap}>
                            <View style={styles.iconWrap}>
                                <Image source={address} resizeMode="contain" style={styles.icon}/>
                            </View>
                            <TextInput  style={styles.input} placeholder="Address" onChangeText={this._onchaneAddress.bind(this)} underlineColorAndroid="transparent" value = {this.state.address}/>
                        </View>
                        <TouchableOpacity disabled = {this.state.loading} activeOpacity={.5} onPress={this._onEdit.bind(this)} keyboardShouldPersistTaps={true}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}> Editing </Text>
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
        borderRadius: 10
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