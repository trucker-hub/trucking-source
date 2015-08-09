'use strict';

angular.module('servicesApp')
    .controller('CompanyDetailsCtrl', function ($scope) {

        console.log("open a edit window for company");

        this.setCompany = function(company) {
          this.company = company;
        }

        this.ok = function() {

        }

        this.cancel = function() {

        }
    });
