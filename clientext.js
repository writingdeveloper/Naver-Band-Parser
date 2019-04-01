const cheerio = require('cheerio')
const request = require('request');

const mysql = require('mysql');
// 비밀번호는 별도의 파일로 분리해서 버전관리에 포함시키지 않아야 합니다. 
var db = mysql.createConnection({
    host: '118.35.126.219',
    user: 'sangumee',
    password: 'sihung84265@',
    database: 'clien',
    charset: 'utf8mb4'
});


let postNumber='13258240';
request.get({
    url: 'https://www.clien.net/service/group/community'
}, function (err, response, body) {
    let $ = cheerio.load(body);
    postNumber = $('.list_item.symph_row').attr('data-board-sn');
})


function getData() {
    return new Promise(function (resolve, reject) {
        request.get({
            url: `https://www.clien.net/service/board/park/${postNumber}`
        }, function (err, response, body) {
            if (err) {
                getData()
                console.log(err);
            }
            let $ = cheerio.load(body);
            let title = $('.post_subject span').text();
            let author = $('.nickname span').text();
            let content = $('.post_article.fr-view').text().replace(/(\r\n|\n|\r|\t|\\)/gm, "");
            if (title) {
                resolve('Found Data Title!!'); // Accept
                if (author === '') {
                    author = $('.nickname img').attr('alt');
                }
                console.log(`Now Processing POST NUMBER : ${postNumber}`);
                db.query(`INSERT INTO post (postNumber, title, author, content) VALUES (?,?,?,?)`, [postNumber, title, author, content]);
                postNumber--;
                getData();
            } else {
                // reject('DATA NULL PAGE'); // Reject
                postNumber--;
                getData();
            }
        })
    })
}

getData();

// getData().then(function (data) {
//     console.log(data);
// }, function (err) {
//     console.log(err);
// })