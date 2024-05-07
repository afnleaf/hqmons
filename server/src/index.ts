// node modules
import { Elysia } from "elysia";

const PORT = process.env.PORT || 4444;

const app = new Elysia();

// port
app.listen(PORT);

// hello
console.log(
    `Frontend is running at  http://${app.server?.hostname}:${app.server?.port}`
);