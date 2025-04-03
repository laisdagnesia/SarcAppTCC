import { NavigationContainer } from '@react-navigation/native';
import { InicioScreen } from '../inicio';
import { createStackNavigator } from '@react-navigation/stack';
import {  createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';

 const Tab = createBottomTabNavigator();

export function NavegacaoPrincipal() {
    return (
        <NavigationContainer>
           <Tab.Navigator>
             <Tab.Screen name="inicio" component={InicioScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}
