import { StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "../../hooks/useAppTheme";
import type { AppTheme } from "../../styles/theme";

interface SectionHeaderProps {
  action?: React.ReactNode;
  subtitle?: string;
  title: string;
}

function SectionHeader({ action, subtitle, title }: SectionHeaderProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {action}
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      flexDirection: "row",
      gap: 12,
      justifyContent: "space-between",
    },
    copy: {
      flex: 1,
      gap: 3,
    },
    subtitle: {
      color: theme.colors.mutedText,
      fontSize: 14,
      lineHeight: 20,
    },
    title: {
      color: theme.colors.text,
      fontSize: 20,
      fontWeight: "800",
    },
  });

export default SectionHeader;
