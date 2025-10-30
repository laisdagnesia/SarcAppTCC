import * as React from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { usePacienteContext } from '../../context/pacientes';
import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { NavegacaoPrincipalParams } from '../navigation/config';
import { Button } from '@rneui/themed';
import { useLanguage } from '../../context/LanguageContext';

interface AvaliacaoProps {
  route: RouteProp<NavegacaoPrincipalParams, 'resultadoDetalhado'>
}

export function ResultadoDetalhadoScreen({ route }: AvaliacaoProps) {
  type navProps = StackNavigationProp<NavegacaoPrincipalParams, 'menu', 'formularioDesempenho'>;
  const navigation = useNavigation<navProps>();
  const { t } = useLanguage();

  const { IMC, IMMEA, MMEA } = route.params;
  const { paciente, pontosSarc, desempenho } = usePacienteContext();

  const [baixaMassaMuscular, setBaixaMassaMuscular] = React.useState<boolean>(false);
  const [sarcF, setSarcF] = React.useState<boolean>(false);
  const [sarcFAC, setSarcFAC] = React.useState<boolean>(false);
  const [sarcCalF, setSarcCalF] = React.useState<boolean>(false);
  const [sarcFEBM, setSarcFEBM] = React.useState<boolean>(false);
  const [sarcCalFAC, setSarcCalFAC] = React.useState<boolean>(false);

  const [baixaForcaMuscular, setBaixaForcaMuscular] = React.useState<boolean>(false);
  const [baixoDesempenhoFisico, setBaixoDesempenhoFisico] = React.useState<boolean>(false);

  const pontuacoesFinais = async () => {
    if (!paciente) return;

    // SARC-F
    if (pontosSarc >= 4) setSarcF(true);

    // SARC-F + AC
    let pontos = pontosSarc;
    const circBraco = Number(paciente.circBraco);
    if (!isNaN(circBraco)) {
      if (paciente.sexo === 'feminino') pontos += circBraco <= 25 ? 10 : 0;
      else pontos += circBraco <= 27 ? 10 : 0;
      setSarcFAC(pontos >= 10);
    }

    // SARC-CALF
    let pontosCalf = pontosSarc;
    const circPant = Number(paciente.circPant);
    if (!isNaN(circBraco) && !isNaN(circPant)) {
      if (paciente.sexo === 'feminino') pontosCalf += circPant <= 33 ? 10 : 0;
      else pontosCalf += circPant <= 34 ? 10 : 0;
      setSarcCalF(pontosCalf >= 11);
    }

    // SARC-F + EBM
    let pontosEBM = pontosSarc;
    pontosEBM += paciente.idade >= 75 ? 10 : 0;
    pontosEBM += IMC <= 21 ? 10 : 0;
    setSarcFEBM(pontosEBM >= 12);

    // SARC-CalF + AC
    let pontosCalFAC = pontosSarc;
    if (!isNaN(circPant) && !isNaN(circBraco)) {
      if (paciente.sexo === 'feminino') {
        pontosCalFAC += circPant <= 33 ? 10 : 0;
        pontosCalFAC += circBraco <= 25 ? 10 : 0;
      } else {
        pontosCalFAC += circPant <= 34 ? 10 : 0;
        pontosCalFAC += circBraco <= 27 ? 10 : 0;
      }
      setSarcCalFAC(pontosCalFAC >= 11);
    }
  };

  const diagnostico = () => {
    let _baixaForca = false;
    let _baixoPerf = false;
    let _baixaMassa = false;

    if (paciente && desempenho) {
      // BAIXA MASSA MUSCULAR (por MMEA e IMMEA)
      if (paciente.sexo === 'masculino' && MMEA < 20) _baixaMassa = true;
      else if (paciente.sexo === 'feminino' && MMEA < 15) _baixaMassa = true;

      if (paciente.sexo === 'masculino' && IMMEA < 7) _baixaMassa = true;
      else if (paciente.sexo === 'feminino' && IMMEA < 5.5) _baixaMassa = true;

      // FORÇA MUSCULAR
      if ((paciente.sexo === 'masculino' && (Number(desempenho?.forcaPalmar) < 27)) ||
          (paciente.sexo === 'feminino' && (Number(desempenho?.forcaPalmar) < 16))) {
        _baixaForca = true;
      }
      if (Number(desempenho?.tempoLevantar) > 15) _baixaForca = true;

      // DESEMPENHO FÍSICO
      if (Number(desempenho?.velocidadeMarcha) <= 0.8) _baixoPerf = true;
      if (Number(desempenho?.shortPhysicalPerformance) <= 8) _baixoPerf = true;
      if (Number(desempenho?.timeUp) >= 20) _baixoPerf = true;
      if (Number(desempenho?.caminhadaCurta) >= 6) _baixoPerf = true;
    }

    setBaixaMassaMuscular(_baixaMassa);
    setBaixaForcaMuscular(_baixaForca);
    setBaixoDesempenhoFisico(_baixoPerf);
  };

  React.useEffect(() => {
    diagnostico();
    pontuacoesFinais();
  }, []);

  // Título dinâmico (duas linhas, preto + vermelho)
  const renderTitulo = () => (
    <Text style={styles.titulo}>
      <Text style={styles.preto}>{t('detailedTitle1')}{'\n'}</Text>
      <Text style={styles.preto}>{t('detailedTitle2')}</Text>
    </Text>
  );

  // Helpers para renderizar cada linha com rótulos traduzidos
  const msgSarcScore = () => {
    if (pontosSarc < 0) return t('formNotFilled');
    if (pontosSarc >= 4) return t('suggestiveSarcopenia');
    if (pontosSarc === 0) return t('nonSarcopenic');
    return t('nonSarcopenic');
  };

  const msgWithData = (hasData: boolean, flag: boolean) => {
    if (pontosSarc < 0) return t('insufficientData');
    if (!hasData) return t('noSufficientData');
    return flag ? t('suggestiveSarcopenia') : t('nonSarcopenic');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ImageBackground style={styles.container} source={require('./../../../assets/images/bg.png')}>
        {/* Título topo */}
        <View style={[styles.tituloContainer, {marginBottom: 150}]}>{renderTitulo()}</View>

        {/* Linhas de resultado */}
        <Text style={styles.texto}>
          {t('sarcF')}: {msgSarcScore()}
        </Text>

        <Text style={styles.texto}>
          {t('sarcFPlusAC')}: {msgWithData(!!paciente?.circBraco, sarcFAC)}
        </Text>

        <Text style={styles.texto}>
          {t('sarcCalf')}: {msgWithData(!!paciente?.circPant, sarcCalF)}
        </Text>

        <Text style={styles.texto}>
          {t('sarcFPlusEBM')}: {msgWithData(!!paciente?.idade && !!IMC, sarcFEBM)}
        </Text>

        <Text style={styles.texto}>
          {t('sarcCalfPlusAC')}: {msgWithData(!!(paciente?.circBraco && paciente?.circPant), sarcCalFAC)}
        </Text>

        <Button
          title={t('goToPerformance')}
          style={styles.button}
          containerStyle={{ borderRadius: 80, width: 320, marginLeft: 30, marginTop: 20 }}
          titleStyle={{ color: 'white' }}
          buttonStyle={{ backgroundColor: '#36b6b0', borderRadius: 80 }}
          onPress={() => navigation.navigate('formularioDesempenho')}
          raised
        />

        <Button
          title={t('back')}
          onPress={() => navigation.goBack()}
          containerStyle={{ borderRadius: 80, width: 320, marginLeft: 30, marginTop: 10 }}
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

  // >>> estilos do título padronizados
  tituloContainer: {
    alignItems: 'center',
  marginTop: -150,
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
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    padding: 5,
  },
  button: {
    backgroundColor: 'blue',
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
