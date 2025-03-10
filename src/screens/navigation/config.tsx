import { CadastroScreen } from "../cadastroProfissional";
import { MenuScreen } from "../menu";
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { CadastroPaciente } from "../cadastroPaciente";
import { LoginScreen } from "../login";
import { FormularioSarcFScreen } from "../formularioSarcF";
import { FormularioDesempenhoScreen } from "../formularioDesempenho";
import { ResetPasswordScreen} from "../resetPassword"
import { PacienteProvider } from "../../context/pacientes";
// import { ResultadoScreen } from "../resultado";
import { ResultadoAntropometriaScreen } from "../resultado/resultadoAntropometria";
import { AvaliacaoSarcopeniaScreen } from "../resultado/avaliacaoSarcopenia";
import {ResultadoDetalhadoScreen}from "../resultado/resultadoDetalhado";

export type NavegacaoPrincipalParams = {
    login: undefined,
    menu: undefined,
    cadastroProfissional: undefined,
    cadastroPaciente: undefined,
    formularioSarcF: undefined,
    formularioDesempenho: undefined,
    resetSenha:undefined,
    resultadoAntropometria: undefined,
    avaliacaoSarcopenia: {IMC: number, IMMEA: number, MMEA: number},
    resultadoDetalhado: {IMC: number, IMMEA: number, MMEA: number},
}

const Stack = createStackNavigator<NavegacaoPrincipalParams>();

export const TelaConfiguracao = () => (
    <NavigationContainer>
        <PacienteProvider>
            <Stack.Navigator screenOptions={{headerShown:false}}>
                {/* <Stack.Screen name="login" component={LoginScreen}/> */}
                <Stack.Screen name="menu" component={MenuScreen}/>
                <Stack.Screen name="cadastroProfissional" component={CadastroScreen} />
                <Stack.Screen name="cadastroPaciente" component={CadastroPaciente} />
                <Stack.Screen name="formularioSarcF" component={FormularioSarcFScreen} />
                <Stack.Screen name="formularioDesempenho"component={FormularioDesempenhoScreen}/>
                <Stack.Screen name="resetSenha"component={ResetPasswordScreen}/>
                <Stack.Screen name="resultadoAntropometria"component={ResultadoAntropometriaScreen}/>
                <Stack.Screen name="avaliacaoSarcopenia"component={AvaliacaoSarcopeniaScreen}/>
                <Stack.Screen name="resultadoDetalhado" component={ResultadoDetalhadoScreen}/>
            </Stack.Navigator>
        </PacienteProvider>

    </NavigationContainer>
)