const fs = require('fs');

fs.readFile('git.txt', 'utf8', function(err, data){
    console.log(data);
});