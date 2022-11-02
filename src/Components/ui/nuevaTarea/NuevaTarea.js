/* eslint-disable no-self-assign */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Button, Form, Modal, Selector, TextArea } from "antd-mobile";
import React, { useContext, useEffect, useState } from "react";
import "./NuevaTarea.css";
import { CheckOutline } from "antd-mobile-icons";
import { GlobalContext } from "../../context/GlobalContext";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CLIENTE } from "../../../graphql/queries/Cliente";
import Select from "react-select";
import { GET_TIPO_TAREA } from "../../../graphql/queries/TipoTarea";
import { GET_TIPO_ORIGEN } from "../../../graphql/queries/TipoOrigen";
import { NEW_TAREA } from "../../../graphql/mutations/tareas";
import { useHistory } from "react-router-dom";
import moment from "moment";

const NuevaTarea = () => {
  let history = useHistory();
  const [idSelector, setIdSelector] = useState();

  const [clientes, setClientes] = useState([]);
  const [clienteSelect, setClienteSelect] = useState();
  const [alertaCliente, setAlertaCliente] = useState(false);
  const { userId, pollTareas } = useContext(GlobalContext);

  //TODO INICIO SECCION DE ELEGIR CLIENTE

  const [buscador, setBuscador] = useState("");
  const [ocultarC, setOcultarC] = useState(false);
  const [limpiar, setLimpiar] = useState(false);

  const handleChange = (value) => {
    if (value === "" || value === null) {
    }
    setBuscador(value.target.value);
  };

  const { loading, error, data } = useQuery(GET_CLIENTE, {
    variables: {
      input: buscador.length > 2 ? buscador : "",
      idUsuario: userId,
    },
  });

  useEffect(() => {
    if (data) {
      setClientes(data.getClientesLimitResolver);
    }
  }, [data]);

  const handleSelect = (value, cli_id) => {
    if (cli_id) {
      setClienteSelect(cli_id);
      setAlertaCliente(false);
    } else {
      setAlertaCliente(true);
    }

    setBuscador(value.target.value);

    if (ocultarC === true) {
      setOcultarC(false);
    }

    if (ocultarC === false) {
      setOcultarC(true);
    }
  };

  const handleLimpiar = (value) => {
    setLimpiar(!limpiar);
    setOcultarC(false);
    setClienteSelect();
    setAlertaCliente(true);
    setBuscador("");
  };
  //TODO FIN SECCION DE ELEGIR CLIENTE
  //TODO INICIO SECCION DE ELEGIR TIPO TAREA
  const [tiposTareas, setTiposTareas] = useState([]);

  const { data: dataTipoTarea } = useQuery(GET_TIPO_TAREA, {
    variables: {
      idCategoria: 1,
    },
  });

  useEffect(() => {
    if (dataTipoTarea) {
      setTiposTareas(dataTipoTarea.getTiposTareaResolver);
    }
  }, [dataTipoTarea]);

  //TODO FIN SECCION DE ELEGIR TIPO TAREA
  //TODO INICIO SECCION DE ELEGIR ORIGEN TAREA
  const [tiposOrigenes, setTiposOrigenes] = useState([]);
  const { data: dataTipoOrigen } = useQuery(GET_TIPO_ORIGEN, {});

  useEffect(() => {
    if (dataTipoOrigen) {
      setTiposOrigenes(dataTipoOrigen.getOrigenesResolver);
    }
  }, [dataTipoOrigen]);

  //TODO FIN SECCION DE ELEGIR ORIGEN TAREA

  const prioridad = [
    {
      label: (
        <div
          key={1}
          className={
            idSelector === 1 ? "selector-alta seleccionado" : "selector-alta"
          }
        >
          <p className="selector-texto">ALTA</p>
        </div>
      ),
      value: 1,
    },
    {
      label: (
        <div
          key={2}
          className={
            idSelector === 2 ? "selector-media seleccionado" : "selector-media"
          }
        >
          <p className="selector-texto">MEDIA</p>
        </div>
      ),
      value: 2,
    },
    {
      label: (
        <div
          key={3}
          className={
            idSelector === 3 ? "selector-baja seleccionado" : "selector-baja"
          }
        >
          <p className="selector-texto">BAJA</p>
        </div>
      ),
      value: 3,
    },
  ];

  //* INICIO SECCION CARGAR UNA NUEVA TAREA

  const [newTareaIframeResolver] = useMutation(NEW_TAREA, {
    onCompleted: () => {
      pollTareas.inicial(1000);
      setTimeout(() => {
        pollTareas.stop();
      }, 1000);

      Modal.alert({
        header: (
          <CheckOutline
            style={{
              fontSize: 64,
              color: "#55b30c",
            }}
          />
        ),
        title: "Tarea Cargada Correctamente",
        confirmText: "Cerrar",
        onConfirm: history.goBack(),
      });
    },
  });

  const handleFormSubmit = (values) => {
    if (!clienteSelect) {
      return setAlertaCliente(true);
    }

    const inputTarea = {
      tar_asunto: values.tar_asunto,
      tar_vencimiento: values.tar_vencimiento,
      tar_horavencimiento: values.tar_horavencimiento,
      ori_id: values.ori_id.value,
      est_id: 1,
      usu_id: userId,
      cli_id: Number(clienteSelect),
      ale_id: null,
      tar_alertanum: null,
      tip_id: values.tip_id.value,
      pri_id: values.pri_id[0],
    };

    let inputNota = {
      not_desc: "",
      not_importancia: "",
    };

    if (inputNota.not_desc === "") {
      inputNota = null;
    }

    let inputAdjunto = null;

    newTareaIframeResolver({
      variables: { inputTarea, inputNota, inputAdjunto, usuAsig: userId },
    });
  };

  const handleHora = (hora) => {
    let horaFormato = hora;
    if (hora.length < 5) {
      horaFormato = "0" + hora;
    }
    return horaFormato;
  };
  //* FIN SECCION CARGAR UNA NUEVA TAREA

  return (
    <div className="detalle-tarea-contenedor">
      <Form
        layout="vertical"
        onFinish={(values) => handleFormSubmit(values)}
        footer={
          <Button block type="submit" color="primary" size="large">
            Cargar Tarea
          </Button>
        }
      >
        <div
          style={{
            padding: "12px 0px",
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
          }}
        >
          <span
            style={{ marginBottom: "4px", fontSize: "15px", display: "flex" }}
          >
            <p style={{ color: "#ff3141" }}>*</p>
            <p style={{ color: "#00b33c" }}>Cliente</p>
          </span>
          {ocultarC !== true ? (
            <input
              className="input-cliente-nueva-tarea"
              placeholder="Ingrese Cliente"
              type="search"
              autoComplete="off"
              onChange={(value) => handleChange(value)}
            />
          ) : null}

          {clientes &&
            clientes.map((cliente) => (
              <>
                {buscador !== "" ? (
                  <div className="div_clienteSelect_btn" key={cliente.cli_id}>
                    <input
                      className="input-cliente-nueva-tarea input-cliente-seleccionado"
                      type="text"
                      onClick={(value) => handleSelect(value, cliente.cli_id)}
                      defaultValue={cliente.cli_nombre}
                      key={cliente.cli_id}
                    />
                    {ocultarC && (
                      <Button
                        className="btn_cliente"
                        onClick={() => handleLimpiar()}
                      >
                        X
                      </Button>
                    )}
                  </div>
                ) : (
                  ""
                )}
              </>
            ))}
          {alertaCliente && (
            <span
              style={{
                fontSize: "13px",
                color: "#ff3141",
                alignSelf: "center",
                marginTop: "4px",
              }}
            >
              Por favor ingrese Cliente
            </span>
          )}
        </div>
        <Form.Item
          label="Asunto"
          name="tar_asunto"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <TextArea
            className="detalleTarea"
            autoSize={true}
            placeholder="Detalle de Tarea"
          ></TextArea>
        </Form.Item>
        <Form.Item
          label="Tipo de Tarea"
          name="tip_id"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            className="select_nueva_tarea"
            placeholder="Seleccione Tipo de Tarea"
            options={
              tiposTareas &&
              tiposTareas.map((tipoTarea) => ({
                label: tipoTarea.tip_desc,
                value: tipoTarea.tip_id,
                key: tipoTarea.tip_id,
              }))
            }
            // onChange={handleSelectTT}
          />
        </Form.Item>
        <Form.Item
          label="Fuente"
          name="ori_id"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            className="select_nueva_tarea select_fuente"
            placeholder="Seleccione Fuente"
            options={
              tiposOrigenes &&
              tiposOrigenes.map((tipoOrigen) => ({
                label: tipoOrigen.ori_desc,
                value: tipoOrigen.ori_id,
                key: tipoOrigen.ori_id,
              }))
            }
            // onChange={handleSelectO}
          />
        </Form.Item>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              width: "50%",
            }}
          >
            <Form.Item
              label="Vencimiento"
              name="tar_vencimiento"
              initialValue={moment().format("YYYY-MM-DD")}
            >
              <input className="input-fechaHora" type="date" />
            </Form.Item>
          </div>
          <div
            style={{
              width: "50%",
            }}
          >
            <Form.Item
              label="Hora"
              name="tar_horavencimiento"
              initialValue={handleHora(moment().format("LT"))}
            >
              <input className="input-fechaHora" type="time" />
            </Form.Item>
          </div>
        </div>
        <Form.Item
          label="Prioridad"
          name="pri_id"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Selector
            style={{
              "--border-radius": "10px",
              "--border": "none",
              "--checked-border": "none",
              "--padding": "0px",
              fontSize: "16px",
            }}
            showCheckMark={false}
            label="Prioridad"
            options={prioridad}
            onChange={(v) => setIdSelector(v[0])}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default NuevaTarea;
