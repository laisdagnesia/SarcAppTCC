import * as React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import { Button } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { NavegacaoPrincipalParams } from '../navigation/config';
import { useLanguage } from '../../context/LanguageContext'; // 👈 importa o contexto

export function MenuScreen() {
  type navProps = StackNavigationProp<NavegacaoPrincipalParams, 'inicio', 'cadastroPaciente'>;
  const navigation = useNavigation<navProps>();
  const { t } = useLanguage(); // 👈 acessa idioma atual e função de tradução

  // 🔤 título com cores e quebra de linha
  const renderTitulo = () => (
    <Text style={styles.titulo}>
      <Text style={styles.preto}>{t('MENU')}{'\n'}</Text>
    </Text>
  );

  return (
    <ImageBackground
      style={styles.container}
      source={require('./../../../assets/images/menu.png')}
    >
      {/* Título colorido dinâmico */}
      {/* <View style={styles.tituloContainer}>{renderTitulo()}</View> */}

      {/* Botões */}
      <Button
        title={t('resultadoAntropometria') || 'Resultado Antropometria'}
        style={styles.button}
        buttonStyle={styles.button}
        titleStyle={{ color: 'white' }}
        containerStyle={{ marginTop: 50, borderRadius: 80 }}
        onPress={() => navigation.navigate('resultadoAntropometria')}
        raised
      />

      <Button
        title={t('formularioTriagem') || 'Formulário de Triagem'}
        style={styles.button}
        buttonStyle={styles.button}
        titleStyle={{ color: 'white' }}
        containerStyle={{ marginTop: 50, borderRadius: 80 }}
        onPress={() => navigation.navigate('formularioSarcF')}
        raised
      />

      <Button
        title={t('avaliacaoSarcopenia') || 'Avaliação para Sarcopenia'}
        style={styles.button}
        buttonStyle={styles.button}
        titleStyle={{ color: 'white' }}
        containerStyle={{ marginTop: 50, borderRadius: 80 }}
        onPress={() => navigation.navigate('formularioDesempenho')}
        raised
      />

      <Button
        title={t('back') || 'Voltar'}
        style={styles.button}
        titleStyle={{ color: 'white' }}
        buttonStyle={{
          backgroundColor: '#bbf5f0',
          borderRadius: 80,
          height: 40,
          width: 300,
        }}
        containerStyle={{ marginTop: 50, borderRadius: 80 }}
        onPress={() => navigation.navigate('inicio')}
        raised
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tituloContainer: {
    alignItems: 'center',
    marginTop: -250,
    marginBottom: 10,
    marginRight: 30,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 34,
  },
  preto: {
    color: '#000',
  },
  vermelho: {
    color: '#d32f2f',
  },
  button: {
    backgroundColor: '#36b6b0',
    borderRadius: 80,
    height: 40,
    width: 300,
  },
});
