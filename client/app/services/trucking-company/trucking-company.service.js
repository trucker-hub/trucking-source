'use strict';

angular.module('servicesApp')
    .service('truckingCompany', function ($http) {

        this.list = [];
        this.fetch = function(callbackOK, callbackERR) {
            $http.get("/api/trucking-companies").then(
                function(response) {
                    //console.log(JSON.stringify(response.data));
                    this.list = response.data;
                    callbackOK(response);
                },
                function(response) {
                    this.list = [];
                    console.log("ran into error " + response);
                    callbackERR(response);
                });
        };

        this.delete = function(company, callbackOK, callbackERR) {
            $http.delete('/api/trucking-companies/' + company._id).then(
                function(response) {
                    var index;
                    for (index =0; index < this.list.length; ++index) {
                        var x = this.list[index];
                        if(x._id == company._id) {
                            this.list.splice(index,1);
                            break;
                        }
                    }
                    callbackOK(response);
                },
                function(response) {
                    callbackERR(response);
                }
            );
        };
        this.save = function(company, callbackOK, callbackERR) {
            $http.put('/api/trucking-companies/' + company._id, {company: company}).then(
                function(response) {
                    callbackOK(response);
                },
                function(response) {
                    callbackERR(response);
                }
            );
        };

        this.toggleFavorite = function(id) {
            var index;
            for (index =0; index < this.list.length; ++index) {
                var company = this.list[index];
                if(company._id == id) {
                    company.favorite = !company.favorite;
                    this.save(company,
                        function (response) {
                            console.log(JSON.stringify(response.data));
                        },
                        function(response) {
                            console.log("ran into error during update");
                            //if error, revert the change
                            company.favorite = !company.favorite;
                        }
                    );
                    break;
                }
            }
            return;
        };

        this.add = function(newOne, callbackOK, callbackERR) {
            $http.post("/api/trucking-companies", newOne).then(
                function(response) {
                    console.log(JSON.stringify(response.data));
                    this.list.push(response.data);
                    callbackOK();
                },
                function(response) {
                    console.log("ran into error " + response);
                    callbackERR();
                }
            );
        };

        this.get = function() {
            return this.list;
        };

        return this;

    });
