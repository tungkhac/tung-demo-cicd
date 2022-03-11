// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
/**
 * Created by nguyen.khac.tung on 9/24/2018.
 */
var model = require('../model');
var Exception = model.Exception;
const UtilityModule = require('./util');
const config = require('config');
const GOOGLE_MAP_API_KEY = "AIzaSyDDxqvFQAP5hMxxEF96LkTHxbbtJXyb0Nc";

var googleMapsClient = require('@google/maps').createClient({
    key: GOOGLE_MAP_API_KEY,
    language: 'ja',
    Promise: Promise
});

//init Geocode Google map
function googleMapGetLocation(params, callback) {
    var address = params.address;
    googleMapsClient.geocode({address: address})
        .asPromise()
        .then(function(response) {
            var json_data = response.json;
            if(json_data.status == "OK"){
                var data = json_data.results[0];

                var address_components = Object.values(data.address_components);
                //console.log(address_components);
                //console.log(address_components.length);
                var city_name = "";
                if(address_components.length > 0){
                    for(var i = 0; i < address_components.length; i++){
                        //console.log(data.address_components[i]);
                        var tmp = data.address_components[i];
                        if(tmp.types.indexOf("locality") !== -1){
                            city_name = tmp.long_name;
                            break;
                        }
                    }
                }
                if(address.indexOf(city_name) !== -1 || city_name.indexOf(address) !== -1){
                }else{
                    city_name = ""
                }
                data = {
                    status: "True",
                    lat: data.geometry.location.lat,
                    long: data.geometry.location.lng,
                    city_name: city_name,
                    address: data.formatted_address
                };
                return callback(data);
            }else{
                var data1 = {
                   status: "False"
                };
                return callback(data1);
            }

        })
        .catch(function(err) {
            //if(typeof err == 'object') {
            //    if(params.connect_page_id != void 0) {
            //        err['connect_page_id'] = params.connect_page_id;
            //    }
            //    if(params.user_id != void 0) {
            //        err['user_id'] = params.user_id;
            //    }
            //}
            UtilityModule.saveException(params.connect_page_id, params.user_id, err, "googleMapGetLocation", "001");
            var data1 = {
                status: "False"
            };
            return callback(data1);
        });
}

exports.googleMapGetLocation = googleMapGetLocation;