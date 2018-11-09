import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView, TextInput,Picker,
  Image, TouchableOpacity, NativeModules, Dimensions, AsyncStorage
} from 'react-native';
import env from '../environment/env';
// import { PermissionsAndroid } from 'react-native';

// async function requestLocationPermission() {
//   try {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       {
//         'title': 'Location Permission',
//         'message': 'This app needs access to your location',
//       }
//     )
//     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//       console.log("You can use the location")
//     } else {
//       console.log("Location permission denied")
//     }
//   } catch (err) {
//     console.warn(err)
//   }
// }
var ImagePicker = NativeModules.ImageCropPicker;
const BASE_URL = env;
var STORAGE_KEY = 'key_access_token';
const company = require('../image/company.png') ;
const map = require('../image/map.jpg') ;
const submit = require('../image/submit.gif') ;


export default class App extends Component {
  static navigationOptions = {
    title: 'Create Request',
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
      content: '',
      address: '',
      company: '',
      latitude: this.props.navigation.getParam('lat'),
      longitude: this.props.navigation.getParam('long'),
      data:[],
      mapRegion: null,
    };
  }

  onRegionChange(region, lastLat, lastLong) {
    this.setState({
      mapRegion: region,
      // If there are no new values set use the the current ones
      latitude: lastLat || this.state.lastLat,
      longitude: lastLong || this.state.lastLong
    });
  }

  componentDidMount(){
    this.watchID = navigator.geolocation.watchPosition((position) => {
      // Create the object to update this.state.mapRegion through the onRegionChange function
      let region = {
        latitude:       position.coords.latitude,
        longitude:      position.coords.longitude,
        latitudeDelta:  0.00922*1.5,
        longitudeDelta: 0.00421*1.5
      }
      this.onRegionChange(region, region.latitude, region.longitude);
    });
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
                data : [{name: 'Select Company!',id:''},...resData]
              });
            //  console.warn('data',this.state.data);
          })
        .catch((err) => {
          console.warn(' loi update Area1',err);
        })
      })
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
    return <Image style={{width: 200, height: 200, resizeMode: 'contain',marginLeft: 10}} source={image} />
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
      let url = BASE_URL + 'Request/InsertRequest';
      let data = new FormData();
      const sessionId = new Date().getTime();
      data.append("Content",this.state.content);
      data.append("Address",this.state.address);
      data.append("CompanyId",this.state.company)
      data.append("LatIng_longitude",this.state.longitude);
      data.append("Latlng_latitude",this.state.latitude);
      let arrImage = [];
      this.state.image ? arrImage.push(this.state.image) : arrImage = [...this.state.images];
      //console.warn('image',arrImage);
      arrImage.map((i) =>{
        data.append("PictureRequest",{
          uri: i.uri,
          type: 'image/jpg',
          name: `${sessionId}.jpg`,
        });
      });
      console.warn('data',data);
      fetch(url,{
        method: 'POST',
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
  _updateCompany = (id) => {
    this.setState({company: id})
}
  render() {
      return (
          <View style= {[styles.container]}>
          <ScrollView>
            <View style={{flex:1, paddingTop: 10, alignItems: 'center'}}>
              <ScrollView horizontal = {true}>
                {this.state.image ? this.renderAsset(this.state.image) : null}
                {this.state.images ? this.state.images.map(i => <View key={i.uri}>{this.renderAsset(i)}</View>) : null}
              </ScrollView>
            </View>
              <TouchableOpacity onPress={() => this.pickSingleWithCamera(false)} keyboardShouldPersistTaps={true}>
                <View style={[styles.button,{backgroundColor:"#d73352",}]}>
                  <Text style={styles.buttonText}> Select image camera</Text>
                </View>  
              </TouchableOpacity>
              <TouchableOpacity onPress={this.pickMultiple.bind(this)} style={[styles.button,{backgroundColor:"#d73352",}]}>
                <Text style={styles.buttonText}>Select Multiple</Text>
              </TouchableOpacity>
            <View style={styles.inputWrap}>
                <TextInput  style={styles.input} placeholder="Content" onChangeText={(content) => this.setState({content})} underlineColorAndroid="transparent"/>
            </View>
            <View style={styles.inputWrap}>
                <TextInput  style={styles.input} placeholder="Address" onChangeText={(address) => this.setState({address})} underlineColorAndroid="transparent"/>
            </View>
            <View style={styles.inputWrap}>
                <View style={styles.iconWrap}>
                    <Image source={company} resizeMode="contain" style={styles.icon}/>
                </View>
                <Text style = {styles.label}> Company </Text>
                <Picker
                    selectedValue={this.state.company}
                    style={styles.combobox}
                    onValueChange={this._updateCompany.bind(this)}>
                    {
                        this.state.data && this.state.data.map((item,index) =>{
                            return <Picker.Item key = {index} label = {item.name} value = {item.id} />
                        })
                    }
                </Picker>
            </View>
            <View style={{flex:0.5, paddingTop: 10}}></View>
            </ScrollView>
            <View style={styles.footer}>
              <TouchableOpacity onPress={()=>{this.props.navigation.navigate('MapsPage')}} keyboardShouldPersistTaps={true}>
                  <Image source = {map} resizeMode="contain" style = {{height: 50,width:50}} />
              </TouchableOpacity>
            </View>
            <View style = {{alignItems:'center', opacity: 1}}>
              <TouchableOpacity onPress={this.Upload.bind(this)} style = {{ width: '45%',alignItems: "center", bottom: 10}}>
                <Image source = {submit} resizeMode="contain" style = {{height: 50}} />
              </TouchableOpacity>
            </View>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: '#E0F7FE',
    width: Dimensions.get('window').width,
    height:  Dimensions.get('window').height,
  },
  view: {
    flex: 1
  },
  button:{
    paddingVertical: 8,
    marginVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    marginLeft: 30,
    marginRight: 30
},
inputWrap:{
  flexDirection:"row",
  marginVertical: 5,
  height:null,
  backgroundColor:"transparent",
  marginLeft: 30,
  marginRight: 30
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
  footer: {
    position: 'absolute',
    flex:1,
    right: 0,
    bottom: 10,
    flexDirection: 'row',
    },
  combobox: {
    backgroundColor: '#848484',
    height: 36,
    flex:1,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon:{
    width: 20,
    height: 20,
  },
  iconWrap:{
    paddingHorizontal:7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:"#288BF5"
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
});