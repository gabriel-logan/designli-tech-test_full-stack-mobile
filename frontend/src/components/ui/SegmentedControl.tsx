import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "../../hooks/useAppTheme";
import type { AppTheme } from "../../styles/theme";

interface Segment<T extends string> {
  label: string;
  value: T;
}

interface SegmentedControlProps<T extends string> {
  onChange: (value: T) => void;
  segments: Segment<T>[];
  value: T;
}

function SegmentedControl<T extends string>({
  onChange,
  segments,
  value,
}: SegmentedControlProps<T>) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {segments.map(segment => {
        const selected = segment.value === value;

        return (
          <Pressable
            accessibilityRole="button"
            key={segment.value}
            onPress={() => onChange(segment.value)}
            style={[styles.segment, selected && styles.selected]}
          >
            <Text style={[styles.label, selected && styles.selectedLabel]}>
              {segment.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: 8,
      flexDirection: "row",
      padding: 4,
    },
    label: {
      color: theme.colors.mutedText,
      fontSize: 14,
      fontWeight: "700",
      textAlign: "center",
    },
    segment: {
      borderRadius: 6,
      flex: 1,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    selected: {
      backgroundColor: theme.colors.surface,
    },
    selectedLabel: {
      color: theme.colors.text,
    },
  });

export default SegmentedControl;
