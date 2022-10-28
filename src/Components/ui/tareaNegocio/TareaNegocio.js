/* eslint-disable default-case */
/* eslint-disable array-callback-return */
import moment from "moment";
import "./tareaNegocio.css";
import {
  CheckOutline,
  UserOutline,
  InformationCircleOutline,
  ClockCircleOutline,
  EditSOutline,
  DownOutline,
} from "antd-mobile-icons";
import { NotaTareaNegocio } from "../notaTareaNegocio/NotaTareaNegocio";
import { ArchivoTareaNegocio } from "../archivoTareaNegocio/ArchivoTareaNegocio";
import { useContext, useEffect, useRef, useState } from "react";
import { Dialog, Modal, SwipeAction } from "antd-mobile";
import { useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
import { UPDATE_ESTADO_TAREA } from "../../../graphql/mutations/tareas";
import { GlobalContext } from "../../context/GlobalContext";

export const TareaNegocio = ({ tarea, origen = "" }) => {
  const { pollTareas, pollTareasClientes } = useContext(GlobalContext);

  const [mostrar, setMostrar] = useState(false);

  const ref = useRef(null);

  let history = useHistory();

  useEffect(() => {}, [mostrar]);

  //*Handles para separar las fechasHoras en fecha y hora como viene de base de datos con moment.js

  const handleFechaVer = (val) => {
    let fecha = moment(val, "DD/MM/YYYY").format("DD/MM/YYYY");
    return fecha;
  };

  const handleHora = (val) => {
    let horaSola = moment(val, "HH:mm:ss").format("LT");
    return horaSola;
  };

  const handleModalDetalleTarea = (tarea) => {
    let cliente = tarea;

    return history.push({
      pathname: `/detalletarea/${tarea.tar_id}`,
      state: { ...cliente },
    });
  };

  const [updateEstadoTareaIframeResolver] = useMutation(UPDATE_ESTADO_TAREA, {
    onCompleted: () => {
      pollTareas.inicial(1000);
      setTimeout(() => {
        pollTareas.stop();
      }, 1000);

      Modal.show({
        header: (
          <CheckOutline
            style={{
              fontSize: 64,
              color: "#56b43c",
            }}
          />
        ),
        title: "Tarea Cerrada Correctamente",
        closeOnMaskClick: true,
        onClose: () => {
          if (pollTareasClientes) {
            pollTareasClientes.inicial(1000);
            setTimeout(() => {
              pollTareasClientes.stop();
            }, 1000);
          }
        },
      });
    },
  });

  const handleModalCerrar = (tarea) => {
    // escribe el resolver
    updateEstadoTareaIframeResolver({
      variables: { idTarea: tarea.tar_id },
    });
  };

  let fechaActual = moment();

  const dateHandler = (fecha) => {
    let fechaParametro = moment(fecha, "DD/MM/YYYY");

    const diff = moment(fechaParametro).diff(fechaActual, "days");

    switch (true) {
      case diff <= 0:
        return "#F44336";
      case diff > 0 && diff <= 5:
        return "#faad14";

      default:
        return "#00b33c";
    }
  };

  if (origen === "ListaTareas") {
    return (
      <SwipeAction
        ref={ref}
        closeOnAction={false}
        closeOnTouchOutside={false}
        rightActions={[
          {
            key: "editar",
            text: <EditSOutline />,
            color: "#2bc4e3",
            onClick: () => {
              handleModalDetalleTarea(tarea);
            },
          },
          {
            key: "cerrar",
            text: <CheckOutline />,
            color: "primary",
            onClick: async () => {
              await Dialog.confirm({
                content: "¿Cerrar Tarea?",
                cancelText: "Cancelar",
                confirmText: "Aceptar",
                onConfirm: () => handleModalCerrar(tarea),
              });
              ref.current?.close();
            },
          },
        ]}
      >
        <div className="tarea-negocio-contenedor">
          <div
            className="tarea-negocio-wrapper wrapper_lista"
            onClick={() => setMostrar(!mostrar)}
          >
            <div className="tarea-negocio-linea-superior">
              {/* <Ellipsis
                className="tarea-negocio-titulo"
                style={{
                  fontWeight: "bold",
                  width: "90%",
                  fontSize: "16px",
                }}
                direction="end"
                content={tarea.tar_asunto}
              /> */}
              <p
                style={{
                  fontWeight: "bold",
                  width: "100%",
                  fontSize: "16px",
                  marginTop: "4px",
                  color: "#454545",
                }}
              >
                {tarea.tar_asunto}
              </p>
            </div>
            <div className="tarea-negocio-linea-intermedia">
              {tarea.cli_nombre ? (
                <div className="tarea-negocio-item">
                  <UserOutline style={{ color: "#00B33C" }} />
                  <p className="tarea-negocio-contacto">{tarea.cli_nombre}</p>
                </div>
              ) : (
                ""
              )}
              {tarea.tip_desc ? (
                <div className="tarea-negocio-item">
                  <InformationCircleOutline style={{ color: "#00B33C" }} />
                  <p className="tarea-negocio-tipoTarea">{tarea.tip_desc}</p>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="tarea-negocio-linea-inferior">
              <div className="tarea-negocio-linea-inferior-uno">
                <div className="tarea-contenedor-horario">
                  <ClockCircleOutline
                    style={{
                      color: dateHandler(tarea.fechavencimiento),
                      fontSize: "0.8rem",
                    }}
                  />
                  <p className="texto-tarea-horario">
                    {handleFechaVer(tarea.fechavencimiento)}
                  </p>
                  {tarea.tar_horavencimiento && (
                    <p className="texto-tarea-horario">
                      {handleHora(tarea.tar_horavencimiento)} hs
                    </p>
                  )}
                </div>
                <div className="tarea-contenedor-horario">
                  {tarea.pri_desc === "ALTA" ? (
                    <div
                      style={{
                        height: "20px",
                        width: "40px",
                        fontSize: "12px",
                        backgroundColor: "rgb(241, 45, 45)",
                        color: "white",
                        border: "solid 1px rgb(241, 45, 45)",
                        borderRadius: "4px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "2px 5px",
                      }}
                    >
                      ALTA
                    </div>
                  ) : null}
                  {tarea.pri_desc === "MEDIA" ? (
                    <div
                      style={{
                        height: "20px",
                        width: "40px",
                        fontSize: "12px",
                        backgroundColor: "rgb(232, 188, 13)",
                        color: "white",
                        border: "solid 1px rgb(232, 188, 13)",
                        borderRadius: "4px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "2px 5px",
                      }}
                    >
                      MEDIA
                    </div>
                  ) : null}
                  {tarea.pri_desc === "BAJA" ? (
                    <div
                      style={{
                        height: "20px",
                        width: "40px",
                        fontSize: "12px",
                        backgroundColor: "rgb(0, 179, 60)",
                        color: "white",
                        border: "solid 1px rgb(0, 179, 60)",
                        borderRadius: "4px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "2px 5px",
                      }}
                    >
                      BAJA
                    </div>
                  ) : null}
                </div>
                <div className="tarea-contenedor-horario">
                  <p
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      border: "solid 1px #f4f4f4",
                      height: "22px",
                      width: "auto",
                      fontSize: "12px",
                      color: tarea.ori_color,
                      borderColor: tarea.ori_color,
                      backgroundColor: "white",
                      padding: "2px 5px",
                      borderRadius: "4px",
                      marginLeft: "-2px",
                      marginRight: "3px",
                    }}
                  >
                    {tarea.ori_desc}
                  </p>
                </div>
              </div>
              <div className="tarea-negocio-linea-inferior-dos">
                <div className="VerMas">
                  {(tarea.not_id && tarea.not_desc !== "<p><br></p>") ||
                  tarea.up_id ? (
                    <DownOutline />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          {tarea.not_id && tarea.not_desc !== "<p><br></p>" ? (
            <NotaTareaNegocio
              nota={tarea}
              origen={origen}
              interno={true}
              display={mostrar}
            />
          ) : null}
          {tarea.up_id && (
            <ArchivoTareaNegocio
              archivo={tarea}
              origen={origen}
              interno={true}
              display={mostrar}
            />
          )}
        </div>
      </SwipeAction>
    );
  } else {
    return (
      <div className="tarea-negocio-contenedor">
        <div
          className="tarea-negocio-wrapper"
          onClick={() => setMostrar(!mostrar)}
        >
          <div className="tarea-negocio-linea-superior">
            <p className="tarea-negocio-titulo">{tarea.tar_asunto}</p>
            <CheckOutline
              style={{ color: "#00B33C", marginRight: "5px", fontSize: "1rem" }}
            />
          </div>
          <div className="tarea-negocio-linea-inferior-timeline">
            <p className="tarea-negocio-fecha">
              {moment(tarea.tar_fecha_ts, "YYYY-MM-DD").fromNow()}
            </p>
            {tarea.cli_nombre ? (
              <div className="tarea-negocio-item">
                <UserOutline style={{ color: "#00B33C" }} />{" "}
                <p className="tarea-negocio-contacto">{tarea.cli_nombre}</p>
              </div>
            ) : (
              ""
            )}
            {tarea.tip_desc ? (
              <div className="tarea-negocio-item">
                <InformationCircleOutline style={{ color: "#00B33C" }} />{" "}
                <p className="tarea-negocio-tipoTarea">{tarea.tip_desc}</p>
              </div>
            ) : (
              ""
            )}
            <div className="tarea-contenedor-horario">
              <ClockCircleOutline
                style={{
                  color: dateHandler(tarea.fechavencimiento),
                  fontSize: "0.8rem",
                }}
              />
              <p className="texto-tarea-horario">
                {moment(tarea.tar_vencimiento, "YYYY-MM-DD").format(
                  "DD/MM/YYYY"
                )}
              </p>
              {tarea.tar_horavencimiento && (
                <p className="texto-tarea-horario">
                  {handleHora(tarea.tar_horavencimiento)} hs
                </p>
              )}
            </div>
          </div>
        </div>
        {tarea.not_id && (
          <NotaTareaNegocio nota={tarea} interno={true} display={true} />
        )}
        {tarea.up_id && (
          <ArchivoTareaNegocio archivo={tarea} interno={true} display={true} />
        )}
      </div>
    );
  }
};
