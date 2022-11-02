import { Steps } from "antd-mobile";
import { Step } from "antd-mobile/es/components/steps/step";
import { NotaTareaNegocio } from "../notaTareaNegocio/NotaTareaNegocio";
import { TareaNegocio } from "../tareaNegocio/TareaNegocio";
import { ArchivoTareaNegocio } from "../archivoTareaNegocio/ArchivoTareaNegocio";

import {
  CalendarOutline,
  FileOutline,
  PictureOutline,
} from "antd-mobile-icons";
import { useQuery } from "@apollo/client";
import {
  GET_TIMELINE_POR_NEGOCIO,
} from "../../../graphql/queries/HistorialNegocio";
import { useEffect, useState } from "react";
import moment from "moment";
import QueryResult from "../../queryResult/QueryResult";

export const NegocioPlanificado = ({ negocio }) => {
  const [timeline, setTimeline] = useState();

  const {
    loading,
    error,
    data: dataTimeline,
  } = useQuery(GET_TIMELINE_POR_NEGOCIO, {
    variables: {
      idNegocio: parseInt(negocio.neg_id),
    },
  });

  const timelineHandler = (lineaTiempo) => {
    let linea = [];

    lineaTiempo.dataNot?.map((nota) => {
      return linea.push(nota);
    });

    lineaTiempo.dataTar?.map((tarea) => {
      return linea.push(tarea);
    });

    lineaTiempo.dataUp?.map((upload) => {
      return linea.push(upload);
    });

    let lineaOrdenada;

    linea = linea.filter((tarea) => tarea.est_id === 1);

    if (linea) {
      lineaOrdenada = linea.sort(function (a, b) {
        return (
          new Date(
            b.tar_id
              ? moment(b.tar_fecha_ts, "YYYY-MM-DD").format("YYYY,MM,DD")
              : b.not_id
              ? moment(b.not_fechahora, "YYYY-MM-DD").format("YYYY,MM,DD")
              : moment(b.up_fechaupload, "YYYY-MM-DD").format("YYYY,MM,DD")
          ) -
          new Date(
            a.tar_id
              ? moment(a.tar_fecha_ts, "YYYY-MM-DD").format("YYYY,MM,DD")
              : a.not_id
              ? moment(a.not_fechahora, "YYYY-MM-DD").format("YYYY,MM,DD")
              : moment(a.up_fechaupload, "YYYY-MM-DD").format("YYYY,MM,DD")
          )
        );
      });
      setTimeline(lineaOrdenada);
    }
  };

  useEffect(() => {
    if (dataTimeline) {
      timelineHandler(JSON.parse(dataTimeline.getTimeLineByNegocioResolver));
    }
  }, [dataTimeline]);

  return (
    <QueryResult loading={loading} error={error} data={timeline}>
      <div className="div_lista_neg">
        <div className="negocio-linea-tiempo-contenedor">
          <Steps direction="vertical">
            {timeline &&
              timeline.map((tarea) => {
                if (tarea.tar_id) {
                  return (
                    <Step
                      key={tarea.tar_id}
                      description={<TareaNegocio tarea={tarea} />}
                      icon={<CalendarOutline style={{ color: "#00B33C" }} />}
                    />
                  );
                } else if (tarea.not_id) {
                  return (
                    <Step
                      key={tarea.not_id}
                      description={<NotaTareaNegocio nota={tarea} />}
                      icon={<FileOutline style={{ color: "#00B33C" }} />}
                    />
                  );
                } else {
                  return (
                    <Step
                      key={tarea.up_id}
                      description={<ArchivoTareaNegocio archivo={tarea} />}
                      icon={<PictureOutline style={{ color: "#00B33C" }} />}
                    />
                  );
                }
              })}
          </Steps>
        </div>
      </div>
    </QueryResult>
  );
};
