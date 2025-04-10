import React, {useState, useEffect} from "react";
import { Text, ImageBackground, StyleSheet,TextInput, Alert} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { NavegacaoPrincipalParams } from '../navigation/config';
import { Button } from '@rneui/themed';
import { Picker } from '@react-native-picker/picker'
import { usePacienteContext } from "../../context/pacientes";

export function FormularioSarcFScreen (props: any) {
    const [forca, setForca] = useState('');
    const [assistencia, setAssistencia] = useState ('');
    const [ levantar, setLevantar] = useState(''); 
    const [ subir, setSubir] = useState(''); 
    const [ quedas, setQuedas] = useState(''); 

    type navProps = StackNavigationProp<NavegacaoPrincipalParams,  'menu' , 'formularioDesempenho'>;
    const navigation = useNavigation<navProps>();
    const  { setPontosSarc } = usePacienteContext();
    const {setFormularioSarcF,formularioSarcF} = usePacienteContext();

    // =====================================
    const getPontos = (variavel: string) => {
      switch(variavel) { 
        case '' : return -1;
        case "nenhuma": return 0;
        case "alguma": return 1; 
        case "muito": return 2; 
        default: return 0;
      }
    }

    const handleAvancar = async () => {
      if (!forca || !assistencia || !levantar || !subir || !quedas) {
        Alert.alert(
          'Atenção',
          'Você não selecionou todas as opções. Isso pode afetar a precisão do resultado. Deseja continuar?',
          [
            {
              text: 'Sim, continuar',
              onPress: () => {
                let pontos = 0;
                pontos += getPontos(forca);
                pontos += getPontos(assistencia);
                pontos += getPontos(levantar);
                pontos += getPontos(subir);
                pontos += getPontos(quedas);
    
                console.log(`Pontos totais: ${pontos}`);
     
                setFormularioSarcF({ forca, assistencia, levantar, subir, quedas });
                setPontosSarc(pontos);
                navigation.navigate('formularioDesempenho');
              },
            },
            {
              text: 'Não, voltar',
              onPress: () => {},
            },
          ]
        );
      } else {
        let pontos = 0;
        pontos += getPontos(forca);
        pontos += getPontos(assistencia);
        pontos += getPontos(levantar);
        pontos += getPontos(subir);
        pontos += getPontos(quedas);
    
        console.log(`Pontos totais: ${pontos}`);
     
        setFormularioSarcF({ forca, assistencia, levantar, subir, quedas });
        setPontosSarc(pontos);
        navigation.navigate('formularioDesempenho');
      }
    }
    
  useEffect(() => {
    // Atualiza o contexto apenas se os valores mudarem
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
    // Inicializa os estados locais com os dados do contexto
    if (formularioSarcF) {
      setForca(formularioSarcF.forca || '');
      setAssistencia(formularioSarcF.assistencia || '');
      setLevantar(formularioSarcF.levantar || '');
      setSubir(formularioSarcF.subir || '');
      setQuedas(formularioSarcF.quedas || '');
    }
  }, []);
  

const handleVoltar = () => {
  navigation.goBack();
};

   return (
       <ImageBackground style={styles.container}
        source={require('./../../../assets/images/formSarcF.png')}
      >
        <Text style={[styles.texto, { marginTop: 100 }]}>Qual a sua dificuldade em carregar 10 libras (4.5kg)?</Text>
        <Picker
          selectedValue={forca}
          onValueChange={(value) => setForca(value)}
          style={{color: 'black'}}
          placeholder="Selecione">
            <Picker.Item label='Selecione' value=''/>
            <Picker.Item label='Nenhuma' value='nenhuma'/>
            <Picker.Item label='Alguma' value='alguma' />
            <Picker.Item label='Muito ou incapaz' value='muito'/>
            {/* <Picker.Item label='Incapaz' value='incapaz' /> */}
          </Picker>
        <Text style={styles.texto}>Qual a sua dificuldade em caminhar através de um cômodo?</Text>
        <Picker
          placeholder="Selecione"
          selectedValue={assistencia}
          style={{color: 'black'}}
          onValueChange={(value) => setAssistencia(value)}>
            <Picker.Item label='Selecione' value=''/>
            <Picker.Item label='Nenhuma' value='nenhuma'/>
            <Picker.Item label='Alguma' value='alguma' />
            <Picker.Item label='Muito ou incapaz' value='muito'/>
            {/* <Picker.Item label='Incapaz' value='incapaz' /> */}
          </Picker>
        <Text style={styles.texto}>Qual a sua dificuldade para levantar de uma cadeira ou cama?</Text>
        <Picker
          placeholder="Selecione"
          selectedValue={levantar}
          style={{color: 'black'}}
          onValueChange={(value) => setLevantar(value)}>
            <Picker.Item label='Selecione' value=''/>
            <Picker.Item label='Nenhuma' value='nenhuma'/>
            <Picker.Item label='Alguma' value='alguma' />
            <Picker.Item label='Muito ou incapaz' value='muito'/>
            {/* <Picker.Item label='Incapaz sem ajuda' value='incapaz' /> */}
          </Picker>
        <Text style={styles.texto}>Qual a sua dificuldade em subir 10 degraus?</Text>
        <Picker
          placeholder="Selecione"
          selectedValue={subir}
          style={{color: 'black'}}
          onValueChange={(value) => setSubir(value)}>
            <Picker.Item label='Selecione' value=''/>
            <Picker.Item label='Nenhuma' value='nenhuma'/>
            <Picker.Item label='Alguma' value='alguma' />
            <Picker.Item label='Muito ou incapaz' value='muito'/>
            {/* <Picker.Item label='Incapaz' value='incapaz' /> */}
          </Picker>
        <Text style={styles.texto}>Quantas vezes você caiu no último ano ?</Text>
        <Picker
          placeholder="Selecione"
          selectedValue={quedas}
          style={{color: 'black'}}
          onValueChange={(value) => setQuedas(value)}>
            <Picker.Item label='Selecione' value=''/>
            <Picker.Item label='Nenhuma' value='nenhuma'/>
            <Picker.Item label='1 a 3' value='alguma' />
            <Picker.Item label='4 ou mais' value='muito'/>
          </Picker>
          <Button 
          title="Avaliação para Sarcopenia"
          style={styles.button}
          titleStyle={{ color: 'white' }}
          containerStyle={{borderRadius: 80,width: 320, marginLeft:40}} 
          buttonStyle={{ backgroundColor: '#36b6b0',borderRadius: 80}}
         onPress={handleAvancar}  
          raised={true}></Button>
          
          <Button title="Voltar" 
          onPress={() => navigation.goBack()}
          style={styles.button}
          containerStyle={{borderRadius: 80,width: 320, marginLeft:40, marginTop:10}} 
          buttonStyle={{ backgroundColor: '#bbf5f0',borderRadius: 80}}
         raised={true}></Button>             
    </ImageBackground>
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
      fontSize:20,
      marginLeft:10,
      fontWeight: 'bold',
    },
    button: {
      backgroundColor: '#bbf5f0',
      borderRadius: 80,
      height: 40,
      width: 400
    },

});
