import React, { Component } from 'react';
import {  StyleSheet, Text, View,Button } from 'react-native';
import MapView from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';


export default class testCoords extends Component {
  constructor(props){
    super(props)
  }
  state = {
    mapRegion: null,
    lastLat: null,
    lastLong: null,
  }

  componentDidMount() {
    {
      this.watchID = Geolocation.watchPosition((position) => {
        // Create the object to update this.state.mapRegion through the onRegionChange function
        let region = {
          latitude:       position.coords.latitude,
          longitude:      position.coords.longitude,
          latitudeDelta:  0.00922*1.5,
          longitudeDelta: 0.00421*1.5
        }
        this.onRegionChange(region, region.latitude, region.longitude);
      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 });
    }
  }

  onRegionChange(region, lastLat, lastLong) {
    this.setState({
      mapRegion: region,
      // If there are no new values set use the the current ones
      lastLat: lastLat || this.state.lastLat,
      lastLong: lastLong || this.state.lastLong
    });
  }

  componentWillUnmount() {
    Geolocation.clearWatch(this.watchID);
  }

  onMapPress(e) {
    // console.log(e.nativeEvent.coordinate.longitude);
    // let region = {
    //   latitude:       e.nativeEvent.coordinate.latitude,
    //   longitude:      e.nativeEvent.coordinate.longitude,
    //   latitudeDelta:  0.00922*1.5,
    //   longitudeDelta: 0.00421*1.5
    // }
    //this.onRegionChange(region, region.latitude, region.longitude);
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <MapView
          style={styles.map}
          region={this.state.mapRegion}
          showsUserLocation={true}
          followUserLocation={true}
          region = {this.state.mapRegion}
          //onRegionChange={this.onRegionChange.bind(this)}
          >
          <MapView.Marker
            coordinate={{
              latitude: (this.state.lastLat + 0.00050) || -36.82339,
              longitude: (this.state.lastLong + 0.00050) || -73.03569,
            }}>
            <View>
              <Text style={{color: '#000'}}>
                { this.state.lastLong } / { this.state.lastLat }
              </Text>
            </View>
          </MapView.Marker>
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  }
});
