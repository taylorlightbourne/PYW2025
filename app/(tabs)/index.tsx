import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Colors from '@/constants/Colors';
import { useData } from '@/context/DataContext';
import CategoryList from '@/components/CategoryList';
import PromptCard from '@/components/PromptCard';
import EmptyState from '@/components/EmptyState';
import { Grid2x2 as Grid } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

export default function HomeScreen() {
  const { prompts, categories, getPromptsByCategory } = useData();
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id || '');
  const { theme } = useTheme();
  const colors = Colors[theme];
  
  // Get filtered prompts
  const filteredPrompts = selectedCategoryId 
    ? getPromptsByCategory(selectedCategoryId)
    : prompts;
    
  // Find the selected category color
  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);
  const categoryColor = selectedCategory?.color || colors.tint;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      
      <View style={styles.content}>
        <View style={styles.categoriesContainer}>
          <CategoryList
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />
        </View>
        
        <View style={styles.promptsContainer}>
          {filteredPrompts.length > 0 ? (
            <FlatList
              data={filteredPrompts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <PromptCard prompt={item} categoryColor={categoryColor} />
              )}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <EmptyState
              icon={<Grid size={32} color={colors.tint} />}
              title="No prompts found"
              message="There are no prompts in this category yet. Please select another category or check back later."
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  categoriesContainer: {
    height: 40,
    marginTop: 20,
    marginBottom: 10,
  },
  promptsContainer: {
    flex: 1,
    marginTop: 0,
  },
  listContent: {
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 0,
    marginBottom: 0,
  },
});