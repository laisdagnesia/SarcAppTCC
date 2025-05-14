import { usePacienteContext } from '../context/pacientes';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useResetarAvaliacao() {
  const {
    setPaciente,
    setDesempenho,
    setFormularioSarcF,
    setPontosSarc
  } = usePacienteContext();

  const resetarAvaliacao = async () => {
    setPaciente?.(undefined);
    setDesempenho?.(undefined);
    setFormularioSarcF?.(undefined);
    setPontosSarc?.(0);

    try {
      await AsyncStorage.multiRemove([
  '@paciente',
  '@desempenho',
  '@formularioSarcF'
]);

      console.log('✅ Avaliação resetada com sucesso');
    } catch (error) {
      console.error('❌ Erro ao limpar armazenamento:', error);
    }
  };

  return resetarAvaliacao;
}
