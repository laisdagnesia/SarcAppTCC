import * as React from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, Alert } from 'react-native';
import { usePacienteContext } from '../../context/pacientes';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { NavegacaoPrincipalParams } from '../navigation/config';
import { Button } from '@rneui/themed';
import { useLanguage } from '../../context/LanguageContext';

export function ResultadoAntropometriaScreen() {
  type navProps = StackNavigationProp<NavegacaoPrincipalParams, 'menu', 'formularioDesempenho'>;
  const navigation = useNavigation<navProps>();
  const { t } = useLanguage();

  const { paciente, desempenho } = usePacienteContext();
  const [MMEA, setMMEA] = React.useState(0);
  const [MMEAEstimado, setMMEAEstimado] = React.useState(false);
  const [IMC, setIMC] = React.useState(0);
  const [IMCEstimado, setIMCEstimado] = React.useState(false);
  const [IMMEA, setIMMEA] = React.useState(0);
  const [IMMEAEstimado, setIMMEAEstimado] = React.useState(false);
  const [altura, setAltura] = React.useState(0);
  const [alturaEstimada, setAlturaEstimada] = React.useState(false);
  const [peso, setPeso] = React.useState(0);
  const [pesoEstimado, setPesoEstimado] = React.useState(false);

  const calcular = async () => {
    if (!paciente || Object.keys(paciente).length === 0) {
      console.log('Paciente ainda não carregado');
      return;
    }
    if (!paciente.altura && !paciente.alturaJoelho) {
      Alert.alert(t('incompletePatientData')); // ex.: 'Dados incompletos do paciente' / 'Incomplete patient data'
      return;
    }

    // ===== ALTURA
    let _altura: number = paciente.altura;
    let _alturaEstimada = false;

    if ((!_altura || _altura === 0) && paciente.alturaJoelho) {
      if (paciente.sexo === 'feminino') {
        _altura = paciente.raca === 'afrodescendente'
          ? (68.1 + (1.86 * paciente.alturaJoelho) - (0.06 * paciente.idade))
          : (70.25 + (1.87 * paciente.alturaJoelho) - (0.06 * paciente.idade));
      } else {
        _altura = paciente.raca === 'afrodescendente'
          ? (73.42 + (1.79 * paciente.alturaJoelho))
          : (71.85 + (1.88 * paciente.alturaJoelho));
      }
      _alturaEstimada = true;
      _altura = _altura / 100; // cm → m
    }

    setAltura(_altura);
    setAlturaEstimada(_alturaEstimada);

    // ===== PESO
    let _peso: number = paciente.peso;
    let _pesoEstimado = false;

    if ((!_peso || _peso === 0) && paciente.alturaJoelho && paciente.circBraco) {
      if (paciente.sexo === 'masculino') {
        _peso = paciente.raca === 'afrodescendente'
          ? (paciente.idade <= 59
              ? ((paciente.alturaJoelho * 1.24) + (paciente.circBraco * 2.97) - 82.48)
              : ((paciente.alturaJoelho * 1.50) + (paciente.circBraco * 2.58) - 84.22))
          : (paciente.idade <= 59
              ? ((paciente.alturaJoelho * 1.01) + (paciente.circBraco * 2.81) - 66.04)
              : ((paciente.alturaJoelho * 1.09) + (paciente.circBraco * 2.68) - 65.51));
      } else {
        _peso = paciente.raca === 'afrodescendente'
          ? (paciente.idade <= 59
              ? ((paciente.alturaJoelho * 1.09) + (paciente.circBraco * 3.14) - 83.72)
              : ((paciente.alturaJoelho * 0.44) + (paciente.circBraco * 2.86) - 39.21))
          : (paciente.idade <= 59
              ? ((paciente.alturaJoelho * 1.19) + (paciente.circBraco * 3.14) - 86.82)
              : ((paciente.alturaJoelho * 1.10) + (paciente.circBraco * 3.07) - 75.81));
      }
      _peso = parseFloat(_peso.toFixed(2));
      _pesoEstimado = true;
    }

    setPeso(_peso);
    setPesoEstimado(_pesoEstimado);

    // ===== MMEA
    const racaFactor = paciente.raca === 'afrodescendente' ? 1.4 : (paciente.raca === 'asiatico' ? 1.2 : 0);
    const sexoFactor = paciente.sexo === 'masculino' ? 1 : 0;

    const _MMEA = desempenho?.massaMuscularApendicular
      ? Number(desempenho.massaMuscularApendicular)
      : (0.244 * _peso + 7.8 * _altura + sexoFactor * 6.6 - 0.098 * paciente.idade + racaFactor - 3.3);

    setMMEA(Number(_MMEA.toFixed(2)));
    setMMEAEstimado(!desempenho?.massaMuscularApendicular);

    // ===== IMMEA
    const _IMMEA = desempenho?.indiceMassaMuscularApendicular
      ? Number(desempenho.indiceMassaMuscularApendicular)
      : _MMEA / (_altura * _altura);

    setIMMEA(Number(_IMMEA.toFixed(2)));
    setIMMEAEstimado(!desempenho?.indiceMassaMuscularApendicular);

    // ===== IMC
    const _IMC = _peso / (_altura * _altura);
    setIMC(Number(_IMC.toFixed(2)));
    setIMCEstimado(_pesoEstimado || _alturaEstimada);
  };

  React.useEffect(() => {
    calcular();
  }, []);

  const renderTitulo = () => (
    <Text style={styles.titulo}>
      <Text style={styles.preto}>{t('anthroTitleLine1')}{'\n'}</Text>
      <Text style={styles.preto}>{t('anthroTitleLine2')}</Text>
    </Text>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ImageBackground
        style={styles.container}
        source={require('./../../../assets/images/bg.png')}
      >
        {/* Título dinâmico */}
        <View style={styles.tituloContainer}>{renderTitulo()}</View>

        {/* PESO */}
        <Text style={[styles.texto, { marginTop: 120 }]}>
          {t('weight')}
          {pesoEstimado ? ` ${t('estimated')}` : ''}: {peso ? `${peso} kg` : t('notInformed')}
        </Text>

        {/* ALTURA */}
        {alturaEstimada && (
          <Text style={styles.texto}>
            {t('heightEstimated')}: {altura ? `${altura.toFixed(2)} ${t('meters')}` : t('notInformed')}
          </Text>
        )}

        {/* IMC */}
        <Text style={styles.texto}>
          {t('bmi')}
          {IMCEstimado ? ` ${t('estimated')}` : ''}: {(IMC && IMC <= 2000) ? IMC.toFixed(2) : t('notInformed')}
        </Text>

        {/* MMEA */}
        <Text style={styles.texto}>
          {t('asmm')}
          {MMEAEstimado ? ` ${t('estimated')}` : ''}:
          {' '}
          {MMEAEstimado && IMC > 29.9
            ? t('bmiOver30')
            : (MMEA >= 0 ? MMEA : t('noSufficientData'))}
        </Text>

        {/* IMMEA */}
        <Text style={styles.texto}>
          {t('asmmIndex')}
          {IMMEAEstimado ? ` ${t('estimated')}` : ''}: {
            IMMEAEstimado && IMC > 29.9
              ? t('bmiOver30')
              : (!isFinite(IMMEA)
                  ? t('noSufficientData')
                  : (IMMEA ? IMMEA : t('notInformed')))
          }
        </Text>

        {(IMC > 29.9) && (MMEAEstimado || IMMEAEstimado) && (
          <Text style={[styles.texto, { marginBottom: 50, color: 'red', fontWeight: 'bold', backgroundColor: '#F7DC6F', padding: 10, marginRight: 10 }]}>
            {t('obsCannotCalcASMM')}
          </Text>
        )}

        <Button
          title={t('back')}
          onPress={() => navigation.goBack()}
          containerStyle={{ borderRadius: 80, width: 320, marginLeft: 30, marginTop: 40 }}
          buttonStyle={{ backgroundColor: '#bbf5f0', borderRadius: 80 }}
          raised
        />
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  background: { width: '100%', height: '100%' },
  container: { flex: 1, justifyContent: 'center' },


  tituloContainer: {
    alignItems: 'center',
    marginTop: -230,
    marginBottom: 10,
    marginRight: 40,
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
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    padding: 5,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 80,
    height: 40,
    width: 400,
    marginTop: 60,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
