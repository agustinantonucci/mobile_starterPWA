/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from "@apollo/client";
import { SwipeAction } from "antd-mobile";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { GET_TAREAS } from "../../../../graphql/queries/Tarea";
import { GlobalContext } from "../../../context/GlobalContext";
import QueryResult from "../../../queryResult/QueryResult";
import { TareaNegocio } from "../../tareaNegocio/TareaNegocio";

export const ClienteTareas = ({ cliente }) => {

  const { userId, setPollTareasClientes } = useContext(GlobalContext);
  const [tareasXCliente, setTareasXCliente] = useState();

  const { loading, error, data, startPolling, stopPolling } = useQuery(GET_TAREAS, {
    variables: {
      idUsuario: userId,
      filtroFecha: "",
      fecha: "",
      estado: 1,
      idUsuarioFiltro: "",
      idClienteFiltro: parseInt(cliente.cli_id),
    },
  });

  const ordenarDatos = (tareas) => {
    let tareasOrdenadas;
    if (tareas) {
      tareasOrdenadas = tareas.sort(function (a, b) {
        return (
          new Date(
            moment(b.fechavencimiento, "DD/MM/YYYY").format("YYYY,MM,DD")
          ) -
          new Date(
            moment(a.fechavencimiento, "DD/MM/YYYY").format("YYYY,MM,DD")
          )
        );
      });
      setTareasXCliente(tareasOrdenadas);
    }
  };

  useEffect(() => {
    if (data) {
      setPollTareasClientes({inicial:startPolling, stop:stopPolling})
      ordenarDatos(JSON.parse(data.getTareasIframeResolver).tareas);
    }
  }, [data]);

  useEffect(() => {
    startPolling(1000);
    setTimeout(() => {
      stopPolling();
    }, 1000);
  }, [data])

  return (
    <QueryResult loading={loading} error={error} data={tareasXCliente}>
      <div className="contenedor-titulo-cliente">
        <p className="titulo-cliente-tareas">{cliente.cli_nombre}</p>
      </div>
      <div className="div_lista_l">
        {tareasXCliente &&
          tareasXCliente.map((tarea) => {
            return (
              <SwipeAction className="swipe_clienteTarea" key={tarea.tar_id}>
                <TareaNegocio tarea={tarea} origen="ListaTareas" />
              </SwipeAction>
            );
          })}
      </div>
    </QueryResult>
  );
};
