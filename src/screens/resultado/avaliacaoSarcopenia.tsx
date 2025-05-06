import * as React from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { usePacienteContext } from '../../context/pacientes';
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { NavegacaoPrincipalParams } from '../navigation/config';
import { Button } from '@rneui/themed';

export function AvaliacaoSarcopeniaScreen() {
  const navigation = useNavigation<StackNavigationProp<NavegacaoPrincipalParams, 'menu'>>();
  const route = useRoute<RouteProp<NavegacaoPrincipalParams, 'avaliacaoSarcopenia'>>();

  // 🛡️ Proteção caso os dados não venham (evita crash do app)
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

  const handleNovaAvaliacao = () => {
    setFormularioSarcF(undefined);
    setDesempenho(undefined);
    setPontosSarc(0);
    navigation.navigate('inicio');
  };

  const pontuacoesFinais = () => {
    if (!paciente) return;

    if (pontosSarc >= 4) setSarcF(true);

    let pontos = pontosSarc;
    if (paciente.circBraco) {
      pontos += paciente.sexo === 'feminino'
        ? (paciente.circBraco <= 25 ? 10 : 0)
        : (paciente.circBraco <= 27 ? 10 : 0);
      setSarcFAC(pontos >= 10);
    }

    let pontosCalf = pontosSarc;
    if (paciente.circPant) {
      pontosCalf += paciente.sexo === 'feminino'
        ? (paciente.circPant <= 33 ? 10 : 0)
        : (paciente.circPant <= 34 ? 10 : 0);
      setSarcCalF(pontosCalf >= 11);
    }

    let pontosEBM = pontosSarc;
    pontosEBM += paciente.idade >= 75 ? 10 : 0;
    pontosEBM += IMC <= 21 ? 10 : 0;
    setSarcFEBM(pontosEBM >= 12);

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
      // MMEA e IMMEA
      if ((paciente.sexo === 'masculino' && MMEA < 20) || (paciente.sexo === 'feminino' && MMEA < 15))
        baixaMassa = true;
      if ((paciente.sexo === 'masculino' && IMMEA < 7) || (paciente.sexo === 'feminino' && IMMEA < 5.5))
        baixaMassa = true;

      // Força
      if ((paciente.sexo === 'masculino' && desempenho.forcaPalmar < 27) ||
          (paciente.sexo === 'feminino' && desempenho.forcaPalmar < 16))
        baixaForca = true;

      if (desempenho.tempoLevantar && desempenho.tempoLevantar > 15)
        baixaForca = true;

      // Desempenho físico
      if (desempenho.velocidadeMarcha && desempenho.velocidadeMarcha <= 0.8)
        baixoDesempenho = true;
      if (desempenho.shortPhysicalPerformance && desempenho.shortPhysicalPerformance <= 8)
        baixoDesempenho = true;
      if (desempenho.timeUp && desempenho.timeUp >= 20)
        baixoDesempenho = true;
      if (desempenho.caminhadaCurta && desempenho.caminhadaCurta >= 6)
        baixoDesempenho = true;
    }

    setBaixaMassaMuscular(baixaMassa);
    setBaixaForcaMuscular(baixaForca);
    setBaixoDesempenhoFisico(baixoDesempenho);
  };

  React.useEffect(() => {
    diagnostico();
    pontuacoesFinais();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ImageBackground style={styles.container} source={require('./../../../assets/images/avaliacaoAntro.png')}>
        <Text style={styles.texto}>Força muscular: {desempenho?.forcaPalmar || desempenho?.tempoLevantar ? (baixaForcaMuscular ? 'Baixa' : 'Preservada') : 'Não tem dados suficientes'}</Text>
        <Text style={styles.texto}>Massa muscular: {baixaMassaMuscular ? 'Baixa' : 'Preservada'}</Text>
        <Text style={styles.texto}>Desempenho físico: {(desempenho?.velocidadeMarcha || desempenho?.shortPhysicalPerformance || desempenho?.timeUp || desempenho?.caminhadaCurta) ? (baixoDesempenhoFisico ? 'Baixo desempenho físico' : 'Desempenho físico preservado') : 'Não tem dados suficientes'}</Text>
        <Text style={styles.texto}>
          Diagnóstico para Sarcopenia: {
            baixaForcaMuscular && baixaMassaMuscular && baixoDesempenhoFisico
              ? 'Paciente sarcopênico grave'
              : baixaMassaMuscular && (baixaForcaMuscular || baixoDesempenhoFisico)
              ? 'Paciente sarcopênico'
              : (baixaForcaMuscular || baixoDesempenhoFisico)
              ? 'Paciente com sarcopenia provável'
              : 'Paciente não sarcopênico'
          }
        </Text>
        <Button title="Resultados da Triagem"
        onPress= {() => navigation.navigate('resultadoDetalhado',{IMC, IMMEA, MMEA})}  
        style={styles.button}
        containerStyle={{borderRadius: 80,width: 320, marginLeft:30,marginTop:20}}
        titleStyle={{ color: 'white' }} 
        buttonStyle={{ backgroundColor: '#36b6b0',borderRadius: 80}}
        raised={true}></Button>
        <Button title="Voltar" onPress={() => navigation.goBack()} containerStyle={{ borderRadius: 80, width: 320, marginLeft: 30, marginTop: 10 }} buttonStyle={{ backgroundColor: '#bbf5f0', borderRadius: 80 }} />
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
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
    marginTop:60
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
