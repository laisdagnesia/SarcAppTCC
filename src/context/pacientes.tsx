// import { createContext, useContext, useState } from "react";
// import React from 'react';


// type Paciente = {
//     idade: number;
//     sexo: 'feminino'|'masculino';
//     raca: 'afrodescendente'|'asiatico'|'caucasiano';
//     peso: number;
//     altura: number;
//     circBraco: number; 
//     circPant: number; 
//     alturaJoelho: number; 
//     diametroCintura: number;
//     diametroQuadril: number;
// }

// type Desempenho = {
//     massaMuscularApendicular: any,
//     indiceMassaMuscularApendicular: any,
//     tempoLevantar: any,
//     forcaPalmar: any,
//     velocidadeMarcha: any,
//     shortPhysicalPerformance: any,
//     timeUp: any,
//     caminhadaCurta: any,
// }

// type FormularioSarcF = {
//     forca: 'nenhuma'|'alguma'|'muito',
//     assistencia: 'nenhuma'|'alguma'|'muito',
//     levantar: 'nenhuma'|'alguma'|'muito',
//     subir: 'nenhuma'|'alguma'|'muito',
//     quedas: 'nenhuma'|'alguma'|'muito',
// }

// export const PacienteContext = createContext<{paciente?: Paciente,
//     setPaciente?:any,
//     pontosSarc: number,
//     setPontosSarc?: any,
//     desempenho?: Desempenho,
//     setDesempenho?: any,
//     formularioSarcF?: FormularioSarcF,
//     setFormularioSarcF?: any  

// }>({pontosSarc: 0});

// export function PacienteProvider({children}: any) {

//     const [ paciente, setPaciente ] = useState<undefined|Paciente>();
//     const [ pontosSarc, setPontosSarc ] = useState<number>(0);
//     const [ desempenho, setDesempenho ] = useState<undefined|Desempenho>();
//     const [ formularioSarcF, setFormularioSarcF ] = useState<undefined|FormularioSarcF>();

//     return (
//         <PacienteContext.Provider value={{paciente, setPaciente, pontosSarc, setPontosSarc, desempenho, setDesempenho, formularioSarcF, setFormularioSarcF}}>
//             {children}
//         </PacienteContext.Provider>
//     )
// }

// export const usePacienteContext = () => useContext(PacienteContext);

import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Paciente = {
  idade: number;
  sexo: 'feminino' | 'masculino';
  raca: 'afrodescendente' | 'asiatico' | 'caucasiano';
  peso: number;
  altura: number;
  circBraco: number;
  circPant: number;
  alturaJoelho: number;
  diametroCintura: number;
  diametroQuadril: number;
};

type Desempenho = {
  massaMuscularApendicular: any,
  indiceMassaMuscularApendicular: any,
  tempoLevantar: any,
  forcaPalmar: any,
  velocidadeMarcha: any,
  shortPhysicalPerformance: any,
  timeUp: any,
  caminhadaCurta: any,
};

type FormularioSarcF = {
  forca: 'nenhuma' | 'alguma' | 'muito',
  assistencia: 'nenhuma' | 'alguma' | 'muito',
  levantar: 'nenhuma' | 'alguma' | 'muito',
  subir: 'nenhuma' | 'alguma' | 'muito',
  quedas: 'nenhuma' | 'alguma' | 'muito',
};

export const PacienteContext = createContext<{
  paciente?: Paciente;
  setPaciente?: (p: Paciente) => void;
  desempenho?: Desempenho;
  setDesempenho?: (d: Desempenho) => void;
  formularioSarcF?: FormularioSarcF;
  setFormularioSarcF?: (f: FormularioSarcF) => void;
  pontosSarc: number;
  setPontosSarc?: (p: number) => void;
}>({
  pontosSarc: 0,
});

export function PacienteProvider({ children }: any) {
  const [paciente, setPacienteState] = useState<Paciente | undefined>();
  const [desempenho, setDesempenhoState] = useState<Desempenho | undefined>();
  const [formularioSarcF, setFormularioSarcFState] = useState<FormularioSarcF | undefined>();
  const [pontosSarc, setPontosSarc] = useState<number>(0);

  // 🔄 Carrega dados ao iniciar
  useEffect(() => {
    const loadAll = async () => {
      const p = await AsyncStorage.getItem('@paciente');
      const d = await AsyncStorage.getItem('@desempenho');
      const f = await AsyncStorage.getItem('@formularioSarcF');
      if (p) {
        setPacienteState(JSON.parse(p));
        console.log('🧠 Paciente carregado do AsyncStorage');
      }
      if (d) {
        setDesempenhoState(JSON.parse(d));
        console.log('🧠 Desempenho carregado do AsyncStorage');
      }
      if (f) {
        setFormularioSarcFState(JSON.parse(f));
        console.log('🧠 Formulário Sarc-F carregado do AsyncStorage');
      }
    };
    loadAll();
  }, []);

  // 💾 Salva paciente
  const setPaciente = async (p: Paciente) => {
    setPacienteState(p);
    await AsyncStorage.setItem('@paciente', JSON.stringify(p));
    console.log('💾 Paciente salvo:', p);
  };

  // 💾 Salva desempenho
  const setDesempenho = async (d: Desempenho) => {
    setDesempenhoState(d);
    await AsyncStorage.setItem('@desempenho', JSON.stringify(d));
    console.log('💾 Desempenho salvo:', d);
  };

  // 💾 Salva Sarc-F
  const setFormularioSarcF = async (f: FormularioSarcF) => {
    setFormularioSarcFState(f);
    await AsyncStorage.setItem('@formularioSarcF', JSON.stringify(f));
    console.log('💾 Formulário Sarc-F salvo:', f);
  };

  return (
    <PacienteContext.Provider
      value={{
        paciente,
        setPaciente,
        desempenho,
        setDesempenho,
        formularioSarcF,
        setFormularioSarcF,
        pontosSarc,
        setPontosSarc,
      }}
    >
      {children}
    </PacienteContext.Provider>
  );
}

export const usePacienteContext = () => useContext(PacienteContext);
