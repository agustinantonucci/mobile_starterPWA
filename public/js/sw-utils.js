// Guardar  en el cache dinamico
function actualizaCacheDinamico(dynamicCache, req, res) {
  if (res.ok) {
    // console.log("actualizaCacheDinamico", req.clone())
    return caches.open(dynamicCache).then((cache) => {
      // cache.put(req, res.clone());
      if(req.clone().method === "POST") {
        respuesta = manejoApiTareas(dynamicCache, req.clone());
        console.log("Es un post, respuesta: ", res.clone());
      }
      return res.clone();
    });
  } else {
    return res;
  }
}

// Cache with network update
function actualizaCacheStatico(staticCache, req, APP_SHELL_INMUTABLE) {
  if (APP_SHELL_INMUTABLE.includes(req.url)) {
    // No hace falta actualizar el inmutable
    // console.log('existe en inmutable', req.url );
  } else {
    // console.log('actualizando', req.url );
    // console.log(req);
    return fetch(req)
      .then((res) => {
        return actualizaCacheDinamico(staticCache, req, res);
      })
      .catch(console.log);
  }
}

//Network with cache fallback then update
const manejoApiTareas = (cacheName, req) => {
  if (req.clone().method === "POST") {
    //Posteo de un nuevo tarea

    //Si el navegador soporta sync manager lo va a guardar en IndexedDB para luego sincronizarlo
    if (self.registration.sync) {
      return req
        .clone()
        .text()
        .then((body) => {
          const bodyObj = JSON.parse(body);
          return guardarTarea(bodyObj);
        });
    } else {
      return fetch(req);
    }
  } else {
    return fetch(req)
      .then((res) => {
        if (res.ok) {
          actualizaCacheDinamico(cacheName, req.clone(), res.clone());
          return res.clone();
        } else {
          return caches.match(req);
        }
      })
      .catch((err) => {
        return caches.match(req);
      });
  }
};
