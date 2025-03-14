import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Splash API",
            version: "1.0.0",
            description: "API documentation for the Water Channel Management System",
            contact: {
                name: "Developer Support",
                email: "support@splash.com",
            },
        },
        servers: [
            {
                url: "http://localhost:5000",
                description: "Local development server",
            },
            {
                url: "https://your-render-deployment-url.com",
                description: "Production server",
            },
        ],
    },
    apis: ["./src/routes/*.js"], // Points to all route files for auto-documentation
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerDocs, swaggerUi };
