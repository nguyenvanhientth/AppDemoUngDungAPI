import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import MapView,{ Marker} from 'react-native-maps';


export default class testCoords extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mapRegion: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0
      }
    }
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.00922 * 1.5,
          longitudeDelta: 0.00421 * 1.5
        }
        this.setState({ mapRegion: region })
      }, null,
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MapView
          initialRegion={this.state.mapRegion}
          style={styles.map}
          region={this.state.mapRegion}
          showsUserLocation={true}
          followUserLocation={true}
        >
          <Marker
            coordinate={{
              latitude: this.state.mapRegion.latitude,
              longitude: this.state.mapRegion.longitude
            }}>
          </Marker>
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
