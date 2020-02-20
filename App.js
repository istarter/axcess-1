import * as React from 'react';
import {
  Button,
  View,
  Text,
  TextInput,
  TouchableHighlight,
  Image,
  Alert,
  ImageBackground,
  StyleSheet,
  Dimensions
} from 'react-native';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';

// import { LoginButton, AccessToken } from 'react-native-fbsdk';
import { SocialIcon } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import bgImage from './assets/logo1.jpg';
import moment from "moment";

const { width: WIDTH } = Dimensions.get('window');

const FBSDK = require('react-native-fbsdk');
const {
  LoginManager,
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} = FBSDK;


class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
        <Button
          title="Go to Details"
          onPress={() => this.props.navigation.navigate('FirstScreen')}
        />
      </View>
    );
  }
}

class DetailsScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Details Screen</Text>
        <Button
          title="Go to Details... again"
          onPress={() => this.props.navigation.push('Details')}
        />
        <Button
          title="Go to Home"
          onPress={() => this.props.navigation.navigate('Home')}
        />
        <Button
          title="Go back"
          onPress={() => this.props.navigation.goBack()}
        />
      </View>
    );
  }
}


class FirstScreen extends React.Component {


  constructor(props) {
    super(props)
    this.state = {
      email: "",
      photo: "",
      name: "",
      facebookName: "",
      userInfo: {}
    }
  }

  componentDidMount() {
    GoogleSignin.configure();
  }


  handleFacebookLogin() {

    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      function (result) {
        readPermissions = ['public_profile']
        if (result.isCancelled) {
          alert('Login was cancelled');
        } else {
          readPermissions = ['public_profile']
          AccessToken.getCurrentAccessToken().then(data => {
            console.log(data.accessToken.toString());

            const processRequest = new GraphRequest(
              '/me?fields=name,email,picture.type(large)',
              null,
              this.get_Response_Info
            );
            // Start the graph request.
            new GraphRequestManager().addRequest(processRequest).start();

          });
        }
      },
      function (error) {
        alert('Login failed with error: ' + error);
      }
    );
  }

  // constructor() {
  //   super();
  //   this.state = {

  //     user_name: '',
  //     avatar_url: '',
  //     avatar_show: false
  //   }
  // }

  get_Response_Info = (error, result) => {
    if (error) {
      Alert.alert('Error fetching data: ' + error.toString());
    } else {

      this.setState({ name: 'Welcome' + ' ' + result.name });

      this.setState({ photo: result.picture.data.url });

      this.setState({ avatar_show: true })

      console.log(result);

      this.props.navigation.navigate('LandingPage', {
        user_name: result.name,
        user_email: result.email,
        user_photo: result.picture.data.url,
      })

    }
  }

  onLogout = () => {

    this.setState({ user_name: null, avatar_url: null, avatar_show: false });

  }




  // Somewhere in your code
  _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo)
      this.setState({
        name: userInfo.user.name,
        email: userInfo.user.email,
        photo: userInfo.user.photo,
      });

      this.props.navigation.navigate('LandingPage', {
        user_name: userInfo.user.name,
        user_email: userInfo.user.email,
        user_photo: userInfo.user.photo,
      })

    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
      console.log(error)
    }
  };


  signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.setState({ user: null }); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };



  onClickListener = (viewId) => {
    Alert.alert("Alert", "Button pressed " + viewId);
  }
  render() {
    return (
      <ImageBackground source={bgImage} style={styles.container}>

        <View>
          <Image
            style={styles.stretch}
            source={require('./assets/logo.png')}
          />
        </View>


        <View style={styles.introTextDiv}>
          <Text style={styles.introText}>Find Clubs,Bars and related tickest,Tables,{'\n'} Meals,Drinks and muchmore...</Text>
        </View>

        {/* <View style={styles.buttonContainer}> */}
        <SocialIcon style={[styles.buttonContainer, styles.socialButton]}
          title='Sign In with Facebook'
          button
          type='facebook'
          light={true}
          readPermissions={['public_profile','email']}
          onPress={this.handleFacebookLogin}
        />
        {/* </View> */}

        {/* <View style={styles.buttonContainer}> */}
        <SocialIcon style={[styles.buttonContainer, styles.socialButton]}
          title='Sign In with Google'
          button
          type='google'
          light={true}
          onPress={this._signIn}
        // onPress={() => this.props.navigation.navigate('LandingPage')}
        />

        {/* <Text>{this.state.name}</Text>
        <Text>{this.state.email}</Text> */}






        {/* </View> */}

        <TouchableHighlight style={[styles.buttonContainer, styles.socialButton]} onPress={() => this.props.navigation.navigate('LogInScreen')}>
          <Text style={styles.SignUpText}>Sign Up</Text>
        </TouchableHighlight>

        <View width={WIDTH - 120}>
          <Text style={styles.verificationText}> Enter your Email address and we will send you a cerification code. So that you can able to change the password.</Text>
        </View>

        <View style={{ opacity: 0 }}>
          <LoginButton
            readPermissions={['public_profile', 'email']}
            onLoginFinished={(error, result) => {
              if (error) {
                console.log(error.message);
                console.log('login has error: ' + result.error);
              } else if (result.isCancelled) {
                console.log('login is cancelled.');
              } else {
                AccessToken.getCurrentAccessToken().then(data => {
                  console.log(data.accessToken.toString());

                  const processRequest = new GraphRequest(
                    '/me?fields=name,email,picture.type(large)',
                    null,
                    this.get_Response_Info
                  );
                  // Start the graph request.
                  new GraphRequestManager().addRequest(processRequest).start();

                });
              }
            }}
            onLogoutFinished={this.onLogout}
          />
        </View>


      </ImageBackground>
    );
  }
}

class LogInScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      TextInputName: '',
      TextInputEmail: '',
      TextInputPassword: '',
    };
  }

  CheckTextInput = () => {
    //Handler for the Submit onPress
    if (this.state.TextInputName != '') {
      //Check for the Name TextInput
      if (this.state.TextInputEmail != '') {

        if (!this.isEmailValid){ 
          alert('Please Enter Valid Email');
        }else{

        //Check for the Email TextInput
        if (this.state.TextInputPassword != '') {
          this.props.navigation.navigate('VerificationScreen')
        } else {
          alert('Please Enter Password');
        }
      } 
    }else {
        alert('Please Enter Email');
      }
    } else {
      alert('Please Enter Name');
    }
  };

  isEmailValid = () => {
    let email = this.state.TextInputEmail
    let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(String(email).toLowerCase())
  }


  onClickListener = (viewId) => {
    Alert.alert("Alert", "Button pressed " + viewId);
  }


  render() {
    return (

      <ImageBackground source={bgImage} style={styles.container}>

        <View>
          <Image
            style={styles.stretch}
            // source={require('./assets/logo.png')}
            source={require('./assets/Mockup.jpg')}
          />
        </View>


        <View style={styles.introTextDiv}>
          <Text style={styles.introText}>Find Clubs,Bars and related tickest,Tables,{'\n'} Meals,Drinks and muchmore...</Text>
        </View>


        <View style={styles.inputContainer}>
        
          <Icon name={'ios-person'} size={24} color={'#212121'} style={styles.inputIcon2} />
          
          <TextInput style={styles.inputs2}
            placeholder="Enter Your Name"
            keyboardType="default"
            underlineColorAndroid='transparent'
            onChangeText={TextInputName => this.setState({ TextInputName })}

          />
        </View>


        <View style={styles.inputContainer}>

          <Icon name={'ios-mail'} size={24} color={'#212121'} style={styles.inputIcon2} />
          <TextInput style={styles.inputs2}
            placeholder="Email"
            keyboardType="email-address"
            underlineColorAndroid='transparent'
            onChangeText={TextInputEmail => this.setState({ TextInputEmail })} />
        </View>


        <View style={styles.inputContainer}>

          <Icon name={'ios-lock'} size={24} style={styles.inputIcon2} />

          <TextInput style={styles.inputs2}
            placeholder="Password"
            keyboardType="default"
            underlineColorAndroid='transparent'
            secureTextEntry={true}
            onChangeText={TextInputPassword => this.setState({ TextInputPassword })} />
        </View>


        <View style={styles.secondryBtnView}>

          <TouchableHighlight style={[styles.secondryButton, styles.WhitwBgButton]} onPress={() => this.props.navigation.navigate('FirstScreen')}>
            <Text style={styles.WhiteButtonWithRedText}>Cancel</Text>
          </TouchableHighlight>

          <TouchableHighlight style={[styles.secondryButton, styles.WhitwBgButton]} onPress={this.CheckTextInput}>
            <Text >Sign Up </Text>
          </TouchableHighlight>

        </View>


        <View>

          <TouchableHighlight onPress={() => this.props.navigation.navigate('SignInView')}>
            <Text>
              <Text style={styles.forgotText}>ALREADY REGISTERED? </Text>
              <Text style={styles.UnderLineText}>SIGN IN</Text>
            </Text>
          </TouchableHighlight>
        </View>

      </ImageBackground>

    );

  }
}

class VerificationScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      verificationCode: '',
      eventDate: moment.duration().add({ minutes: 0, seconds: 59 }), // add 9 full days

      mins: 0,
      secs: 0
    };
  }

  // state={

  // }

  componentDidMount() {
    this.updateTimer()
  }
  updateTimer = () => {

    const x = setInterval(() => {
      let { eventDate } = this.state

      if (eventDate <= 0) {
        clearInterval(x)
      } else {
        eventDate = eventDate.subtract(1, "s")

        const mins = eventDate.minutes()
        const secs = eventDate.seconds()

        this.setState({

          mins,
          secs,
          eventDate
        })
      }
    }, 1000)

  }

  CheckCodeInput = () => {
    //Handler for the Submit onPress
    if (this.state.verificationCode != '') {

      this.props.navigation.navigate('SignInView')
    } else {
      alert('Please Enter Verification Code');
    }

  };

  onClickListener = (viewId) => {
    Alert.alert("Alert", "Button pressed " + viewId);
  }

  render() {
    const { mins, secs } = this.state
    return (

      <ImageBackground source={bgImage} style={styles.container}>

        <View>
          <Image
            style={styles.stretch}
            source={require('./assets/logo.png')}
          />
        </View>


        <View style={styles.introTextDiv}>
          <Text style={styles.introText}>Find Clubs,Bars and related tickest,Tables,{'\n'} Meals,Drinks and muchmore...</Text>
        </View>


        <View style={styles.inputContainer}>
          <TextInput style={styles.inputs2}
            placeholder="Enter Verification Code"
            keyboardType="default"
            underlineColorAndroid='transparent'
            onChangeText={(verificationCode) => this.setState({ verificationCode })} />
        </View>

        <TouchableHighlight style={[styles.buttonContainer, styles.WhitwBgButton]} onPress={this.CheckCodeInput}>
          <Text style={styles.WhiteButtonWithRedText}>NEXT </Text>

        </TouchableHighlight>

        <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.props.navigation.navigate('FirstScreen')}>
          <Text style={styles.loginText}>Resend Code in  0{`${mins} : ${secs}`}</Text>
        </TouchableHighlight>

        <View width={WIDTH - 120}>
          <Text style={styles.verificationText}> we have sent you a verification code at your email.{'\n'}Please enter the verification code to activate your account</Text>
        </View>

      </ImageBackground>

    );
  }
}


