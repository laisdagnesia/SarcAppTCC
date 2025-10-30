import React, {useState} from "react";
import { Text, ImageBackground, StyleSheet, ScrollView, Alert, View } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { NavegacaoPrincipalParams } from '../navigation/config';
import { Button, Input } from '@rneui/themed';
import { Picker } from '@react-native-picker/picker'
import { usePacienteContext } from "../../context/pacientes";
import { useLanguage } from "../../context/LanguageContext";

export function CadastroPaciente () {
  const { t, lang } = useLanguage();

  const [idade, setIdade] = useState<any>('');
  const [sexo, setSexo ] = useState('');
  const [raca, setRaca] = useState(''); 
  const [peso, setPeso] = useState<any>(''); 
  const [altura, setAltura] = useState<any>(''); 
  const [circBraco, setCircBraco] = useState<any>(''); 
  const [circPant, setCircPant] = useState<any>(''); 
  const [alturaJoelho, setAlturaJoelho] = useState<any>(''); 
  const [diametroCintura, setDiametroCintura] = useState<any>(''); 
  const [diametroQuadril, setDiametroQuadril] = useState<any>('');

  type navProps = StackNavigationProp<NavegacaoPrincipalParams,  'formularioSarcF' , 'cadastroPaciente'>;
  const navigation = useNavigation<navProps>();
  const { setPaciente } = usePacienteContext();

  const toNumber = (valor: string | number | null): number => {
    if (valor === null || valor === '') return 0;
    const num = typeof valor === 'string' ? parseFloat(valor.replace(',', '.')) : valor;
    return isNaN(num) ? 0 : num;
  };

  const handleAvancar = () => {
    if (idade?.toString().trim() === '' || isNaN(Number(idade))) {
      Alert.alert(t('errAge'));
      return;
    }
    if (sexo.trim() === '') {
      Alert.alert(t('errSex'));
      return;
    }
    if (raca.trim() === '') {
      Alert.alert(t('errRace'));
      return;
    }

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

    navigation.navigate('menu');
  };

  const handleInputChange = (text: any, setStateFunction: any) => {
    const formattedText = toNumber(text);
    setStateFunction(formattedText);
  };

  const renderTitulo = () => (
    <Text style={styles.titulo}>
      <Text style={styles.preto}>{t('titleLine1')}{'\n'}</Text>
      <Text style={styles.preto}>{t('titleLine2')}</Text>
    </Text>
  );

  return (
    <ScrollView>
      <ImageBackground style={styles.container} source={require('./../../../assets/images/bg.png')}>
        <View style={styles.tituloContainer}>{renderTitulo()}</View>

        <Text style={[styles.texto, { marginTop: 40 }]}>{t('age')}</Text>
        <Input
          placeholder=""
          placeholderTextColor={'black'}
          onChangeText={setIdade}
          value={idade?.toString()}
          keyboardType="number-pad"
          style={{ width: 200,color: 'black', marginBottom:-5}}
        />

        <Text style={[styles.texto, { marginTop: 10, marginBottom:10 }]}>{t('selectSex')}</Text>
        <Picker
          placeholder=""
          selectedValue={sexo}
          style={{color: 'black'}}
          onValueChange={(value) => setSexo(value)}
          selectionColor={'black'}
        >
          <Picker.Item label={t('selectSex')} value="" />
          <Picker.Item label={t('female')} value="feminino"/>
          <Picker.Item label={t('male')} value="masculino" />
        </Picker>

        <Text style={[styles.texto, { marginTop: 10, marginBottom:10 }]}>{t('selectRace')}</Text>
        <Picker
          placeholder=""
          style={{color: 'black'}}
          selectedValue={raca}
          onValueChange={(value) => setRaca(value)}
        >
          <Picker.Item label={t('selectRace')} value="" />
          <Picker.Item label={t('raceAfrican')} value="afrodescendente"/>
          <Picker.Item label={t('raceAsian')} value="asiatico" />
          <Picker.Item label={t('raceCaucasian')} value="caucasiano"/>
        </Picker>

        <Text style={[styles.texto,{ marginTop: 20}]}>{t('weight')}</Text>
        <Input
          placeholder={lang === 'en' ? 'e.g., 65.8' : 'Ex: 65.8'}
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
          value={peso === null ? '' : peso?.toString()} 
          keyboardType="number-pad"
          style={{color: 'black',marginBottom:-5 }}
        />

        <Text style={[styles.texto]}>{t('height')}</Text>
        <Input
          placeholder={t('inCm')}
          placeholderTextColor="black" 
          onChangeText={(text) => {
            if (text.trim() === '') {
              setAltura(null); 
            } else {
              let formattedText = text.replace(',', '.'); 
              if (!isNaN(formattedText as any) && formattedText.trim() !== '') {
                let numericValue = parseFloat(formattedText);
                if (numericValue > 100) numericValue = numericValue / 100;
                setAltura(numericValue); 
              }
            }
          }}
          value={altura === null ? '' : altura?.toString()} 
          keyboardType="number-pad"
          style={{color: 'black',marginBottom:-5 }}
        />

        <Text style={[styles.texto]}>{t('armCirc')}</Text>
        <Input
          placeholder={t('inCm')}
          placeholderTextColor="black" 
          value={circBraco?.toString()}
          onChangeText={(text) => handleInputChange(text, setCircBraco)}
          keyboardType="numeric"
          style={{color: 'black',marginBottom:-5 }}
        />

        <Text style={[styles.texto]}>{t('calfCirc')}</Text>
        <Input
          placeholder={t('inCm')}
          placeholderTextColor="black" 
          onChangeText={(text) => handleInputChange(text, setCircPant)}
          keyboardType="numeric"
          value={circPant?.toString()}
          style={{color: 'black',marginBottom:-5 }}
        /> 

        <Text style={[styles.texto]}>{t('kneeHeight')}</Text>
        <Input
          placeholder={t('inCm')}
          placeholderTextColor="black" 
          onChangeText={(text) => handleInputChange(text, setAlturaJoelho)}
          keyboardType="numeric"
          value={alturaJoelho?.toString()}
          style={{color: 'black',marginBottom:-5 }}
        />

        <Text style={[styles.texto]}>{t('waist')}</Text>
        <Input
          placeholder={t('inCm')}
          placeholderTextColor="black" 
          onChangeText={(text) => handleInputChange(text, setDiametroCintura)}
          value={diametroCintura?.toString()}
          keyboardType="number-pad"
          style={{color: 'black',marginBottom:-5 }}
        />

        <Text style={[styles.texto]}>{t('hip')}</Text>
        <Input
          placeholder={t('inCm')}
          placeholderTextColor="black" 
          onChangeText={(text) => handleInputChange(text, setDiametroQuadril)}
          value={diametroQuadril?.toString()}
          keyboardType="number-pad"
          style={{color: 'black',marginBottom:-5 }}
        />

        <Button 
          title={t('menu')}
          style={styles.button}
          titleStyle={{ color: 'white' }}
          containerStyle={{borderRadius: 80,width: 320, marginLeft:30}} 
          buttonStyle={{ backgroundColor: '#36b6b0',borderRadius: 80}}
          onPress={handleAvancar}
          raised
        />

        <Button
          title={t('back')}
          onPress={() => navigation.goBack()}
          containerStyle={{borderRadius: 80,width: 320, marginLeft:30,marginTop:10}} 
          buttonStyle={{ backgroundColor: '#bbf5f0', borderRadius: 80}}
          raised
        />
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  background: { width: '80%', height: '80%' },
  container: { flex: 1, justifyContent: 'center', padding: 5 },
  tituloContainer: { alignItems: 'center', marginTop: 20, marginBottom: 10, marginRight: 30 },
  titulo: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', lineHeight: 34 },
  preto: { color: '#000' },
  //vermelho: { color: '#d32f2f' },
  inputContainer: { backgroundColor: 'white' },
  button: { backgroundColor: 'white', borderRadius: 80, height: 40, width: 300 },
  texto: { color: 'black', fontSize: 20, marginLeft: 10, fontWeight: 'bold' },
});
