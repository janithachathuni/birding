import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { useFonts, SchibstedGrotesk_400Regular, SchibstedGrotesk_700Bold } from '@expo-google-fonts/schibsted-grotesk';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [fontsLoaded] = useFonts({
    SchibstedGrotesk_400Regular,
    SchibstedGrotesk_700Bold,
  });

  const handleSubmit = () => {
    // Navigate to birder dashboard (Home screen)
    navigation.replace('Home');
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Image Section
      <View style={styles.imageSection}>
        <Image
          source={require('../assets/signup_image1.jpg')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <View style={styles.imageOverlay}>
          <View style={styles.birdInfoTop}>
            <Text style={styles.birdName}>Blue-Tailed Bee Eater</Text>
            <Text style={styles.birdScientific}>Merops phillipinus</Text>
          </View>
          <View style={styles.locationInfo}>
            <Ionicons name="location" size={18} color="white" />
            <Text style={styles.locationText}>Thalangama Lake</Text>
          </View>
        </View>
      </View> */}

      {/* Form Section */}
      <View style={styles.formSection}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Sign in to your account</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotPassword}>Forgot password?</Text>
          </TouchableOpacity>

          <View style={styles.signupSection}>
            <Text style={styles.signupText}>Don't have an account?</Text>
            <TouchableOpacity 
              style={styles.signupButton}
              onPress={() => navigation.navigate('SignUp')}
            >
              <Text style={styles.signupButtonText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  imageSection: {
    flex: 1,
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 40,
  },
  birdInfoTop: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  birdName: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'SchibstedGrotesk_700Bold',
  },
  birdScientific: {
    color: 'white',
    fontSize: 16,
    fontStyle: 'italic',
    fontFamily: 'SchibstedGrotesk_400Regular',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 16,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  locationText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'SchibstedGrotesk_400Regular',
  },
  formSection: {
    flex: 1,
    backgroundColor: '#fffdef',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 28,
    marginBottom: 40,
    fontFamily: 'SchibstedGrotesk_700Bold',
    color: '#000',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'SchibstedGrotesk_400Regular',
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#8B4513',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    fontFamily: 'SchibstedGrotesk_400Regular',
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#8B4513',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'SchibstedGrotesk_700Bold',
  },
  forgotPassword: {
    color: '#8B4513',
    marginTop: 16,
    fontSize: 14,
    fontFamily: 'SchibstedGrotesk_400Regular',
  },
  signupSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
  },
  signupText: {
    fontSize: 14,
    fontFamily: 'SchibstedGrotesk_400Regular',
    color: '#000',
  },
  signupButton: {
    marginLeft: 20,
    borderWidth: 1,
    borderColor: '#8B4513',
    backgroundColor: '#f8eec8',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  signupButtonText: {
    fontSize: 14,
    fontFamily: 'SchibstedGrotesk_400Regular',
    color: '#000',
  },
});