class SignInView extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      EmailInput: '',
      PasswordInput: '',
    };
  }

  CheckTextInput = () => {
    //Handler for the Submit onPress

    if (this.state.EmailInput != '') {
      //Check for the Email TextInput
      if (this.state.PasswordInput != '') {
        this.onClickListener("MainPage")
      } else {
        alert('Please Enter Password');
      }
    } else {
      alert('Please Enter Email');
    }

  };

  onClickListener = (viewId) => {
    Alert.alert("Alert", "Button pressed " + viewId);
  }

  render() {
    return (

      <ImageBackground source={bgImage} style={styles.container}>

        <View>
          <Image
            style={styles.stretch}
            source={require('./assets/logo.png')}
          />
        </View>


        <View style={styles.introTextDiv}>
          <Text style={styles.introText}>Find Clubs,Bars and related tickest,Tables,{'\n'} Meals,Drinks and muchmore...</Text>
        </View>


        <View style={styles.inputContainer}>

          <Icon name={'ios-person'} size={24} color={'#212121'} style={styles.inputIcon2} />
          <TextInput style={styles.inputs2}
            placeholder="Email"
            keyboardType="email-address"
            underlineColorAndroid='transparent'
            onChangeText={(EmailInput) => this.setState({ EmailInput })} />
        </View>


        <View style={styles.inputContainer}>

          <Icon name={'ios-lock'} size={24} style={styles.inputIcon2} />

          <TextInput style={styles.inputs2}
            placeholder="Password"
            keyboardType="email-address"
            underlineColorAndroid='transparent'
            onChangeText={(PasswordInput) => this.setState({ PasswordInput })} />
        </View>

        <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={this.CheckTextInput}>
          <Text style={styles.loginText}>Get Started</Text>
        </TouchableHighlight>

        <View>

          <TouchableHighlight onPress={() => this.props.navigation.navigate('ResetScreen')}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableHighlight>
        </View>


        <View style={styles.secondryBtnView}>

          <SocialIcon style={styles.secondryButton}
            title=' Facebook'
            button
            type='facebook'
            onPress={() => this.props.navigation.navigate('LandingPage')}
          />

          <SocialIcon style={styles.secondryButton}
            title=' Google'
            button
            type='google'
            onPress={() => this.props.navigation.navigate('LandingPage')}
          />



        </View>
      </ImageBackground>


    );
  }
}


class ResetScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      EmailReset: '',

    };
  }

  CheckTextInput = () => {
    //Handler for the Submit onPress

    if (this.state.EmailReset != '') {
      //Check for the Email TextInput
      this.navigation.navigate('SignInView')
    } else {
      alert('Please Enter Email');
    }

  };
  onClickListener = (viewId) => {
    Alert.alert("Alert", "Button pressed " + viewId);
  }


  render() {
    return (

      <ImageBackground source={bgImage} style={styles.container}>

        <View>
          <Image
            style={styles.stretch}
            source={require('./assets/logo.png')}
          />
        </View>


        <View style={styles.introTextDiv}>
          <Text style={styles.introText}>Find Clubs,Bars and related tickest,Tables,{'\n'} Meals,Drinks and muchmore...</Text>
        </View>




        <View style={styles.inputContainer}>

          <Icon name={'ios-mail'} size={24} color={'#212121'} style={styles.inputIcon2} />
          <TextInput style={styles.inputs2}
            placeholder="Email"
            keyboardType="email-address"
            underlineColorAndroid='transparent'
            onChangeText={(EmailReset) => this.setState({ EmailReset })} />
        </View>


        <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.props.navigation.navigate('FirstScreen')}>
          <Text style={styles.loginText}>Request a password reset</Text>
        </TouchableHighlight>

        <View width={WIDTH - 120}>
          <Text style={styles.verificationText}> Enter your Email address and we will send you a cerification code. So that you can able to change the password.</Text>
        </View>

      </ImageBackground>

    );
  }
}


