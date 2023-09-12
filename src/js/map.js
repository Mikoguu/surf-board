let map;

    DG.then(function () {
        map = DG.map('map', {
            center: [55.752004, 37.576133],
            zoom: 17
        });

        myIcon = DG.icon({
          iconUrl: './img/map-mark.svg',
          iconSize: [48, 48]
      });

      DG.marker([55.752004, 37.576133], {
        icon: myIcon
    }).addTo(map);
  });
