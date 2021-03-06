import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView, TextInput,Picker,ActivityIndicator,
  Image, TouchableOpacity, NativeModules, ToastAndroid, AsyncStorage
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
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
const camera = require('../image/camera.png');
const photo = require('../image/photoLibrary.png');


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
      latitude: null,
      longitude: null,
      data:[],
      mapRegion: null,
      loading: true,
      opacity: 1,
    };
  }

  onRegionChange(region, lastLat, lastLong) {
    this.setState({
      mapRegion: region,
      // If there are no new values set use the the current ones
      latitude: lastLat,
      longitude: lastLong 
    });
  }
  componentDidMount(){
      Geolocation.getCurrentPosition((position) => {
      // Create the object to update this.state.mapRegion through the onRegionChange function
      let region = {
        latitude:       position.coords.latitude,
        longitude:      position.coords.longitude,
        latitudeDelta:  0.00922*1.5,
        longitudeDelta: 0.00421*1.5
      };
      this.onRegionChange(region, region.latitude, region.longitude);
    },
    (error) => {
      // See error code charts below.
      console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 });
  //-------------------------------------------------------------------------------------
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
                data : [{name: 'Select Company!',id:''},...resData],
                loading: false
              });
            //  console.warn('data',this.state.data);
          })
        .catch((err) => {
          this.setState({loading: false});
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
    }).catch(e => console.log(e));
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
    }).catch(e => console.log(e));
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
      let arrImage = [];
      this.state.image ? arrImage.push(this.state.image) : arrImage = [...this.state.images];
      if (this.state.content.length ===0 ||this.state.address.length ===0 ||
        this.state.company.length === 0|| arrImage.length === 0) {
        alert('You have not entered enough!');
      }
      else {
        this.setState({loading: true, opacity: 0.1});
        data.append("Content",this.state.content);
        data.append("Address",this.state.address);
        data.append("CompanyId",this.state.company)
        data.append("LatIng_longitude",this.state.longitude);
        data.append("Latlng_latitude",this.state.latitude);
      //console.warn('image',arrImage);
      arrImage.map((i) =>{
        data.append("PictureRequest",{
          uri: i.uri,
          type: 'image/jpg',
          name: `${sessionId}.jpg`,
        });
      });
     // console.warn('data',data);
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
        console.warn(res); 
        if(res.ok){
          var { navigate } = this.props.navigation;
          navigate('drawerStack');
          this.setState({loading: false, opacity: 1})
          ToastAndroid.show('Request Success!', ToastAndroid.CENTER);
        }
          else {
            this.setState({loading: false, opacity: 1})
            ToastAndroid.show('Request False!', ToastAndroid.CENTER);
        }
      })
      .catch((err) => {
        this.setState({loading: false, opacity: 1})
        console.warn(' Error Update image',err);
      });
      }
    })
  }
  _updateCompany = (id) => {
    this.setState({company: id});
  }
  render() {
    //------------------------------------------------
    if (this.state.loading) {
      return(
          <View style = {styles.background}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )
  } else {
      return (
          <View style= {[styles.container]}>
          <ScrollView>
            <View style={{flex:1, paddingTop: 10, alignItems: 'center'}}>
              <ScrollView horizontal = {true}>
                {this.state.image ? this.renderAsset(this.state.image) : null}
                {this.state.images ? this.state.images.map(i => <View key={i.uri}>{this.renderAsset(i)}</View>) : null}
              </ScrollView>
            </View>
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
            <View style={{flex: 1, flexDirection: "row",margin: 20, alignItems: "center"}}>
              {this.state.latitude ? <Text style={[styles.input,{padding: 5, fontSize: 15}]}>Latitude: {this.state.latitude}</Text> 
                  : <Text style={[styles.input,{padding: 5, fontSize: 15}]}>Latitude: Loading...</Text> }
              {this.state.longitude ? <Text style={[styles.input,{padding: 5, fontSize: 15}]}>Longitude: {this.state.longitude}</Text> 
                  : <Text style={[styles.input,{padding: 5, fontSize: 15}]}>Longitude: Loading...</Text> }
            </View>
            <View style = {{flexDirection: 'row', alignItems: 'center',alignContent: 'center', justifyContent: 'center'}}>
            <TouchableOpacity onPress={() => this.pickSingleWithCamera(false)} keyboardShouldPersistTaps={true}>
              <View style={[styles.button]}>
                <Image style = {styles.camera} resizeMode="contain" source = {camera} />
              </View>  
            </TouchableOpacity>
            <TouchableOpacity onPress={this.pickMultiple.bind(this)}>
              <View style={[styles.button]}>
                <Image style = {styles.camera} resizeMode="contain" source = {photo}/>
              </View>
            </TouchableOpacity>
            </View>
            </ScrollView>
            <View style={styles.footer}>
              <TouchableOpacity onPress={()=>{this.props.navigation.navigate('MapsPage')}} keyboardShouldPersistTaps={true}>
                  <Image source = {map} resizeMode="contain" style = {{height: 50,width:50}} />
              </TouchableOpacity>
            </View>
            <View style = {{alignItems:'center', opacity: 1}}>
              <TouchableOpacity disabled = {this.state.loading} onPress={()=>this.Upload()} style = {{ width: '45%',alignItems: "center", bottom: 10,borderRadius: 10, backgroundColor: '#2ECCFA',
                opacity: this.state.opacity}}>
                <Text style = {{fontSize: 20, padding: 10 }}>Submit</Text>
              </TouchableOpacity>
            </View>
        </View>
      );
    } 
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: '#E0F7FE',
  },
  background:{
    flex: 1,
    justifyContent:'center',
    backgroundColor: '#ECF8FB'
  },
  view: {
    flex: 1
  },
  button:{
    borderRadius: 30,
    margin: 30
},
inputWrap:{
  flexDirection:"row",
  marginVertical: 5,
  height:null,
  backgroundColor:"transparent",
  marginLeft: 30,
  marginRight: 30,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.8,
  shadowRadius: 2,
  elevation: 15,
},
input:{
  flex: 1,
  paddingHorizontal: 5,
  backgroundColor:'#FFF',
  borderRadius: 25,
  },
camera: {
  width: 50, 
  height: 50,  
},
  footer: {
    position: 'absolute',
    flex:1,
    right: 10,
    bottom: 15,
    flexDirection: 'row',
    },
  combobox: {
    backgroundColor: '#848484',
    height: 36,
    flex:1,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon:{
    width: 20,
    height: 20,
  },
  iconWrap:{
    paddingHorizontal:7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:"#288BF5",
    borderRadius: 5,
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