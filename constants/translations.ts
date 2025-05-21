type Language = 'en-US' | 'es' | 'fr' | 'de';

interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

export const translations: Translations = {
  // Common
  'settings': {
    'en-US': 'Settings',
    'es': 'Ajustes',
    'fr': 'Paramètres',
    'de': 'Einstellungen',
  },
  'language': {
    'en-US': 'Language',
    'es': 'Idioma',
    'fr': 'Langue',
    'de': 'Sprache',
  },
  'selectLanguage': {
    'en-US': 'Select Language',
    'es': 'Seleccionar Idioma',
    'fr': 'Sélectionner la Langue',
    'de': 'Sprache Auswählen',
  },
  'backToAccount': {
    'en-US': 'Back to Account',
    'es': 'Volver a la Cuenta',
    'fr': 'Retour au Compte',
    'de': 'Zurück zum Konto',
  },
  'notifications': {
    'en-US': 'Notifications',
    'es': 'Notificaciones',
    'fr': 'Notifications',
    'de': 'Benachrichtigungen',
  },
  'appearance': {
    'en-US': 'Appearance',
    'es': 'Apariencia',
    'fr': 'Apparence',
    'de': 'Erscheinungsbild',
  },
  'privacy': {
    'en-US': 'Privacy & Security',
    'es': 'Privacidad y Seguridad',
    'fr': 'Confidentialité et Sécurité',
    'de': 'Datenschutz & Sicherheit',
  },
  'profile': {
    'en-US': 'Profile',
    'es': 'Perfil',
    'fr': 'Profil',
    'de': 'Profil',
  },
  'home': {
    'en-US': 'Home',
    'es': 'Inicio',
    'fr': 'Accueil',
    'de': 'Startseite',
  },
  'saved': {
    'en-US': 'Saved',
    'es': 'Guardados',
    'fr': 'Enregistrés',
    'de': 'Gespeichert',
  },
  'chatHistory': {
    'en-US': 'Chat History',
    'es': 'Historial de Chat',
    'fr': 'Historique des Chats',
    'de': 'Chat-Verlauf',
  },
  'yourProfile': {
    'en-US': 'Your Profile',
    'es': 'Tu Perfil',
    'fr': 'Votre Profil',
    'de': 'Ihr Profil',
  },
  'promptYourWay': {
    'en-US': 'Prompt Your Way',
    'es': 'Prompt a tu Manera',
    'fr': 'Prompt à Votre Façon',
    'de': 'Prompt auf Ihre Weise',
  },
  'englishUS': {
    'en-US': 'English (US)',
    'es': 'Inglés (EE.UU.)',
    'fr': 'Anglais (É.-U.)',
    'de': 'Englisch (US)',
  },
  'spanish': {
    'en-US': 'Spanish',
    'es': 'Español',
    'fr': 'Espagnol',
    'de': 'Spanisch',
  },
  'french': {
    'en-US': 'French',
    'es': 'Francés',
    'fr': 'Français',
    'de': 'Französisch',
  },
  'german': {
    'en-US': 'German',
    'es': 'Alemán',
    'fr': 'Allemand',
    'de': 'Deutsch',
  },
  'saveChanges': {
    'en-US': 'Save Changes',
    'es': 'Guardar cambios',
    'fr': 'Enregistrer les modifications',
    'de': 'Änderungen speichern',
  },
  'editProfile': {
    'en-US': 'Edit Profile',
    'es': 'Editar perfil',
    'fr': 'Modifier le profil',
    'de': 'Profil bearbeiten',
  },
  'emailCannotChange': {
    'en-US': 'Email address cannot be changed',
    'es': 'No se puede cambiar el correo electrónico',
    'fr': "L'adresse e-mail ne peut pas être modifiée",
    'de': 'E-Mail-Adresse kann nicht geändert werden',
  },
  'updatePassword': {
    'en-US': 'Update Password',
    'es': 'Actualizar contraseña',
    'fr': 'Mettre à jour le mot de passe',
    'de': 'Passwort aktualisieren',
  },
  'enterCurrentPassword': {
    'en-US': 'Enter current password',
    'es': 'Ingresar contraseña actual',
    'fr': 'Saisir le mot de passe actuel',
    'de': 'Aktuelles Passwort eingeben',
  },
  'enterNewPassword': {
    'en-US': 'Enter new password',
    'es': 'Ingresar nueva contraseña',
    'fr': 'Saisir le nouveau mot de passe',
    'de': 'Neues Passwort eingeben',
  },
  'confirmNewPassword': {
    'en-US': 'Confirm new password',
    'es': 'Confirmar nueva contraseña',
    'fr': 'Confirmer le nouveau mot de passe',
    'de': 'Neues Passwort bestätigen',
  },
  'changePassword': {
    'en-US': 'Change Password',
    'es': 'Cambiar contraseña',
    'fr': 'Changer le mot de passe',
    'de': 'Passwort ändern',
  },
  'updateYourPassword': {
    'en-US': 'Update your password',
    'es': 'Actualiza tu contraseña',
    'fr': 'Mettez à jour votre mot de passe',
    'de': 'Passwort aktualisieren',
  },
  'returnToAccountSettings': {
    'en-US': 'Return to Account Settings',
    'es': 'Volver a la cuenta',
    'fr': 'Retour aux paramètres du compte',
    'de': 'Zurück zu den Kontoeinstellungen',
  },
  'selectYourLanguage': {
    'en-US': 'Select your language',
    'es': 'Selecciona tu idioma',
    'fr': 'Sélectionnez votre langue',
    'de': 'Wähle deine Sprache',
  },
  'lightMode': {
    'en-US': 'Light Mode',
    'es': 'Modo claro',
    'fr': 'Mode clair',
    'de': 'Heller Modus',
  },
  'darkMode': {
    'en-US': 'Dark Mode',
    'es': 'Modo oscuro',
    'fr': 'Mode sombre',
    'de': 'Dunkler Modus',
  },
  'switchToDarkMode': {
    'en-US': 'Switch to dark mode',
    'es': 'Cambiar a modo oscuro',
    'fr': 'Passer en mode sombre',
    'de': 'In den dunklen Modus wechseln',
  },
  'switchToLightMode': {
    'en-US': 'Switch to light mode',
    'es': 'Cambiar a modo claro',
    'fr': 'Passer en mode clair',
    'de': 'In den hellen Modus wechseln',
  },
  'accountSettings': {
    'en-US': 'Account Settings',
    'es': 'Configuración de la Cuenta',
    'fr': 'Paramètres du Compte',
    'de': 'Kontoeinstellungen',
  },
  'signOut': {
    'en-US': 'Sign Out',
    'es': 'Cerrar Sesión',
    'fr': 'Se Déconnecter',
    'de': 'Abmelden',
  },
}; 