/** @format */
import React from 'react'
import {AppRegistry, Text,Image, StyleSheet } from 'react-native'
import { DrawerNavigator,StackNavigator,createDrawerNavigator,createStackNavigator} from 'react-navigation';
import {name as appName} from './app.json';

import Splash from './component/screen/Splash';
import Login from './component/screen/Login';
import ForgotPassword from './component/screen/ForgotPassword';
import Main from './component/screen/Main';
import Information from './component/screen/Information';
import ChanePassword from './component/screen/ChanePassword';
import UpdateImage from './component/screen/UpdateImage';
import SignUpPage from './component/screen/SignUpPage';
import maps from './component/screen/maps/maps';
import ListCompany from './component/screen/ListCompany';
import SelectedRequest from './component/screen/SelectedRequest';
import finish from './component/screen/finish';
import CreateCompany from './component/screen/CreateCompany';
import EditCompany from './component/screen/EditCompany';
import SiderBar from './component/SiderBar';
import ListUser from './component/screen/ListUser';

const NavigationProfile = (props) => (
  <SiderBar {...props}></SiderBar>
)

const DrawerStack = createDrawerNavigator({
  Main: { screen: Main },
  Profile: { screen: Information },
  Password: { screen: ChanePassword },
},
{
  contentComponent: NavigationProfile // edit drawer stack
})

const DrawerNavigation = createStackNavigator({
  DrawerStack: { screen: DrawerStack },
}, {
  navigationOptions: ({navigation}) => ({
     header: null,
    // headerStyle: {backgroundColor: '#1583F8',},
    // title: 'Main',
    // headerTintColor: '#fff',
    // headerTitleStyle: {
    //   fontWeight: 'bold',
    // },
    // headerRight: <Text onPress={() => navigation.openDrawer()} style = {{
    //     alignItems: 'center',
    //     width:40,height:40}}
    //     >
    //       <Image source={menuIcon} style={{width:25,height:25,}} />
    //   </Text>, 
  })
})

const login = createStackNavigator({
  SplashPage: { screen: Splash,navigationOptions: {header: null} },
  LoginPage: { screen: Login},
  ForgotPassPage: { screen: ForgotPassword },
});

const MyApp = createStackNavigator({
  drawerStack: { screen: DrawerStack,
    navigationOptions: ({navigation}) => ({
      header: null,
      // headerStyle: {backgroundColor: '#1583F8',},
      // title: 'Main',
      // headerTintColor: '#fff',
      // headerTitleStyle: {
      //   fontWeight: 'bold',
      // },
      // headerRight: <Text onPress={() => navigation.openDrawer()} style = {{
      //     alignItems: 'center',
      //     width:40,height:40}}
      //     >
      //       <Image source={menuIcon} style={{width:25,height:25,}} />
      //   </Text>, 
    })},
  UpdateImagePage: {screen: UpdateImage},
  SignUpPage:{screen: SignUpPage},
  MapsPage: {screen: maps},
  ListCompanyPage: {screen: ListCompany},
  ListUserPage:{screen: ListUser},
  CheckedPage: {screen: SelectedRequest},
  FinishPage: {screen: finish},
  CreateCompanyPage: {screen: CreateCompany },
  EditCompanyPage: {screen: EditCompany },
},);

const PrimaryNav = createStackNavigator({
  loginStack: { screen: login },
  MainStack: {screen: MyApp},
  drawerStack: { screen: DrawerNavigation, }
}, {
  // Default config for all screens
  headerMode: 'none',
  title: 'Main',
  initialRouteName: 'loginStack', 
  
})

AppRegistry.registerComponent(appName, () => PrimaryNav);