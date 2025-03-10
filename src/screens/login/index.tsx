import React, { useState } from 'react';
import { View, Text, ImageBackground, StyleSheet, TextInput, Alert} from 'react-native';
import { Button, Input } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack'
import { NavegacaoPrincipalParams } from '../navigation/config';
import { GoogleSignin, GoogleSigninButton } from "@react-native-google-signin/google-signin"
import { signInWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from '@firebase/firestore';
import { auth, db } from '../../config/firebase-config';


export function LoginScreen(props: any) {
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const [ loading, setLoading ] = useState(false);
     const [isValidEmail, setIsValidEmail] = useState(true);
     const [isValidPassword, setIsValidPassword] = useState(true);

     type navProps = StackNavigationProp<NavegacaoPrincipalParams,  'menu' , 'cadastroPaciente'>;
     const navigation = useNavigation<navProps>();
   
     const handleLogin = async() => {
      try{
        await signInWithEmailAndPassword(auth, email,password)
        navigation.navigate('menu');
      } catch(error){
        console.log('Error signin in', error);
        Alert.alert('Erro', 'Verifique o email e a senha, algo está incorreto');
      }
     }
     const logar = async() => {
      setLoading(true);
      try {
        GoogleSignin.configure();
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        await setDoc(doc(db, 'users', userInfo.user.id), {email: userInfo.user.email, nome:userInfo.user.name, uid: userInfo.user.id});

        navigation.navigate('menu')
        console.log(userInfo)
      } catch(e:any) {
        alert(e.code);
        console.log(e);
      }
      setLoading(false);
    }
      return (
        <ImageBackground style={styles.container}
          source={require('./../../../assets/images/login.jpeg')}
        > 
        <Input placeholder='E-mail' 
        placeholderTextColor={'white'}
       leftIcon={{name:'person', color:'white'}}
       inputStyle={{color:'white'}} 
       onChangeText={(text) => {
        setEmail(text);
        setIsValidEmail(true);
      }}
      value={email}/>
      {!isValidEmail && <Text style={{ color: 'red',marginTop:-15}}>Email Inválido
   </Text>}
       <Input placeholder='Senha' 
       placeholderTextColor={'white'}
       leftIcon={{name:'lock', color:'white'}}
       inputStyle={{color:'white'}}
       secureTextEntry={true} 
       onChangeText={setPassword}
      value={password}/>
           {!isValidPassword && <Text style={{ color: 'red', marginTop:-15 }}>Senha Inválida
           !</Text>}

   <Button 
          title="LOGIN"
          style={styles.button} 
          buttonStyle={styles.button} 
          titleStyle={{ color: 'blue' }}
          containerStyle={{marginTop:15,borderRadius: 80}} 
          onPress={handleLogin} 
          raised={true}></Button>
           <Text style={{ marginTop: 20,fontSize:15, color:'white' }}> Entrar sem login{' '}
          <Text style={{ color: 'white', textDecorationLine: 'underline'}}
         onPress={() => navigation.navigate('menu')}>Clique aqui</Text>.</Text>
          <Text style={{ marginTop: 20,fontSize:15, color:'white' }}>Não possui cadastro?{' '}
          <Text style={{ color: 'white', textDecorationLine: 'underline' }}
          onPress={() => navigation.navigate('cadastroProfissional')}>Clique aqui</Text>.</Text>
          <Text style={{ marginTop: 20,fontSize:15, color:'white', marginBottom:10 }}>Esqueceu a senha?{' '}
          <Text style={{ color: 'white', textDecorationLine: 'underline'}}
         onPress={() => navigation.navigate('resetSenha')}>Clique aqui</Text>.</Text>

        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          disabled={loading}
          onPress={logar}
        />
        <Text style={styles.version}>Versão 1.0</Text>

       </ImageBackground>
     );
   }
  
   const styles = StyleSheet.create({
    background: {
      width: '100%',
      height: '100%',
    },
     container: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
     },
     inputContainer: {
       backgroundColor: 'white',
     },
     button: {
       backgroundColor: 'white',
       color:'red',
       borderRadius: 80,
       height: 40,
       width: 300
     },
     version: {
      fontSize: 9,
      position: 'absolute',
      right: 10,
      bottom: 5,
      color:'white'
     }
   
   });
   