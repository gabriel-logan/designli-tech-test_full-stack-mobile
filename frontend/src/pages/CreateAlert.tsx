import { Picker } from "@react-native-picker/picker";
import MaterialDesignIcon from "@react-native-vector-icons/material-design-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isDecimal, isEmpty, isNumber } from "multiform-validator";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import AppButton from "../components/ui/AppButton";
import AppTextInput from "../components/ui/AppTextInput";
import ErrorState from "../components/ui/ErrorState";
import Screen from "../components/ui/Screen";
import { useAppTheme } from "../hooks/useAppTheme";
import { createAlert } from "../services/mutations/alerts";
import { getStockQuote, getStocks } from "../services/queries/stocks";
import type { AppTheme } from "../styles/theme";
import type { StockSymbol } from "../types/api";
import type { RootStackScreenProps } from "../types/navigation";
import { formatCurrency } from "../utils/formatters";
import getAxiosErrorMessage from "../utils/getAxiosErrorMessage";

type Props = RootStackScreenProps<"CreateAlert">;

interface FieldErrors {
  symbol?: string;
  targetPrice?: string;
}

function getUniqueStockOptions(stocks: StockSymbol[]) {
  const symbols = new Set<string>();

  return stocks.filter(stock => {
    const symbol = stock.symbol.trim().toUpperCase();

    if (!symbol || symbols.has(symbol)) {
      return false;
    }

    symbols.add(symbol);

    return true;
  });
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
  const routeSymbol = route.params?.symbol?.trim().toUpperCase();
  const stocksQuery = useQuery({
    queryKey: ["stocks", "alert-options"],
    queryFn: () =>
      getStocks({
        exchange: "US",
        limit: 100,
      }),
  });
  const routeStockQuery = useQuery({
    enabled: !!routeSymbol,
    queryKey: ["stocks", "alert-options", routeSymbol],
    queryFn: () =>
      getStocks({
        limit: 20,
        query: routeSymbol,
      }),
  });
  const stockOptions = getUniqueStockOptions([
    ...(routeStockQuery.data ?? []),
    ...(stocksQuery.data ?? []),
  ]);
  const hasStockOptions = stockOptions.length > 0;
  const isLoadingStocks = stocksQuery.isLoading || routeStockQuery.isLoading;
  const isSelectedStockAvailable = stockOptions.some(
    stock => stock.symbol.trim().toUpperCase() === normalizedSymbol,
  );

  const quoteQuery = useQuery({
    enabled: isSelectedStockAvailable,
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

    const normalizedTargetPrice = targetPrice.replace(",", ".");

    const parsedTarget = Number(normalizedTargetPrice);

    const hasValidNumber =
      !isEmpty(normalizedTargetPrice) &&
      (isDecimal(normalizedTargetPrice) || isNumber(normalizedTargetPrice));

    if (isEmpty(normalizedSymbol)) {
      nextErrors.symbol = t("alerts.symbolError");
    } else if (!isSelectedStockAvailable) {
      nextErrors.symbol = t("alerts.symbolUnavailable");
    }

    if (
      !hasValidNumber ||
      !Number.isFinite(parsedTarget) ||
      parsedTarget <= 0
    ) {
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

  function selectSymbol(value: string) {
    setSymbol(value);
    setErrors(currentErrors => ({
      ...currentErrors,
      symbol: undefined,
    }));
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>{t("alerts.create")}</Text>
        <Text style={styles.subtitle}>{t("alerts.createSubtitle")}</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>{t("alerts.symbol")}</Text>
          <View
            style={[
              styles.pickerContainer,
              errors.symbol ? styles.pickerError : null,
            ]}
          >
            <Picker
              dropdownIconColor={theme.colors.text}
              enabled={!isLoadingStocks && hasStockOptions}
              onValueChange={selectSymbol}
              selectedValue={isSelectedStockAvailable ? normalizedSymbol : ""}
              style={styles.picker}
            >
              <Picker.Item
                color={theme.colors.mutedText}
                label={t("alerts.symbolPlaceholder")}
                value=""
              />
              {stockOptions.map(stock => (
                <Picker.Item
                  key={stock.symbol}
                  label={`${stock.displaySymbol} - ${stock.description}`}
                  value={stock.symbol.trim().toUpperCase()}
                />
              ))}
            </Picker>
          </View>

          {isLoadingStocks && (
            <Text style={styles.helperText}>{t("alerts.loadingStocks")}</Text>
          )}
          {!isLoadingStocks && !hasStockOptions && (
            <Text style={styles.errorText}>
              {t("alerts.noStocksAvailable")}
            </Text>
          )}
          {!!errors.symbol && (
            <Text style={styles.errorText}>{errors.symbol}</Text>
          )}
          {(stocksQuery.isError || routeStockQuery.isError) && (
            <Text style={styles.errorText}>{t("alerts.loadStocksError")}</Text>
          )}
        </View>

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
          disabled={!hasStockOptions || isLoadingStocks}
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
    errorText: {
      color: theme.colors.danger,
      fontSize: 13,
    },
    field: {
      gap: 7,
    },
    helperText: {
      color: theme.colors.mutedText,
      fontSize: 13,
    },
    header: {
      gap: 6,
      paddingTop: 10,
    },
    label: {
      color: theme.colors.text,
      fontSize: 14,
      fontWeight: "700",
    },
    picker: {
      color: theme.colors.text,
    },
    pickerContainer: {
      backgroundColor: theme.colors.field,
      borderColor: theme.colors.border,
      borderRadius: 8,
      borderWidth: 1,
      justifyContent: "center",
      minHeight: 48,
      overflow: "hidden",
    },
    pickerError: {
      borderColor: theme.colors.danger,
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
