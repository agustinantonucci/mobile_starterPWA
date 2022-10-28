import moment from "moment";
import { useEffect, useState } from "react";
import QueryResult from "../../queryResult/QueryResult";
import ListaTarea from "../listaTareas/ListaTarea";

export const TareasSemanaProxima = ({tareasParametro, error, loading}) => {
  const [tareas, setTareas] = useState();

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
      setTareas(tareasOrdenadas);
    }
  };

  useEffect(() => {
    if (tareasParametro) {
      ordenarDatos(tareasParametro);
    }
  }, [tareasParametro])

  return (
    <QueryResult
      loading={loading}
      error={error}
      data={tareas}
    >
      {tareas && (
        <div className="div_lista">
          <ListaTarea itemListaTarea={tareas} />
        </div>
      )}
    </QueryResult>
  );
};
