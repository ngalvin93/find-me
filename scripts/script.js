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
        console.log('loading...');
        document.getElementById('get-location-btn').textContent = 'Getting location...';
    };

    var locationSuccess = function (location) {
        console.log('%c got location', 'color: green');
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
            restartTable(createTable);
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

    var createTable = function () {
        if (localStorage.length !== 0) {
            if (document.querySelector('.empty')) {
                main.removeChild(document.querySelector('.empty'));
            }
            // something in storage, render it on page
            var savedLocations = document.createElement('div');
            savedLocations.className ='saved-locations';
            var data = {};
            for (var i = 0; i < localStorage.length; i++){
                var location = document.createElement('div');
                location.className = 'location';
                let locationObj = JSON.parse(localStorage.getItem(localStorage.key(i)));
                data[locationObj.date] = locationObj;
                location.innerHTML = `${new Date(locationObj.date).toLocaleTimeString('en-US')}, ${locationObj.lat}, ${locationObj.lon}`
                savedLocations.append(location);
            }
            // sort data
            // console.log(data)
            // Object.entries(data).forEach(function ([key, value]) {
            //     // console.log(key, value);
                
            // })
            var clearBtn = document.createElement('button');
            clearBtn.className = 'clear-btn';
            clearBtn.textContent = 'Clear Locations';

            clearBtn.addEventListener('click', function () {
                localStorage.clear();
                createTable();
            })

            main.appendChild(savedLocations);
            main.appendChild(clearBtn);
        } else {
            // local storage clear
            // clear the existing list of locations, if any
            if (document.querySelector(".saved-locations")) {
                main.removeChild(document.querySelector(".saved-locations")); // remove location section
                main.removeChild(document.querySelector(".clear-btn")); // remove clear btn
            }
            // nothing in storage, render "No locations saved"
            let text = document.createElement('div');
            text.className = "empty";
            text.innerHTML = 'No locations saved.';
            main.appendChild(text);
        }
    };

    createTable();

})()