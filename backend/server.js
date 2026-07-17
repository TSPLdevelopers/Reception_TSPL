const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./src/config/db");
const validateEnvironment = require("./src/config/validateEnv");

const startServer = async () => {
    validateEnvironment();
    await connectDB();

    const app = require("./app");
    const port = process.env.PORT || 5000;

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};

startServer().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
