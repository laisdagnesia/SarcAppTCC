import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Lang = 'pt' | 'en';

type LanguageContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STRINGS: Record<Lang, Record<string, string>> = {
  pt: {
    welcome: 'Bem-vindo ao',
    appName: 'SarcApp',
    titleLine1: 'Dados do',
    titleLine2: 'Paciente',
    age: 'Idade',
    selectSex: 'Selecione o sexo',
    selectRace: 'Selecione a raça',
    female: 'Feminino',
    male: 'Masculino',
    raceAfrican: 'Afrodescendente',
    raceAsian: 'Asiático',
    raceCaucasian: 'Caucasiano',
    weight: 'Peso',
    height: 'Altura',
    inCm: 'Em cm',
    armCirc: 'Circunferência do Braço',
    calfCirc: 'Circunferência da Panturrilha',
    kneeHeight: 'Altura do Joelho',
    waist: 'Diâmetro da Cintura',
    hip: 'Diâmetro do Quadril',
    menu: 'Menu',
    back: 'Voltar',
    errAge: 'Por favor, insira uma idade válida.',
    errSex: 'Por favor, selecione o sexo.',
    errRace: 'Por favor, selecione a raça.',
    startEval: 'Iniciar Avaliação',
    health: 'Avaliação',
    assessment: 'Nutricional',
    resultadoAntropometria: 'Resultado Antropometria',
    formularioTriagem: 'Formulário de Triagem',
    avaliacaoSarcopenia: 'Avaliação para Sarcopenia',
      physical: 'Desempenho',
  performance: 'Físico',
  muscleStrengthSec: '» FORÇA MUSCULAR',
  handgrip: 'Força de preensão palmar (kg)',
  chairStand: 'Teste do sentar e levantar da cadeira (segundos)',
  muscleMassSec: '» MASSA MUSCULAR',
  appendicularMass: 'Massa muscular esquelética apendicular (MMEA)',
  appendicularIndex: 'Índice de massa muscular esquelética apendicular (kg/m²)',
  physicalPerfSec: '» DESEMPENHO FÍSICO',
  gaitSpeed: 'Velocidade de marcha (m/s)',
  sppb: 'Pontuação Short Physical Performance Battery (SPPB)',
  tug: 'Pontuação Time Up and Go (TUG)',
  walk400: 'Teste de Caminhada de 400 metros (minutos)',
  diagSarcopenia: 'Diagnóstico para Sarcopenia',
  anthroTitleLine1: 'Resultado',
  anthroTitleLine2: 'Antropometria',
  estimated: 'Estimado',
  notInformed: 'Não informado',
  heightEstimated: 'Altura Estimada',
  meters: 'metros',
  bmi: 'IMC',
  asmm: 'MMEA',
  asmmIndex: 'IMMEA',
  bmiOver30: ' IMC maior que 30 Kg/m²',
  noSufficientData: 'Não há dados suficientes',
  obsCannotCalcASMM: 'Observação: Não foi possível calcular o MMEA e o IMMEA pois o IMC é maior que 29.9',
  incompletePatientData: 'Dados incompletos do paciente',
   screening: 'Triagem',
  attention: 'Atenção',
  sarcfIncompleteWarn: 'Você não selecionou todas as opções. Isso pode afetar a precisão do resultado. Deseja continuar?',
  yesContinue: 'Sim, continuar',
  noBack: 'Não, voltar',
  sarcfResult: 'Resultado da Triagem',
  // Perguntas SARC-F
  sarcfQ1: 'Qual a sua dificuldade em carregar 10 libras (4,5 kg)?',
  sarcfQ2: 'Qual a sua dificuldade em caminhar através de um cômodo?',
  sarcfQ3: 'Qual a sua dificuldade para levantar de uma cadeira ou cama?',
  sarcfQ4: 'Qual a sua dificuldade em subir 10 degraus?',
  sarcfQ5: 'Quantas vezes você caiu no último ano?',
   detailedTitle1: 'Resultado',
  detailedTitle2: 'Detalhado',
  sarcF: 'Sarc-F',
  sarcFPlusAC: 'Sarc-F + AC',
  sarcCalf: 'Sarc-CalF',
  sarcFPlusEBM: 'Sarc-F + EBM',
  sarcCalfPlusAC: 'Sarc-CalF + AC',
  formNotFilled: 'Formulário SARC-F não foi preenchido',
  nonSarcopenic: 'Paciente não sarcopênico',
  suggestiveSarcopenia: 'Sugestivo de sarcopenia',
  insufficientData: 'Dados insuficientes',
  goToPerformance: 'Avaliação para Sarcopenia',

   sarcopeniaTitle1: 'Avaliação de',
  sarcopeniaTitle2: 'Sarcopenia',
  muscleStrength: 'Força muscular',
  muscleMass: 'Massa muscular',
  physicalPerformance: 'Desempenho físico',
  sarcDiagnosis: 'Diagnóstico para Sarcopenia',
  low: 'Baixa',
  preserved: 'Preservada',
  lowPhysicalPerformance: 'Baixo desempenho físico',
  preservedPhysicalPerformance: 'Desempenho físico preservado',
  severeSarcopenia: 'Paciente sarcopênico grave',
  sarcopenic: 'Paciente sarcopênico',
  probableSarcopenia: 'Paciente com sarcopenia provável',
  newAssessment: 'Nova Avaliação',

  },
  en: {
    welcome: 'Welcome to',
    appName: 'SarcApp',
    titleLine1: 'Patient',
    titleLine2: 'Information',
    age: 'Age',
    selectSex: 'Select sex',
    selectRace: 'Select race/ethnicity',
    female: 'Female',
    male: 'Male',
    raceAfrican: 'African descent',
    raceAsian: 'Asian',
    raceCaucasian: 'Caucasian',
    weight: 'Weight',
    height: 'Height',
    inCm: 'In cm',
    armCirc: 'Arm circumference',
    calfCirc: 'Calf circumference',
    kneeHeight: 'Knee height',
    waist: 'Waist diameter',
    hip: 'Hip diameter',
    menu: 'Menu',
    back: 'Back',
    errAge: 'Please enter a valid age.',
    errSex: 'Please select sex.',
    errRace: 'Please select race/ethnicity.',
    startEval: 'Start Evaluation',
    health: 'Health',
    assessment: 'Assessment',
    resultadoAntropometria: 'Anthropometry Results',
    formularioTriagem: 'Screening Form',
    avaliacaoSarcopenia: 'Sarcopenia Assessment',
      physical: 'Physical',
  performance: 'Performance',
  muscleStrengthSec: '» MUSCLE STRENGTH',
  handgrip: 'Handgrip strength (kg)',
  chairStand: 'Chair stand test (seconds)',
  muscleMassSec: '» MUSCLE MASS',
  appendicularMass: 'Appendicular skeletal muscle mass (ASMM)',
  appendicularIndex: 'Appendicular skeletal muscle mass index (kg/m²)',
  physicalPerfSec: '» PHYSICAL PERFORMANCE',
  gaitSpeed: 'Gait speed (m/s)',
  sppb: 'Short Physical Performance Battery (SPPB) score',
  tug: 'Timed Up and Go (TUG) score',
  walk400: '400-meter walk test (minutes)',
  diagSarcopenia: 'Sarcopenia Diagnosis',
  anthroTitleLine1: 'Anthropometry',
  anthroTitleLine2: 'Results',
  estimated: 'Estimated',
  notInformed: 'Not informed',
  heightEstimated: 'Estimated Height',
  meters: 'meters',
  bmi: 'BMI',
  asmm: 'ASMM',
  asmmIndex: 'ASMMI',
  bmiOver30: ' BMI greater than 30 kg/m²',
  noSufficientData: 'Not enough data',
  obsCannotCalcASMM: 'Note: Could not calculate ASMM and ASMMI because BMI is greater than 29.9',
  incompletePatientData: 'Incomplete patient data',
   screening: 'Screening',
  attention: 'Attention',
  sarcfIncompleteWarn: 'You did not select all options. This may affect the accuracy of the result. Do you want to continue?',
  yesContinue: 'Yes, continue',
  noBack: 'No, go back',
  sarcfResult: 'Screening Result',
  // SARC-F Questions
  sarcfQ1: 'How difficult is it for you to carry 10 pounds (4.5 kg)?',
  sarcfQ2: 'How difficult is it for you to walk across a room?',
  sarcfQ3: 'How difficult is it for you to get up from a chair or bed?',
  sarcfQ4: 'How difficult is it for you to climb 10 stairs?',
  sarcfQ5: 'How many times did you fall in the last year?',
    detailedTitle1: 'Detailed',
  detailedTitle2: 'Results',
  sarcF: 'Sarc-F',
  sarcFPlusAC: 'Sarc-F + AC',
  sarcCalf: 'Sarc-CalF',
  sarcFPlusEBM: 'Sarc-F + EBM',
  sarcCalfPlusAC: 'Sarc-CalF + AC',
  formNotFilled: 'SARC-F form was not completed',
  nonSarcopenic: 'Non-sarcopenic patient',
  suggestiveSarcopenia: 'Suggestive of sarcopenia',
  insufficientData: 'Insufficient data',
  goToPerformance: 'Sarcopenia Assessment',

    sarcopeniaTitle1: 'Sarcopenia',
  sarcopeniaTitle2: 'Assessment',
  muscleStrength: 'Muscle strength',
  muscleMass: 'Muscle mass',
  physicalPerformance: 'Physical performance',
  sarcDiagnosis: 'Sarcopenia Diagnosis',
  low: 'Low',
  preserved: 'Preserved',
  lowPhysicalPerformance: 'Low physical performance',
  preservedPhysicalPerformance: 'Physical performance preserved',
  severeSarcopenia: 'Severe sarcopenia',
  sarcopenic: 'Sarcopenic patient',
  probableSarcopenia: 'Probable sarcopenia',
  newAssessment: 'New Assessment',
  },
};

const STORAGE_KEY = '@app_lang';

export const LanguageProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>('pt');

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved === 'pt' || saved === 'en') setLangState(saved);
    })();
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    AsyncStorage.setItem(STORAGE_KEY, l).catch(() => {});
  };

  const t = (key: string) => STRINGS[lang][key] ?? key;

  const value = useMemo(() => ({ lang, setLang, t }), [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
