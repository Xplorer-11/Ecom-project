const express = require('express');
// const session = require('express-session');
const app = express();
const port = 3000;
//dummy db
const users = [
    { username: 'Anshul', password: 'me' },
    { username: 'bob', password: 'password' }
];
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'my-secret-key',
}));
// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password ===
        password);
    if (!user) {
        res.send('Invalid username or password. Please try again.');
    } else {
        req.session.user = user.username;
        res.redirect('/welcome');
    }
});
app.get('/welcome', (req, res) => {
    if (req.session.user) {
        res.send(`Welcome, ${req.session.user}!`);
    } else {
        res.redirect('/');
    }
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});