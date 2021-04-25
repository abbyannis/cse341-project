const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;
    if (url === '/') {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Prove01</title><head>');
        res.write('<body>');
        res.write('<h1>Hello! Welcome to Prove 01!</h1>');
        res.write('<p style="font-family:verdana;font-size:16px;">Enter Username</p>');
        res.write('<form action="/create-user" method="POST">');
        res.write('<input type="text" name="username">')
        res.write('<button type="submit">Send</button>');
        res.write('</form>');
        res.write('</body>');
        res.write('<html>');
        res.end();
    }
    if (url === '/users') {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>User List</title><head>');
        res.write('<body>');
        res.write('<h1 style="text-align:center;">User List</h1>');
        res.write('<ul style="font-family:verdana;font-size:16px;">');
        res.write('<li>User 1</li>');
        res.write('<li>User 2</li>');
        res.write('<li>User 3</li>');
        res.write('<li>User 4</li>');
        res.write('<li>User 5</li>');
        res.write('</ul>');
        res.write('</body>');
        res.write('<html>');
        res.end();
    }
    if (url === '/create-user' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });
        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            console.log(parsedBody.split('=')[1]);
        }); 
        res.statusCode = 302;
        res.setHeader('Location', '/users');
        res.end(); 
    }
};

exports.handler = requestHandler;