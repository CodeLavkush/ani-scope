import swaggerUi from "swagger-ui-express"
import YAML from "yamljs"

const swaggerDocument = YAML.load("./src/docs/swagger.yaml")

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "Ani Scope API",
            version: "1.0.0",
            description: "Anime platform backend API",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },

        servers: [
            {
                url: process.env.NODE_ENV === "prod" ? "http://backend:4000" : "http://localhost:4000",
            },
        ],
    },

    apis: ["./src/routes/*.js"],
}


export { swaggerUi, swaggerDocument }