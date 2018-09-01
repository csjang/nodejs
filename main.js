var http    = require('http');
var fs      = require('fs');
var url     = require('url');
var qs      = require('querystring');
 
function templateHTML(title, list, article, control){
    return `
    <!doctype html>
    <html>
    <head>
        <title>WEB - ${title}</title>
        <meta charset="utf-8">
    </head>
    <body>
        <h1><a href="/">WEB</a></h1>
        ${list}
        ${control}
        ${article}
    </body>
    </html>
    `;
}

function templateList(filelist) {
    var list ='<ul>';
    var i = 0;
    while(i < filelist.length){
        list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        i += 1;
    }
    list += '</ul>';

    return list;
}

var app = http.createServer(function(req, res){
    var _url = req.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if(pathname === '/'){
        if(queryData.id === undefined){
            fs.readdir('./data', function(err, filelist){
                var title = 'Welcome';
                var description = 'Hello Node.js';
                var list = templateList(filelist);
                var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`, `<a href="/create">Create</a>`);
                res.writeHead(200);
                res.end(template);
            });
            
        } else {
            fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
                fs.readdir('./data', function(err, filelist){
                    var title = queryData.id;
                    var list = templateList(filelist);
                    var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`, `<a href="/create">Create</a>   <a href="/update?id=${title}">Update</a>
                    <form action="/delete_process" method="POST">
                        <input type="hidden" name="id" value="${title}">
                        <input type="submit" value="Delete">
                    </form>`);
                    res.writeHead(200);
                    res.end(template);
                });
            });
        }
    } else if (pathname === '/create'){
        fs.readdir('./data', function(err, filelist){
            var title = 'Create';
            var list = templateList(filelist);
            var template = templateHTML(title, list, `
                    <form action="/create_process" method="POST">
                        <p>
                            <input type="text" name="title" placeholder="Title">
                        </p>
                        <p>
                            <textarea name="description" cols="22" rows="5" placeholder="Description"></textarea>
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                    </form>
                    `, '');
            // 200 : success
            res.writeHead(200);
            res.end(template);
        });
    } else if (pathname === '/create_process'){
        var reqbody = '';
        req.on('data', function(data){
            reqbody += data;
        });
        req.on('end', function(){
            var post = qs.parse(reqbody);
            var title = post.title;
            var description = post.description;
            fs.writeFile(`./data/${title}`, description, 'utf8', function(err){
                // 302 : redirection
                res.writeHead(302, {Location:`/?id=${title}`});
                res.end();
            });
        });
    } else if (pathname === '/update'){
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
            fs.readdir('./data', function(err, filelist){
                var title = queryData.id;
                var list = templateList(filelist);
                var template = templateHTML(title, list, `
                        <form action="/update_process" method="POST">
                                <input type="hidden" name="id" value=${title}>
                                <p>
                                    <input type="text" name="title" placeholder="Title" value=${title}>
                                </p>
                                <p>
                                    <textarea name="description" cols="22" rows="5" placeholder="Description">${description}</textarea>
                                </p>
                                <p>
                                    <input type="submit">
                                </p>
                            </form>`, `<a href="/create">Create</a>   <a href="/update/?id=${title}">Update</a>`);
                res.writeHead(200);
                res.end(template);
            });
        });
    } else if (pathname === '/update_process'){
        var reqbody = '';
        req.on('data', function(data){
            reqbody += data;
        });
        req.on('end', function(){
            var post = qs.parse(reqbody);
            var id = post.id;
            var title = post.title;
            var description = post.description;
            fs.rename(`./data/${id}`, `./data/${title}`, function(err){
                fs.writeFile(`./data/${title}`, description, 'utf8', function(err){
                    // 302 : redirection
                    res.writeHead(302, {Location:`/?id=${title}`});
                    res.end();
                });
            });
        });
    } else if (pathname === '/delete_process'){
        var reqbody = '';
        req.on('data', function(data){
            reqbody += data;
        });
        req.on('end', function(){
            var post = qs.parse(reqbody);
            var id = post.id;

            fs.unlink(`./data/${id}`, function(err){
                // 302 : redirection
                res.writeHead(302, {Location:`/`});
                res.end();
            });
        });
    } else {
        // 404 : not found
        res.writeHead(404);
        res.end('Not found');
    }
});

app.listen(3003);