import { MOOD_AFFIRMATIONS, MoodType } from "@/constants/meditations";
import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInUp,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface VibeModalProps {
  visible: boolean;
  onClose: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function MoodButton({
  emoji,
  label,
  mood,
  onPress,
  isLoading,
}: {
  emoji: string;
  label: string;
  mood: MoodType;
  onPress: () => void;
  isLoading: boolean;
}) {
  const { colors, isDark } = useAppTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedPressable
      style={[
        styles.moodButton,
        animatedStyle,
        { backgroundColor: isDark ? "#374151" : "#F3F4F6" },
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isLoading}
    >
      <Text style={styles.moodEmoji}>{emoji}</Text>
      <Text style={[styles.moodLabel, { color: colors.text }]}>{label}</Text>
    </AnimatedPressable>
  );
}

export default function VibeModal({ visible, onClose }: VibeModalProps) {
  const { colors, isDark } = useAppTheme();
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [affirmation, setAffirmation] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleMoodSelect = async (mood: MoodType) => {
    setSelectedMood(mood);
    setIsGenerating(true);
    setAffirmation("");

    // Имитация LLM API вызова с задержкой
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Выбор случайной аффирмации для выбранного настроения
    const affirmations = MOOD_AFFIRMATIONS[mood];
    const randomAffirmation =
      affirmations[Math.floor(Math.random() * affirmations.length)];
    setAffirmation(randomAffirmation);
    setIsGenerating(false);
  };

  const handleClose = () => {
    setSelectedMood(null);
    setAffirmation("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Animated.View
          entering={FadeInUp.duration(400)}
          exiting={FadeOut.duration(200)}
          style={[
            styles.modalContent,
            { backgroundColor: isDark ? "#1F2937" : "#FFFFFF" },
          ]}
          onStartShouldSetResponder={() => true}
        >
          <View
            style={[
              styles.handle,
              { backgroundColor: isDark ? "#4B5563" : "#E5E7EB" },
            ]}
          />

          <Text style={[styles.title, { color: colors.text }]}>
            ✨ AI Настрой дня
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Выберите своё настроение, чтобы получить персональную аффирмацию
          </Text>

          {!selectedMood ? (
            <View style={styles.moodContainer}>
              <MoodButton
                emoji="😊"
                label="Радость"
                mood="joy"
                onPress={() => handleMoodSelect("joy")}
                isLoading={isGenerating}
              />
              <MoodButton
                emoji="😌"
                label="Спокойствие"
                mood="calm"
                onPress={() => handleMoodSelect("calm")}
                isLoading={isGenerating}
              />
              <MoodButton
                emoji="⚡"
                label="Энергия"
                mood="energy"
                onPress={() => handleMoodSelect("energy")}
                isLoading={isGenerating}
              />
            </View>
          ) : isGenerating ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#10B981" />
              <Text
                style={[styles.loadingText, { color: colors.textSecondary }]}
              >
                AI генерирует вашу аффирмацию...
              </Text>
            </View>
          ) : (
            <Animated.View
              entering={FadeIn.duration(500)}
              style={styles.affirmationContainer}
            >
              <View style={styles.affirmationIcon}>
                <Ionicons name="sparkles" size={32} color="#10B981" />
              </View>
              <Text style={[styles.affirmationText, { color: colors.text }]}>
                {affirmation}
              </Text>

              <TouchableOpacity
                style={[
                  styles.resetButton,
                  { backgroundColor: isDark ? "#374151" : "#F3F4F6" },
                ]}
                onPress={() => setSelectedMood(null)}
              >
                <Text
                  style={[styles.resetButtonText, { color: colors.primary }]}
                >
                  Попробовать снова
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
    minHeight: 400,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 32,
  },
  moodContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
  },
  moodButton: {
    alignItems: "center",
    padding: 5,
    paddingBottom: 10,
    borderRadius: 20,
    width: 100,
  },
  moodEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
  },
  affirmationContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  affirmationIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EDE9FE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  affirmationText: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 28,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  resetButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: 8,
  },
});
