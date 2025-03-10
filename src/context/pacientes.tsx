import { createContext, useContext, useState } from "react";


type Paciente = {
    idade: number;
    sexo: 'feminino'|'masculino';
    raca: 'afrodescendente'|'asiatico'|'caucasiano';
    peso: number;
    altura: number;
    circBraco: number; 
    circPant: number; 
    alturaJoelho: number; 
    diametroCintura: number;
    diametroQuadril: number;
}

type Desempenho = {
    massaMuscularApendicular: any,
    indiceMassaMuscularApendicular: any,
    tempoLevantar: any,
    forcaPalmar: any,
    velocidadeMarcha: any,
    shortPhysicalPerformance: any,
    timeUp: any,
    caminhadaCurta: any,
}

type FormularioSarcF = {
    forca: 'nenhuma'|'alguma'|'muito',
    assistencia: 'nenhuma'|'alguma'|'muito',
    levantar: 'nenhuma'|'alguma'|'muito',
    subir: 'nenhuma'|'alguma'|'muito',
    quedas: 'nenhuma'|'alguma'|'muito',
}

export const PacienteContext = createContext<{paciente?: Paciente,
    setPaciente?:any,
    pontosSarc: number,
    setPontosSarc?: any,
    desempenho?: Desempenho,
    setDesempenho?: any,
    formularioSarcF?: FormularioSarcF,
    setFormularioSarcF?: any  

}>({pontosSarc: 0});

export function PacienteProvider({children}: any) {

    const [ paciente, setPaciente ] = useState<undefined|Paciente>();
    const [ pontosSarc, setPontosSarc ] = useState<number>(0);
    // const [ pontosCalf, setPontosCalf ] = useState<number>(0);
    const [ desempenho, setDesempenho ] = useState<undefined|Desempenho>();
    const [ formularioSarcF, setFormularioSarcF ] = useState<undefined|FormularioSarcF>();

    return (
        <PacienteContext.Provider value={{paciente, setPaciente, pontosSarc, setPontosSarc, desempenho, setDesempenho, formularioSarcF, setFormularioSarcF}}>
            {children}
        </PacienteContext.Provider>
    )
}

export const usePacienteContext = () => useContext(PacienteContext);