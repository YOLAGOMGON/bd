import app from "./app.js";
import { env } from "./config/env.js";

app.listen(env.APP_PORT, (error) => {
  try {
    console.log(`Servidor corriendo en puerto ${env.APP_PORT}`);
    if (error) {
      console.log(error);
    }
  } catch (errorCatch) {
    console.error("Error al iniciar el servidor:", errorCatch);
  }
});
