import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import ClienteIndividualView from "../../views/ClienteIndividualView";
import ClientesView from "../../views/ClientesView";
import ConfiguracionView from "../../views/ConfiguracionView";
import DetalleTareaView from "../../views/DetalleTareaView";
import HomeView from "../../views/HomeView";
import LoginView from "../../views/LoginView";
import NegocioCompletoView from "../../views/NegocioCompletoView";
import NuevaTareaView from "../../views/NuevaTareaView";
import TareasView from "../../views/TareasView";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";


const AppRouter = () => {
  return (
    <BrowserRouter basename="/app">
      <Switch>
        <PublicRoute exact path="/" component={LoginView}/>

        <PrivateRoute exact path="/home" component={HomeView}/>

        <PrivateRoute exact path="/configuracion" component={ConfiguracionView}/>

        <PrivateRoute exact path="/clientes" component={ClientesView}/>

        <PrivateRoute exact path="/tareas" component={TareasView}/>

        <PrivateRoute exact path="/detalletarea/*" component={DetalleTareaView}/>

        <PrivateRoute exact path="/nuevatarea" component={NuevaTareaView}/>

        <PrivateRoute exact path="/cliente-individual/*" component={ClienteIndividualView} />

        <PrivateRoute exact path="/negocio-completo/*" component={NegocioCompletoView} />

      </Switch>
    </BrowserRouter>
  );
};

export default AppRouter;
