import appConfig from "./index.js"
import {config} from "./config.js";
import router from "./routes/index.js";

const {app, env} = appConfig;
const PORT = config[env].PORT || 8080;


app.get("/", (req, res)=>{
    return res.status(200).send("Welcome to one stop backend services!")
})

app.use("/api", router)

app.listen(PORT, ()=>{
    console.log("Server successfully started on: "+PORT);
})