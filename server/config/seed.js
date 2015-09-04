/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var TruckingCompany = require('../api/trucking-company/trucking-company.model');
var FtlLoad = require('../api/load/ftlLoad/ftlLoad.model.js');


Thing.find({}).remove(function () {
  Thing.create( {
    name: 'Deployment Ready',
    info: 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
  });
});

FtlLoad.find({}).remove(function() {
  FtlLoad.create(
      {
        who: "Elite Toner",
        shipTo: {
          location: {
            full_address: "9111 S La Cienega Blvd, #211, Inglewood, CA 90301",
            state:        "CA",
            county:       "Los Angeles County",
            city:         "Inglewood",
            zipCode:      "90301"
          }
        },
        shipFrom: {
          location: {
            full_address: "3476 Del Amo Blvd, Torrance, CA 90503",
            state:        "CA",
            county:       "Los Angeles County",
            city:         "Torrance",
            zipCode:      "90503"
          }
        },

        lines: [{
          weight: 17000,
          quantity: 1,
          packaging: "Full container",
          length: 20,
          width: 20,
          height: 20,
          description: "Metals"
        }],
        trailer: {
          type: 'Dry Van',
          size: "40"
        }
      },
      {
        who: "Beverly Furniture",
        shipTo: {
          location: {
            full_address:     "3476 Del Amo Blvd, Torrance, CA 90503",
            state:      "CA",
            county:     "Los Angeles County",
            city:       "Torrance",
            zipCode:    "90503"
          }
        },
        shipFrom: {
          location: {
            full_address:     "9111 S La Cienega Blvd, #211, Inglewood, CA 90301",
            state:      "CA",
            county:     "Los Angeles County",
            city:       "Inglewood",
            zipCode:    "90301"
          }
        },

        lines: [{
          weight: 10000,
          quantity: 1,
          packaging: "Full container",
          length: 20,
          width: 20,
          height: 20,
          description: "Metals"
        }],
        trailer: {
          type: 'Dry Van',
          size: "40"
        }
      }
  )
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
          fuelSurcharge: 2.0,
          residentialCharge: 60.0,
          regions: [
            {
              state: "CA",
              county: "Los Angeles County"
            }
          ],
          OverWeightCharges: [
            {
              containerSize: "40",
              ranges: [
                {limit:13000, charge:100},
                {limit:16000, charge:150}
              ]
            }
          ],
          rates: [
            {
              state: "CA",
              city: "Inglewood",
              zipCode: "90301",
              rate: 100,
              dropOffCharge: 0
            },
            {
              state: "CA",
              city: "Torrance",
              zipCode: "90503",
              rate: 150,
              dropOffCharge: 60
            },
            {
              state: "CA",
              city: "Rancho Palos Verdes",
              zipCode: "90275",
              rate: 200,
              dropOffCharge: 100
            }
          ]
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
            }
          ],
          OverWeightCharges: [
            {
              containerSize: "40",
              ranges: [
                {limit: 13000, charge: 150},
                {limit: 16000, charge: 200}
              ]
            }
          ],
          rates: [
            {
              state: "CA",
              city: "Inglewood",
              zipCode: "90301",
              rate: 150,
              dropOffCharge: 0
            },
            {
              state: "CA",
              city: "Torrance",
              zipCode: "90503",
              rate: 200,
              dropOffCharge: 60
            },
            {
              state: "CA",
              city: "Rancho Palos Verdes",
              zipCode: "90275",
              rate: 250,
              dropOffCharge: 100
            }
          ]
        }
      }
  );
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
