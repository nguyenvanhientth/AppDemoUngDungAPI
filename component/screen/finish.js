import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView, ActivityIndicator,
  Image, TouchableOpacity, NativeModules, Dimensions, AsyncStorage, ToastAndroid
} from 'react-native';
import env from '../environment/env';

var ImagePicker = NativeModules.ImageCropPicker;
const BASE_URL = env;
var STORAGE_KEY = 'key_access_token';
const camera = require('../image/camera.png');
const photo = require('../image/photoLibrary.png');

export default class Finish extends Component {
  static navigationOptions = {
    title: 'Request',
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
      images: [],
      data:[],
      id: this.props.navigation.getParam('id'),
      loading: false
    };
  }

  componentDidMount(){
  }

  pickSingleWithCamera(cropping) {
    ImagePicker.openCamera({
      cropping: cropping,
      width: 500,
      height: 500,
      includeExif: true,
    }).then(image => {
      console.log('received image', image);
      this.setState({
        image: {uri: image.path, width: image.width, height: image.height},
        images: null
      });
    }).catch(e => ToastAndroid.show(e,ToastAndroid.CENTER));
  }

  pickMultiple() {
    ImagePicker.openPicker({
      multiple: true,
      waitAnimationEnd: false,
      includeExif: true,
      forceJpg: true,
    }).then(images => {
      this.setState({
        image: null,
        images: images.map(i => {
          console.log('received image', i);
          return {uri: i.path, width: i.width, height: i.height, mime: i.mime};
        })
      });
    }).catch(e => ToastAndroid.show(e,ToastAndroid.CENTER));
  }
  renderImage(image) {
    return <Image style={{width: 300, height: 300, resizeMode: 'contain',marginLeft: 10, borderRadius: 10}} source={image} />
  }

  renderAsset(image) {
    return this.renderImage(image);
  }

  Upload = () => {
    AsyncStorage.getItem(STORAGE_KEY).then((user_data_json) => {
      this.setState({loading: true});
      let token = user_data_json;   
      if(token === undefined){
        var { navigate } = this.props.navigation;
        navigate('LoginPage');
        this.setState({loading: false});
       }    
      let url = BASE_URL + 'Request/RepairPersonFinish';
      let data = new FormData();
      const sessionId = new Date().getTime();
      data.append("RequestId",this.state.id);
      let arrImage = [];
      this.state.image ? arrImage.push(this.state.image) : arrImage = [...this.state.images];
      //console.warn('image',arrImage);
      arrImage.map((i) =>{
        data.append("ListPictureFinish",{
          uri: i.uri,
          type: 'image/jpg',
          name: `${sessionId}.jpg`,
        });
      });
      //console.warn('data',data);
      fetch(url,{
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + token,
          },
        body: data,
      })
      .then((res) => {
        //console.warn(res); 
        if(res.ok){
          var { navigate } = this.props.navigation;
          navigate('drawerStack');
          this.setState({loading: false});
          alert('Request Success!');
        }
          else {
            alert('Request False!');
            this.setState({loading: false});
        }
      })
      .catch((err) => {
        console.warn(' loi update image',err);
        this.setState({loading: false});
      })
    })
  }
  render() {
    if (this.state.loading) {
      return(
         <View style = {{flex: 1,justifyContent:'center',}}>
           <ActivityIndicator size="large" color="#0000ff" />
         </View>
       )
    } else {
      return (
        <ScrollView>
          <View style= {styles.container}>
            <View style={{flex:0.5, paddingTop: 10, alignItems:'center'}}>
            <ScrollView horizontal = {true}>
              {this.state.image ? this.renderAsset(this.state.image) : null}
              {this.state.images ? this.state.images.map(i => <View key={i.uri}>{this.renderAsset(i)}</View>) : null}
            </ScrollView>
            </View>
            <View>
              <View style = {{flexDirection: 'row', alignItems: 'center',alignContent: 'center', justifyContent: 'center'}}>
                <TouchableOpacity onPress={() => this.pickSingleWithCamera(false)} keyboardShouldPersistTaps={true}>
                  <View style={{borderRadius: 30,margin: 30}}>
                    <Image style = {styles.camera} resizeMode="contain" source = {camera} />
                  </View>  
                </TouchableOpacity>
                <TouchableOpacity onPress={this.pickMultiple.bind(this)}>
                  <View style={{borderRadius: 30,margin: 30}}>
                    <Image style = {styles.camera} resizeMode="contain" source = {photo}/>
                  </View>
                </TouchableOpacity>
              </View>
            <TouchableOpacity onPress={this.Upload.bind(this)} style={styles.button}>
              <Text style={styles.buttonText}>Send request</Text>
            </TouchableOpacity>
            </View>
          </View>
      </ScrollView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('window').width,
    height:  Dimensions.get('window').height,
    backgroundColor: '#E5E5E5',
    paddingHorizontal:15,
  },
  button:{
    backgroundColor:"#91b4ce",
    paddingVertical: 8,
    marginVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
},
inputWrap:{
  flexDirection:"row",
  marginVertical: 5,
  height:null,
  backgroundColor:"transparent",
},
input:{
  flex: 1,
  paddingHorizontal: 5,
  backgroundColor:'#FFF',
  },
buttonText: {
  fontSize: 16,
  color:'#FFFFFF',
  textAlign: 'center',   
},
camera: {
  width: 50, 
  height: 50,  
},
});