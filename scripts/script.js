(function(){
    var loadingLocation;
    var geoLocationOptions = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    var main = document.getElementById('main');
    var getLocationBtn = document.getElementById('get-location-btn');

    getLocationBtn.addEventListener('click', function (e) {
        e.preventDefault();
        navigator.geolocation.getCurrentPosition(locationSuccess, locationError, geoLocationOptions);
        loadingLocation = setInterval(showLoadingState, 200);
    });

    var showLoadingState = function () {
        // console.log('loading...');
        document.getElementById('get-location-btn').textContent = 'Getting location...';
    };

    var locationSuccess = function (location) {
        // console.log('%c got location', 'color: green');
        clearInterval(loadingLocation);
        document.getElementById('get-location-btn').textContent = 'Find me';
        var modalContainer = document.createElement('div');
        modalContainer.className = 'modal-container';
        var modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header';
        var modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        var modalActions = document.createElement('div');
        modalActions.className = 'modal-actions';
        var latitudeLabel = document.createElement('div');
        latitudeLabel.className = 'modal-label';
        latitudeLabel.innerHTML = 'Latitude';
        var latitude = document.createElement('div');
        latitude.className = 'latitude';
        var longitudeLabel = document.createElement('div');
        longitudeLabel.className = 'modal-label';
        longitudeLabel.innerHTML = 'Longitude';
        var longitude = document.createElement('div');
        longitude.className = 'longitude';
        var altitudeLabel = document.createElement('div');
        altitudeLabel.className = 'modal-label';
        altitudeLabel.innerHTML = 'Altitude';
        var altitude = document.createElement('div');
        altitude.className = 'altitude';
        var closeBtn = document.createElement('button');
        closeBtn.className = 'close-btn';
        var saveBtn = document.createElement('button');
        saveBtn.className = 'save-btn';

        modalHeader.innerHTML = 'Found you!';
        latitude.innerHTML = location.coords.latitude ? location.coords.latitude : 'Unavailable';
        longitude.innerHTML = location.coords.longitude ? location.coords.longitude : 'Unavailable';
        altitude.innerHTML = location.coords.altitude ? location.coords.altitude : 'Unavailable';
        closeBtn.innerHTML = 'Close';
        saveBtn.innerHTML = 'Save Location';

        modalContent.appendChild(latitudeLabel);
        modalContent.appendChild(latitude);
        modalContent.appendChild(longitudeLabel);
        modalContent.appendChild(longitude);
        modalContent.appendChild(altitudeLabel);
        modalContent.appendChild(altitude);
        modalActions.appendChild(closeBtn);
        modalActions.appendChild(saveBtn);
        modalContainer.appendChild(modalHeader);
        modalContainer.appendChild(modalContent);
        modalContainer.appendChild(modalActions);
        main.appendChild(modalContainer);

        closeBtn.addEventListener('click', function (e) {
            e.preventDefault();
            closeModal();
        });

        saveBtn.addEventListener('click', function (e) {
            e.preventDefault();
            var date = Date.now();
            let obj = {
                lat: latitude.innerHTML,
                lon: longitude.innerHTML,
                alt: altitude.innerHTML,
                date: date
            };
            let data = JSON.stringify(obj);
            localStorage.setItem(date, data);
            saveBtn.classList.add('saved');
            saveBtn.innerHTML = 'Saved!';
            saveBtn.disabled = true;
            restartTable(init);
        })

    };

    var locationError = function (err) {
        // TODO dont display modal & show error
        console.error('Error: ', err);
    };

    var closeModal = function () {
        main.removeChild(document.querySelector('.modal-container'));
    };

    var restartTable = function (callback) {
        if (document.querySelector('.saved-locations')) {
            main.removeChild(document.querySelector('.saved-locations'));
        }
        if (document.querySelector('.empty')) {
            main.removeChild(document.querySelector('.empty'))
        }
        if (document.querySelector('.clear-btn')) {
            main.removeChild(document.querySelector('.clear-btn'));
        }
        callback()
    };

    /**
     * 
     * @param {Object} dataObj Data object
     * @param {Array} dataArr Ordered array of timestamps
     */
    var createTableDOM = function (dataArr) {
        // console.log(dataArr)
        var tableDataOrder = ['date', 'lat', 'lon', 'alt'];
        var table = document.createElement('table');
        table.className = 'location-table';
        var head = document.createElement('thead');
        var headRow = document.createElement('tr');
        var headDate = document.createElement('th');
        headDate.textContent = 'Date';
        var headLat = document.createElement('th');
        headLat.textContent = 'Latitude';
        var headLon = document.createElement('th');
        headLon.textContent = 'Longitude';
        var headAlt = document.createElement('th');
        headAlt.textContent = 'Altitude';
        var body = document.createElement('tbody');

        var row;
        for (let i = 0; i < dataArr.length; i++) {
            row = document.createElement('tr');
            let currLoc = dataArr[i]
            // console.log(currLoc);
            for (let j = 0; j < tableDataOrder.length; j++) {
                let data = document.createElement('td');
                switch (tableDataOrder[j]) {
                    case 'date':
                        data.textContent = new Date(currLoc[tableDataOrder[j]]).toLocaleString();
                        break;
                    case 'lat':
                        data.textContent = currLoc[tableDataOrder[j]];
                        break;
                    case 'lon':
                        data.textContent = currLoc[tableDataOrder[j]];
                        break;
                    case 'alt':
                        let text = currLoc[tableDataOrder[j]] === 'Unavailable' ? '-' : currLoc[tableDataOrder[j]]
                        data.textContent = text;
                        break;
                }
                row.appendChild(data);
            }
            body.appendChild(row);
        }

        headRow.appendChild(headDate);
        headRow.appendChild(headLat);
        headRow.appendChild(headLon);
        headRow.appendChild(headAlt);
        head.appendChild(headRow);
        table.appendChild(head);
        table.appendChild(body);
        main.appendChild(table);
    };

    var init = function () {
        if (localStorage.length !== 0) {
            if (document.querySelector('.empty')) {
                main.removeChild(document.querySelector('.empty'));
            }
            // something in storage, render it on page
            // var savedLocations = document.createElement('div');
            // savedLocations.className ='saved-locations';
            var dataObj = {};
            var dataArr = [];
            let locationObj;
            let i;
            let j;
            for (i = 0; i < localStorage.length; i++){
                dataArr.push(JSON.parse(localStorage.getItem(localStorage.key(i))).date);
                locationObj = JSON.parse(localStorage.getItem(localStorage.key(i)));
                dataObj[locationObj.date] = locationObj;
            }
            // sort dates
            dataArr.sort(function(a,b){
                return a - b;
            })
            let out = []
            for (j = 0; j < dataArr.length; j++) {
                out.push(dataObj[dataArr[j]]);
            }
            if (document.querySelector('.location-table')) {
                main.removeChild(document.querySelector('.location-table'));
            }
            createTableDOM(out);
            var clearBtn = document.createElement('button');
            clearBtn.className = 'clear-btn';
            clearBtn.textContent = 'Clear Locations';

            clearBtn.addEventListener('click', function () {
                localStorage.clear();
                init();
            })

            // main.appendChild(savedLocations);
            main.appendChild(clearBtn);
        } else {
            // local storage clear
            // clear the existing list of locations, if any
            if (document.querySelector(".location-table")) {
                main.removeChild(document.querySelector(".location-table")); // remove location section
                main.removeChild(document.querySelector(".clear-btn")); // remove clear btn
            }
            // nothing in storage, render "No locations saved"
            let text = document.createElement('div');
            text.className = "empty";
            text.innerHTML = 'No locations saved.';
            main.appendChild(text);
        }
    };

    init();

})()