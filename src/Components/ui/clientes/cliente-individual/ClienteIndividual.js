/* eslint-disable react-hooks/exhaustive-deps */
import { CapsuleTabs } from "antd-mobile";
import { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import InfoCliente from "../../infoCliente/InfoCliente";
import { ClienteTareas } from "./ClienteTareas";
import "./clienteIndividual.css";
import { ClienteNegocios } from "./ClienteNegocios";
import { GlobalContext } from "../../../context/GlobalContext";

export const ClienteIndividual = () => {

  const { tabClienteActivo, setTabClienteActivo } = useContext(GlobalContext);

  const location = useLocation();

  useEffect(() => {}, [tabClienteActivo]);

  return (
    <CapsuleTabs
      className="contenedor-cliente-individual"
      onChange={(v) => setTabClienteActivo(v)}
      defaultActiveKey={tabClienteActivo}
    >
      <CapsuleTabs.Tab title="Info" key="1">
        {tabClienteActivo === "1" && <InfoCliente clienteSelect={location.state[0]} />}
      </CapsuleTabs.Tab>
      <CapsuleTabs.Tab title="Tareas" key="2">
        {tabClienteActivo === "2" && <ClienteTareas cliente={location.state[0]} />}
      </CapsuleTabs.Tab>
      <CapsuleTabs.Tab title="Negocios" key="3">
        {tabClienteActivo === "3" && <ClienteNegocios cliente={location.state[0]} />}
      </CapsuleTabs.Tab>
    </CapsuleTabs>
  );
};
