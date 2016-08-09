(function () {
    var pictures = [];
    var opened_picture = {};

    function getPictures(gallery) {
        gallery = gallery || 'hot';
        Utils.request(CONFIG.IMGUR_API_ENDPOINT + gallery + '/viral/0.json',
            {headers: [{name: 'Authorization', val: 'Client-ID 747f78a06dd424e'}]})
        .then(function (data) {
              pictures = data.data;
              displayPictures(8);
        }, function (response){
            pictures = [];
            throw response.responseText;
        });
    }

    function displayPictures(limit) {
        var result = '';
        limit = limit || 10;
        if (!Utils.isArray(pictures)) {
            throw 'tried to display pictures using invalid information';
        }
        pictures = pictures.filter(function  (val, index) {
            return index < limit ? true : false;
        });
        result = pictures.reduce(function (pre, cur, idx) {
            cur.img_url = cur.link;
            cur.idx = idx;
            if (cur.is_album === true) {
                cur.img_url = 'http://imgur.com/' + cur.cover + '.jpg';
            }
            return pre += Utils.parseTemplate('picture-frame', cur);
        }, '');
        document.getElementById('gallery-container').innerHTML = result;
    }

    function displayPicture(_idx) {
      var template_content = '';
      if (pictures[_idx]) {
        opened_picture = pictures[_idx];
        opened_picture.idx = _idx;
        opened_picture.previous_idx = _idx - 1;
        opened_picture.next_idx = _idx + 1;
        template_content = Utils.parseTemplate('full-modal', opened_picture);
        document.querySelector('#modal-container').innerHTML = template_content;
      } else {
        document.querySelector('#modal-container').innerHTML = '';
      }
    }

    document.querySelector('body').addEventListener('click', function(event) {
      if (event.target.className.match('img') !== null) {
        var _idx = +event.target.attributes.index.textContent;
        displayPicture(_idx);
      }
    });

    document.querySelector('body').addEventListener('click', function(event) {
      if (event.target.className.match('close-img-modal') !== null) {
          document.querySelector('#modal-container').innerHTML = '';
      }
    });

    document.querySelector('body').addEventListener('click', function(event) {
      if (event.target.className.match('change-image-arrow') !== null) {
          var _idx = +event.target.attributes.index.textContent;
          displayPicture(_idx);
      }
    });

    document.querySelector('body').addEventListener('keyup', function(e) {
        e = e || window.event;
        var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
        if (charCode === 27) {
            document.querySelector('#modal-container').innerHTML = '';
        }
        if (charCode === 39) {
            displayPicture(opened_picture.next_idx);
        }
        if (charCode === 37) {
            displayPicture(opened_picture.previous_idx);
        }
    });

    getPictures();
})();
