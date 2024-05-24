import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const salt = 10;

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["POST", "GET"],
    credentials: true
}));
app.use(cookieParser());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "signup"
});

// Middleware to verify JWT token
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "You are not authenticated" });
    } else {
        jwt.verify(token, "jwt-secreat-key", (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: "Token is not valid" });
            } else {
                req.name = decoded.name;
                next();
            }
        });
    }
};

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    bcrypt.hash(password, salt, (err, hash) => {
        if (err) return res.json({ error: "Error hashing password" });
        const sql = "INSERT INTO login (name, email, password) VALUES (?, ?, ?)";
        const values = [name, email, hash];
        db.query(sql, values, (err, result) => {
            if (err) return res.json({ error: "Error inserting data" });
            return res.json({ status: "Success" });
        });
    });
});

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM login WHERE email = ?";
    db.query(sql, [req.body.email], (err, data) => {
        if (err) return res.json({ error: "Login error in server" });
        if (data.length > 0) {
            bcrypt.compare(req.body.password, data[0].password, (err, response) => {
                if (err) return res.json({ error: "Password compare error" });
                if (response) {
                    const name = data[0].name;
                    const token = jwt.sign({ name }, "jwt-secreat-key", { expiresIn: '1d' });
                    res.cookie('token', token, { httpOnly: true, sameSite: 'strict' });
                    return res.json({ status: "Success" });
                } else {
                    return res.json({ error: "Password does not match" });
                }
            });
        } else {
            return res.json({ error: "Email does not exist" });
        }
    });
});

// Route protected with JWT token verification middleware
app.get('/', verifyUser, (req, res) => {
    return res.json({ status: "Success", name: req.name });
});



app.get('/logout', (req,res) =>{
    res.clearCookie('token');
    return res.json({Status: "success"});
})

const PORT = 8081;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
