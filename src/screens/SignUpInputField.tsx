import * as React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { InputFieldProps, SignUpInputFieldProps } from './types';

export const InputField: React.FC<SignUpInputFieldProps> = ({ label, id, type = 'text', value, onChange }) => {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label} nativeID={`${id}Label`}>{label}</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={(text) => onChange(id, text)}
          accessibilityLabel={label}
          accessibilityLabelledBy={`${id}Label`}
          secureTextEntry={type === 'password'}
          testID={id}
        />
      </View>
    );
  };

const styles = StyleSheet.create({
  inputContainer: {
    borderRadius: 16,
    width: '100%',
    paddingLeft: 16,
    paddingTop: 16,
    paddingBottom: 16,
    overflow: 'hidden',
    flex: 1,
  },
  label: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: '#000000',
    letterSpacing: 0.14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  }
});