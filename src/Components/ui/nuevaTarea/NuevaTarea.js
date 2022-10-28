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

  const handleSelect = (value) => {
    setBuscador(value.target.value);

    if (ocultarC === true) {
      setOcultarC(false);
    }

    if (ocultarC === false) {
      setOcultarC(true);
    }
  };

  const handleLimpiar = (value) => {
    if (limpiar === false) {
      setLimpiar(true);
      setOcultarC(false);
    }
    if (limpiar === true) {
      setLimpiar(false);
      setOcultarC(false);
    }

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
    const inputTarea = {
      tar_asunto: values.tar_asunto,
      tar_vencimiento: values.tar_vencimiento,
      tar_horavencimiento: values.tar_horavencimiento,
      ori_id: values.ori_id.value,
      est_id: 1,
      usu_id: userId,
      cli_id: Number(clientes[0].cli_id),
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
    let horaFormato = hora
    if(hora.length<5) {
      horaFormato = "0" + hora;
    } 
    return horaFormato;
  }
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
        <Form.Item
          label="Cliente"
          name="cli_id"
          className="nueva_tarea_buscador_cliente"
        >
          {ocultarC !== true ? (
            <input
              className="select_nueva_tarea input_cliente"
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
                      className="select_nueva_tarea input_cliente"
                      type="text"
                      onClick={(value) => handleSelect(value)}
                      defaultValue={cliente.cli_nombre}
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
        </Form.Item>
        <Form.Item label="Asunto" name="tar_asunto">
          <TextArea
            className="detalleTarea"
            autoSize={true}
            placeholder="Detalle de Tarea"
          ></TextArea>
        </Form.Item>
        <Form.Item label="Tipo de Tarea" name="tip_id">
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
        <Form.Item label="Fuente" name="ori_id">
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
            <Form.Item label="Hora" name="tar_horavencimiento" initialValue={handleHora(moment().format("LT"))}>
              <input className="input-fechaHora" type="time" />
            </Form.Item>
          </div>
        </div>
        <Form.Item label="Prioridad" name="pri_id">
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
