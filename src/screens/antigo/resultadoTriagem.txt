import * as React from 'react';
import { View, Text,StyleSheet,ImageBackground, ScrollView } from 'react-native';
import { usePacienteContext } from '../../context/pacientes';
import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { NavegacaoPrincipalParams } from '../navigation/config';
import { Button} from '@rneui/themed';

interface AvaliacaoProps {
    route: RouteProp<NavegacaoPrincipalParams, 'resultadoDetalhado'>
}

export function ResultadoDetalhadoScreen ({route}: AvaliacaoProps) {
    type navProps = StackNavigationProp<NavegacaoPrincipalParams,  'menu' , 'formularioDesempenho'>;
    const navigation = useNavigation<navProps>();
    const { IMC, IMMEA, MMEA  } = route.params;

    const { paciente, pontosSarc, desempenho } = usePacienteContext();
    
    const [ baixaMassaMuscular, setBaixaMassaMuscular]  =  React.useState<boolean>(false);

    const [ sarcF, setSarcF ] = React.useState<boolean>(false)
    const [ sarcFAC, setSarcFAC ] = React.useState<boolean>(false)
    const [ sarcCalF, setSarcCalF ] = React.useState<boolean>(false)
    const [ sarcFEBM, setSarcFEBM ] = React.useState<boolean>(false)
    const [ sarcCalFAC, setSarcCalFAC ] = React.useState<boolean>(false)
    //--------------

    const [ baixaForcaMuscular, setBaixaForcaMuscular]  =  React.useState<boolean>(false);
    const [ baixoDesempenhoFisico, setBaixoDesempenhoFisico]  =  React.useState<boolean>(false);
    // ------------

    // ===================================
const pontuacoesFinais = async () => {
    console.log("Função pontuacoesFinais foi chamada!");

    if (!paciente) {
        console.warn("Nenhum paciente encontrado!");
        return;
    }

    console.log("Paciente encontrado:", paciente);
    console.log("Pontos SARC iniciais:", pontosSarc);

    // ========= PONTUAÇÕES SARC ===========//
    if (pontosSarc >= 4) {
        setSarcF(true);
        console.log(`Pontos totais diagnóstico: ${pontosSarc}`);
    }

    // SARC-F+AC
    let pontos = pontosSarc;
    const circBraco = Number(paciente.circBraco);
    if (!isNaN(circBraco)) {
        if (paciente.sexo === 'feminino') {
            pontos += circBraco <= 25 ? 10 : 0;
        } else {
            pontos += circBraco <= 27 ? 10 : 0;
        }
        console.log(`Pontos SARC-F+AC: ${pontos}`);
        setSarcFAC(pontos >= 10);
    }

    // SARC-CALF
    let pontosCalf = pontosSarc;
    const circPant = Number(paciente.circPant);
    if (!isNaN(circBraco) && !isNaN(circPant)) {
        console.log(`Circunferência do braço: ${circBraco}, Panturrilha: ${circPant}`);

        if (paciente.sexo === 'feminino') {
            pontosCalf += circPant <= 33 ? 10 : 0;
        } else {
            pontosCalf += circPant <= 34 ? 10 : 0;
        }
        console.log(`Pontos SARC-CALF: ${pontosCalf}`);
        setSarcCalF(pontosCalf >= 11);
    } else {
        console.warn("circBraco ou circPant não são valores numéricos válidos!");
    }

    // SARC-F + EBM
    let pontosEBM = pontosSarc;
    pontosEBM += paciente.idade >= 75 ? 10 : 0;
    pontosEBM += IMC <= 21 ? 10 : 0;
    console.log(`Pontos SARC-F+EBM: ${pontosEBM}`);
    setSarcFEBM(pontosEBM >= 12);

    // SARC-CalF+AC
    let pontosCalFAC = pontosSarc;
    if (!isNaN(circPant) && !isNaN(circBraco)) {
        if (paciente.sexo === 'feminino') {
            pontosCalFAC += circPant <= 33 ? 10 : 0;
            pontosCalFAC += circBraco <= 25 ? 10 : 0;
        } else {
            pontosCalFAC += circPant <= 34 ? 10 : 0;
            pontosCalFAC += circBraco <= 27 ? 10 : 0;
        }
        console.log(`Pontos SARC-CalF+AC: ${pontosCalFAC}`);
        setSarcCalFAC(pontosCalFAC >= 11);
    }
};

    
    const diagnostico = () => {

        let baixaForcaMuscular = false;
        let baixoDesempenhoFisico = false;
        let baixaMassaMuscular = false;
        if (paciente && desempenho) {
            
            // =============== BAIXA MASSA MUSCULAR ===============//
            //BASEADO NO MMEA
            if(paciente.sexo == 'masculino' && MMEA < 20 )
                baixaMassaMuscular = true;
            else if(paciente.sexo == 'feminino' && MMEA <15)
                baixaMassaMuscular = true;
            
            //BASEADO NO IMMEA
            if(paciente.sexo == 'masculino' && IMMEA < 7)
                baixaMassaMuscular = true;
            else if(paciente.sexo == 'feminino' && IMMEA < 5.5 )
                baixaMassaMuscular = true;
            
            setBaixaMassaMuscular(baixaMassaMuscular)

            // ================= FORÇA MUSCULAR =============//
            //Força Palmar
            if ((paciente.sexo === 'masculino' && desempenho?.forcaPalmar < 27) || 
                (paciente.sexo === 'feminino' && desempenho?.forcaPalmar < 16)) 
                baixaForcaMuscular = true;
            
            // TEMPO LEVANTAR
            if (desempenho?.tempoLevantar > 15) baixaForcaMuscular = true;
            
            // VELOCIDADE MARCHA
            if (desempenho?.velocidadeMarcha <= 0.8) baixoDesempenhoFisico = true;
            
            // SHORT PHYSICAL PERFORMANCE
            if (desempenho?.shortPhysicalPerformance <= 8) baixoDesempenhoFisico = true;
                    
            // TIME UP GO
            if (desempenho?.timeUp >= 20) baixoDesempenhoFisico = true;
    
            // CAMINHADA CURTA
            if (desempenho?.caminhadaCurta >= 6) baixoDesempenhoFisico = true;
        }
    
        setBaixaForcaMuscular(baixaForcaMuscular)
        setBaixoDesempenhoFisico(baixoDesempenhoFisico)
    }


    // ---------
    React.useEffect(() => {
        diagnostico()
        pontuacoesFinais()
    }, [])

    // ====================================
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ImageBackground style={styles.container}
        source={require('./../../../assets/images/diagnostico.png')}
      >
      {/* Foi feito uma condicao para caso o valor seja vazio, ou seja, ele nao seja respondido, ele fique como -1, caso responda nenhuma ele entende como 0  */}

       <Text style={[styles.texto]}> Sarc-F: {pontosSarc < 0 ? ' Formulário Sarc-F não foi preenchido' : pontosSarc === 0 ? 'Paciente não sarcopênico' : pontosSarc >= 4 ? 'Sugestivo de sarcopenia' : 'Paciente não sarcopênico'} </Text>
    
        <Text style={[styles.texto]}>Sarc-F + AC: {pontosSarc < 0 ? ' Dados insuficientes' : paciente?.circBraco ? (sarcFAC ? 'Sugestivo de sarcopenia' : 'Paciente não sarcopênico') : ' Não tem dados suficientes'}</Text>

       <Text style={[styles.texto]}>Sarc-CalF: {pontosSarc < 0 ? ' Dados insuficientes' : paciente?.circPant ? (sarcCalF ? 'Sugestivo de sarcopenia' : 'Paciente não sarcopênico') : ' Não tem dados suficientes'} </Text> 
        
        <Text style={[styles.texto]}>Sarc-F + EBM: {pontosSarc < 0 ? ' Dados insuficientes' : paciente?.idade && IMC ? (sarcFEBM ? 'Sugestivo de sarcopenia' : 'Paciente não sarcopênico') : ' Não tem dados suficientes'}</Text> 
        
        <Text style={[styles.texto]}> Sarc-CalF+AC:{pontosSarc < 0 ? ' Dados insuficientes' : paciente?.circBraco && paciente?.circPant ? (sarcCalFAC ? 'Sugestivo de sarcopenia' : 'Paciente não sarcopênico') : ' Não tem dados suficientes'}</Text>
        <Button 
        title="Avaliação para Sarcopenia"
        style={styles.button}
        containerStyle={{borderRadius: 80,width: 320, marginLeft:30,marginTop:20}}
        titleStyle={{ color: 'white' }} 
        buttonStyle={{ backgroundColor: '#36b6b0',borderRadius: 80}}
        onPress= {() => navigation.navigate('formularioDesempenho')}  
        raised={true}></Button>

         <Button title="Voltar" onPress={() => navigation.goBack()}
         containerStyle={{borderRadius: 80,width: 320, marginLeft:30, marginTop:10}} 
         buttonStyle={{ backgroundColor: '#bbf5f0',borderRadius: 80}}
         raised={true}></Button>
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
      fontWeight: 'bold',
      marginTop:10, 
      marginBottom:10,
      padding:5
    },
    button: {
        backgroundColor: 'blue',
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