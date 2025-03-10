import { NavigationContainer } from '@react-navigation/native';
import { CadastroScreen } from '../cadastroProfissional';
import { MenuScreen } from '../menu';
import { createStackNavigator } from '@react-navigation/stack';
import {  createBottomTabNavigator } from '@react-navigation/bottom-tabs';

 const Tab = createBottomTabNavigator();

export function NavegacaoPrincipal() {
    return (
        <NavigationContainer>
           <Tab.Navigator>
             <Tab.Screen name="menu" component={MenuScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}
