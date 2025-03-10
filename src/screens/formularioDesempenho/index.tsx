import React, {useState, useEffect} from "react";
import { Text, ImageBackground, StyleSheet,TextInput, View,ScrollView,Image} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { NavegacaoPrincipalParams } from '../navigation/config';
import { Button, Input } from '@rneui/themed';
import { usePacienteContext } from "../../context/pacientes";
import { MaskedTextInput } from "react-native-mask-text";


export function FormularioDesempenhoScreen (props: any) {
    const [forcaPalmar, setForcaPalmar] = useState('');
    const [tempoLevantar, setTempoLevantar] = useState ('');
    const [ massaMuscularApendicular, setMassaMuscularApendicular] = useState(''); 
    const [ indiceMassaMuscularApendicular, setIndiceMassaMuscularApendicular] = useState(''); 
    const [ velocidadeMarcha, setVelocidadeMarcha] = useState(''); 
    const [ shortPhysicalPerformance, setShortPhysicalPerformance] = useState(''); 
    const [ timeUp, setTimeUp] = useState(''); 
    const [ caminhadaCurta, setCaminhadaCurta] = useState(''); 


    type navProps = StackNavigationProp<NavegacaoPrincipalParams,  'menu' , 'cadastroPaciente'>;
    const navigation = useNavigation<navProps>();
    const { setDesempenho, desempenho } = usePacienteContext();

    const handleInputChange = (text) => {
      const formattedText = text.replace(',', '.');
      
      if (/^\d*\.?\d*$/.test(formattedText)) {
        setMassaMuscularApendicular(formattedText)
      }
    }

    //==================================================
        // TESTE PARA SALVAR INFORMACOES

 useEffect(() => {
    // Atualiza o contexto apenas se os valores mudarem
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
      setDesempenho({ forcaPalmar, tempoLevantar, massaMuscularApendicular, indiceMassaMuscularApendicular, velocidadeMarcha, shortPhysicalPerformance, timeUp, caminhadaCurta });
    }
  }, [forcaPalmar, tempoLevantar, massaMuscularApendicular ,indiceMassaMuscularApendicular, velocidadeMarcha,shortPhysicalPerformance, timeUp, caminhadaCurta ,desempenho, setDesempenho]);
  
  useEffect(() => {
    // Inicializa os estados locais com os dados do contexto
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

                // FIM DO TESTE PARA SALVAR INFORMACOES
    //==================================================
    
    // ==================================================
    const handleAvancar = async () => {
        setDesempenho({ forcaPalmar, tempoLevantar, massaMuscularApendicular, indiceMassaMuscularApendicular, velocidadeMarcha })
        navigation.navigate('resultadoAntropometria');
    }
    // ==================================================
   return (
    <ScrollView>
    <ImageBackground style={styles.container}
    source={require('./../../../assets/images/formDesempenho.png')}
  >
<View>
<Text style={[styles.titulo, { marginTop: 150, marginBottom:20 }]}>» FORÇA MUSCULAR</Text>
<Text style={[styles.texto,]}>Força de preensão palmar (kg)</Text>
<Input placeholder=''    
    inputStyle={{color:"black"}} 
    onChangeText={setForcaPalmar}
    keyboardType="number-pad"
    value={forcaPalmar} />
<Text style={[styles.texto]}>Teste do sentar e levantar da cadeira (segundos)</Text>
<Input placeholder=''    
    inputStyle={{color:"black"}} 
    onChangeText={setTempoLevantar}
    keyboardType="number-pad"
    value={tempoLevantar} />
<Text style={[styles.titulo, { marginBottom:20 }]}>» MASSA MUSCULAR</Text>
<Text style={[styles.texto]}>Massa muscular esquelética apendicular (MMEA)</Text>

<Input
      placeholder=''
      inputStyle={{ color: "black" }}
      onChangeText={handleInputChange}
      keyboardType="numeric"
      value={massaMuscularApendicular}
    />

<Text style={[styles.texto]}>Índice de massa muscular esquelética apendicular (kg/m²) </Text>
<Input placeholder=''    
    inputStyle={{color:"black"}} 
    onChangeText={setIndiceMassaMuscularApendicular}
    keyboardType="number-pad"
    value={indiceMassaMuscularApendicular}/>

    <Text style={[styles.titulo, {marginBottom:20 }]}>» DESEMPENHO FISICO</Text>
<Text style={[styles.texto]}>Velocidade de marcha (m/s)</Text>
<MaskedTextInput
        mask="9.9"
        placeholder=""
        onChangeText={(text, rawText) => setVelocidadeMarcha(rawText)}
        keyboardType="number-pad"
        value={velocidadeMarcha}
        style={styles.mask}
      />

<Text style={[styles.texto]}>Pontuação Short Physical Perfomance Battery (SPPB)</Text>
<Input placeholder=''    
    inputStyle={{color:"black"}} 
    onChangeText={setShortPhysicalPerformance}
    keyboardType="number-pad"
    value={shortPhysicalPerformance}/>
<Text style={[styles.texto]}>Pontuação Time Up and Go (TUG)</Text>
<Input placeholder=''    
    inputStyle={{color:"black"}} 
    onChangeText={setTimeUp}
    keyboardType="number-pad"
    value={timeUp}/>
<Text style={[styles.texto]}>Teste de Caminhada de 400 metros (minutos)</Text>
<Input placeholder=''    
    inputStyle={{color:"black"}} 
    onChangeText={setCaminhadaCurta}
    keyboardType="number-pad"
    value={caminhadaCurta}/>
  <Button 
      title="Resultados"
      style={styles.button}
      titleStyle={{ color: 'white' }}
      containerStyle={{borderRadius: 80,width: 320, marginLeft:30}} 
      buttonStyle={{ backgroundColor: '#36b6b0',borderRadius: 80}}
      onPress={handleAvancar}  
      raised={true}></Button>
      <Button title="Voltar" onPress={() => navigation.goBack()}
      containerStyle={{borderRadius: 80,width: 320, marginLeft:30, marginTop:10}} 
     buttonStyle={{ backgroundColor: '#bbf5f0',borderRadius: 80}}
     raised={true}></Button>
</View>            
</ImageBackground>
</ScrollView>
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
    },
    texto:{
      color:'black',
      marginLeft:10, 
      fontSize:20, 
      fontWeight: 'bold'
    },
    titulo:{
        color:'black',
        marginLeft:10, 
        fontSize:22, 
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
  button: {
    borderRadius: 80,
    height: 40,
    width: 20,
    marginTop:10
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
          marginLeft:10,
          marginRight:10       
  }

});
