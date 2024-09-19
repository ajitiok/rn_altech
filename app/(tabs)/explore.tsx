import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>
      <ThemedText>This app uses the following technologies:</ThemedText>
      <Collapsible title="Technologies Used">
        <ThemedText>
          - React Native
        </ThemedText>
        <ThemedText>
          - Expo
        </ThemedText>
        <ThemedText>
          - TypeScript
        </ThemedText>
        <ThemedText>
          - React Navigation
        </ThemedText>
        <ThemedText>
          - React Native Reanimated
        </ThemedText>
        <ThemedText>
          - Custom Fonts
        </ThemedText>
        <ThemedText>
          - Light and Dark Mode Support
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
