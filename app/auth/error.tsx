import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useLocalSearchParams, useRouter} from 'expo-router';

export default function AuthError() {
  const router = useRouter();
  const {message} = useLocalSearchParams<{ message: string }>();

  const goToLogin = () => {
    router.replace("/");
  };

  return (
      <View style={styles.container}>
        <Text style={styles.title}>인증 오류</Text>
        <Text style={styles.message}>{message || '인증 과정에서 오류가 발생했습니다.'}</Text>

        <TouchableOpacity style={styles.button} onPress={goToLogin}>
          <Text style={styles.buttonText}>로그인 페이지로 이동</Text>
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#555',
  },
  button: {
    backgroundColor: '#3897f0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});