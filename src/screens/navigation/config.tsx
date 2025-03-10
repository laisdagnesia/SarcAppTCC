import { MenuScreen } from "../menu";
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { CadastroPaciente } from "../cadastroPaciente";
import { FormularioSarcFScreen } from "../formularioSarcF";
import { FormularioDesempenhoScreen } from "../formularioDesempenho";
import { PacienteProvider } from "../../context/pacientes";
import { ResultadoAntropometriaScreen } from "../resultado/resultadoAntropometria";
import { AvaliacaoSarcopeniaScreen } from "../resultado/avaliacaoSarcopenia";
import {ResultadoDetalhadoScreen}from "../resultado/resultadoDetalhado";
import * as React from 'react';


export type NavegacaoPrincipalParams = {
    menu: undefined,
    cadastroPaciente: undefined,
    formularioSarcF: undefined,
    formularioDesempenho: undefined,
    resultadoAntropometria: undefined,
    avaliacaoSarcopenia: {IMC: number, IMMEA: number, MMEA: number},
    resultadoDetalhado: {IMC: number, IMMEA: number, MMEA: number},
}

const Stack = createStackNavigator<NavegacaoPrincipalParams>();

export const TelaConfiguracao = () => (
    <NavigationContainer>
        <PacienteProvider>
            <Stack.Navigator screenOptions={{headerShown:false}}>
                <Stack.Screen name="menu" component={MenuScreen}/>
                <Stack.Screen name="cadastroPaciente" component={CadastroPaciente} />
                <Stack.Screen name="formularioSarcF" component={FormularioSarcFScreen} />
                <Stack.Screen name="formularioDesempenho"component={FormularioDesempenhoScreen}/>
                <Stack.Screen name="resultadoAntropometria"component={ResultadoAntropometriaScreen}/>
                <Stack.Screen name="avaliacaoSarcopenia"component={AvaliacaoSarcopeniaScreen}/>
                <Stack.Screen name="resultadoDetalhado" component={ResultadoDetalhadoScreen}/>
            </Stack.Navigator>
        </PacienteProvider>

    </NavigationContainer>
)