class LandingPage extends React.Component {

  render() {
    const { navigation } = this.props;
    return (
      <>
        <ImageBackground source={bgImage} style={styles.container}>
          <View style={styles.landingPageContainer}>

            <Text style={styles.text}>Welcom to AXESS</Text>

            <Image
              // source={{ uri: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/old_logo.png', }}
              source={{ uri: navigation.getParam('user_photo', 'Default'), }}
              //borderRadius style will help us make the Round Shape Image
              style={{ width: 200, height: 200, borderRadius: 200 / 2 }}
            />

            <Text style={{marginTop: 30, fontSize: 20,color: 'white',}}> {JSON.stringify(navigation.getParam('user_name', 'Default'))} </Text>
            <Text style={{marginTop: 30, fontSize: 20,color: 'white',}}> {navigation.getParam('user_email', 'Default')} </Text>

          </View>
        </ImageBackground>
      </>
    );
  }
};





const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',

  },

  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    width: "90%",
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
  },

  SeparatorLine: {

    backgroundColor: '#000000',
    width: 3,
    height: 40

  },

  socialBtnContainer: {
    borderBottomColor: '#F5FCFF',
    borderRadius: 30,
    width: "90%",
    margin: 10,
    height: 45,
    flexDirection: 'row',

  },

  buttonContainer: {
    height: 45,
    width: "90%",
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 30,
    borderBottomWidth: 0,
  },

  forgotButton: {
    height: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 10,
    width: "30%",
  },

  forgotText: {
    fontSize: 12,
    color: "white",
    marginBottom: 10,
    justifyContent: "flex-start"
  },

  verificationText: {
    fontSize: 10,
    color: "white",
    justifyContent: "flex-start"
  },

  UnderLineText: {
    fontSize: 12,
    color: "white",
    textDecorationLine: "underline"
  },

  secondryButton: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    margin: 1,
    width: "45%",
    borderRadius: 30,
  },

  secondryBtnView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: "row",
  },

  loginButton: {
    backgroundColor: "#c62828",
  },

  socialButton: {
    backgroundColor: "white",
    textDecorationColor: "#c62828"
  },

  WhitwBgButton: {
    backgroundColor: "white",
  },

  FacebookButton: {
    backgroundColor: "#4267b2",
  },

  GoogleButton: {
    backgroundColor: "#b53d00",
  },

  loginText: {
    color: 'white',
  },

  SignUpText: {
    color: '#4267b2',
    fontWeight: "bold"
  },

  WhiteButtonWithRedText: {
    color: '#c62828',
  },

  inputs2: {
    width: WIDTH - 55,
    height: 45,
    fontSize: 16,
    paddingLeft: 45,
    marginHorizontal: 25,
    borderRadius: 25,
    borderBottomColor: '#FFFFFF',
  },

  inputIcon2: {
    position: 'absolute',
    top: 10,
    left: 20,

  },

  stretch: {
    width: 100,
    height: 100,
    marginBottom: 10,
    resizeMode: 'stretch'
  },

  introText: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 60
  },

  landingPageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },

  text: {
    marginTop: 30,
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
  },

});


const RootStack = createStackNavigator({
  // Home: HomeScreen,
  // Details: DetailsScreen,

  FirstScreen: {
    screen: FirstScreen,
    navigationOptions: {
      headerShown: false,
    },
  },

  LogInScreen: {
    screen: LogInScreen,
    navigationOptions: {
      headerShown: false,
    },
  },

  VerificationScreen: {
    screen: VerificationScreen,
    navigationOptions: {
      headerShown: false,
    },
  },

  SignInView: {
    screen: SignInView,
    navigationOptions: {
      headerShown: false,
    },
  },

  ResetScreen: {
    screen: ResetScreen,
    navigationOptions: {
      headerShown: false,
    },
  },

  LandingPage: {
    screen: LandingPage,
    navigationOptions: {
      headerShown: false,
    },
  }

});

