import * as React from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { usePacienteContext } from '../../context/pacientes';
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { NavegacaoPrincipalParams } from '../navigation/config';
import { Button } from '@rneui/themed';
import { useResetarAvaliacao } from '../../hooks/useResetarAvaliacao';
import { useLanguage } from '../../context/LanguageContext';

export function AvaliacaoSarcopeniaScreen() {
  const navigation = useNavigation<StackNavigationProp<NavegacaoPrincipalParams, 'menu'>>();
  const route = useRoute<RouteProp<NavegacaoPrincipalParams, 'avaliacaoSarcopenia'>>();
  const resetarAvaliacao = useResetarAvaliacao();
  const { t } = useLanguage();

  const { IMC = 0, IMMEA = 0, MMEA = 0 } = route.params || {};
  const { paciente, pontosSarc, desempenho, setFormularioSarcF, setDesempenho, setPontosSarc } = usePacienteContext();

  const [baixaMassaMuscular, setBaixaMassaMuscular] = React.useState(false);
  const [sarcF, setSarcF] = React.useState(false);
  const [sarcFAC, setSarcFAC] = React.useState(false);
  const [sarcCalF, setSarcCalF] = React.useState(false);
  const [sarcFEBM, setSarcFEBM] = React.useState(false);
  const [sarcCalFAC, setSarcCalFAC] = React.useState(false);
  const [baixaForcaMuscular, setBaixaForcaMuscular] = React.useState(false);
  const [baixoDesempenhoFisico, setBaixoDesempenhoFisico] = React.useState(false);

  const handleIniciar = async () => {
    await resetarAvaliacao();
    navigation.navigate('inicio');
  };

  const handleNovaAvaliacao = () => {
    setFormularioSarcF(undefined);
    setDesempenho(undefined);
    setPontosSarc(0);
    navigation.navigate('inicio');
  };

  const pontuacoesFinais = () => {
    if (!paciente) return;

    if (pontosSarc >= 4) setSarcF(true);

    // SARC-F + AC
    let pontos = pontosSarc;
    if (paciente.circBraco) {
      pontos += paciente.sexo === 'feminino'
        ? (paciente.circBraco <= 25 ? 10 : 0)
        : (paciente.circBraco <= 27 ? 10 : 0);
      setSarcFAC(pontos >= 10);
    }

    // SARC-CALF
    let pontosCalf = pontosSarc;
    if (paciente.circPant) {
      pontosCalf += paciente.sexo === 'feminino'
        ? (paciente.circPant <= 33 ? 10 : 0)
        : (paciente.circPant <= 34 ? 10 : 0);
      setSarcCalF(pontosCalf >= 11);
    }

    // SARC-F + EBM
    let pontosEBM = pontosSarc;
    pontosEBM += paciente.idade >= 75 ? 10 : 0;
    pontosEBM += IMC <= 21 ? 10 : 0;
    setSarcFEBM(pontosEBM >= 12);

    // SARC-CalF + AC
    let pontosCalFAC = pontosSarc;
    if (paciente.circPant && paciente.circBraco) {
      if (paciente.sexo === 'feminino') {
        pontosCalFAC += paciente.circPant <= 33 ? 10 : 0;
        pontosCalFAC += paciente.circBraco <= 25 ? 10 : 0;
      } else {
        pontosCalFAC += paciente.circPant <= 34 ? 10 : 0;
        pontosCalFAC += paciente.circBraco <= 27 ? 10 : 0;
      }
      setSarcCalFAC(pontosCalFAC >= 11);
    }
  };

  const diagnostico = () => {
    let baixaForca = false;
    let baixoDesempenho = false;
    let baixaMassa = false;

    if (paciente && desempenho) {
      // Massa muscular (MMEA / IMMEA)
      if ((paciente.sexo === 'masculino' && MMEA < 20) || (paciente.sexo === 'feminino' && MMEA < 15)) baixaMassa = true;
      if ((paciente.sexo === 'masculino' && IMMEA < 7) || (paciente.sexo === 'feminino' && IMMEA < 5.5)) baixaMassa = true;

      // Força
      if ((paciente.sexo === 'masculino' && Number(desempenho.forcaPalmar) < 27) ||
          (paciente.sexo === 'feminino' && Number(desempenho.forcaPalmar) < 16)) baixaForca = true;
      if (Number(desempenho.tempoLevantar) > 15) baixaForca = true;

      // Desempenho físico
      if (Number(desempenho.velocidadeMarcha) <= 0.8) baixoDesempenho = true;
      if (Number(desempenho.shortPhysicalPerformance) <= 8) baixoDesempenho = true;
      if (Number(desempenho.timeUp) >= 20) baixoDesempenho = true;
      if (Number(desempenho.caminhadaCurta) >= 6) baixoDesempenho = true;
    }

    setBaixaMassaMuscular(baixaMassa);
    setBaixaForcaMuscular(baixaForca);
    setBaixoDesempenhoFisico(baixoDesempenho);
  };

  React.useEffect(() => {
    diagnostico();
    pontuacoesFinais();
  }, []);

  // Título dinâmico (duas linhas, preto + vermelho)
  const renderTitulo = () => (
    <Text style={styles.titulo}>
      <Text style={styles.preto}>{t('sarcopeniaTitle1')}{'\n'}</Text>
      <Text style={styles.preto}>{t('sarcopeniaTitle2')}</Text>
    </Text>
  );

  const textoForca = () => {
    const temAlgumDado = !!(desempenho?.forcaPalmar || desempenho?.tempoLevantar);
    if (!temAlgumDado) return t('noSufficientData');
    return baixaForcaMuscular ? t('low') : t('preserved');
  };

  const textoDesempenho = () => {
    const temDados = !!(desempenho?.velocidadeMarcha || desempenho?.shortPhysicalPerformance || desempenho?.timeUp || desempenho?.caminhadaCurta);
    if (!temDados) return t('noSufficientData');
    return baixoDesempenhoFisico ? t('lowPhysicalPerformance') : t('preservedPhysicalPerformance');
  };

  const textoDiagnostico = () => {
    if (baixaForcaMuscular && baixaMassaMuscular && baixoDesempenhoFisico) return t('severeSarcopenia');
    if (baixaMassaMuscular && (baixaForcaMuscular || baixoDesempenhoFisico)) return t('sarcopenic');
    if (baixaForcaMuscular || baixoDesempenhoFisico) return t('probableSarcopenia');
    return t('nonSarcopenic');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ImageBackground style={styles.container} source={require('./../../../assets/images/bg.png')}>
        {/* Título topo */}
        <View style={[styles.tituloContainer, {marginBottom: 150}]}>{renderTitulo()}</View>

        <Text style={styles.texto}>{t('muscleStrength')}: {textoForca()}</Text>
        <Text style={styles.texto}>{t('muscleMass')}: {baixaMassaMuscular ? t('low') : t('preserved')}</Text>
        <Text style={styles.texto}>{t('physicalPerformance')}: {textoDesempenho()}</Text>
        <Text style={styles.texto}>{t('sarcDiagnosis')}: {textoDiagnostico()}</Text>

        <Button
          title={t('menu')}
          onPress={() => navigation.navigate('menu')}
          containerStyle={{ borderRadius: 80, width: 320, marginLeft: 30, marginTop: 10 }}
          buttonStyle={{ backgroundColor: '#36b6b0', borderRadius: 80 }}
        />
        <Button
          title={t('newAssessment')}
          style={styles.button}
          titleStyle={{ color: 'white' }}
          containerStyle={{ borderRadius: 80, width: 320, marginLeft: 30, marginTop: 10 }}
          buttonStyle={{ backgroundColor: '#36b6b0', borderRadius: 80 }}
          onPress={handleIniciar}
          raised
        />
        <Button
          title={t('back')}
          onPress={() => navigation.goBack()}
          containerStyle={{ borderRadius: 80, width: 320, marginLeft: 30, marginTop: 10 }}
          buttonStyle={{ backgroundColor: '#bbf5f0', borderRadius: 80 }}
        />
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },

  // título no padrão solicitado
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
