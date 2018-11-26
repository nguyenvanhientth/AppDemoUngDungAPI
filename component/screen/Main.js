import React, { Component } from 'react';
import {StyleSheet,Text,View,Image,Dimensions,ActivityIndicator,Platform,Picker,
    AsyncStorage,TouchableOpacity,StatusBar,FlatList,TextInput} from 'react-native';
import HeaderNavigation from './header/HeaderNavigation';
import helper from '../helper/helper';
import env from '../environment/env';
import { red } from 'ansi-colors';

const BASE_URL = env;
var STORAGE_KEY = 'key_access_token';
const addUser = require('../image/addUser.png') ;
const company = require('../image/company.png') ;
const will = require('../image/willdo.png') ;
const list = require('../image/list.png') ;
const add = require('../image/add.png') ;
const waiting = require('../image/waiting.png') ;
const todo = require('../image/todo.png') ;
const done = require('../image/done.png') ;
const main = require('../image/home.png') ;

export default class Main extends Component {
    static navigationOptions = {
        title: 'Main',
          drawerIcon: ({icon}) =>(
            <Image source = {main} resizeMode="contain" style = {[styles.icon1]} />
        )
      };
    constructor(props) {
    super(props);
  
    this.state = {
        data: [],
        Position: '',
        companyName:'',
        addressCompany:'',
        loading: true,
        value: '',
        data1: [],
        dataName: [],
        company: '',
        supervisorName: '',
        status: [{id:0, name: 'All Status'},{id:1, name: 'Waiting'},{id:2, name: 'To do'},{id:3, name: 'Done'},{id:4, name: 'Approved'},],
    };
    this.array = [];
  }
  
    componentWillMount () {
    try {
        AsyncStorage.getItem(STORAGE_KEY).then((user_data_json) => {
            let token = user_data_json;   
            if(token === undefined){
              var { navigate } = this.props.navigation;
              navigate('LoginPage');
            }    
//-----------get data async from helper----------------------
            helper.getUser(token).then((data) => {
                this.setState({
                     Position: data.role,
                })
            });
//-----------------------------------------------------------
                helper.getRequest(token).then((data)=>{
                    this.setState({
                        data: data,
                    })
                    this.array = data;
                })        
    //-----------------------------------------------------------
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
                        data1 : [{id: 0,name: 'All Company'},...resData],
                        });
                        //console.warn('data',this.state.data);
                    })
                .catch((err) => {
                    console.warn(' loi update Area1',err);
                })
    //-------------------------------------------------------------
                helper.getSupervisor(token).then(data=> {
                    this.setState({
                        dataName : [{id: 0,supervisorFirstName: 'Supervisor',supervisorLastName: 'All'},...data],
                        })
                    })
            }).then(() => this.setState({loading: false}))       
        } 
        catch (error) {
            this.setState({loading: false});
            console.log('AsyncStorage error: ' + error.message);
        }   
    }
    
