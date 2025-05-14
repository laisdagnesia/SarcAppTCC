import * as React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import { Button } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { NavegacaoPrincipalParams } from '../navigation/config';
import { useResetarAvaliacao } from '../../hooks/useResetarAvaliacao'; // ✅ Importa o hook

export function InicioScreen(props: any) {
  type navProps = StackNavigationProp<NavegacaoPrincipalParams, 'inicio', 'menu'>;
  const navigation = useNavigation<navProps>();
  const resetarAvaliacao = useResetarAvaliacao(); // ✅ Usa o hook

  const handleIniciar = async () => {
    await resetarAvaliacao(); // ✅ Limpa os dados
    navigation.navigate('cadastroPaciente'); // ✅ Depois, navega
  };

  return (
    <ImageBackground style={styles.container} source={require('./../../../assets/images/inicio.png')}>
      <Button
        title="Iniciar Avaliação"
        style={styles.button}
        buttonStyle={styles.button}
        titleStyle={{ color: 'white' }}
        containerStyle={{ marginTop: 500, borderRadius: 80 }}
        onPress={handleIniciar} // ✅ Chama função ao clicar
        raised={true}
      />
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
    backgroundColor: '#36b6b0',
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
});