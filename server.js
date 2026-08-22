const express = require("express");
const path = require("path");

const app = express();

const PORT = 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.post("/api/login", (req, res) => {

    const { email, password } = req.body;

    if (
        email === "admin@gmail.com" &&
        password === "admin123"
    ) {

        res.json({
            success: true,
            message: "Login successful"
        });

    } else {

        res.status(401).json({
            success: false,
            message: "Invalid email or password"
        });

    }

});

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});