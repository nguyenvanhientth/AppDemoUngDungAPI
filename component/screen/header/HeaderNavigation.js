import  React, { Component } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet} from 'react-native';
import { DrawerActions } from 'react-navigation'
import menuIcon from '../../image/menuIcon.png';

export default class HeaderNavigation extends Component {
    render() {
        const key = this.props.navigation.state ? this.props.navigation.state.key : '';
        return (
        <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.btnDrawer}
                onPress={() => {
                    this.props.navigation.dispatch(DrawerActions.openDrawer());
                }}>
                <Image style={{ width: 25, height: 25 }} source={menuIcon}/>
            </TouchableOpacity>

            <Text style={styles.titleText}>{key}</Text>
        </View>);
    }
}

const styles = StyleSheet.create({
    headerContainer:{
        height: 60,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#29ACE4',
    },
    btnDrawer:{
        marginLeft: 10, 
        marginTop: 5,
        padding: 10,
    },
    titleText:{
        position: 'absolute', 
        left: '45%',  
        fontWeight: '500', 
        fontSize: 18,
        color: '#fff'
    },
})