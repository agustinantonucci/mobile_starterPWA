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
  GET_HISTORIAL_POR_NEGOCIO,
  GET_TIMELINE_POR_NEGOCIO,
} from "../../../graphql/queries/HistorialNegocio";
import { useEffect, useState } from "react";
import moment from "moment";
import QueryResult from "../../queryResult/QueryResult";

export const NegocioCompletado = ({ negocio }) => {
  const [timeline, setTimeline] = useState();

  const { loading, error, data } = useQuery(GET_HISTORIAL_POR_NEGOCIO, {
    variables: {
      idNegocio: parseInt(negocio.neg_id),
    },
  });

  const { data: dataTimeline } = useQuery(GET_TIMELINE_POR_NEGOCIO, {
    variables: {
      idNegocio: parseInt(negocio.neg_id),
    },
  });

  const timelineHandler = (lineaTiempo, historial) => {
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

    linea = linea.filter((tarea) => tarea.est_id !== 1);

    historial.map((historia) => {
      if (!historia.his_detalle.startsWith("###")) {
        return linea.push(historia);
      }
    });

    let lineaOrdenada;

    if (linea) {
      lineaOrdenada = linea.sort(function (a, b) {
        return (
          new Date(
            b.tar_id
              ? moment(b.tar_fecha_ts, "YYYY-MM-DD").format("YYYY,MM,DD")
              : b.not_id
              ? moment(b.not_fechahora, "YYYY-MM-DD").format("YYYY,MM,DD")
              : b.up_fechaupload
              ? moment(b.up_fechaupload, "YYYY-MM-DD").format("YYYY,MM,DD")
              : b.his_fechaupdate / 1
          ) -
          new Date(
            a.tar_id
              ? moment(a.tar_fecha_ts, "YYYY-MM-DD").format("YYYY,MM,DD")
              : a.not_id
              ? moment(a.not_fechahora, "YYYY-MM-DD").format("YYYY,MM,DD")
              : a.up_fechaupload
              ? moment(a.up_fechaupload, "YYYY-MM-DD").format("YYYY,MM,DD")
              : a.his_fechaupdate / 1
          )
        );
      });
      setTimeline(lineaOrdenada);
    }
  };

  useEffect(() => {
    if (dataTimeline && data) {
      timelineHandler(
        JSON.parse(dataTimeline.getTimeLineByNegocioResolver),
        data.getHistorialByNegocioResolver
      );
    }
  }, [data, dataTimeline]);

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
                } else if (tarea.up_id) {
                  return (
                    <Step
                      key={tarea.up_id}
                      description={<ArchivoTareaNegocio archivo={tarea} />}
                      icon={<PictureOutline style={{ color: "#00B33C" }} />}
                    />
                  );
                } else {
                  return (
                    <Step
                      key={tarea.his_id}
                      description={tarea.his_detalle.startsWith("<p>") ?
                        <div
                          dangerouslySetInnerHTML={{
                            __html: tarea.his_detalle,
                          }}
                        ></div> : <span className="detailItem">{tarea.his_detalle}</span>
                      }
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
