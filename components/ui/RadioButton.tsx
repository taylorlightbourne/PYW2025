import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface RadioButtonProps {
  selected: boolean;
  onPress: () => void;
  color: string;
  size?: number;
}

export function RadioButton({ 
  selected, 
  onPress, 
  color, 
  size = 20 
}: RadioButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderColor: color,
        },
      ]}
    >
      {selected && (
        <View
          style={[
            styles.selected,
            {
              backgroundColor: color,
              width: size * 0.6,
              height: size * 0.6,
            },
          ]}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 999,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    borderRadius: 999,
  },
});