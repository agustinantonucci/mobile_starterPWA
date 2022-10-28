/* eslint-disable array-callback-return */
import { useQuery } from "@apollo/client";
import { List, SearchBar } from "antd-mobile";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { GET_CLIENTE } from "../../../graphql/queries/Cliente";
import { GlobalContext } from "../../context/GlobalContext";
import "./Clientes.css";

const Clientes = () => {
  const [inputBuscador, setInputBuscador] = useState("");
  const [clientes, setClientes] = useState();

  const { userId } = useContext(GlobalContext);

  let history = useHistory();

  const redirecInfo = (id) => {
    let cliente = clientes.filter((cliente) => cliente.cli_id === id);

    return history.push({
      pathname: `/cliente-individual/${id}`,
      state: { ...cliente },
    });
  };

  const { loading, error, data } = useQuery(GET_CLIENTE, {
    variables: {
      input: inputBuscador.length > 2 ? inputBuscador : "",
      idUsuario: userId,
    },
  });

  const handleChange = (value) => {
    if (value === "" || value === null) {
    }
    return setInputBuscador(value);
  };

  useEffect(() => {
    if (data) {
      setClientes(data.getClientesLimitResolver);
    }
  }, [data]);

  return (
    <div style={{ textAlign: "start" }}>
      <List
        header={
          <SearchBar
            placeholder="Ingrese Cliente"
            style={{ "--background": "#ffffff" }}
            onChange={(value) => handleChange(value)}
          />
        }
      >
        {clientes &&
          clientes.map((cliente) => (
            <List.Item
              key={cliente.cli_id}
              onClick={() => redirecInfo(cliente.cli_id)}
            >
              <div className="div_empresa">{cliente.cli_nombre}</div>
            </List.Item>
          ))}
      </List>
    </div>
  );
};

export default Clientes;
