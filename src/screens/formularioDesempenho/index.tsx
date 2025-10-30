import React, {useState, useEffect} from "react";
import { Text, ImageBackground, StyleSheet, View, ScrollView } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { NavegacaoPrincipalParams } from '../navigation/config';
import { Button, Input } from '@rneui/themed';
import { usePacienteContext } from "../../context/pacientes";
import { MaskedTextInput } from "react-native-mask-text";
import { useLanguage } from "../../context/LanguageContext"; // 👈 idioma

export function FormularioDesempenhoScreen() {
  const [forcaPalmar, setForcaPalmar] = useState('');
  const [tempoLevantar, setTempoLevantar] = useState('');
  const [massaMuscularApendicular, setMassaMuscularApendicular] = useState(''); 
  const [indiceMassaMuscularApendicular, setIndiceMassaMuscularApendicular] = useState(''); 
  const [velocidadeMarcha, setVelocidadeMarcha] = useState(''); 
  const [shortPhysicalPerformance, setShortPhysicalPerformance] = useState(''); 
  const [timeUp, setTimeUp] = useState(''); 
  const [caminhadaCurta, setCaminhadaCurta] = useState(''); 

  type navProps = StackNavigationProp<NavegacaoPrincipalParams, 'menu', 'cadastroPaciente'>;
  const navigation = useNavigation<navProps>();
  const { setDesempenho, desempenho } = usePacienteContext();
  const { t } = useLanguage(); // 👈 tradução

  const handleMassaChange = (text: string) => {
    const formattedText = text.replace(',', '.');
    if (/^\d*\.?\d*$/.test(formattedText)) {
      setMassaMuscularApendicular(formattedText);
    }
  };

  // salva no contexto quando mudar
  useEffect(() => {
    if (
      desempenho?.forcaPalmar !== forcaPalmar ||
      desempenho?.tempoLevantar !== tempoLevantar ||
      desempenho?.massaMuscularApendicular !== massaMuscularApendicular ||
      desempenho?.indiceMassaMuscularApendicular !== indiceMassaMuscularApendicular ||
      desempenho?.velocidadeMarcha !== velocidadeMarcha ||
      desempenho?.shortPhysicalPerformance !== shortPhysicalPerformance ||
      desempenho?.timeUp !== timeUp ||
      desempenho?.caminhadaCurta !== caminhadaCurta
    ) {
      setDesempenho({
        forcaPalmar,
        tempoLevantar,
        massaMuscularApendicular,
        indiceMassaMuscularApendicular,
        velocidadeMarcha,
        shortPhysicalPerformance,
        timeUp,
        caminhadaCurta
      });
    }
  }, [
    forcaPalmar, tempoLevantar, massaMuscularApendicular, indiceMassaMuscularApendicular,
    velocidadeMarcha, shortPhysicalPerformance, timeUp, caminhadaCurta, desempenho, setDesempenho
  ]);

  // carrega valores do contexto na abertura
  useEffect(() => {
    if (desempenho) {
      setForcaPalmar(desempenho.forcaPalmar?.toString() || '');
      setTempoLevantar(desempenho.tempoLevantar || '');
      setMassaMuscularApendicular(desempenho.massaMuscularApendicular || '');
      setIndiceMassaMuscularApendicular(desempenho.indiceMassaMuscularApendicular || '');
      setVelocidadeMarcha(desempenho.velocidadeMarcha || '');
      setShortPhysicalPerformance(desempenho.shortPhysicalPerformance || '');
      setTimeUp(desempenho.timeUp || '');
      setCaminhadaCurta(desempenho.caminhadaCurta || '');
    }
  }, []);

  const handleAvancar = async () => {
    setDesempenho({
      forcaPalmar,
      tempoLevantar,
      massaMuscularApendicular,
      indiceMassaMuscularApendicular,
      velocidadeMarcha
    });
    navigation.navigate('avaliacaoSarcopenia');
  };

  // 🔤 título 2 linhas (preto + vermelho)
  const renderTituloTopo = () => (
    <Text style={styles.tituloTopo}>
      <Text style={styles.preto}>{t('physical')}{'\n'}</Text>
      <Text style={styles.preto}>{t('performance')}</Text>
    </Text>
  );

  return (
    <ScrollView>
      <ImageBackground
        style={styles.container}
        source={require('./../../../assets/images/bg.png')}
      >
        {/* título dinâmico */}
        <View style={styles.tituloContainer}>{renderTituloTopo()}</View>

        {/* FORÇA MUSCULAR */}
        <Text style={[styles.secaoTitulo, { marginTop: 12 }]}>{t('muscleStrengthSec')}</Text>
        <Text style={styles.texto}>{t('handgrip')}</Text>
        <Input
          placeholder=""
          inputStyle={{ color: "black" }}
          onChangeText={setForcaPalmar}
          keyboardType="number-pad"
          value={forcaPalmar}
        />

        <Text style={styles.texto}>{t('chairStand')}</Text>
        <Input
          placeholder=""
          inputStyle={{ color: "black" }}
          onChangeText={setTempoLevantar}
          keyboardType="number-pad"
          value={tempoLevantar}
        />

        {/* MASSA MUSCULAR */}
        <Text style={[styles.secaoTitulo]}>{t('muscleMassSec')}</Text>
        <Text style={styles.texto}>{t('appendicularMass')}</Text>
        <Input
          placeholder=""
          inputStyle={{ color: "black" }}
          onChangeText={handleMassaChange}
          keyboardType="numeric"
          value={massaMuscularApendicular}
        />

        <Text style={styles.texto}>{t('appendicularIndex')}</Text>
        <Input
          placeholder=""
          inputStyle={{ color: "black" }}
          onChangeText={setIndiceMassaMuscularApendicular}
          keyboardType="number-pad"
          value={indiceMassaMuscularApendicular}
        />

        {/* DESEMPENHO FÍSICO */}
        <Text style={[styles.secaoTitulo]}>{t('physicalPerfSec')}</Text>
        <Text style={styles.texto}>{t('gaitSpeed')}</Text>
        <MaskedTextInput
          mask="9.9"
          placeholder=""
          onChangeText={(text, rawText) => setVelocidadeMarcha(rawText)}
          keyboardType="number-pad"
          value={velocidadeMarcha}
          style={styles.mask}
        />

        <Text style={styles.texto}>{t('sppb')}</Text>
        <Input
          placeholder=""
          inputStyle={{ color: "black" }}
          onChangeText={setShortPhysicalPerformance}
          keyboardType="number-pad"
          value={shortPhysicalPerformance}
        />

        <Text style={styles.texto}>{t('tug')}</Text>
        <Input
          placeholder=""
          inputStyle={{ color: "black" }}
          onChangeText={setTimeUp}
          keyboardType="number-pad"
          value={timeUp}
        />

        <Text style={styles.texto}>{t('walk400')}</Text>
        <Input
          placeholder=""
          inputStyle={{ color: "black" }}
          onChangeText={setCaminhadaCurta}
          keyboardType="number-pad"
          value={caminhadaCurta}
        />

        <Button
          title={t('diagSarcopenia')}
          style={styles.button}
          titleStyle={{ color: 'white' }}
          containerStyle={{ borderRadius: 80, width: 320, marginLeft: 30 }}
          buttonStyle={{ backgroundColor: '#36b6b0', borderRadius: 80 }}
          onPress={handleAvancar}
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

  // 🔤 título topo — usa o padrão que você pediu antes
  tituloContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    marginRight: 30,
  },
  tituloTopo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 34,
  },
  preto: { color: '#000' },
  vermelho: { color: '#d32f2f' },

  // textos/seções
  texto: {
    color: 'black',
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold'
  },
  secaoTitulo: {
    color: 'black',
    marginLeft: 10,
    fontSize: 22,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginBottom: 12,
    marginTop: 20,
  },

  button: {
    borderRadius: 80,
    height: 40,
    width: 20,
    marginTop: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 5,
  },
  mask: {
    color: "black",
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingHorizontal: 10,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10
  }
});
