import React from 'react';
import { 
  StyleSheet, 
  TextInput, 
  View, 
  Text, 
  TextInputProps,
  useColorScheme
} from 'react-native';
import Colors from '@/constants/Colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: object;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  containerStyle,
  leftIcon,
  rightIcon,
  style,
  ...props
}: InputProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
      
      <View style={[
        styles.inputContainer,
        { 
          backgroundColor: colors.inputBackground,
          borderColor: error ? colors.error : colors.inputBorder 
        }
      ]}>
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        
        <TextInput
          style={[
            styles.input,
            { 
              color: colors.text,
              paddingLeft: leftIcon ? 0 : 12,
              paddingRight: rightIcon ? 0 : 12,
            },
            style
          ]}
          placeholderTextColor={colors.placeholderText}
          {...props}
        />
        
        {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
      </View>
      
      {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    height: 48,
    paddingVertical: 12,
    fontSize: 16,
  },
  iconContainer: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
  },
});