/* eslint-disable no-unused-vars */
import { ConfigProvider } from "antd-mobile";
import "./App.css";
import AppRouter from "./Components/router/AppRouter";
import es_ES from "antd-mobile/es/locales/es-ES";
import { GlobalContext } from "./Components/context/GlobalContext";
import React, { useEffect, useState } from "react";
import AuthProvider from "./auth/AuthProvider";
import { ApolloProvider } from "@apollo/client";
import Client from "./config/apolloClientConfig";
import { getDataInStorage } from "./Components/storage/manageStorage";

const App = () => {

  //*States creados para utilizarlos globalmente
  const [userData, setUserData] = useState({});
  const [logoutAlert, setLogoutAlert] = useState(false);
  const [infoUser, setInfoUser] = useState({});
  const [tareaSeleccionada, setTareaSeleccionada] = useState({});
  const [tareas, setTareas] = useState();
  const [plataforma, setPlataforma] = useState();
  const [userId, setUserId] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [note, setNote] = useState();
  const [pollTareas, setPollTareas] = useState();
  const [pollTareasClientes, setPollTareasClientes] = useState();

  useEffect(() => {

    getDataInStorage("userInfo").then((res) => {
      if (res) {
        setUserData(res);
        setUserId(res.idUsuario);

      } else {
        setUserData({});
      }
    });

    if (navigator.userAgent.toUpperCase().includes("IPHONE")) {
      setPlataforma("IPHONE");
    } else {
      setPlataforma("OTRO");
    }
  }, [])
  
  return (
    <AuthProvider>
      <ApolloProvider client={Client}>
        <ConfigProvider locale={es_ES}>
          <GlobalContext.Provider
            value={{
              userData,
              setUserData,
              logoutAlert,
              setLogoutAlert,
              infoUser,
              setInfoUser,
              tareaSeleccionada,
              setTareaSeleccionada,
              tareas,
              setTareas,
              plataforma,
              userId, 
              setUserId,
              cargando,
              setCargando,
              note,
              setNote,
              pollTareas,
              setPollTareas,
              pollTareasClientes, 
              setPollTareasClientes
            }}
          >
            <AppRouter />
          </GlobalContext.Provider>
        </ConfigProvider>
      </ApolloProvider>
    </AuthProvider>
  );
};

export default App;
