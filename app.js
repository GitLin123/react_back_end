import loaders from "./loaders/index.js";
import express from "express";
import useRoutes from "./routes/user.router.js"
const app = express();
async function startServer() {
    await loaders.init({ expressApp: app });
    app.use('/api', useRoutes);
    app.listen(3000, '0.0.0.0',() => {
        console.log(`Server running on port ${3000}`);
    });
}
startServer();
