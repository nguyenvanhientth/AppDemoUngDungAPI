import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView, TextInput,
  Image, TouchableOpacity, NativeModules, Dimensions, AsyncStorage
} from 'react-native';
import env from '../environment/env';

var ImagePicker = NativeModules.ImageCropPicker;
const BASE_URL = env;
var STORAGE_KEY = 'key_access_token';


export default class Finish extends Component {
  static navigationOptions = {
    title: 'Request',
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
      image: null,
      images: [],
      data:[],
      id: this.props.navigation.getParam('id'),
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
    }).catch(e => alert(e));
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
    }).catch(e => alert(e));
  }
  renderImage(image) {
    return <Image style={{width: 300, height: 300, resizeMode: 'contain',marginLeft: 10}} source={image} />
  }

  renderAsset(image) {
    return this.renderImage(image);
  }

  Upload = () => {
    AsyncStorage.getItem(STORAGE_KEY).then((user_data_json) => {
      let token = user_data_json;   
      if(token === undefined){
        var { navigate } = this.props.navigation;
        navigate('LoginPage');
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
          alert('Request Success!');
        }
          else {
            alert('Request False!');debugger;
        }
      })
      .catch((err) => {
        console.warn(' loi update image',err);
      })
    })
  }
  render() {
      return (
        <ScrollView>
          <View style= {styles.container}>
            <View style={{flex:0.5, paddingTop: 10}}>
            <ScrollView horizontal = {true}>
              {this.state.image ? this.renderAsset(this.state.image) : null}
              {this.state.images ? this.state.images.map(i => <View key={i.uri}>{this.renderAsset(i)}</View>) : null}
            </ScrollView>
            </View>
            <View>
              <View>
                <TouchableOpacity onPress={() => this.pickSingleWithCamera(false)} keyboardShouldPersistTaps={true}>
                  <View style={styles.button}>
                    <Text style={styles.buttonText}> Select image camera</Text>
                  </View>  
                </TouchableOpacity>
                <TouchableOpacity onPress={this.pickMultiple.bind(this)} style={styles.button}>
                  <Text style={styles.buttonText}>Select Multiple</Text>
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
});