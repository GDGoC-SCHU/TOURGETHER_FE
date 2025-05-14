import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({message = '로딩 중...'}: LoadingScreenProps) {
  return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3897f0"/>
        <Text style={styles.text}>{message}</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
});