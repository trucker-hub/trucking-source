/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var TruckingCompany = require('../api/trucking-company/trucking-company.model');

Thing.find({}).remove(function () {
    Thing.create({
        name: 'Development Tools',
        info: 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
    }, {
        name: 'Server and Client integration',
        info: 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
    }, {
        name: 'Smart Build System',
        info: 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
    }, {
        name: 'Modular Structure',
        info: 'Best practice client and server structures allow for more code reusability and maximum scalability'
    }, {
        name: 'Optimized Build',
        info: 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
    }, {
        name: 'Deployment Ready',
        info: 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
    });
});


TruckingCompany.find({}).remove(function () {
        TruckingCompany.create(
            {
                name: "Aspeed",
                contact: "310-951-3843",
                location: "9111 S La Cienega Blvd, Inglewood, CA 90301",
              phone: "3109111111",
              fax: "3109111112",
              email: "hello@trucking-hub.com",
                favorite: false,
                rateBasis: "city",
                ftl: {
                    fuelSurcharge: 0.20,
                    residentialCharge: 60.0,
                    regions: [
                        {
                            state: "CA",
                            county: "San Diego County",

                        }
                    ],
                    OverWeightCharges: []
                }
            },
            {
                name: "Bspeed",
                location: "9111 S La Cienega Blvd, Inglewood, CA 90301",
              phone: "3109111111",
              fax: "3109111112",
              email: "hello@trucking-hub.com",
                favorite: true,
                rateBasis: "city",
                ftl: {
                    fuelSurcharge: 0.20,
                    residentialCharge: 60.0,
                    regions: [
                        {
                            state: "CA",
                            county: "Orange County"
                        },
                        {
                            state: "CA",
                            county: "San Diego County"
                        }
                    ],
                    OverWeightCharges: []
                }
            },
            {
                name: "Cspeed",
                contact: "310-951-3843",
                location: "9111 S La Cienega Blvd, Inglewood, CA 90301",
                phone: "3109111111",
                fax: "3109111112",
                email: "hello@trucking-hub.com",
                favorite: false,
                rateBasis: "city",
                ftl: {
                    fuelSurcharge: 0.20,
                    residentialCharge: 60.0,
                    regions: [
                        {
                            state: "CA",
                            county: "Los Angeles County"
                        }
                    ],
                    OverWeightCharges: []
                }
            },
            {
                name: "Dspeed",
                location: "9111 S La Cienega Blvd, Inglewood, CA 90301",
              phone: "3109111111",
              fax: "3109111112",
              email: "hello@trucking-hub.com",
                favorite: false,
                rateBasis: "city",
                ftl: {
                    fuelSurcharge: 0.20,
                    residentialCharge: 60.0,
                    regions: [
                        {
                            state: "CA",
                            county: "Los Angeles County"
                        },
                        {
                            state: "CA",
                            county: "Orange County"
                        },
                        {
                            state: "CA",
                            county: "San Diego County"
                        }
                    ],
                    OverWeightCharges: []
                }
            });
    });

User.find({}).remove(function () {
    User.create({
            provider: 'local',
            name: 'Test User',
            email: 'test@test.com',
            password: 'test'
        }, {
            provider: 'local',
            role: 'admin',
            name: 'Admin',
            email: 'admin@admin.com',
            password: 'admin'
        }, function () {
            console.log('finished populating users');
        }
    );
});
