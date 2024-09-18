const app = require("./app");
const { port } = require("./config/env");
const { connectDatabase } = require("./db")

const server = async ()=>{
try {
    await connectDatabase();
    app.listen(port,()=>{
        console.log("server is running on port ",port);
    })
} catch (error) {
    console.log("🚀 ~ server ~ error:", error)
    server()
}
}
server()