/* eslint-disable no-unused-vars */
import { Card, Empty } from "antd-mobile";
import React, { useEffect, useState } from "react";
import { PhonebookOutline, MailOutline } from "antd-mobile-icons";
import "./InfoCliente.css";
import { useQuery } from "@apollo/client";
import { GET_CONTACTO } from "../../../graphql/queries/Contactos";

const InfoCliente = ({ clienteSelect }) => {

  const [contact, setContact] = useState([])

  const { loading, error, data } = useQuery(GET_CONTACTO, {
    variables: {
      id:Number(clienteSelect.cli_id)
    },
  });

  useEffect(() => {
    if (data && data !== []) {
      setContact(data.getContactosResolver)
    } else {setContact("")}
  }, [data]);

  return (
    <div className="div_contenedor_info">
      <div className="div_contacto">
        <Card className="card_empresa">
          <div
            className="div_emp"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <p className="p_infoEmpresa">{clienteSelect.cli_nombre} </p>

            {clienteSelect.cli_telefono1 && clienteSelect.cli_telefono1 !== "" ? (
              <a
                className="numCel p_info"
                href={"tel:+54" + clienteSelect.cli_telefono1}
              >
                <PhonebookOutline /> {clienteSelect.cli_telefono1}
              </a>

            ) : (<p className="numCel p_info" ><PhonebookOutline /> - </p>)}
            
            {clienteSelect.cli_email1 && clienteSelect.cli_email1 !== "" ? (
              <a className="numCel p_info" href={"mailto:" + clienteSelect.cli_email1}>
                <MailOutline /> {clienteSelect.cli_email1}
              </a>
            ) : (<p className="numCel p_info"> <MailOutline /> -</p>)}

          </div>
        </Card>
      </div>

      <div className="div_contacto2">
        <Card title="CONTACTOS" className="card_contactos">
            <div className="div_contacto_lista">
              {contact && contact.length !== 0 ? (contact.map((contact) => (
                <Card className="border" key={contact.con_id}>
                  <Card className="cards_internas">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                      }}
                    >
                      <div>
                        <p className="p_infoContacto">
                          {contact.con_nombre}
                        </p>
                      </div>

                      {contact.con_telefono1 && contact.con_telefono1 !== "" ? (
                        <a
                          className="numCel p_info"
                          href={"tel:+54" + contact.con_telefono1}
                        >
                          <PhonebookOutline /> {contact.con_telefono1}
                        </a>

                      ) : (<p className="numCel p_info" style={{marginLeft:"0px"}}> <PhonebookOutline /> - </p>)}

                      {contact.con_email1 && contact.con_email1 !== "" ? (
                        <a
                          className="numCel p_info"
                          href={"mailto:" + contact.con_email1}
                        >
                          <MailOutline /> {contact.con_email1}
                        </a>

                      ) : (<p className="numCel p_info" style={{marginLeft:"0px"}}> <MailOutline /> - </p>)} 

                    </div>
                  </Card>
                </Card>
              ))):(<Empty/>)}
            </div>
        </Card>
      </div>
    </div>
  );
};

export default InfoCliente;
