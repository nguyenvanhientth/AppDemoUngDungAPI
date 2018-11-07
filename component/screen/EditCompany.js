import React, { Component } from 'react';
import {StyleSheet,Text,TextInput,View,TouchableOpacity,
  Image,AsyncStorage, ScrollView,Dimensions,NativeModules} from 'react-native';
import env from '../environment/env';

const BASE_URL = env;
var STORAGE_KEY = 'key_access_token';
const company = require('../image/company.png');
const address = require('../image/address.png');
var ImagePicker = NativeModules.ImageCropPicker;

export default class EditCompany extends Component {
    static navigationOptions = {
        title: 'Create Company',
        headerStyle: {
            backgroundColor: '#1583F8',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
      };
  constructor(props) {
    super(props);
    this.state = {
        images: [],
        companyName: '',
        address: '',
        id: this.props.navigation.getParam('id'),
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
            let token = user_data_json;  
            let serviceUrl = BASE_URL+  "Company/ChangeInformationCompany";
            const sessionId = new Date().getTime();
            let data = new FormData();
            let image = this.state.images ? this.state.images[0]:null;
            data.append("CompanyId",this.state.id)
            data.append("Name",this.state.companyName);
            data.append("Address",this.state.address);
            if (image !== undefined) {
                data.append("Logo",{
                    uri: image.uri,
                    type: 'image/jpg',
                    name: `${sessionId}.jpg`,
                  });
            }
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
                              navigate('drawerStack');
                              alert('Edit Success!');
                          }
                          else {
                              alert('Edit False!');
                          }
                          
                  })
                  .catch((error) => {
                      console.warn('Error: ',error);
                  });  
          })
    }
    pickMultiple() {
        ImagePicker.openPicker({
          multiple: true,
          waitAnimationEnd: false,
          includeExif: true,
          forceJpg: true,
        }).then(images => {
          this.setState({
            images: images.map(i => {
              //console.warn('received image', i);
              return {uri: i.path, width: i.width, height: i.height, mime: i.mime};
            })
          });
        }).catch(e => alert(e));
      }
    renderImage(image) {
        return <Image style={{width: 300, height: 300, resizeMode: 'contain',marginLeft: 10}} source={image} />
    }
    
    renderAsset(image) {
        return this.renderImage(image);
    }
    render() {
        var { navigate } = this.props.navigation;
    return (
        <ScrollView>
        <View style={ styles.background}>
            <View style={styles.container}/>
                <View style={styles.wrapper}>
                    <ScrollView horizontal = {true}>
                        {this.state.images ? this.state.images.map(i => <View key={i.uri}>{this.renderAsset(i)}</View>) : null}
                    </ScrollView>
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
                    <TouchableOpacity onPress={this.pickMultiple.bind(this)}>
                        <View style = {[styles.button,{backgroundColor:'#58ACFA'}]}>
                            <Text style = {styles.buttonText}>Select New Logo Company</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={.5} onPress={this._onEdit.bind(this)} keyboardShouldPersistTaps={true}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}> Editing </Text>
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
    );
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