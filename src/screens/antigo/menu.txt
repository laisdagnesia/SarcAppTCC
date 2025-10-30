import * as React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import { Button } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack'
import { NavegacaoPrincipalParams } from '../navigation/config';

export function MenuScreen(props: any) {
    type navProps = StackNavigationProp<NavegacaoPrincipalParams,  'inicio' , 'cadastroPaciente'>;
    const navigation = useNavigation<navProps>();
    return (
        <ImageBackground style={styles.container}
            source={require('./../../../assets/images/menu.png')}
        >
        <Button 
            title="Resultado Antropometria"
            style={styles.button}
            buttonStyle={styles.button}
            titleStyle={{ color: 'white' }}
            containerStyle={{marginTop:50,borderRadius: 80}}
            onPress= {() => navigation.navigate('resultadoAntropometria')} 
            raised={true}>      
        </Button>

        <Button 
                title="Formulário de Triagem"
                style={styles.button}
                buttonStyle={styles.button}
                titleStyle={{ color: 'white' }}
                containerStyle={{marginTop:50,borderRadius: 80}}
                onPress= {() => navigation.navigate('formularioSarcF')} 
                raised={true}></Button>
           <Button 
                title="Avaliação para Sarcopenia"
                style={styles.button}
                buttonStyle={styles.button}
                titleStyle={{ color: 'white' }}
                containerStyle={{marginTop:50,borderRadius: 80}}
              onPress= {() => navigation.navigate('formularioDesempenho')} 
                raised={true}></Button>
            <Button 
                title="Voltar"
                style={styles.button}
                titleStyle={{ color: 'white' }}
                buttonStyle={{ backgroundColor: '#bbf5f0',borderRadius: 80, height: 40,width: 300}}
                containerStyle={{marginTop:50,borderRadius: 80}}
                onPress= {() => navigation.navigate('inicio')} 
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
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#36b6b0',
        borderRadius: 80,
        height: 40,
        width: 300
    },
}); 