import React, { useState } from 'react';
import { View, Text, ImageBackground, StyleSheet, TextInput, ToastAndroid } from 'react-native';
import { Button,Input} from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { NavegacaoPrincipalParams } from '../navigation/config';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { Alert } from 'react-native';

export function ResetPasswordScreen(props: any) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isValidEmail, setIsValidEmail] = useState(true);

    type navProps = StackNavigationProp<NavegacaoPrincipalParams,  'login' , 'cadastroProfissional'>;
    const auth = getAuth();
    const navigation = useNavigation();

  const alterarSenha = async () => {
    setLoading(true);
    if (!email) {
        setIsValidEmail(false);
    } else {
        await sendPasswordResetEmail(auth, email)
                .then(() => {
                  Alert.alert('Sucesso', 'Email de redefinição de senha enviado');
                })
                .catch((error) => {
                  console.log(error);
                  Alert.alert('Não foi possível enviar o email de redefinição de senha');
                });
    }
      
    setLoading(false);

 }
 
  return (
    <ImageBackground style={styles.container}
    source={require('./../../../assets/images/login.jpeg')}
  >
      <Text style={[styles.texto, { marginTop: 100 }]}>Informe seu Email</Text>
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
        <Button
          title="Enviar Email de Redefinição"
          buttonStyle={styles.button}
          disabled={loading}
          containerStyle={{ marginTop: 15, borderRadius: 80 }}
          onPress={alterarSenha}
          raised={true}
        ></Button>
        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
          buttonStyle={styles.botaoVoltar}
          containerStyle={{ borderRadius: 30, marginTop: 15 }}
          raised={true}
        ></Button>
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
  button: {
    backgroundColor: 'blue',
    borderRadius: 80,
    height: 40,
    width: 300,
  },
  botaoVoltar: {
    borderRadius: 80,
    height: 40,
    width: 300,
    backgroundColor: 'blue',
  },
  texto:{
    color:'white',
    fontSize:20,
    marginBottom:20,
    marginLeft:10

  },
});