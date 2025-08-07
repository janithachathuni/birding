import React from 'react';
import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>HomePage</Text>
      <Button title="Back to Login" className="bg-red-400" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}
