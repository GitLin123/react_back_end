import loaders from "./loaders/index.js";
import express from "express";
import router from "./routes/index.js"
const app = express();
async function startServer() {
    await loaders.init({ expressApp: app });
    app.use('/api', router);
    app.listen(3000, '0.0.0.0',() => {
        console.log(`Server running on port ${3000}`);
    });
}
startServer();
