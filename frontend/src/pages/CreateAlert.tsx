import MaterialDesignIcon from "@react-native-vector-icons/material-design-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import AppButton from "../components/ui/AppButton";
import AppTextInput from "../components/ui/AppTextInput";
import ErrorState from "../components/ui/ErrorState";
import Screen from "../components/ui/Screen";
import { useAppTheme } from "../hooks/useAppTheme";
import { createAlert } from "../services/mutations/alerts";
import { getStockQuote } from "../services/queries/stocks";
import type { AppTheme } from "../styles/theme";
import type { RootStackScreenProps } from "../types/navigation";
import { formatCurrency } from "../utils/formatters";
import getAxiosErrorMessage from "../utils/getAxiosErrorMessage";

type Props = RootStackScreenProps<"CreateAlert">;

interface FieldErrors {
  symbol?: string;
  targetPrice?: string;
}

function CreateAlert({ navigation, route }: Props) {
  const { t } = useTranslation();

  const theme = useAppTheme();
  const styles = createStyles(theme);
  const queryClient = useQueryClient();

  const [symbol, setSymbol] = useState(route.params?.symbol ?? "");
  const [targetPrice, setTargetPrice] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [requestError, setRequestError] = useState("");

  const normalizedSymbol = symbol.trim().toUpperCase();
  const quoteQuery = useQuery({
    enabled: normalizedSymbol.length > 0,
    queryKey: ["stocks", "quote", normalizedSymbol],
    queryFn: () => getStockQuote(normalizedSymbol),
  });

  const createAlertMutation = useMutation({
    mutationFn: createAlert,
    onError: error => {
      setRequestError(getAxiosErrorMessage(error, t("alerts.createError")));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      navigation.navigate("Home", { screen: "Alerts" });
    },
  });

  function validateForm() {
    const nextErrors: FieldErrors = {};
    const parsedTarget = Number(targetPrice.replace(",", "."));

    if (normalizedSymbol.length === 0) {
      nextErrors.symbol = t("alerts.symbolError");
    }

    if (!Number.isFinite(parsedTarget) || parsedTarget <= 0) {
      nextErrors.targetPrice = t("alerts.targetError");
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function submit() {
    setRequestError("");

    if (!validateForm()) {
      return;
    }

    createAlertMutation.mutate({
      symbol: normalizedSymbol,
      targetPrice: Number(targetPrice.replace(",", ".")),
    });
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>{t("alerts.create")}</Text>
        <Text style={styles.subtitle}>{t("alerts.createSubtitle")}</Text>
      </View>

      <View style={styles.form}>
        <AppTextInput
          autoCapitalize="characters"
          error={errors.symbol}
          label={t("alerts.symbol")}
          onChangeText={setSymbol}
          placeholder={t("alerts.symbolPlaceholder")}
          value={symbol}
        />

        <AppTextInput
          error={errors.targetPrice}
          keyboardType="decimal-pad"
          label={t("alerts.targetPrice")}
          onChangeText={setTargetPrice}
          onSubmitEditing={submit}
          placeholder={t("alerts.targetPlaceholder")}
          value={targetPrice}
        />

        {!!quoteQuery.data && (
          <View style={styles.quoteContext}>
            <MaterialDesignIcon
              color={theme.colors.primary}
              name="chart-line"
              size={20}
            />
            <View style={styles.quoteCopy}>
              <Text style={styles.quoteTitle}>{t("alerts.currentPrice")}</Text>
              <Text style={styles.quoteValue}>
                {formatCurrency(quoteQuery.data.current)}
              </Text>
            </View>
          </View>
        )}

        {!!requestError && (
          <ErrorState message={requestError} title={t("alerts.createError")} />
        )}

        <AppButton
          icon={
            <MaterialDesignIcon
              color="#ffffff"
              name="bell-plus-outline"
              size={18}
            />
          }
          loading={createAlertMutation.isPending}
          onPress={submit}
          title={t("alerts.save")}
        />
      </View>
    </Screen>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    form: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: 8,
      borderWidth: 1,
      gap: 16,
      padding: 16,
    },
    header: {
      gap: 6,
      paddingTop: 10,
    },
    quoteContext: {
      alignItems: "center",
      backgroundColor: theme.colors.primarySoft,
      borderRadius: 8,
      flexDirection: "row",
      gap: 12,
      padding: 14,
    },
    quoteCopy: {
      flex: 1,
      gap: 3,
    },
    quoteTitle: {
      color: theme.colors.mutedText,
      fontSize: 13,
      fontWeight: "700",
    },
    quoteValue: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: "900",
    },
    subtitle: {
      color: theme.colors.mutedText,
      fontSize: 15,
      lineHeight: 22,
    },
    title: {
      color: theme.colors.text,
      fontSize: 30,
      fontWeight: "900",
      lineHeight: 36,
    },
  });

export default CreateAlert;
