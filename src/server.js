import appConfig from "./index.js"
import createAppRouter from "./routes/index.js";

const {app, env} = appConfig;
const PORT = 8080;

const appRoutes = createAppRouter();

app.get("/", (req, res)=>{
    return res.status(200).send("Welcome to one stop backend services!")
})

app.use("/api", appRoutes);

app.listen(PORT, ()=>{
    console.log("Server successfully started on: "+PORT);
})