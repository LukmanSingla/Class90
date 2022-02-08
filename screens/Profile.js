import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  Switch,
} from "react-native";
import firebase from "firebase";
import { RFValue } from "react-native-responsive-fontsize";

import AppLoading from "expo-app-loading";
import { DarkTheme } from "@react-navigation/native";
import * as Font from "expo-font";
import { isEnabled } from "react-native/Libraries/Performance/Systrace";
let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf"),
};
var theme;
export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      darkTheme: true,
      name: "",
      isEnabled: false,
      profileImg: "",
    };
  }
  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }
  fetchUser = async () => {
    var name, img;
    await firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid)
      .on("value", function (snapshot) {
        // alert(snapshot.val()[firebase.auth().currentUser.uid].current_theme);
        theme = snapshot.val().current_theme;
        name = `${snapshot.val().first_name} ${snapshot.val().last_name}`;
        img = snapshot.val().profile_picture;
      });
    this.setState({
      darkTheme: theme === "dark" ? true : false,
      name: name,
      profileImg: img,
      isEnabled: theme === "dark" ? false : true,
    });
  };
  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
  }
  toggleSwitch() {
    var updates = {};
    const theme = !this.state.isEnabled ? "light" : "dark";
    updates["/users/" + firebase.auth().currentUser.uid + "/current_theme"] =
      theme;
    firebase.database().ref().update(updates);
    this.setState({
      isEnabled: !this.state.isEnabled,
      darkTheme: !this.state.darkTheme,
    });
  }
  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View
          style={
            this.state.darkTheme ? styles.container : styles.containerLight
          }
        >
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.iconImage}
              ></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text
                style={
                  this.state.darkTheme
                    ? styles.appTitleText
                    : styles.appTitleTextLight
                }
              >
                Storytelling App
              </Text>
            </View>
          </View>
          <View style={styles.screenContainer}>
            <View style={styles.profileContainer}>
              <Image
                source={{ uri: this.state.profileImg }}
                style={styles.profilePic}
              ></Image>
              <Text
                style={this.state.darkTheme ? styles.name : styles.nameLight}
              >
                {this.state.name}
              </Text>
            </View>
            <View style={styles.themeContainer}>
              <Text
                style={
                  this.state.darkTheme
                    ? styles.themeText
                    : styles.themeTextLight
                }
              >
                Dark Theme
              </Text>
              <Switch
                trackColor={{ false: "#767577", true: "#ffffff" }}
                thumbColor={this.state.darkTheme ? "#ee8249" : "#f4f3f4"}
                onValueChange={() => {
                  this.toggleSwitch();
                }}
                value={this.state.darkTheme}
              ></Switch>
            </View>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  droidSafeArea: {
    marginTop:
      Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35),
  },
  container: {
    flex: 1,
    backgroundColor: "#15193c",
  },
  containerLight: {
    flex: 1,
    backgroundColor: "white",
  },
  appTitle: {
    flex: 0.07,
    flexDirection: "row",
  },
  appIcon: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  iconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: "center",
  },
  appTitleText: {
    color: "white",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans",
  },
  appTitleTextLight: {
    color: "black",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans",
  },
  screenContainer: {
    flex: 0.85,
  },
  themeContainer: {
    flex: 0.2,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
    alignItems: "center",
  },
  profileContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  profilePic: {
    height: RFValue(100),
    width: RFValue(100),
    borderRadius: RFValue(50),
  },
  name: {
    color: "#ffffff",
    fontSize: 35,
    fontFamily: "Bubblegum-Sans",
    marginTop: 10,
  },
  nameLight: {
    color: "#000000",
    fontSize: 35,
    fontFamily: "Bubblegum-Sans",
    marginTop: 10,
  },
  themeText: {
    color: "white",
    fontFamily: "Bubblegum-Sans",
    marginTop: 10,
    fontSize: 25,
  },

  themeTextLight: {
    color: "black",
    fontFamily: "Bubblegum-Sans",
    marginTop: 10,
    fontSize: 25,
  },
});
