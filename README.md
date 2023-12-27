import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

export default function App() {
 const [result, setResult] = useState(null);

 const _authenticate = async () => {
    let result;
    try {
      result = await LocalAuthentication.authenticateAsync();
      setResult(result);
    } catch (e) {
      console.log(e);
    }
 };

 return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ marginBottom: 20 }}>Authenticate with Fingerprint:</Text>
      <TouchableOpacity onPress={_authenticate}>
        <Text>Authenticate</Text>
      </TouchableOpacity>
      {result && (
        <Text style={{ marginTop: 20 }}>
          Authenticated: {result.success ? 'Yes' : 'No'}
        </Text>
      )}
    </View>
 );
}
