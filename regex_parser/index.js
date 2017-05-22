let request = require('request');
let fs = require('fs');
let cheerio = require('cheerio');
let md5 = require('md5');

let nodeCache = '';

function createObj(pajeObj) {
    let pageBody = pajeObj.body;

    let $ = cheerio.load(pageBody);

    let title = '';
    let price = '';
    let description = '';
    let picArr = [];

    $('#CenterPanelInternal > div:nth-child(2)').children('h1').children().remove();
    title = $('#CenterPanelInternal > div:nth-child(2)').children('h1').text();

    price = $('#mm-saleDscPrc').attr('content') || $('#prcIsum').attr('content') || $('#prcIsumConv').children('span').text() || $('#prcIsum_bidPrice').attr('content') || $('#mainContent > div:nth-child(1) > table > tbody > tr:nth-child(6) > td > div > div:nth-child(2) > div.u-flL.w29.vi-price-np > span').attr('content');

    if ($('#vi_main_img_fs_slider').html()) {
        picArr = $('div #vi_main_img_fs').children('ul').children('li').map(function(i, elem) {
            return $(this)
                .children('a')
                .children('table')
                .children('tr')
                .children('td')
                .children('div')
                .children('img')
                .attr('src');
        }).get();
    }
    else {
        picArr.push($('#icImg').attr('src'));
    }

    if ($('#vi-desc-maincntr > div.itemAttr').text().replace(/\s{2,}/gi, ' ')) description = $('#vi-desc-maincntr > div.itemAttr').text().replace(/\s{2,}/gi, ' ');
    else description = 'No description';

    let date = new Date(Date.now());

    let parcedObj = {
        title:  title,
        description :  description,
        price:  price,
        image: picArr,
        parsingDateTime: date.toString()
    };



    return {
        url: pajeObj.url,
        obj: parcedObj
    };
}

function readFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) reject (err);
            else resolve (data);
        })
    });
}

function writeDataToFile(data, path) {
    return new Promise((resolve, reject) => {
        console.log('Write data to file '+ path);
        fs.writeFile(path, data, 'utf8', err => {
            if (err) reject (err);
            else {
                console.log('Data was written to file '+ path);
                resolve(data);
            }
        })
    });
}

function getPage(url) {

    return new Promise(function(resolve, reject) {

        /*setTimeout(function () {*/
        request.get({
            url: url
        }, function(error, res, body){
            if (!error){
                resolve(body);
            }
            else reject(error);
        });
        /*}, 2000);*/
    });
}

function createPagination () {

}


module.exports = function grabPages(url) {


    return readFile('E:\\internChi\\restApi\\regex_parser\\urlMap.json')
        .then(readedUrlMap => {
            nodeCache = new Map(JSON.parse(readedUrlMap));
            return getPage(url);
        })
        .then(mainPage => {
            return (cheerio.load(mainPage));
        })
        .then($ => {
            return $('div #ResultSetItems').children('#ListViewInner').children('li').map(function(i, elem) {
                return $(this).children('h3').children('a').attr('href');
            }).get();
        })
        .then(urlArr => {
            let promArray = [];

            for (let x = 0; x < urlArr.length; x++ ) {

                if (nodeCache.has(md5(urlArr[x]))) {
                    /*console.log('GOTED FROM CACHE ---- ' + urlArr[x]);
                    promArray.push(nodeCache.get(md5(urlArr[x])));*/
                    promArray.push(readFile('E:\\internChi\\restApi\\regex_parser\\cache\\' + md5(urlArr[x]) + '.txt')
                        .then(body  => {
                                console.log('GOTED FROM CACHE ----- ' + urlArr[x]);
                                return createObj({
                                    body: body,
                                    url: urlArr[x]
                                })
                            }
                        ).catch(err  => console.log(err))
                    );
                }
                else {
                    promArray.push(getPage(urlArr[x])
                        .then(body  => {
                                console.log('creating ----- ' + urlArr[x]);
                                nodeCache.set(urlArr[x], body);
                                writeDataToFile(body, 'E:\\internChi\\restApi\\regex_parser\\cache\\' + md5(urlArr[x]) + '.txt');
                                return createObj({
                                    body: body,
                                    url: urlArr[x]
                                })
                            }
                        ).catch(err  => console.log(err))
                    );
                }
            }
            return Promise.all(promArray);
        })
        .then (result => {

            writeDataToFile(JSON.stringify([...nodeCache]), 'E:\\internChi\\restApi\\regex_parser\\urlMap.json');
            return writeDataToFile(JSON.stringify(result), 'E:\\internChi\\restApi\\regex_parser\\output.json');
        })
        .catch(err => console.log(err));
};