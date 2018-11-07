import React, { Component } from 'react';
import {StyleSheet,Text,View,Image,Dimensions,
    AsyncStorage,TouchableOpacity,StatusBar,FlatList} from 'react-native';
import env from '../environment/env';
import HeaderNavigation from './header/HeaderNavigation';

var STORAGE_KEY = 'key_access_token';
const background = require('../image/hinhnen.png') ;
const addUser = require('../image/addUser.png') ;
const company = require('../image/company.png') ;
const addCompany = require('../image/addCompany.png') ;
const list = require('../image/list.png') ;
const add = require('../image/add.png') ;
const waiting = require('../image/waiting.png') ;
const todo = require('../image/todo.png') ;
const done = require('../image/done.png') ;
const main = require('../image/home.png') ;
const BASE_URL = env;

export default class Main extends Component {
    static navigationOptions = {
        title: 'Main',
          drawerIcon: ({icon}) =>(
            <Image source = {main} resizeMode="contain" style = {[styles.icon1,]} />
        )
      };
    constructor(props) {
    super(props);
  
    this.state = {
        data: [],
        Position: '',
        companyName:'',
        addressCompany:'',
    };
  }
  
  componentWillMount() {
    try {
        AsyncStorage.getItem(STORAGE_KEY).then((user_data_json) => {
            let token = user_data_json;   
            if(token === undefined){
              var { navigate } = this.props.navigation;
              navigate('LoginPage');
            }    
            let url = BASE_URL + 'Request/GetRequest';
            fetch(url,{
                headers: {
                  'cache-control': 'no-cache',
                  Authorization: 'Bearer ' + token,
                  },
              })
              .then((res) => res.json())
              .then((resData) => { 
                  this.setState({
                      data : resData
                    });
                    //console.warn('data',this.state.data);
                })
              .catch((err) => {
                console.warn('Error',err);
              })
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
                    });   
                   // console.warn(this.state.Position)    
                })
                .catch ((error) => {
                    console.warn('AsyncStorage error:' + error.message);
                }) 
            })
            //Get position        
        } catch (error) {
        console.log('AsyncStorage error: ' + error.message);
        }   
    }
    cutString = (string) =>{
        var n = string.length;
        var address  = '';
        for (let index = 0; index < n; index++) {
            if (string[index] === ','){
                break;
            }
            address = address + string[index]
        }
        return address;
    }
    //----------------------------------------------------------------------------------------------
    _renderList = ({ item }) => {
        return (
         <TouchableOpacity style={styles.flatview} onPress={()=>this.props.navigation.navigate('CheckedPage',{id: item.id})}>
            <Image style = {styles.anh} source= {{uri: item.pictureRequest[0]}}/>
            <View style = {styles.line}>
                <Text style={styles.name} > {this.cutString(item.address)}</Text>
                <Text >{this._name(item.repairPersonName,item.supervisorName)}</Text>
                <View style = {styles.iconWrap}>{this.status(item.status)}</View>
            </View>
         </TouchableOpacity>
        );
      }
      FlatListItemSeparator = () => {
        return (
          <View
            style={{
              height: 1,
              flex: 1,
              backgroundColor: "#607D8B",
              paddingHorizontal: 5,
            }}
          />
        );
      }
    _onPressLogOut () {
        try {
             AsyncStorage.removeItem(STORAGE_KEY);
             var { navigate } = this.props.navigation;
             navigate('LoginPage');
         } catch (error) {
             console.log('AsyncStorage error: ' + error.message);
         }   
     }
    status = (status) =>{
        if(status === 'Waiting'){
          return <Image style = {styles.status} source = {waiting}/>
        }
        else if (status === 'To Do'){
          return <Image style = {styles.status} source = {todo}/>
        }
        else 
        return <Image style = {styles.status} source = {done}/>
      }
    _name = (name1,name2) =>{
        if(name1 === null){
            return <Text style={styles.title}>SupervisorName: <Text style = {styles.email}>{name2}</Text></Text>
        }
        else {
            return <Text style={styles.title}>RepairPersonName: <Text style = {styles.email}>{name1}</Text></Text>
        }
    }

 render() {
     if (this.state.Position === "Admin") {
        return (
            <View style={ styles.background}>
                <StatusBar hidden={false}></StatusBar>
                <HeaderNavigation {...this.props}></HeaderNavigation>
                <View style = { styles.row}>
                    <TouchableOpacity style= {styles.column} activeOpacity={.5} onPress = {()=>this.props.navigation.navigate('SignUpPage')}  keyboardShouldPersistTaps={true}>
                        <View style = {[styles.buttonAd,{backgroundColor:'#08B358'}]}>
                            <View style={styles.iconWrap}>
                                <Image source = {addUser} style = {styles.icon}/>
                            </View>
                            <Text style = {styles.textAd}> Create User </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style= {styles.column} activeOpacity={.5} onPress = {()=>this.props.navigation.navigate('CreateCompanyPage')} keyboardShouldPersistTaps={true}>
                        <View style = {[styles.buttonAd,{backgroundColor: '#B558E8'}]}>
                            <View style={styles.iconWrap}>
                                <Image source = {company} style = {styles.icon}/>
                            </View>
                            <Text style = {styles.textAd}> Create Company </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style = { styles.row}>
                    <TouchableOpacity style= {styles.column} activeOpacity={.5} onPress = {() =>this.props.navigation.navigate('ListCompanyPage')}  keyboardShouldPersistTaps={true}>
                        <View style = {[styles.buttonAd,{backgroundColor: '#6AC6E5'}]}>
                            <View style={styles.iconWrap}>
                                <Image source = {list} style = {styles.icon}/>
                            </View>
                            <Text style = {styles.textAd}> List Company </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style= {styles.column} activeOpacity={.5} onPress = {this._onPressLogOut.bind(this)} keyboardShouldPersistTaps={true}>
                        <View style = {[styles.buttonAd,{backgroundColor:'#BEDB6E'}]}>
                            <View style={styles.iconWrap}>
                                <Image source = {addCompany} style = {styles.icon}/>
                            </View>
                            <Text style = {styles.textAd}> Company for User </Text>
                        </View>
                    </TouchableOpacity>
                </View>
           </View>
        );
     } else if(this.state.Position === "Supervisor"){
         if(this.state.data.length === 0){
            return (
                <View style={ styles.background}>
                    <StatusBar hidden={false}></StatusBar>
                    <HeaderNavigation {...this.props}></HeaderNavigation>
                    <Text style = {styles.text}> No Request!~ </Text>
                    <View style={styles.footer}>
                        <TouchableOpacity activeOpacity={.5} onPress={()=>this.props.navigation.navigate('UpdateImagePage')} keyboardShouldPersistTaps={true}>
                            <View style={styles.button}>
                                <Image style = {styles.iconAdd} source= {add} />
                            </View>   
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
        else return(
        <View style={ styles.background}>
            <StatusBar hidden={false}></StatusBar>
            <HeaderNavigation {...this.props}></HeaderNavigation>
            <View style = {styles.Container}>
                <FlatList
                data={this.state.data}
                ItemSeparatorComponent = {this.FlatListItemSeparator}
                renderItem={this._renderList}
                keyExtractor={item => item.address}
                />
            </View>
            <View style={styles.footer}>
                <TouchableOpacity activeOpacity={.5} onPress={()=>this.props.navigation.navigate('UpdateImagePage')} keyboardShouldPersistTaps={true}>
                    <View style={styles.button}>
                        <Image style = {styles.iconAdd} source= {add} />
                    </View>   
                </TouchableOpacity>
            </View>
        </View>
        );
    }
    else {
        if(this.state.data.length === 0){
            return (
                <View style={ styles.background}>
                    <StatusBar hidden={false}></StatusBar>
                    <HeaderNavigation {...this.props}></HeaderNavigation>
                    {/* <Text style={styles.h2text}> Job </Text> */}
                    <Text style = {styles.text}> No Job!~ </Text>
                </View>
            );
        }
        else return(
        <View style={ styles.background}>
            <StatusBar hidden={false}></StatusBar>
            <HeaderNavigation {...this.props}></HeaderNavigation>
            <View style = {styles.Container}>
                <FlatList
                data={this.state.data}
                ItemSeparatorComponent = {this.FlatListItemSeparator}
                renderItem={this._renderList}
                keyExtractor={item => item.address}
                />
            </View>
        </View>
        );
    }
  } 
}
 
const styles = StyleSheet.create({
    Container: {
        width: Dimensions.get('window').width,
        height:  Dimensions.get('window').height,
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingLeft: 10
    },
  footer: {
    position: 'absolute',
    flex:1,
    right: 0,
    bottom: 15,
    },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    flexDirection: 'column',
    alignContent:'center',
    backgroundColor:'#CED8F6',
    margin: 10,
    borderRadius: 20
  },
  line: {
    paddingLeft: 10,
    width: '75%'
  },
  background:{
    flex: 1,
    justifyContent:'center',
    backgroundColor: '#ECF8FB'
  },
  iconWrap:{
    paddingHorizontal:7,
    alignItems: "center",
    justifyContent: "center",
    },
  icon:{
    width:100,
    height:100,
    },
    iconAdd:{
        marginTop: 10,
        width:50,
        height:50,
        },
  wrapper:{
      paddingHorizontal:15,
  },
  flatview: {
    paddingTop: 10,
    paddingBottom: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems:'center',
  },
name: {
    fontFamily: 'Verdana',
    fontSize: 18,
    color:'#424040',
    fontWeight: '100',
  },
  title: {
    color: 'black',
    fontWeight: '100'
  },
email: {
    color: 'blue'
  },
button:{
    paddingVertical: 8,
    marginVertical:3,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    marginLeft: 20,
    marginRight: 20,
    padding: 15,
},
buttonAd:{
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    borderRadius:5
},
  buttonText: {
      fontSize: 16,
      color:'#FFFFFF',
      textAlign: 'center',   
  },
  text: {
    color: 'gray',
    fontSize: 20,
    textAlign: 'center'
  },
  textAd: {
    color: '#616555',
    fontSize: 15,
    textAlign: 'center'
  },
  h2text: {
    marginTop: 10,
    fontFamily: 'Helvetica',
    fontSize: 36,
    fontWeight: 'bold',
    alignItems: 'center',
    textAlign: 'center',

  },
  combobox: {
    backgroundColor: '#848484',
    height: 36,
    flex:1,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
      textAlign: "center",
      fontSize: 26,
      fontWeight: "bold"
  },
  anh: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  status: {
    width: 30,
    height: 30,
    position: 'absolute',
    right: 0,
    bottom: -10,
  },
  icon1: {
    width: 25,
    height: 25
}
});