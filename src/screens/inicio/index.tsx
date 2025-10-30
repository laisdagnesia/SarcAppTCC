import * as React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { NavegacaoPrincipalParams } from '../navigation/config';
import { useResetarAvaliacao } from '../../hooks/useResetarAvaliacao';
import { useLanguage } from '../../context/LanguageContext';

export function InicioScreen() {
  type navProps = StackNavigationProp<NavegacaoPrincipalParams, 'inicio', 'menu'>;
  const navigation = useNavigation<navProps>();
  const resetarAvaliacao = useResetarAvaliacao();
  const { lang, setLang, t } = useLanguage();

  const handleIniciar = async () => {
    await resetarAvaliacao();
    navigation.navigate('cadastroPaciente'); // idioma já está global no contexto
  };

  const handleSelectLanguage = (l: 'pt' | 'en') => {
    setLang(l);
    // if (l === 'en') navigation.navigate('start' as never);
  };

  const renderTitulo = () => (
    <Text style={styles.titulo}>
      <Text style={styles.preto}>{t('welcome')}{'\n'}</Text>
      <Text style={styles.vermelho}>{t('appName')}</Text>
    </Text>
  );

  return (
    <ImageBackground style={styles.container} source={require('./../../../assets/images/start.png')}>
      <View style={styles.languageContainer}>
        <TouchableOpacity onPress={() => handleSelectLanguage('pt')}>
          <Text style={[styles.languageText, lang === 'pt' && styles.selectedLanguage]}>🇧🇷 PT</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSelectLanguage('en')}>
          <Text style={[styles.languageText, lang === 'en' && styles.selectedLanguage]}>🇺🇸 EN</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tituloContainer}>{renderTitulo()}</View>

      <Button
        title={t('startEval')}
        style={styles.button}
        buttonStyle={styles.button}
        titleStyle={{ color: 'white' }}
        containerStyle={{ marginTop: 420, borderRadius: 80 }}
        onPress={handleIniciar}
        raised
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  languageContainer: { position: 'absolute', top: 60, right: 20, flexDirection: 'row', gap: 10 },
  languageText: { fontSize: 16, color: 'white', opacity: 0.7 },
  selectedLanguage: { fontWeight: 'bold', opacity: 1, textDecorationLine: 'underline' },
  tituloContainer: { position: 'absolute', top: 450, alignItems: 'center' },
  titulo: { fontSize: 38, fontWeight: 'bold', textAlign: 'center', lineHeight: 38 },
  preto: { color: '#000' },
  vermelho: { color: '#d32f2f' },
  button: { backgroundColor: '#36b6b0', borderRadius: 80, height: 40, width: 300 },
});
