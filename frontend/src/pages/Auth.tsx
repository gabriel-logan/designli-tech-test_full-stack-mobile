import MaterialDesignIcon from "@react-native-vector-icons/material-design-icons";
import { useMutation } from "@tanstack/react-query";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "multiform-validator";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import AppButton from "../components/ui/AppButton";
import AppTextInput from "../components/ui/AppTextInput";
import Screen from "../components/ui/Screen";
import SegmentedControl from "../components/ui/SegmentedControl";
import { useAppTheme } from "../hooks/useAppTheme";
import { login, register } from "../services/mutations/auth";
import { useAuthStore } from "../stores/authStore";
import type { AppTheme } from "../styles/theme";
import getAxiosErrorMessage from "../utils/getAxiosErrorMessage";

type AuthMode = "login" | "register";

interface FieldErrors {
  email?: string;
  name?: string;
  password?: string;
}

function Auth() {
  const { t } = useTranslation();

  const theme = useAppTheme();
  const styles = createStyles(theme);
  const setAuth = useAuthStore(state => state.setAuth);

  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [requestError, setRequestError] = useState("");

  const authMutation = useMutation({
    mutationFn: () => {
      if (mode === "login") {
        return login({ email: email.trim(), password });
      }

      return register({ email: email.trim(), name: name.trim(), password });
    },
    onError: error => {
      setRequestError(getAxiosErrorMessage(error, t("auth.requestError")));
    },
    onSuccess: async auth => {
      setRequestError("");
      await setAuth(auth);
    },
  });

  function validateForm() {
    const nextErrors: FieldErrors = {};

    const emailValidation = validateEmail(email.trim(), {
      maxLength: 254,
      errorMsg: [
        t("auth.emailRequired"),
        t("auth.emailInvalid"),
        t("auth.emailTooLong"),
        t("auth.emailCountryInvalid"),
        t("auth.emailDomainInvalid"),
      ],
    });
    const passwordValidation = validatePassword(password, {
      maxLength: 128,
      minLength: 6,
      errorMsg: [
        t("auth.passwordTooLong"),
        t("auth.passwordTooShort"),
        t("auth.passwordUppercaseRequired"),
        t("auth.passwordSpecialRequired"),
        t("auth.passwordNumberRequired"),
        t("auth.passwordLetterRequired"),
      ],
    });

    if (mode === "register") {
      const nameValidation = validateName(name.trim(), {
        maxLength: 80,
        minLength: 2,
        errorMsg: [
          t("auth.nameRequired"),
          t("auth.nameNoNumbers"),
          t("auth.nameNoSpecialChars"),
          t("auth.nameInvalid"),
          t("auth.nameTooLong"),
        ],
      });

      if (!nameValidation.isValid) {
        nextErrors.name = nameValidation.errorMsg;
      }
    }

    if (!emailValidation.isValid) {
      nextErrors.email = emailValidation.errorMsg;
    }

    if (!passwordValidation.isValid) {
      nextErrors.password = passwordValidation.errorMsg;
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function submit() {
    setRequestError("");

    if (validateForm()) {
      authMutation.mutate();
    }
  }

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setErrors({});
    setRequestError("");
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <View style={styles.logo}>
          <MaterialDesignIcon
            color={theme.colors.primary}
            name="chart-timeline-variant"
            size={30}
          />
        </View>
        <Text style={styles.title}>{t("auth.title")}</Text>
        <Text style={styles.subtitle}>{t("auth.subtitle")}</Text>
      </View>

      <View style={styles.form}>
        <SegmentedControl
          onChange={changeMode}
          segments={[
            { label: t("auth.login"), value: "login" },
            { label: t("auth.register"), value: "register" },
          ]}
          value={mode}
        />

        {mode === "register" && (
          <AppTextInput
            error={errors.name}
            label={t("auth.name")}
            onChangeText={setName}
            placeholder={t("auth.namePlaceholder")}
            textContentType="name"
            value={name}
          />
        )}

        <AppTextInput
          autoComplete="email"
          error={errors.email}
          keyboardType="email-address"
          label={t("auth.email")}
          onChangeText={setEmail}
          placeholder={t("auth.emailPlaceholder")}
          textContentType="emailAddress"
          value={email}
        />

        <AppTextInput
          autoComplete="password"
          error={errors.password}
          label={t("auth.password")}
          onChangeText={setPassword}
          onSubmitEditing={submit}
          placeholder={t("auth.passwordPlaceholder")}
          secureTextEntry
          textContentType={mode === "login" ? "password" : "newPassword"}
          value={password}
        />

        {!!requestError && (
          <Text style={styles.requestError}>{requestError}</Text>
        )}

        <AppButton
          icon={
            <MaterialDesignIcon
              color="#ffffff"
              name={mode === "login" ? "login" : "account-plus-outline"}
              size={18}
            />
          }
          loading={authMutation.isPending}
          onPress={submit}
          title={mode === "login" ? t("auth.login") : t("auth.createAccount")}
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
    hero: {
      gap: 10,
      paddingTop: 38,
    },
    logo: {
      alignItems: "center",
      backgroundColor: theme.colors.primarySoft,
      borderRadius: 8,
      height: 54,
      justifyContent: "center",
      width: 54,
    },
    requestError: {
      color: theme.colors.danger,
      fontSize: 14,
      lineHeight: 20,
    },
    subtitle: {
      color: theme.colors.mutedText,
      fontSize: 16,
      lineHeight: 23,
    },
    title: {
      color: theme.colors.text,
      fontSize: 32,
      fontWeight: "900",
      lineHeight: 38,
    },
  });

export default Auth;
