(function () {
    function getPictures(gallery) {
        gallery = gallery || 'hot';
        Utils.request(CONFIG.IMGUR_API_ENDPOINT + gallery + '/viral/0.json', 
            {headers: [{name: 'Authorization', val: 'Client-ID 747f78a06dd424e'}]})
        .then(function (data) {
              displayPictures(data.data);
        }, function (response){
            throw response.responseText;
        });
    }

    function displayPictures(pictures) {
        var result = '';
        if (!Utils.isArray(pictures)) {
            throw 'tried to display pictures using invalid information';
        }
        var result = pictures.reduce(function (pre, cur) {
            cur.img_url = cur.link;
            if (cur.nsfw === true ) {
                return pre;
            }
            if (cur.is_album === true) {
                cur.img_url = 'http://imgur.com/' + cur.cover + '.jpg';
            }
            return pre += Utils.parseTemplate('picture-frame', cur);
        }, '');
        document.getElementById('gallery-container').innerHTML = result;
    }

    getPictures();
})();
