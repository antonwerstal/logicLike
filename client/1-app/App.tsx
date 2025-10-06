import React, { useEffect } from "react";
import { AppRoutes } from "./AppRoutes";
import { apiClient } from "@features/apiClient";
import { ApiResponse } from "@root/types";
import "./App.scss";

export const App: React.FC = () => {
  const [isInit, setIsInit] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    init();
  }, []);

  const init = async (): Promise<void> => {
    try {
      const res: ApiResponse = await apiClient.get("/health");
      if (res.success) {
        setIsInit(true);
        setError(null);
      } else {
        setIsInit(false);
        setError("Проверьте, что запущен сервер и корректны доступы к БД");
      }
    } catch (error) {
      console.error("[App][init]:", error);
      setError("Проверьте, что запущен сервер и корректны доступы к БД");
      setIsInit(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="App-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <span>Инициализация приложения...</span>
        </div>
      </div>
    );
  }

  if (!isInit) {
    return `Ошибка инициализации: ${error}`;
  }

  return <AppRoutes />;
};
