import React, { useState } from 'react';
import { Text, ImageBackground, StyleSheet,Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { NavegacaoPrincipalParams } from '../navigation/config';
import { Button, Input } from '@rneui/themed';
import { GoogleSignin, GoogleSigninButton } from "@react-native-google-signin/google-signin"
import { getAuth, createUserWithEmailAndPassword } from '@firebase/auth';
import { getFirestore, setDoc, doc } from '@firebase/firestore';


export function CadastroScreen(props: any) {
  const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [loading, setLoading] = useState(false);

   const [isValidEmail, setIsValidEmail] = useState(true);
   const [isValidPassword, setIsValidPassword] = useState(true);
 
   type navProps = StackNavigationProp<NavegacaoPrincipalParams,  'login' , 'menu'>;
   const navigation = useNavigation<navProps>();
   const auth = getAuth(); 
   const db = getFirestore();

  const handleSignIn = async () => {
    setLoading(true);
    try {
     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
     const { user } = userCredential;
     await setDoc(doc(db, 'users', user.uid), {email, nome:name, uid: user.uid});
     Alert.alert('Sucesso', 'Usuario Criado');
     navigation.navigate('login');
    } 
    catch (error) {
      console.log('Error creating user:', error);
     Alert.alert('Erro', 'Não foi possível criar o usuário, tente novamente.');
    } 
    setLoading(false);
};

   return (
    
      <ImageBackground style={styles.container}
        source={require('./../../../assets/images/cadastroProfissional.png')}
      >
       <Input
         placeholder="Nome Completo"
         placeholderTextColor={'white'}
         onChangeText={setName}
         value={name}
         style={{ width: 350,
           height:30,
          color:'white',
          marginBottom:10,
           fontSize:20,
           paddingHorizontal: 10, }}
       />
       <Input
         placeholder="Email"
         placeholderTextColor={'white'}
         onChangeText={(text) => {
           setEmail(text);
           setIsValidEmail(true);
         }}
         value={email}
         style={{
           width: 350,
           height:30,
           color:'white',
           fontSize:20,
           marginBottom:10,
           paddingHorizontal: 10,
           borderColor: isValidEmail ? 'black' : 'red',
         }}
       />
       {!isValidEmail && <Text style={{ color: 'red',marginTop:-15}}>Email Inválido
 </Text>}
       <Input
         placeholder="  Senha"
        placeholderTextColor={'white'}
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true}
         style={{
           width: 350,
           height:30,
           color:'white',
           marginBottom:10,
           fontSize:20,
           borderColor: isValidPassword ? 'black' : 'red',
         }}
       />
         {!isValidPassword && <Text style={{ color: 'red', marginTop:-15 }}>Senha Inválida
 !</Text>}
        <Button
           title=" Cadastrar"
           buttonStyle={styles.button} 
           titleStyle={{ color: 'blue' }}
           containerStyle={{marginTop:15,borderRadius: 80}} 
           onPress= {handleSignIn}
           disabled={loading}
           raised={true}></Button>
           <Button title="Voltar" onPress={() => navigation.goBack()}
            buttonStyle={styles.botaoVoltar}
            disabled={loading}
            containerStyle={{ borderRadius: 30, marginTop: 15, marginBottom:15 }}
            raised={true}></Button>
              
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
     borderRadius: 80,
     height: 40,
     width: 300
   },
   botaoVoltar:{
     borderRadius: 80,
     height: 40,
     width: 300,
     backgroundColor: 'blue'  
   },
 });
 