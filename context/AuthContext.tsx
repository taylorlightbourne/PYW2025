import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  User
} from '@/config/firebase';

// Define types
type UserType = User | null;

interface AuthContextType {
  user: UserType;
  isLoading: boolean;
  isInitialized: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  error: string | null;
  deleteAccount: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | null>(null);

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle auth state changes
  useEffect(() => {
    console.log('Setting up auth state listener...');
    const unsubscribe = auth.onAuthStateChanged((user: UserType) => {
      console.log('Auth state changed:', {
        isAuthenticated: !!user,
        userId: user?.uid,
        email: user?.email
      });
      setUser(user);
      setIsLoading(false);
      setIsInitialized(true);
    });

    return () => {
      console.log('Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  // Sign up function
  const signUp = async (email: string, password: string, displayName: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update profile with display name
      await updateProfile(userCredential.user, { displayName });
      setUser(userCredential.user);
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    console.log('AuthContext: Starting sign in process', { email });
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('AuthContext: Attempting Firebase sign in');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('AuthContext: Sign in successful', {
        userId: userCredential.user.uid,
        email: userCredential.user.email
      });
      
      // Verify the user is properly set in Firebase
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error('AuthContext: User not set in Firebase after sign in');
        throw new Error('Failed to complete authentication');
      }
      
      console.log('AuthContext: Updating local user state');
      setUser(userCredential.user);
      
      // Double check authentication state
      console.log('AuthContext: Final auth state check', {
        hasUser: !!user,
        firebaseUser: !!currentUser,
        isInitialized,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('AuthContext: Sign in error:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    console.log('AuthContext: Starting sign out process');
    setIsLoading(true);
    setError(null);
    
    try {
      if (!auth.currentUser) {
        console.log('AuthContext: No user currently signed in');
        setUser(null);
        return;
      }

      console.log('AuthContext: Current user before sign out:', auth.currentUser.uid);
      console.log('AuthContext: Calling Firebase signOut');
      
      // First clear the local user state
      setUser(null);
      
      // Then sign out from Firebase
      await firebaseSignOut(auth);
      console.log('AuthContext: Firebase signOut successful');
      
      // Double check the auth state
      if (auth.currentUser) {
        console.warn('AuthContext: User still exists after sign out!');
      } else {
        console.log('AuthContext: Verified user is signed out');
      }
    } catch (error: any) {
      console.error('AuthContext: Sign out error:', error);
      console.error('AuthContext: Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
      console.log('AuthContext: Sign out process completed');
    }
  };

  // Update profile function
  const updateUserProfile = async (displayName: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No user is currently signed in');
      }
      
      await updateProfile(currentUser, { displayName });
      setUser(currentUser);
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update password function
  const updateUserPassword = async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) {
        throw new Error('No user is currently signed in');
      }

      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete account function
  const deleteAccount = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No user is currently signed in');
      }
      await currentUser.delete();
      setUser(null);
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    isInitialized,
    signUp,
    signIn,
    signOut,
    updateUserProfile,
    updatePassword: updateUserPassword,
    error,
    deleteAccount,
  };

  // Don't render until Firebase Auth is initialized
  if (!isInitialized) {
    return null;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}