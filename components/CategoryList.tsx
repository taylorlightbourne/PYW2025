import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  View 
} from 'react-native';
import Colors from '@/constants/Colors';
import { Category } from '@/types/data';
import { useTheme } from '@/context/ThemeContext';
import { Heart, Sparkles, Briefcase, TrendingUp, Palette, Circle } from 'lucide-react-native';
import { LucideIcon } from 'lucide-react-native';

interface CategoryListProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  'heart': Heart,
  'sparkles': Sparkles,
  'briefcase': Briefcase,
  'trending-up': TrendingUp,
  'palette': Palette,
};

export default function CategoryList({ 
  categories, 
  selectedCategoryId,
  onSelectCategory 
}: CategoryListProps) {
  const { theme } = useTheme();
  const colors = Colors[theme];

  const renderIcon = (iconName: string, color: string) => {
    const IconComponent = iconMap[iconName] || Circle;
    return <IconComponent size={20} color={color} />;
  };

  return (
    <ScrollView 
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <TouchableOpacity
        style={[
          styles.categoryButton,
          { 
            backgroundColor: selectedCategoryId === '' ? colors.tint : '#718096',
            borderColor: selectedCategoryId === '' ? colors.tint : 'transparent',
          }
        ]}
        onPress={() => onSelectCategory('')}
      >
        <Text 
          style={[
            styles.categoryText,
            { 
              color: '#FFFFFF',
              fontFamily: 'Inter-Medium',
              marginLeft: 0
            }
          ]}
        >
          All
        </Text>
      </TouchableOpacity>
      {categories.map((category) => {
        const isSelected = category.id === selectedCategoryId;
        
        return (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              { 
                backgroundColor: isSelected 
                  ? category.color 
                  : '#718096',
                borderColor: isSelected ? category.color : 'transparent',
              }
            ]}
            onPress={() => onSelectCategory(category.id)}
          >
            {renderIcon(
              category.icon, 
              '#FFFFFF'
            )}
            <Text 
              style={[
                styles.categoryText,
                { 
                  color: '#FFFFFF',
                  fontFamily: 'Inter-Medium'
                }
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 0,
    marginBottom: 0,
    marginTop: 0,
    height: 32,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 0,
    height: 32,
  },
  categoryText: {
    fontSize: 13,
    marginLeft: 6,
  },
});
