/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  AsyncStorage
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import firebase from 'react-native-firebase';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log('Fcm Token :::-> ', fcmToken);
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      console.log('Fcm Token :::-> ', fcmToken);

      if (fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      this.getToken();
    } catch (error) {
      console.log('permission rejected');
    }
  }

  async createNotificationListeners() {
    firebase.notifications().onNotification(notification => {
      console.log('Notification here :::::-> ', notification);

      notification.android.setChannelId('insider').setSound('default')
      firebase.notifications().displayNotification(notification)
    });
  }

  componentDidMount() {
    const channel = new firebase.notifications.Android.Channel('insider', 'insider channel', firebase.notifications.Android.Importance.Max)
    firebase.notifications().android.createChannel(channel);
    this.checkPermission();
    this.createNotificationListeners();
  }

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />

        <View style={styles.container}>
          <Text >It is sample application for the pushnotification </Text>
        </View>

      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lighter,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default App;
