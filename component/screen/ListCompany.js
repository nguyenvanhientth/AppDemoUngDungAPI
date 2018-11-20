import React, { Component } from "react";
import { Text, TouchableOpacity, View, StyleSheet, FlatList, AsyncStorage,
    ActivityIndicator,Image } from "react-native";
import Dialog from "react-native-dialog";
import env from '../environment/env';

const BASE_URL = env;
var STORAGE_KEY = 'key_access_token';
const edit = require('../image/edit.png') ;
const addCompany = require('../image/addCompany.png') ;
 
export default class ListChecked extends Component {
    static navigationOptions = {
        title: 'List Company',
        headerStyle: {
            backgroundColor: '#29ACE4',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
    };
    constructor(props){
        super(props);
        this.state = {
            data: [],
            dialogStatus: false,
            id:'',
            companyName:'',
            addressCompany: '',
            loading: true
            
    }
  };
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
                  data : resData,
                  loading: false
                });
                //console.warn('data',this.state.data);
            })
          .catch((err) => {
            console.warn(' loi update Area1',err);
            this.setState({loading: false});
          })
        })
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
  changeStatus =(id) =>{
    this.setState({
        dialogStatus: true,
        id: id,
    })
  }
  handleCancel = ()=>{
    this.setState({
        dialogStatus: false,
    })
  }
  handleChange = () =>{
    AsyncStorage.getItem(STORAGE_KEY).then((user_data_json) => {
        this.setState({loading: true});
        let token = user_data_json;  
        let serviceUrl = BASE_URL+  "Company/ChangeCompanyStatus";
        let id = this.state.id;
        // kiem tra o day 
          fetch(serviceUrl,{
              method: "PUT",          
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token,
              },
          body: JSON.stringify({
              'CompanyId': id,
              })
          })
              .then((responseJSON) => {  
                  //console.warn('creacte company',responseJSON)
                      if(responseJSON.ok){
                          this.componentDidMount();
                          alert('Change Success!');
                          this.setState({loading: false});
                      }
                      else {
                          alert('Change False!');
                          this.setState({loading: false});
                      }
                      
              })
              .catch((error) => {
                this.setState({loading: false});
                  console.warn('Error: ',error);
              });  
      })
      this.setState({
          dialogStatus:false,
      })
  }
    componentDidUpdate(prevProps){
        this.componentDidMount();
    }
  _renderList = ({ item }) => {
    return (
     <TouchableOpacity disabled = {this.state.loading} style={styles.flatview} 
        onLongPress = {() =>this.props.navigation.navigate('EditCompanyPage',{id:item.id,address: item.address, image: item.logo, name: item.name})}
        onPress={() =>this.props.navigation.navigate('ListUserPage',{id:item.id})}>
        <Image style = {styles.anh} source= {{uri: item.logo}} resizeMode="contain"/>
        <View style = {styles.nameList}>
            <Text style={styles.name} >{item.name}</Text>
            <Text style={styles.address} >Address: {item.address}</Text>
            <Text style={styles.status} >Status: {String(item.status)}</Text>
        </View>
        <View style = {styles.iconWrap}>
        <TouchableOpacity onPress = {()=>this.props.navigation.navigate('EditCompanyPage',{id:item.id,address: item.address, image: item.logo, name: item.name})}><Image source = {edit} style={styles.icon} /></TouchableOpacity>
        </View>
     </TouchableOpacity>
    );

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
            <View style={styles.container} > 
                <FlatList
                data={this.state.data}
                ItemSeparatorComponent = {this.FlatListItemSeparator}
                renderItem={this._renderList}
                keyExtractor={item => item.id}
                />
                <View style={styles.footer}>
                    <TouchableOpacity activeOpacity={.5} onPress = {()=>this.props.navigation.navigate('CreateCompanyPage')} keyboardShouldPersistTaps={true}>
                        <View style={[styles.button,{borderRadius: 50}]}>
                            <Image style = {[styles.iconAdd,]} resizeMode="contain" source = {addCompany} />
                        </View>   
                    </TouchableOpacity>
                </View>
                <Dialog.Container visible = {this.state.dialogStatus}>
                    <Dialog.Title> You are want change status! </Dialog.Title>
                    <Dialog.Button label="Ok" onPress={this.handleChange} />
                    <Dialog.Button label="Cancel" onPress={this.handleCancel} />
                </Dialog.Container>
            </View>
            );
        }
    }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      //alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    flatview: {
      justifyContent: 'flex-start',
      flex: 1,
      flexDirection: 'row',
      paddingRight: 100,
      paddingTop: 15,
      paddingBottom: 15
    },
    name: {
      fontFamily: 'Verdana',
      fontSize: 18,
    },
    address: {
      color: '#4000FF',
      justifyContent: 'flex-start'
    },
    status: {
        color: 'red',
        right: 0
      },
    footer: {
        position: 'absolute',
        flex:1,
        right: 0,
        bottom: 10,
    },
    icon:{
        marginTop: 10,
       width: 25,
       height: 25,
        },
    iconWrap:{
        paddingHorizontal:7,
        alignItems: "center",
        justifyContent: 'center',
        alignContent: "center",
        position: 'absolute',
        flex:1,
        right: 10,
        top: 12
        },
    nameList: {
        left: 0,
        padding: 10,
        paddingRight: 30,
    },
    anh: {
        width: 90,
        height: 90,
        borderRadius: 100
      },
    button:{
        paddingVertical: 8,
        marginVertical:3,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        marginLeft: 20,
        marginRight: 20
    },
    iconAdd:{
        marginTop: 10,
        width:50,
        height:50,
        borderRadius:50,
        },
})