import * as React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { InputFieldProps } from '../screens/types';

export const InputField: React.FC<InputFieldProps> = ({
  label,
  type = 'text',
  id,
  value,
  onChange
}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label} nativeID={`${id}-label`}>
        {label}
      </Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        secureTextEntry={type === 'password'}
        accessibilityLabel={label}
        accessibilityLabelledBy={`${id}-label`}
        testID={id}
      />
    </View>
  );
};



const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    borderRadius: 16,
    minHeight: 52,
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontFamily: 'Roboto',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
});