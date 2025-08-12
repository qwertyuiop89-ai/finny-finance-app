import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

const CustomInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  multiline = false,
  numberOfLines = 1,
  editable = true,
  style,
  inputStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputContainerFocused,
        error && styles.inputContainerError,
        !editable && styles.inputContainerDisabled
      ]}>
        {leftIcon && (
          <Ionicons 
            name={leftIcon} 
            size={20} 
            color={isFocused ? COLORS.primary : COLORS.darkGray}
            style={styles.leftIcon}
          />
        )}
        
        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || secureTextEntry) && styles.inputWithRightIcon,
            multiline && styles.multilineInput,
            inputStyle
          ]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.darkGray}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity 
            onPress={togglePasswordVisibility}
            style={styles.rightIcon}
          >
            <Ionicons 
              name={showPassword ? 'eye-off' : 'eye'} 
              size={20} 
              color={COLORS.darkGray}
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !secureTextEntry && (
          <TouchableOpacity 
            onPress={onRightIconPress}
            style={styles.rightIcon}
          >
            <Ionicons 
              name={rightIcon} 
              size={20} 
              color={COLORS.darkGray}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputContainerFocused: {
    borderColor: COLORS.primary,
    shadowOpacity: 0.2,
    elevation: 4,
  },
  inputContainerError: {
    borderColor: COLORS.danger,
  },
  inputContainerDisabled: {
    backgroundColor: COLORS.lightGray,
    opacity: 0.7,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.darkGray,
    paddingVertical: 16,
  },
  inputWithLeftIcon: {
    paddingLeft: 12,
  },
  inputWithRightIcon: {
    paddingRight: 12,
  },
  multilineInput: {
    paddingVertical: 12,
    textAlignVertical: 'top',
  },
  leftIcon: {
    marginRight: 4,
  },
  rightIcon: {
    padding: 4,
    marginLeft: 4,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.danger,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default CustomInput;