export default createAppContainer(RootStack);



























// import React, { Component } from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   ScrollView,
//   View,
//   Text,
//   Image,
//   StatusBar,
// } from 'react-native';

// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
// } from '@react-native-community/google-signin';

// import { LoginButton, AccessToken } from 'react-native-fbsdk';

// import {
//   Header,
//   LearnMoreLinks,
//   Colors,
//   DebugInstructions,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';
// import { LoginButton, AccessToken } from 'react-native-fbsdk';


// export default class App extends Component {

//   constructor(props) {
//     super(props)
//     this.state = {
//       email: "",
//       photo: "",
//       name: "",
//       facebookName: "",
//       userInfo: {}
//     }
//   }



//   componentDidMount() {
//     GoogleSignin.configure();
//   }

//   // Somewhere in your code
//   _signIn = async () => {
//     try {
//       await GoogleSignin.hasPlayServices();
//       const userInfo = await GoogleSignin.signIn();
//       console.log(userInfo)
//       this.setState({
//         name: userInfo.user.name,
//         email: userInfo.user.email,
//         photo: userInfo.user.photo,
//       });
//     } catch (error) {
//       if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//         // user cancelled the login flow
//       } else if (error.code === statusCodes.IN_PROGRESS) {
//         // operation (e.g. sign in) is in progress already
//       } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//         // play services not available or outdated
//       } else {
//         // some other error happened
//       }
//       console.log(error)
//     }
//   };


//   signOut = async () => {
//     try {
//       await GoogleSignin.revokeAccess();
//       await GoogleSignin.signOut();
//       this.setState({ user: null }); // Remember to remove the user from your app's state as well
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   render() {
//     return (
//       <>
//         <View style={styles.MainContainer}>

//           <GoogleSigninButton
//             style={{ width: 192, height: 48 }}
//             size={GoogleSigninButton.Size.Wide}
//             color={GoogleSigninButton.Color.Dark}
//             onPress={this._signIn}
//           // disabled={this.state.isSigninInProgress}
//           />

//           <Text>{this.state.name}</Text>
//           <Text>{this.state.email}</Text>

//           {/* <Image source={{uri:this.state.photo}} style={styles.containerImg} />  */}
//           <Image
//             source={{ uri: this.state.photo }}
//             //borderRadius style will help us make the Round Shape Image
//             style={{ width: 200, height: 200, borderRadius: 200 / 2 }}
//           />


//           <LoginButton
//             onLoginFinished={
//               (error, result) => {
//                 if (error) {
//                   console.log("login has error: " + result.error);
//                 } else if (result.isCancelled) {
//                   console.log("login is cancelled.");
//                 } else {
//                   AccessToken.getCurrentAccessToken().then(
//                     (data) => {
//                       console.log(data.accessToken.toString())
//                     }
//                   )
//                 }
//               }
//             }
//             onLogoutFinished={() => console.log("logout.")} />
//           {this.state.userInfo.name && (
//             <Text style={{ fontSize: 16, marginVertical: 16 }}>
//               Logged in As {this.state.userInfo.name}
//             </Text>
//           )}
//         </View>
//       </>
//     );
//   }
// };

// const styles = StyleSheet.create({

//   MainContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#e0dcdc',
//   },

//   containerImg: {
//     position: 'absolute',
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },


//   scrollView: {
//     backgroundColor: Colors.lighter,
//   },
//   engine: {
//     position: 'absolute',
//     right: 0,
//   },
//   body: {
//     backgroundColor: Colors.white,
//   },
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: Colors.black,
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//     color: Colors.dark,
//   },
//   highlight: {
//     fontWeight: '700',
//   },
//   footer: {
//     color: Colors.dark,
//     fontSize: 12,
//     fontWeight: '600',
//     padding: 4,
//     paddingRight: 12,
//     textAlign: 'right',
//   },
// });

