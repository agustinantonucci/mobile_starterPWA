/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Checkbox, Form, Image, Input } from "antd-mobile";
import React, { useContext, useEffect, useState } from "react";
import duo from "./logo-crm-prod.svg";
import { EyeInvisibleOutline, EyeOutline } from "antd-mobile-icons";
import "./Login.css";
import { useHistory } from "react-router-dom";
import useAuth from "../../../auth/useAuth";
import { GlobalContext } from "../../context/GlobalContext";
import { saveDataInStorage } from "../../storage/manageStorage";
import * as base64 from "base-64";
import { LOGIN_AUTHENTICATION } from "../../../graphql/queries/loginAuthentication";
import { useLazyQuery } from "@apollo/client";

const Login = () => {
  let history = useHistory();
  const auth = useAuth();
  const { userData, setUserData, userId, setUserId } = useContext(GlobalContext);

  const [visible, setVisible] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const [loginIframeResolver, { loading, data, error }] =
    useLazyQuery(LOGIN_AUTHENTICATION);

  useEffect(() => {



    if (data) {
      if (data.loginIframeResolver.status === 200) {
        setUserId(data.loginIframeResolver.idUser);
        if (switchChecked) {

          const x ={
            ...userData, idUsuario:data.loginIframeResolver.idUser
          }
          saveDataInStorage("userInfo", x);
        }

        auth.login(userData);
      } else {
        alert(data.loginIframeResolver.message);
      }
    }
  }, [data]);

  const onFinish = (values) => {
    let usuario = base64.encode(values.username);
    let contrasena = base64.encode(values.password);

    loginIframeResolver({
      variables: { credentials: { username: usuario, password: contrasena } },
    });

    setUserData({ username: usuario, password: contrasena });

    const info = { usuario, contrasena };
  };

  return (
    <div className="vista_login_wrapper">
      <div className="vista_login_content">
        <div className="img_content">
          <Image src={duo} width={150} height={150} />
        </div>
        <div className="form_login">
          <Form
            layout="horizontal"
            onFinish={onFinish}
            footer={
              <>
                <div className="recordar">
                  <div className="recordar_texto">
                    <h3>Recordarme</h3>
                  </div>
                  <div className="recordar_check">
                    <Checkbox
                      onChange={() => {
                        setSwitchChecked(!switchChecked);
                      }}
                    />
                  </div>
                </div>
                <div className="btn_content">
                  <Button className="btn_content_btn" type="submit">
                    INICIAR
                  </Button>
                </div>
              </>
            }
          >
            <Form.Item
              className="form_login_label"
              label="Usuario"
              name="username"
              rules={[
                {
                  required: false,
                  message: "Por Favor Ingrese Usuario!",
                },
              ]}
            >
              <Input
                className="form_login_input"
                placeholder="Ingrese Usuario"
                clearable
              />
            </Form.Item>
            <Form.Item
              className="form_login_label"
              label="Contraseña"
              name="password"
              rules={[
                {
                  required: false,
                  message: "Por Favor Ingrese Contraseña!",
                },
              ]}
              extra={
                <div className="eye">
                  {!visible ? (
                    <EyeInvisibleOutline onClick={() => setVisible(true)} />
                  ) : (
                    <EyeOutline onClick={() => setVisible(false)} />
                  )}
                </div>
              }
            >
              <Input
                className="form_login_input"
                placeholder="Ingrese Contraseña"
                clearable
                type={visible ? "text" : "password"}
              />
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
