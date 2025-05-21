import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
  View
} from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  loadingText?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export default function Button({
  title,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  loadingText,
  style,
  textStyle,
  disabled,
  icon,
  ...props
}: ButtonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // Determine styles based on variant
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: colorScheme === 'light' ? '#E9D8FD' : '#553C9A',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.tint,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
        };
      case 'destructive':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.error,
        };
      default:
        return {
          backgroundColor: colors.tint,
        };
    }
  };

  // Determine text color based on variant
  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
      case 'ghost':
        return {
          color: colors.tint,
        };
      case 'secondary':
        return {
          color: colorScheme === 'light' ? '#553C9A' : '#FFFFFF',
        };
      case 'destructive':
        return {
          color: colors.error,
        };
      default:
        return {
          color: '#FFFFFF',
        };
    }
  };

  // Determine size styles
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 24,
        };
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 20,
        };
    }
  };

  const getTextSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          fontSize: 14,
        };
      case 'large':
        return {
          fontSize: 18,
        };
      default:
        return {
          fontSize: 16,
        };
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        getSizeStyle(),
        disabled && styles.disabled,
        disabled && { backgroundColor: colors.disabledButton },
        style,
      ]}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <ActivityIndicator 
            size="small" 
            color={variant === 'primary' ? '#FFFFFF' : colors.tint} 
          />
          {loadingText && (
            <Text 
              style={[
                styles.buttonText, 
                getTextStyle(), 
                getTextSizeStyle(),
                { marginLeft: 8 },
                disabled && { color: colors.disabledButtonText },
                textStyle
              ]}
            >
              {loadingText}
            </Text>
          )}
        </>
      ) : (
        <View style={styles.contentContainer}>
          {icon}
          <Text 
            style={[
              styles.buttonText, 
              getTextStyle(), 
              getTextSizeStyle(),
              icon ? { marginLeft: 8 } : undefined,
              disabled && { color: colors.disabledButtonText },
              textStyle
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.7,
  },
});