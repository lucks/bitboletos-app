import { useAuth } from '@/contexts/AuthContext';
import { BorderRadius, Colors, Layout, Spacing, Typography } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress?: () => void;
  showArrow?: boolean;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
}

const MenuItem = ({
  icon,
  title,
  onPress,
  showArrow = true,
  showSwitch = false,
  switchValue = false,
  onSwitchChange,
}: MenuItemProps) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={onPress}
    disabled={showSwitch}
    activeOpacity={0.7}
  >
    <View style={styles.menuItemLeft}>
      <Ionicons name={icon} size={20} color={Colors.text} />
      <Text style={styles.menuItemText}>{title}</Text>
    </View>
    
    {showSwitch ? (
      <Switch
        value={switchValue}
        onValueChange={onSwitchChange}
        trackColor={{ false: Colors.border, true: Colors.primary }}
        thumbColor="#FFFFFF"
      />
    ) : showArrow ? (
      <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
    ) : null}
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [darkMode, setDarkMode] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [profile, setProfile] = React.useState<any>(null);
  const [stats, setStats] = React.useState({
    events: 0,
    tickets: 0,
    favorites: 0,
  });

  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchProfile();
        fetchStats();
      }
    }, [user])
  );

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!user) return;
    
    // Fetch tickets count
    const { count: ticketsCount } = await supabase
      .from('tickets')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Fetch favorites count
    const { count: favoritesCount } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    setStats(prev => ({
      ...prev,
      tickets: ticketsCount || 0,
      favorites: favoritesCount || 0
    }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Perfil</Text>
        </View>

        {/* Profile Info */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={Colors.primary} />
          </View>
          
          <Text style={styles.name}>{profile?.name || 'Usuario'}</Text>
          <Text style={styles.email}>{user?.email || 'usuario@email.com'}</Text>
          
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={() => router.push('/profile/edit')}
          >
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Statistics */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.events}</Text>
            <Text style={styles.statLabel}>Eventos</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.tickets}</Text>
            <Text style={styles.statLabel}>Boletos</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.favorites}</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </View>
        </View>

        {/* Menu Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mi Cuenta</Text>
          
          <View style={styles.menuGroup}>
            <MenuItem
              icon="person-outline"
              title="Información Personal"
              onPress={() => console.log('Personal info')}
            />
            <MenuItem
              icon="heart-outline"
              title="Eventos Favoritos"
              onPress={() => console.log('Favorites')}
            />
            <MenuItem
              icon="receipt-outline"
              title="Historial de Compras"
              onPress={() => console.log('Purchase history')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferencias</Text>
          
          <View style={styles.menuGroup}>
            <MenuItem
              icon="notifications-outline"
              title="Notificaciones"
              onPress={() => console.log('Notifications')}
            />
            <MenuItem
              icon="location-outline"
              title="Ciudad Preferida"
              onPress={() => console.log('Preferred city')}
            />
            <MenuItem
              icon="moon-outline"
              title="Tema Oscuro"
              showArrow={false}
              showSwitch={true}
              switchValue={darkMode}
              onSwitchChange={setDarkMode}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Soporte</Text>
          
          <View style={styles.menuGroup}>
            <MenuItem
              icon="help-circle-outline"
              title="Ayuda y FAQ"
              onPress={() => console.log('Help')}
            />
            <MenuItem
              icon="mail-outline"
              title="Contactar Soporte"
              onPress={() => console.log('Contact support')}
            />
            <MenuItem
              icon="document-text-outline"
              title="Términos y Privacidad"
              onPress={() => console.log('Terms')}
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={() => supabase.auth.signOut()}>
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={styles.version}>Versión 1.0.0</Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Layout.screenPadding,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.sizes.h1,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginHorizontal: Layout.screenPadding,
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  name: {
    fontSize: Typography.sizes.h2,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs / 2,
  },
  email: {
    fontSize: Typography.sizes.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  editButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  editButtonText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary,
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundSecondary,
    marginHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: Typography.sizes.h2,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs / 2,
  },
  statLabel: {
    fontSize: Typography.sizes.caption,
    color: Colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.bold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    paddingHorizontal: Layout.screenPadding,
    marginBottom: Spacing.sm,
  },
  menuGroup: {
    backgroundColor: Colors.background,
    marginHorizontal: Layout.screenPadding,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    fontSize: Typography.sizes.body,
    color: Colors.text,
    marginLeft: Spacing.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.error,
    marginBottom: Spacing.lg,
  },
  logoutText: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.error,
    marginLeft: Spacing.sm,
  },
  version: {
    fontSize: Typography.sizes.small,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
});
