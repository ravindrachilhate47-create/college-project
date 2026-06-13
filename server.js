const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root', 
    database: 'megablog_db'
});

db.connect((err) => {
    if (err) {
        console.error('❌ MySQL Connection Error:', err);
        return;
    }
    console.log('🚀 MySQL Database Connected Successfully on Port 8000!');
});

app.get('/api/blogs', (req, res) => {
    const sql = "SELECT * FROM blogs ORDER BY id DESC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const formattedResults = results.map(blog => ({
            ...blog,
            comments: blog.comments ? JSON.parse(blog.comments) : [],
            isUserPost: true 
        }));
        res.json(formattedResults);
    });
});


app.post('/api/blogs', (req, res) => {
    const { title, category, content, imgUrl, date } = req.body;
    const sql = "INSERT INTO blogs (title, category, content, imgUrl, date, comments) VALUES (?, ?, ?, ?, ?, ?)";
    const emptyComments = JSON.stringify([]); 
    
    db.query(sql, [title, category, content, imgUrl, date, emptyComments], (err, result) => {
        if (err) return res.status(400).json({ error: err.message });
        res.status(201).json({ id: result.insertId, title, category, content, imgUrl, date, likes: 0, comments: [] });
    });
});


app.post('/api/blogs/:id/like', (req, res) => {
    const blogId = req.params.id;
    const sqlUpdate = "UPDATE blogs SET likes = likes + 1 WHERE id = ?";
    const sqlSelect = "SELECT likes FROM blogs WHERE id = ?";
    
    db.query(sqlUpdate, [blogId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        db.query(sqlSelect, [blogId], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if(results.length > 0) res.json({ likes: results[0].likes });
            else res.status(404).json({ error: "Post not found" });
        });
    });
});


app.post('/api/blogs/:id/comment', (req, res) => {
    const blogId = req.params.id;
    const { comment } = req.body;
    const sqlSelect = "SELECT comments FROM blogs WHERE id = ?";
    const sqlUpdate = "UPDATE blogs SET comments = ? WHERE id = ?";
    
    db.query(sqlSelect, [blogId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: "Post not found" });
        
        let currentComments = results[0].comments ? JSON.parse(results[0].comments) : [];
        currentComments.push(comment);
        db.query(sqlUpdate, [JSON.stringify(currentComments), blogId], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ comments: currentComments });
        });
    });
});

app.listen(PORT, () => {
    console.log(`📡 Backend Active on http://localhost:${PORT}`);
});