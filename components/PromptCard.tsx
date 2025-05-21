import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Prompt } from '@/types/data';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

interface PromptCardProps {
  prompt: Prompt;
  categoryColor: string;
}

export default function PromptCard({ prompt, categoryColor }: PromptCardProps) {
  const [expanded, setExpanded] = useState(false);
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  
  // Preview text (first 100 characters)
  const previewText = prompt.text.length > 100 
    ? `${prompt.text.substring(0, 100)}...` 
    : prompt.text;

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handleStartChat = () => {
    router.push({
      pathname: '/(modals)/edit-prompt',
      params: { promptId: prompt.id }
    });
  };

  return (
    <Card style={styles.card}>
      <View style={[styles.categoryIndicator, { backgroundColor: categoryColor }]} />
      
      <Text style={[styles.title, { color: colors.text }]}>
        {prompt.title}
      </Text>
      
      <Text style={[styles.preview, { color: colors.textSecondary }]}>
        {expanded ? prompt.text : previewText}
      </Text>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          onPress={toggleExpanded}
          style={styles.toggleButton}
        >
          <Text style={[styles.toggleText, { color: (prompt.categoryId === 'work' || prompt.categoryId === 'creative') ? '#FFFFFF' : categoryColor }]}>
            {expanded ? 'Show less' : 'See more'}
          </Text>
          {expanded ? (
            <ChevronUp size={16} color={(prompt.categoryId === 'work' || prompt.categoryId === 'creative') ? '#FFFFFF' : categoryColor} />
          ) : (
            <ChevronDown size={16} color={(prompt.categoryId === 'work' || prompt.categoryId === 'creative') ? '#FFFFFF' : categoryColor} />
          )}
        </TouchableOpacity>
        
        <Button
          title="Start Chat"
          size="small"
          style={[styles.button, { backgroundColor: categoryColor }]}
          onPress={handleStartChat}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 0,
    marginBottom: 8,
    padding: 0,
    overflow: 'hidden',
  },
  categoryIndicator: {
    height: 8,
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  preview: {
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleText: {
    marginRight: 4,
    fontWeight: '500',
  },
  button: {
    minWidth: 100,
  },
});