'use strict';

angular.module('servicesApp')
    .controller('CompanyDetailsCtrl', function ($scope) {

        console.log("open a edit window for company");

        this.setCompany = function(company, okFunc, cancelFunc) {
          console.log("company is set to " + company.name);
          this.company = company;
          this.cancel = cancelFunc;
          this.save = okFunc;
        }
    });
