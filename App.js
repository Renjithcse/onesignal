/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import OneSignal from 'react-native-onesignal';
import VoipPushNotification from 'react-native-voip-push-notification';
import RNCallKit from 'react-native-callkit';

import uuid from 'uuid';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {

  constructor(properties) {
    super(properties);

    this.state = { uuid: '' };
    OneSignal.init("9c37e109-b56b-4137-a212-0b5032bc1d9b", {kOSSettingsKeyAutoPrompt : true});

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);

    // Initialise RNCallKit
    let options = {
        appName: 'RNCallKitExample',
        imageName: 'my_image_name_in_bundle',
        ringtoneSound: 'my_ringtone_sound_filename_in_bundle',
    };
    try {
        RNCallKit.setup(options);
    } catch (err) {
        console.log('error:', err.message);
    }

    // Add RNCallKit Events
    RNCallKit.addEventListener('didReceiveStartCallAction', this.onRNCallKitDidReceiveStartCallAction);
    RNCallKit.addEventListener('answerCall', this.onRNCallKitPerformAnswerCallAction);
    RNCallKit.addEventListener('endCall', this.onRNCallKitPerformEndCallAction);
    RNCallKit.addEventListener('didActivateAudioSession', this.onRNCallKitDidActivateAudioSession);
    RNCallKit.addEventListener('didDisplayIncomingCall', this.onRNCallKitDidDisplayIncomingCall);
    RNCallKit.addEventListener('didPerformSetMutedCallAction', this.onRNCallKitDidPerformSetMutedCallAction);
  }

  onRNCallKitDidReceiveStartCallAction(data) {
    /*
     * Your normal start call action
     *
     * ...
     *
     */
 
    let _uuid = uuid.v4();
    RNCallKit.startCall(_uuid, data.handle);
  }
 
  onRNCallKitPerformAnswerCallAction(data) {
    /* You will get this event when the user answer the incoming call
     *
     * Try to do your normal Answering actions here
     *
     * e.g. this.handleAnswerCall(data.callUUID);
     */
    RNCallKit.endCall(data.callUUID);
    //this.setState({ uuid:'' })
  }
 
  onRNCallKitPerformEndCallAction(data) {
    /* You will get this event when the user finish the incoming/outgoing call
     *
     * Try to do your normal Hang Up actions here
     *
     * e.g. this.handleHangUpCall(data.callUUID);
     */
  }
 
  onRNCallKitDidActivateAudioSession(data) {
    /* You will get this event when the the AudioSession has been activated by **RNCallKit**,
     * you might want to do following things when receiving this event:
     *
     * - Start playing ringback if it is an outgoing call
     */
  }
 
  onRNCallKitDidDisplayIncomingCall(error) {
    /* You will get this event after RNCallKit finishes showing incoming call UI
     * You can check if there was an error while displaying
     */
  }
 
  onRNCallKitDidPerformSetMutedCallAction(muted) {
    /* You will get this event after the system or the user mutes a call
     * You can use it to toggle the mic on your custom call UI
     */
  }
 
  // This is a fake function where you can receive incoming call notifications
  onIncomingCall() {
    // Store the generated uuid somewhere
    // You will need this when calling RNCallKit.endCall()
    let _uuid = uuid.v4();
    this.setState({ uuid: _uuid });
    RNCallKit.displayIncomingCall(_uuid, "886900000000")
  }
 
  // This is a fake function where you make outgoing calls
  onOutgoingCall() {
    // Store the generated uuid somewhere
    // You will need this when calling RNCallKit.endCall()
    let _uuid = uuid.v4();
    RNCallKit.startCall(_uuid, "886900000000")
  }
 
  // This is a fake function where you hang up calls
  onHangUpCall() {
    // get the _uuid you stored earlier
    RNCallKit.endCall(_uuid)
  }

  

  componentWillMount() { // or anywhere which is most comfortable and appropriate for you
    VoipPushNotification.requestPermissions(); // required
  
    VoipPushNotification.addEventListener('register', (token) => {

      console.log('token: ', token);
      // send token to your apn provider server
    });
 
    VoipPushNotification.addEventListener('notification', (notification) => {
      this.onIncomingCall();
      // register your VoIP client, show local notification, etc.
      // e.g.
      //this.doRegister();
      
      /* there is a boolean constant exported by this module called
       * 
       * wakeupByPush
       * 
       * you can use this constant to distinguish the app is launched
       * by VoIP push notification or not
       *
       * e.g.
       */
       if (VoipPushNotification.wakeupByPush) {
         console.log('in')

         
         // do something...
 
         // remember to set this static variable to false
         // since the constant are exported only at initialization time
         // and it will keep the same in the whole app
         VoipPushNotification.wakeupByPush = false;
       }
 
      /**
       * Local Notification Payload
       *
       * - `alertBody` : The message displayed in the notification alert.
       * - `alertAction` : The "action" displayed beneath an actionable notification. Defaults to "view";
       * - `soundName` : The sound played when the notification is fired (optional).
       * - `category`  : The category of this notification, required for actionable notifications (optional).
       * - `userInfo`  : An optional object containing additional notification data.
       */
      console.log(notification)
      VoipPushNotification.presentLocalNotification({
          alertBody: 'hello'
      });
    });
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived(notification) {
    console.log("Notification received: ", notification);
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  onIds(device) {
    console.log('Device info: ', device);
  }


  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