//----------------------------------------------------------------------------------
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
         <TouchableOpacity style={styles.flatview} onPress={()=>this.props.navigation.navigate('CheckedPage',{id: item.id, status: item.status})}>
            <Image style = {styles.anh} source= {{uri: item.pictureRequest[0]}}/>
            <View style = {styles.line}>
                <Text style={styles.name} > {this.cutString(item.address)}</Text>
                <Text >{this._name(item.repairPersonName,item.supervisorName)}</Text>
            </View>
            <View style = {styles.iconWrap}>{this.status(item.status)}</View>
         </TouchableOpacity>
        );
      }
    renderHeader = () => {
        return(
            <View style = {styles.seach}>
                <TextInput style = {{backgroundColor: '#fff', borderRadius: 20}} placeholder = 'Type here...' onChangeText = {(text) => this.seachName(text)} />
            </View>
        )
    };
    
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
            return <Text style={styles.title}>Supervisor: <Text style = {styles.email}>{name2}</Text></Text>
        }
        else {
            return <Text style={styles.title}>RepairPerson: <Text style = {styles.email}>{name1}</Text></Text>
        }
    }
    seachName = (text) =>{
        const newData = this.array.filter((item) => {
            const itemData = `${item.address.toUpperCase()}
            ${item.status.toUpperCase()}`;
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        this.setState({data : newData})
    }
    _seachStatus = (status) => {
        this.setState({value: status})
        if (status === 'All Status'|| status === undefined) {
            status=''
        }
        const newData = this.array.filter((item) => {
            const itemData = `${item.status.toUpperCase()}`;
            const textData = status.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            data: newData
            })
    }
    _seachCompany = async (company) =>{
        this.setState({company:company})
        if (company === 'All Company' || company === undefined) {
            company = ''
        }
        const newData = this.array.filter((item) => {
            const itemData = `${item.companyName.toUpperCase()}`;
            const textData = company.toUpperCase();
            return itemData.indexOf(textData) > -1;});
        this.setState({
            data: newData
        })
    }
    _seachSupervisor = (supervisorName)=>{
        this.setState({supervisorName:supervisorName})
        if (supervisorName === 'Supervisor All') {
            supervisorName = ''
        }
        const newData = this.array.filter((item) => {
            const itemData = `${item.supervisorName.toUpperCase()}`;
            const textData = supervisorName.toUpperCase();
            return itemData.indexOf(textData) > -1;});
        this.setState({
            data: newData
        })
    }

 render() {
    if(this.state.loading){
        return(
            <View style = {styles.background}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        )
    }
    else{
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
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style= {styles.column} activeOpacity={.5} onPress = {()=>this.props.navigation.navigate('ListCompanyPage')} keyboardShouldPersistTaps={true}>
                            <View style = {[styles.buttonAd,{backgroundColor: '#B558E8'}]}>
                                <View style={styles.iconWrap}>
                                    <Image source = {company} style = {styles.icon}/>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style = { styles.row}>
                        <TouchableOpacity style= {styles.column} activeOpacity={.5} onPress = {() =>alert('Will do')}  keyboardShouldPersistTaps={true}>
                            <View style = {[styles.buttonAd,{backgroundColor: '#6AC6E5'}]}>
                                <View style={styles.iconWrap}>
                                    <Image source = {will} style = {styles.icon}/>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style= {styles.column} activeOpacity={.5} onPress = {()=>alert('Will do')} keyboardShouldPersistTaps={true}>
                            <View style = {[styles.buttonAd,{backgroundColor:'#BEDB6E'}]}>
                                <View style={styles.iconWrap}>
                                    <Image source = {will} style = {styles.icon}/>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
            </View>
            );
        } else if(this.state.Position === "Supervisor"){
            return(
            <View style={ styles.background}>
                <StatusBar hidden={false}></StatusBar>
                <HeaderNavigation {...this.props}></HeaderNavigation>
                <View style = {styles.fuilter}>
                    <View style = {styles.viewPicker}>
                        <Picker
                            selectedValue = {this.state.value}
                            style = {styles.combobox}
                            onValueChange = {(selectedValue) => this._seachStatus(selectedValue)}
                        >
                        {
                            this.state.status.map((item,index) => {
                                return <Picker.Item key = {index} label={item.name} value = {item.name} />
                            })
                        }
                        </Picker>
                    </View>
                    <View style = {styles.viewPicker}>
                        <Picker
                            selectedValue = {this.state.company}
                            style = {styles.combobox}
                            onValueChange = {(selectedValue) =>this._seachCompany(selectedValue)}
                        >
                        {
                            this.state.data1.map((item,index) => {
                                return <Picker.Item key = {index} label={item.name} value = {item.name} />
                            })
                        }
                        </Picker>
                    </View>
                </View>
                <View style = {styles.Container}>
                {
                    this.state.data ? 
                    <FlatList
                    data={this.state.data}
                    ItemSeparatorComponent = {this.FlatListItemSeparator}
                    renderItem={this._renderList}
                    keyExtractor={item => item.id}
                    ListHeaderComponent = {this.renderHeader}

                    /> : <Text style = {styles.text}> No Request!~ </Text>
                }
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
         return(
            <View style={ styles.background}>
                <StatusBar hidden={false}></StatusBar>
                <HeaderNavigation {...this.props}></HeaderNavigation>
                <View style = {styles.fuilter}>
                    <View style = {styles.viewPicker}>
                        <Picker
                            selectedValue = {this.state.value}
                            style = {styles.combobox}
                            onValueChange = {this._seachStatus.bind(this)}
                        >
                        {
                            this.state.status.map((item,index) => {
                                return <Picker.Item key = {index} label={item.name} value = {item.name} />
                            })
                        }
                        </Picker>
                    </View>
                    <View style = {styles.viewPicker}>
                        <Picker
                            selectedValue = {this.state.supervisorName}
                            style = {styles.combobox}
                            onValueChange = {this._seachSupervisor.bind(this)}
                        >
                        {
                            this.state.dataName.map((item,index) => {
                                return <Picker.Item key = {index} label={`${item.supervisorLastName} ${item.supervisorFirstName}`} value = {`${item.supervisorFirstName} ${item.supervisorLastName}`} />
                            })
                        }
                        </Picker>
                    </View>
                </View>
                <View style = {[styles.Container]}>
                {
                    this.state.data ?
                    <FlatList
                    data={this.state.data}
                    ItemSeparatorComponent = {this.FlatListItemSeparator}
                    renderItem={this._renderList}
                    keyExtractor={item => item.id}
                    ListHeaderComponent = {this.renderHeader}

                    />:<Text style = {styles.text}>No Job</Text>
                }
                </View>
            </View>
            );
            }
        }
    } 
}

const styles = StyleSheet.create({
    Container: {
        width: Dimensions.get('window').width,
        height:  Dimensions.get('window').height,
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 10,
        paddingTop: (Platform.OS === 'ios')?20:0
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
    width: '65%',
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
    marginRight:10,
    marginLeft: 5,
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
    backgroundColor: '#F0EEEE',
    height: 36,
    flex:1,
    paddingHorizontal: 5,
    marginRight: 10,
    marginLeft: 10,
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
},
    seach: {
        marginTop: 10,
    },
    fuilter:{
        backgroundColor: '#FAFAFA',
        marginTop: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: "center"
    },
    viewPicker:{
        borderRadius: 5, 
        borderWidth: 1, 
        borderColor: 'gray',
        flex: 1, 
        justifyContent: 'center' ,
        marginLeft: 10, 
        marginRight: 10,
        height: 40
    }
});