import React, {useState} from "react";
import { Text, ImageBackground, StyleSheet,TextInput,ScrollView, Alert} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { NavegacaoPrincipalParams } from '../navigation/config';
import { Button,Input } from '@rneui/themed';
import { Picker } from '@react-native-picker/picker'
import { usePacienteContext } from "../../context/pacientes";
import { MaskedTextInput } from "react-native-mask-text";

export function CadastroPaciente (props: any) {
    const [idade, setIdade] = useState('');
    const [sexo, setSexo ] = useState('');
    const [ raca, setRaca] = useState(''); 
    const [ peso, setPeso] = useState(''); 
    const [ altura, setAltura] = useState(''); 
    const [ circBraco, setCircBraco] = useState(''); 
    const [ circPant, setCircPant] = useState(''); 
    const [ alturaJoelho, setAlturaJoelho] = useState(''); 
    const [ diametroCintura, setDiametroCintura] = useState(''); 
    const [ diametroQuadril, setDiametroQuadril] = useState('');

    type navProps = StackNavigationProp<NavegacaoPrincipalParams,  'formularioSarcF' , 'cadastroPaciente'>;
    const navigation = useNavigation<navProps>();
    const { setPaciente } = usePacienteContext();

        // Converte string para number seguro
        const toNumber = (valor: string | number | null): number => {
          if (valor === null || valor === '') return 0;
          const num = typeof valor === 'string' ? parseFloat(valor.replace(',', '.')) : valor;
          return isNaN(num) ? 0 : num;
        };

  const handleAvancar = () => {
    // Verificações
    if (idade.trim() === '' || isNaN(Number(idade))) {
      Alert.alert('Por favor, insira uma idade válida.');
      return;
    }
    if (sexo.trim() === '') {
      Alert.alert('Por favor, selecione o sexo.');
      return;
    }
    if (raca.trim() === '') {
      Alert.alert('Por favor, selecione a raça.');
      return;
    }

  
    // Salva no contexto
    setPaciente({
      idade: toNumber(idade),
      sexo: sexo as 'feminino' | 'masculino',
      raca: raca as 'afrodescendente' | 'asiatico' | 'caucasiano',
      peso: toNumber(peso),
      altura: toNumber(altura),
      circBraco: toNumber(circBraco),
      circPant: toNumber(circPant),
      alturaJoelho: toNumber(alturaJoelho),
      diametroCintura: toNumber(diametroCintura),
      diametroQuadril: toNumber(diametroQuadril),
    });
  
    console.log('📦 Paciente salvo no contexto:', {
      idade: toNumber(idade),
      sexo,
      raca,
      peso: toNumber(peso),
      altura: toNumber(altura),
      circBraco: toNumber(circBraco),
      circPant: toNumber(circPant),
      alturaJoelho: toNumber(alturaJoelho),
      diametroCintura: toNumber(diametroCintura),
      diametroQuadril: toNumber(diametroQuadril),
    });
  
    // Navega para o menu
    navigation.navigate('menu');
  };
  

  const handleInputChange = (text, setStateFunction) => {
    const formattedText = toNumber(text);
    setStateFunction(formattedText);
  }

    // ================================
   return (
    <ScrollView >
       <ImageBackground style={styles.container}
        source={require('./../../../assets/images/dadosPaciente.png')}
      >
      <Text style={[styles.texto, { marginTop: 110 }]}>Idade</Text>
        <Input
          placeholder=""
          placeholderTextColor={'black'}
          onChangeText={setIdade}
          value={idade}
          keyboardType="number-pad"
          style={{ width: 200,color: 'black', marginBottom:-5}}
        />
        <Text style={[styles.texto, { marginTop: 10, marginBottom:10 }]}>Selecione o sexo</Text>
        <Picker
          placeholder=""
          selectedValue={sexo}
          style={{color: 'black'}}
          onValueChange={(value) => setSexo(value)}
          selectionColor={'black'}
          >
            <Picker.Item label='Selecione o sexo' value='' />
            <Picker.Item label='Feminino' value='feminino'/>
            <Picker.Item label='Masculino' value='masculino' />
          </Picker>
          <Text style={[styles.texto, { marginTop: 10, marginBottom:10 }]}>Selecione a raça</Text>
          <Picker
          placeholder=""
          style={{color: 'black'}}
          selectedValue={raca}
          onValueChange={(value) => setRaca(value)}
          >
            <Picker.Item label='Selecione a raça' value='' />
            <Picker.Item label='Afrodescendente' value='afrodescendente'/>
            <Picker.Item label='Asiático' value='asiatico' />
            <Picker.Item label='Caucasiano' value='caucasiano'/>
          </Picker>
          
      <Text style={[styles.texto,{ marginTop: 20}]}>Peso</Text>
        <Input
         placeholder="Ex: 65.8"
         placeholderTextColor="black" 
         onChangeText={(text) => {
          if (text.trim() === '') {
        setPeso(null); 
          } else {
        let formattedText = text.replace(',', '.'); 
        if (/^\d*\.?\d*$/.test(formattedText)) {
          setPeso(formattedText); 
        }
          }
        }}
        value={peso === null ? '' : peso.toString()} 
        keyboardType="number-pad"
        style={{color: 'black',marginBottom:-5 }}
        />

<Text style={[styles.texto]}>Altura</Text>
<Input
  placeholder="Em cm"

  placeholderTextColor="black" 
  onChangeText={(text) => {
    if (text.trim() === '') {
      setAltura(null); 
    } else {
      let formattedText = text.replace(',', '.'); 
      if (!isNaN(formattedText) && formattedText.trim() !== '') {
        let numericValue = parseFloat(formattedText);
      if (numericValue > 100) {
          numericValue = numericValue / 100;
        }
        setAltura(numericValue); 
      }
    }
  }}
  value={altura === null ? '' : altura.toString()} 
  keyboardType="number-pad"
  style={{color: 'black',marginBottom:-5 }}
/>
      <Text style={[styles.texto]}>Circunferência do Braço</Text>
        <Input
         placeholder="Em cm"
         placeholderTextColor="black" 
         value={circBraco}
         onChangeText={(text) => handleInputChange(text, setCircBraco)}
         keyboardType="numeric"
        style={{color: 'black',marginBottom:-5 }}
        />
      <Text style={[styles.texto]}>Circunferência da Panturrilha</Text>
        <Input
       placeholder="Em cm"
       placeholderTextColor="black" 
      onChangeText={(text) => handleInputChange(text, setCircPant)}
      keyboardType="numeric"
       value={circPant}
          style={{color: 'black',marginBottom:-5 }}
        /> 
      <Text style={[styles.texto]}>Altura do Joelho</Text>
        <Input
          placeholder="Em cm"
          placeholderTextColor="black" 
          onChangeText={(text) => handleInputChange(text, setAlturaJoelho)}
          keyboardType="numeric"
          value={alturaJoelho}
          style={{color: 'black',marginBottom:-5 }}
          />
      <Text style={[styles.texto]}>Diâmetro da Cintura</Text>
        <Input
          placeholder="Em cm"
          placeholderTextColor="black" 
         onChangeText={(text) => handleInputChange(text, setDiametroCintura)}
          value={diametroCintura}
          keyboardType="number-pad"
          style={{color: 'black',marginBottom:-5 }}
          />
      <Text style={[styles.texto]}>Diâmetro do Quadril</Text>
        <Input
        placeholder="Em cm"
        placeholderTextColor="black" 
        onChangeText={(text) => handleInputChange(text, setDiametroQuadril)}
        value={diametroQuadril}
        keyboardType="number-pad"
          style={{color: 'black',marginBottom:-5 }}
        />
          <Button 
          title="Menu"
          style={styles.button}
          titleStyle={{ color: 'white' }}
          containerStyle={{borderRadius: 80,width: 320, marginLeft:30}} 
          buttonStyle={{ backgroundColor: '#36b6b0',borderRadius: 80}}
         onPress={handleAvancar}  
          raised={true}></Button>
          <Button title="Voltar" onPress={() => navigation.goBack()}
            containerStyle={{borderRadius: 80,width: 320, marginLeft:30,marginTop:10}} 
            buttonStyle={{ backgroundColor: '#bbf5f0',borderRadius: 80}}
            raised={true}></Button>
             </ImageBackground>
      </ScrollView>

  );
}

const styles = StyleSheet.create({
  background: {
    width: '80%',
    height: '80%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 5,
  },
  inputContainer: {
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 80,
    height: 40,
    width: 300
  },
  texto:{
    color:'black',
    fontSize:20,
    marginLeft:10,
    fontWeight: 'bold',
  }
});