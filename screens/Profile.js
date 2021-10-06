import React, { Component } from "react";
import { StyleSheet, Text, View, StatusBar, SafeAreaView, Image, Platform, Switch} from "react-native";
import firebase from "firebase";

import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { RFValue } from "react-native-responsive-fontsize";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      isEnabled:false,
      light_theme:true,
      profile_image:"",
      name:""
    };
  }

  toggleSwitch(){
    const previous_state=this.state.isEnabled
    const theme=!this.state.isEnabled?"dark":"light"
    var updates={}
    updates[
      "/users/"+firebase.auth().currentUser.uid+"/current_theme"
    ]=theme
    firebase
    .database()
    .ref()
    .update(updates)
    this.setState({isEnabled:!previous_state,light_theme:previous_state})
  }


  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser()
  }
  asyncfetchUser(){
    let theme,name,image
    awaitfirebase 
    .database()
    .ref("/users/"+firebase.auth().currentUser.uid)
    .on("value",function(snapshot){
      theme=snapshot.val().current_theme
      name=`${snapshot.val().first_name}${snapshot.val().last_name}`
      image=snapshot.val().profile_picture
    })
    this.setState({
      light_theme:theme==="light"?true:false,
      isEnabled:theme==="light"?false:true,
      name:name,
      profile_image:image
    })
  }
  render(){
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } 
    else {
      return (
        <View style={styles.container}>
          <SafeAreaView style={styles.droidSafeArea} />
            <View style={styles.appTitle}>
              <View style={styles.appIcon}>
                <Image
                  source={require("../assets/logo.png")}
                  style={styles.iconImage}
                ></Image>
              </View>
              <View style={styles.appTitleTextContainer}>
                <Text style={styles.appTitleText}>{`Storytelling\nApp`}</Text>
              </View>
            </View>
            <View style={styles.screenContainer}>
              <View style={styles.profileImageContainer}>
                <Image
                  source={{uri:this.state.profile_image}}
                  style={styles.profileImage}
                ></Image>
                  <Text style={styles.nameText}>{this.state.name}</Text>
              </View>
            </View>
            //need to be continued.............
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15193c"
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
  },
  appTitle: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center"
  },
  appIcon: {
    width: RFValue(130),
    height: RFValue(130),
    resizeMode: "contain"
  },
  appTitleText: {
    color: "white",
    textAlign: "center",
    fontSize: RFValue(40),
    fontFamily: "Bubblegum-Sans"
  },
  button:{
    width:RFValue(250),
    height:RFValue(50),
    flexDirection:"row",
    justifyContent:"space-evenly",
    alignItems:"center",
    borderRadius:RFValue(30),
    backgroundColor:"white"
  },
  googleIcon:{
    width:RFValue(30),
    height:RFValue(30),
    resizeMode:"contain"
  },
  buttonContainer:{
    flex:0.3,
    justifyContent:"center",
    alignItems:"center"
  },
  googleText:{
    fontSize:RFValue(20),
    color:"black",
    fontFamily:"Bubblegum-Sans"
  },
  cloudContainer:{
    flex:0.3,
  },
  cloudImage:{
    position:"absolute",
    width:"100%",
    resizeMode:"contain",
    bottom:RFValue(-5)
  }
});