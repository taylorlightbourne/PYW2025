import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import { collection, setDoc, doc, addDoc } from '@firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/context/AuthContext';
import { dummyCategories } from '@/data/dummyData';

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  // State for manual prompt input
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [addPromptStatus, setAddPromptStatus] = useState('');
  const [addPromptLoading, setAddPromptLoading] = useState(false);

  // State for new category
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('circle');
  const [newCategoryColor, setNewCategoryColor] = useState('#888888');
  const [categories, setCategories] = useState(dummyCategories);
  const [addCategoryLoading, setAddCategoryLoading] = useState(false);
  const [addCategoryStatus, setAddCategoryStatus] = useState('');

  useEffect(() => {
    async function checkAdmin() {
      if (!user) {
        setIsAdmin(false);
        setChecking(false);
        return;
      }
      try {
        const tokenResult = await user.getIdTokenResult();
        setIsAdmin(!!tokenResult.claims.admin);
      } catch (e) {
        setIsAdmin(false);
      } finally {
        setChecking(false);
      }
    }
    checkAdmin();
  }, [user]);

  const handleAddSinglePrompt = async () => {
    setAddPromptLoading(true);
    setAddPromptStatus('');
    let categoryId = selectedCategoryId;
    if (showNewCategory) {
      setAddPromptStatus('Please add the new category first.');
      setAddPromptLoading(false);
      return;
    }
    if (!title.trim() || !text.trim() || !categoryId.trim()) {
      setAddPromptStatus('Please fill in all fields.');
      setAddPromptLoading(false);
      return;
    }
    try {
      const promptId = `${categoryId}-${Date.now()}`;
      const promptRef = doc(collection(db, 'prompts'), promptId);
      await setDoc(promptRef, {
        title,
        text,
        categoryId,
        createdBy: 'manual',
        createdAt: new Date()
      });
      setAddPromptStatus('Prompt added successfully!');
      setTitle('');
      setText('');
      setSelectedCategoryId('');
    } catch (error: any) {
      setAddPromptStatus('Error: ' + error.message);
    } finally {
      setAddPromptLoading(false);
    }
  };

  const handleAddCategory = async () => {
    setAddCategoryLoading(true);
    setAddCategoryStatus('');
    if (!newCategoryName.trim() || !newCategoryIcon.trim() || !newCategoryColor.trim()) {
      setAddCategoryStatus('Please fill in all fields for the new category.');
      setAddCategoryLoading(false);
      return;
    }
    try {
      // Generate a unique id for the category
      const categoryId = newCategoryName.toLowerCase().replace(/\s+/g, '-');
      const categoryData = {
        id: categoryId,
        name: newCategoryName,
        icon: newCategoryIcon,
        color: newCategoryColor
      };
      // Add to Firestore (optional, for persistence)
      await setDoc(doc(collection(db, 'categories'), categoryId), categoryData);
      // Add to local state
      setCategories([...categories, categoryData]);
      setSelectedCategoryId(categoryId);
      setShowNewCategory(false);
      setNewCategoryName('');
      setNewCategoryIcon('circle');
      setNewCategoryColor('#888888');
      setAddCategoryStatus('Category added!');
    } catch (error: any) {
      setAddCategoryStatus('Error: ' + error.message);
    } finally {
      setAddCategoryLoading(false);
    }
  };

  if (isLoading || checking) {
    return <View style={styles.container}><ActivityIndicator size="large" /><Text>Checking admin access...</Text></View>;
  }
  if (!user) {
    return <View style={styles.container}><Text>You must be signed in to access this page.</Text></View>;
  }
  if (!isAdmin) {
    return <View style={styles.container}><Text>Access denied. You must be an admin to view this page.</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a New Prompt</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Prompt Text"
        value={text}
        onChangeText={setText}
        multiline
      />
      <Text style={styles.subtitle}>Select Category</Text>
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          style={styles.radioRow}
          onPress={() => { setSelectedCategoryId(cat.id); setShowNewCategory(false); }}
        >
          <View style={[styles.radioOuter, selectedCategoryId === cat.id && styles.radioOuterSelected]}>
            {selectedCategoryId === cat.id && <View style={styles.radioInner} />}
          </View>
          <Text style={styles.radioLabel}>{cat.name}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={styles.radioRow}
        onPress={() => { setSelectedCategoryId(''); setShowNewCategory(true); }}
      >
        <View style={[styles.radioOuter, showNewCategory && styles.radioOuterSelected]}>
          {showNewCategory && <View style={styles.radioInner} />}
        </View>
        <Text style={styles.radioLabel}>Other (Add New Category)</Text>
      </TouchableOpacity>
      {showNewCategory && (
        <View style={styles.newCategoryBox}>
          <TextInput
            style={styles.input}
            placeholder="New Category Name"
            value={newCategoryName}
            onChangeText={setNewCategoryName}
          />
          <TextInput
            style={styles.input}
            placeholder="Icon (e.g. heart, sparkles, palette)"
            value={newCategoryIcon}
            onChangeText={setNewCategoryIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Color (hex, e.g. #FF6B6B)"
            value={newCategoryColor}
            onChangeText={setNewCategoryColor}
          />
          <Button title={addCategoryLoading ? 'Adding...' : 'Add Category'} onPress={handleAddCategory} disabled={addCategoryLoading} />
          {addCategoryStatus ? <Text style={styles.status}>{addCategoryStatus}</Text> : null}
        </View>
      )}
      <Button title={addPromptLoading ? 'Adding...' : 'Add Prompt'} onPress={handleAddSinglePrompt} disabled={addPromptLoading} />
      {addPromptStatus ? <Text style={styles.status}>{addPromptStatus}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    width: 300,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioOuterSelected: {
    borderColor: '#7400B8',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#7400B8',
  },
  radioLabel: {
    fontSize: 16,
  },
  newCategoryBox: {
    width: 320,
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  status: {
    marginTop: 10,
    fontSize: 16,
    color: 'green',
    textAlign: 'center',
  },
}); 