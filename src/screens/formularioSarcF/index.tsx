import React, {useState, useEffect} from "react";
import { Text, ImageBackground, StyleSheet, Alert, View } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { NavegacaoPrincipalParams } from '../navigation/config';
import { Button } from '@rneui/themed';
import { Picker } from '@react-native-picker/picker';
import { usePacienteContext } from "../../context/pacientes";
import { useLanguage } from "../../context/LanguageContext";

export function FormularioSarcFScreen() {
  const [forca, setForca] = useState('');
  const [assistencia, setAssistencia] = useState('');
  const [levantar, setLevantar] = useState('');
  const [subir, setSubir] = useState('');
  const [quedas, setQuedas] = useState('');

  type navProps = StackNavigationProp<NavegacaoPrincipalParams, 'menu', 'formularioDesempenho'>;
  const navigation = useNavigation<navProps>();
  const { setPontosSarc, setFormularioSarcF, formularioSarcF } = usePacienteContext();
  const { t, lang } = useLanguage();

  const getPontos = (variavel: string) => {
    switch (variavel) {
      case '': return -1;
      case 'nenhuma': return 0;
      case 'alguma': return 1;
      case 'muito': return 2;
      default: return 0;
    }
  };

  const calcularPontosESeguir = () => {
    let pontos = 0;
    pontos += getPontos(forca);
    pontos += getPontos(assistencia);
    pontos += getPontos(levantar);
    pontos += getPontos(subir);
    pontos += getPontos(quedas);

    setFormularioSarcF({ forca, assistencia, levantar, subir, quedas });
    setPontosSarc(pontos);

    navigation.navigate('resultadoDetalhado', {
      IMC: 0,
      IMMEA: 0,
      MMEA: 0,
    });
  };

  const handleAvancar = async () => {
    if (!forca || !assistencia || !levantar || !subir || !quedas) {
      Alert.alert(
        t('attention'),
        t('sarcfIncompleteWarn'),
        [
          { text: t('yesContinue'), onPress: calcularPontosESeguir },
          { text: t('noBack'), onPress: () => {} },
        ]
      );
    } else {
      calcularPontosESeguir();
    }
  };

  useEffect(() => {
    if (
      formularioSarcF?.forca !== forca ||
      formularioSarcF?.assistencia !== assistencia ||
      formularioSarcF?.levantar !== levantar ||
      formularioSarcF?.subir !== subir ||
      formularioSarcF?.quedas !== quedas
    ) {
      setFormularioSarcF({ forca, assistencia, levantar, subir, quedas });
    }
  }, [forca, assistencia, levantar, subir, quedas, formularioSarcF, setFormularioSarcF]);

  useEffect(() => {
    if (formularioSarcF) {
      setForca(formularioSarcF.forca || '');
      setAssistencia(formularioSarcF.assistencia || '');
      setLevantar(formularioSarcF.levantar || '');
      setSubir(formularioSarcF.subir || '');
      setQuedas(formularioSarcF.quedas || '');
    }
  }, []);

  // Título dinâmico (preto + vermelho, 2 linhas)
  const renderTitulo = () => (
    <Text style={styles.titulo}>
      <Text style={styles.preto}>{t('screening')}{'\n'}</Text>
      <Text style={styles.preto}>SARC-F</Text>
    </Text>
  );

  // Helpers para label dos itens mantendo os valores salvos em PT
  const labelNone = lang === 'en' ? 'None' : 'Nenhuma';
  const labelSome = lang === 'en' ? 'Some' : 'Alguma';
  const labelALot = lang === 'en' ? 'A lot / unable' : 'Muito ou incapaz';
  const labelSelect = lang === 'en' ? 'Select' : 'Selecione';

  return (
    <ImageBackground style={styles.container} source={require('./../../../assets/images/bg.png')}>
      {/* Título topo */}
      <View style={styles.tituloContainer}>{renderTitulo()}</View>

      <Text style={[styles.texto, { marginTop: 10 }]}>{t('sarcfQ1')}</Text>
      <Picker
        selectedValue={forca}
        onValueChange={(value) => setForca(value)}
        style={{ color: 'black' }}
      >
        <Picker.Item label={labelSelect} value="" />
        <Picker.Item label={labelNone} value="nenhuma" />
        <Picker.Item label={labelSome} value="alguma" />
        <Picker.Item label={labelALot} value="muito" />
      </Picker>

      <Text style={styles.texto}>{t('sarcfQ2')}</Text>
      <Picker
        selectedValue={assistencia}
        onValueChange={(value) => setAssistencia(value)}
        style={{ color: 'black' }}
      >
        <Picker.Item label={labelSelect} value="" />
        <Picker.Item label={labelNone} value="nenhuma" />
        <Picker.Item label={labelSome} value="alguma" />
        <Picker.Item label={labelALot} value="muito" />
      </Picker>

      <Text style={styles.texto}>{t('sarcfQ3')}</Text>
      <Picker
        selectedValue={levantar}
        onValueChange={(value) => setLevantar(value)}
        style={{ color: 'black' }}
      >
        <Picker.Item label={labelSelect} value="" />
        <Picker.Item label={labelNone} value="nenhuma" />
        <Picker.Item label={labelSome} value="alguma" />
        <Picker.Item label={labelALot} value="muito" />
      </Picker>

      <Text style={styles.texto}>{t('sarcfQ4')}</Text>
      <Picker
        selectedValue={subir}
        onValueChange={(value) => setSubir(value)}
        style={{ color: 'black' }}
      >
        <Picker.Item label={labelSelect} value="" />
        <Picker.Item label={labelNone} value="nenhuma" />
        <Picker.Item label={labelSome} value="alguma" />
        <Picker.Item label={labelALot} value="muito" />
      </Picker>

      <Text style={styles.texto}>{t('sarcfQ5')}</Text>
      <Picker
        selectedValue={quedas}
        onValueChange={(value) => setQuedas(value)}
        style={{ color: 'black' }}
      >
        <Picker.Item label={labelSelect} value="" />
        <Picker.Item label={labelNone} value="nenhuma" />
        <Picker.Item label={lang === 'en' ? '1 to 3' : '1 a 3'} value="alguma" />
        <Picker.Item label={lang === 'en' ? '4 or more' : '4 ou mais'} value="muito" />
      </Picker>

      <Button
        title={t('sarcfResult')}
        style={styles.button}
        titleStyle={{ color: 'white' }}
        containerStyle={{ borderRadius: 80, width: 320, marginLeft: 40, marginTop: 10 }}
        buttonStyle={{ backgroundColor: '#36b6b0', borderRadius: 80 }}
        onPress={handleAvancar}
        raised
      />
      <Button
        title={t('back')}
        onPress={() => navigation.goBack()}
        style={styles.button}
        containerStyle={{ borderRadius: 80, width: 320, marginLeft: 40, marginTop: 10 }}
        buttonStyle={{ backgroundColor: '#bbf5f0', borderRadius: 80 }}
        raised
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },

  // título (padrão que você pediu)
  tituloContainer: {
    alignItems: 'center',
    marginTop: -10,
    marginBottom: 10,
    marginRight: 30,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 34,
  },
  preto: { color: '#000' },
  vermelho: { color: '#d32f2f' },

  texto: {
    color: 'black',
    fontSize: 20,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#bbf5f0',
    borderRadius: 80,
    height: 40,
    width: 400,
  },
});
