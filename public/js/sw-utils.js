// Guardar  en el cache dinamico
function actualizaCacheDinamico(dynamicCache, req, res) {
  console.log(`REQ: ${req}, RES: ${res}`);
  if (res.ok) {
    console.log("actualizaCacheDinamico", req)
    return caches.open(dynamicCache).then((cache) => {
      // cache.put(req, res.clone());
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
// const manejoApiMensajes = (cacheName, req) => {
//   if (req.clone().method === "POST") {
//     //Posteo de un nuevo mensaje

//     //Si el navegador soporta sync manager lo va a guardar en IndexedDB para luego sincronizarlo
//     if (self.registration.sync) {
//       return req
//         .clone()
//         .text()
//         .then((body) => {
//           const bodyObj = JSON.parse(body);
//           return guardarMensaje(bodyObj);
//         });
//     } else {
//       return fetch(req);
//     }
//   } else {
//     return fetch(req)
//       .then((res) => {
//         if (res.ok) {
//           actualizaCacheDinamico(cacheName, req, res.clone());
//           return res.clone();
//         } else {
//           return caches.match(req);
//         }
//       })
//       .catch((err) => {
//         return caches.match(req);
//       });
//   }
// };
