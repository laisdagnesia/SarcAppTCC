import React, { useEffect } from 'react';
import {TelaConfiguracao} from './src/screens/navigation/config';
import * as Updates from 'expo-updates';
import { StatusBar, View } from 'react-native';

export default function App() {

  const atualizar = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      alert(`Erro ao atualizar: ${error}`);
    }
  }

  useEffect(() => {
    atualizar()
  }, []) 



  return (
    <View style={{flex: 1}}>
      <StatusBar  translucent backgroundColor="transparent"/>
      <TelaConfiguracao/>
    </View>
  );
}
