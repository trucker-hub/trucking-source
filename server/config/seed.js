/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var TruckingCompany = require('../api/trucking-company/trucking-company.model');
var FtlLoad = require('../api/load/ftl/ftlLoad.model');
var LtlLoad = require('../api/load/ltl/ltl.model');
var Warehouse = require('../api/warehouse/warehouse.model')
var Counter = require('../api/counter/counter.model');
var Interest = require('../api/interest/interest.model');


Thing.find({}).remove(function () {
    Thing.create( {
        name: 'Deployment Ready',
        info: 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
    });
});

Warehouse.find({}).remove(function() {
    Warehouse.create({
        name: "St George LAX warehouse",
        info: "In Los Angeles, St. George Logistics offers a comprehensive warehousing and transportation package tailored to fit each of our customer's specific requirements.",
        contact: {
            phone:"3107644395",
            fax:"3107644395",
            email:"LAGeneralOrder@stgusa.com"
        },
        active: true,
        location: {
            full_address: "1650 South Central Avenue, Compton, CA 90220",
            state: "CA",
            county: "Los Angeles County",
            city: "Compton",
            zipCode: "90220"
        },
        fees: {
            terminal: {
                forklift: {fee: 5, cbm: 1, weight: 800, minimum: 50},
                receiving:{fee: 7.5, cbm: 1, weight: 800, minimum: 35}
            },
            minimum: 50,
            maximum:250,
            doc: 10,
            it: 0,
            freeTime: 5,
            storageFee: 100
        },
        fdaReg: "11889452704",
        lastUpdated: "7/1/14"
    }, {
        name: "Another Warehouse",
        info: "TBD",
        contact: {
            phone:"3107644395",
            fax:"3107644395",
            email:"LAGeneralOrder@stgusa.com"
        },
        active: true,
        location: {
            full_address: "1651 South Central Avenue, Compton, CA 90220",
            state: "CA",
            county: "Los Angeles County",
            city: "Compton",
            zipCode: "90220"
        },
        fees: {
            terminal: {
                forklift: {fee: 6, cbm: 1, weight: 800, minimum: 60},
                receiving:{fee: 8.5, cbm: 1, weight: 800, minimum: 45}
            },
            minimum: 60,
            maximum:250,
            doc: 10,
            it: 10,
            freeTime: 5,
            storageFee: 200
        },
        fdaReg: "11889452704",
        lastUpdated: "7/1/14"

    });
});

LtlLoad.find({}).remove(function() {
    LtlLoad.create({

            who: "Home and Body",
            email: "jinbo.chen@gmail.com",
            loadType:  'LTL',
            notes: "A note",
            shipTo: {
                location: {
                    full_address: "9111 S La Cienega Blvd, Inglewood, CA 90301",
                    state:      "CA",
                    county:     "Los Angeles County",
                    city:       "Inglewood",
                    zipCode:    "90301"
                },
                services: [{service: 'Inside'}, {service: 'LifeGate'}]
            },
            shipFrom: {
                location: {
                    full_address:     "4489 Spencer St, Torrance, CA 90503",
                    state:      "CA",
                    county:     "Los Angeles County",
                    city:       "Torrance",
                    zipCode:    "90503"
                },
                services: [{service: 'Inside'}, {service: 'LifeGate'}]
            },
            lines: [{
                weight: 200,
                quantity: 10,
                packaging:"Cartons",
                length: 10,
                width: 10,
                height: 10,
                description: "Dumper"
            }],
            fulfilledBy: {},
            deliveryOrderContact: {}
        }, {

            who: "Home and Body",
            email: "jinbo.chen@gmail.com",
            loadType:  'AIR',
            notes: "A note",
            shipTo: {
                location: {
                    full_address:     "9111 S La Cienega Blvd, Inglewood, CA 90301",
                    state:      "CA",
                    county:     "Los Angeles County",
                    city:       "Inglewood",
                    zipCode:    "90301"
                },
                services: [{service: 'Inside'}, {service: 'LifeGate'}]
            },
            shipFrom: {
                location: {
                    full_address:     "4489 Spencer St, Torrance, CA 90503",
                    state:      "CA",
                    county:     "Los Angeles County",
                    city:       "Torrance",
                    zipCode:    "90503"
                },
                services: [{service: 'Inside'}, {service: 'LifeGate'}]
            },
            lines: [{
                weight: 200,
                quantity: 10,
                packaging:"Cartons",
                length: 10,
                width: 10,
                height: 10,
                description: "Dumper"
            }],
            fulfilledBy: {},
            deliveryOrderContact: {}
        }
    )
});

FtlLoad.find({}).remove(function() {
    FtlLoad.create({
            who: "Elite Toner",
            email: "jinbo.chen@gmail.com",
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
                packaging: "20",
                description: "Metals"
            }],
            trailer: {
                type: 'Dry Van'
            }
        },
        {
            who: "Beverly Furniture",
            email: "jinbo.chen@gmail.com",
            shipTo: {
                location: {
                    full_address: "3476 Del Amo Blvd, Torrance, CA 90503",
                    state:        "CA",
                    county:       "Los Angeles County",
                    city:          "Torrance",
                    zipCode:       "90503"
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
                packaging: "20",
                description: "Metals"
            }],
            trailer: {
                type: 'Dry Van'
            }
        }
    )
});

TruckingCompany.find({}).remove(function () {
    TruckingCompany.create({
            name: "Aspeed",
            contact: "310-951-3843",
            location: "9111 S La Cienega Blvd, Inglewood, CA 90301",
            phone: "3109111111",
            fax: "3109111112",
            email: "hello@trucking-hub.com",
            favorite: true,
            rateBasis: "zipCode",
            ftl: {
                fuelSurcharge: 20,
                regions: [
                    { state: "CA", county: "Los Angeles County"}
                ],
                sizeCharges: [
                    {
                        containerSize: "20",
                        weightRanges: [
                            { limit:13000, charge:100},
                            { limit:16000, charge:150}
                        ],
                        pierPassFee: 66.50,
                        cleanTruckFee: 35,
                        congestionFee: 150
                    },
                    {
                        containerSize: "40",
                        weightRanges: [
                            { limit:13000, charge:100},
                            { limit:16000, charge:150}
                        ],
                        pierPassFee: 66.50,
                        cleanTruckFee: 35,
                        congestionFee: 150
                    }
                ],
                rateDef: {
                    byZipCode: {
                        rates: [
                            {
                                state: "CA",
                                city: "Inglewood",
                                zipCode: "90301",
                                rate: 100,
                                dropOffCharge:15,
                                dropOffChargeOffhour:25,
                                dropOffChargeWeekend:50,
                                dropOffChargeHoliday:70
                            },
                            {
                                state: "CA",
                                city: "Torrance",
                                zipCode: "90503",
                                rate: 150,
                                dropOffCharge:50,
                                dropOffChargeOffhour:75,
                                dropOffChargeWeekend:100,
                                dropOffChargeHoliday:125
                            },
                            {
                                state: "CA",
                                city: "Rancho Palos Verdes",
                                zipCode: "90024",
                                rate: 200,
                                dropOffCharge:50,
                                dropOffChargeOffhour:75,
                                dropOffChargeWeekend:100,
                                dropOffChargeHoliday:125
                            }
                        ]
                    }
                }

            },
            ltl: {
                fuelSurcharge: 20,
                residentialCharge: 60,
                liftGateCharge: 30,
                insideCharge: 15,
                tradeShowCharge: 20,
                additionalCharges: [{ name: "Call before delivery",  charge: 10 }],
                regions: [ { state: "CA", county: "Los Angeles County" }],
                rateDef: {
                    byZone: {
                        zoneRateVariables: {
                            weightIncrement: 100,
                            zones: [
                                {
                                    label:"A",
                                    minCharge:35,
                                    dropOffCharge: 10,
                                    dropOffChargeOffhour: 20,
                                    dropOffChargeWeekend: 30,
                                    dropOffChargeHoliday: 40
                                }, {
                                    label:"B",
                                    minCharge:40,
                                    dropOffCharge: 10,
                                    dropOffChargeOffhour: 20,
                                    dropOffChargeWeekend: 30,
                                    dropOffChargeHoliday: 40
                                }, {
                                    label:"C",
                                    minCharge:45,
                                    dropOffCharge: 10,
                                    dropOffChargeOffhour: 20,
                                    dropOffChargeWeekend: 30,
                                    dropOffChargeHoliday: 40
                                }, {
                                    label:"D",
                                    minCharge:35,
                                    dropOffCharge: 10,
                                    dropOffChargeOffhour: 20,
                                    dropOffChargeWeekend: 30,
                                    dropOffChargeHoliday: 40
                                }, {
                                    label:"E",
                                    minCharge:51,
                                    dropOffCharge: 10,
                                    dropOffChargeOffhour: 20,
                                    dropOffChargeWeekend: 30,
                                    dropOffChargeHoliday: 40
                                }]
                        },
                        flatRates: [
                            {
                                tier:"1",
                                ranges: [0,1000],
                                rates:[
                                    {zone: "A", rate:35},
                                    {zone: "B", rate:45},
                                    {zone: "C", rate:55},
                                    {zone: "D", rate:65},
                                    {zone: "E", rate:75}]
                            }, {
                                tier: "2",
                                ranges: [1000, 2000],
                                rates:[
                                    {zone: "A", rate:55},
                                    {zone: "B", rate:65},
                                    {zone: "C", rate:75},
                                    {zone: "D", rate:85},
                                    {zone: "E", rate:95}
                                ]
                            }
                        ],
                        weightRates: [
                            {
                                tier:"3",
                                ranges: [3000,4000],
                                rates:[
                                    {zone: "A", rate:5.5},
                                    {zone: "B", rate:3.3},
                                    {zone: "C", rate:2.3},
                                    {zone: "D", rate:8.9},
                                    {zone: "E", rate:2.0}
                                ]},
                            {
                                tier: "4",
                                ranges: [4000, 5000],
                                rates:[
                                    {zone: "A", rate:55},
                                    {zone: "B", rate:33},
                                    {zone: "C", rate:23},
                                    {zone: "D", rate:89},
                                    {zone: "E", rate:20}
                                ]},
                            {
                                tier: "5",
                                ranges: [5000, 6000],
                                rates:[
                                    {zone: "A", rate:55},
                                    {zone: "B", rate:33},
                                    {zone: "C", rate:23},
                                    {zone: "D", rate:89},
                                    {zone: "E", rate:20}
                                ]}
                        ],
                        rates: [ {
                            state: "CA",
                            city: "Torrance",
                            zipCode: "90501",
                            zone: "A"
                        }, {
                            state: "CA",
                            city: "Torrance",
                            zipCode: "90503",
                            zone: "B"
                        }, {
                            state: "CA",
                            city: "Rancho Palos Verdes",
                            zipCode: "90275",
                            zone: "C"
                        }]
                    }
                }

            },
            air: {
                fuelSurcharge: 20,
                residentialCharge: 60,
                liftGateCharge: 30,
                insideCharge: 15,
                tradeShowCharge: 20,
                additionalCharges: [{ name: "Call before delivery",  charge: 10 }],
                regions: [ { state: "CA", county: "Los Angeles County" }],
                rateDef: {
                    byZone: {
                        zoneRateVariables: {
                            weightIncrement: 100,
                            zones: [
                                {
                                    label:"A",
                                    minCharge:35,
                                    dropOffCharge: 10,
                                    dropOffChargeOffhour: 20,
                                    dropOffChargeWeekend: 30,
                                    dropOffChargeHoliday: 40
                                }, {
                                    label:"B",
                                    minCharge:35,
                                    dropOffCharge: 10,
                                    dropOffChargeOffhour: 20,
                                    dropOffChargeWeekend: 30,
                                    dropOffChargeHoliday: 40
                                }, {
                                    label:"C",
                                    minCharge:35,
                                    dropOffCharge: 10,
                                    dropOffChargeOffhour: 20,
                                    dropOffChargeWeekend: 30,
                                    dropOffChargeHoliday: 40
                                }, {
                                    label:"D",
                                    minCharge:35,
                                    dropOffCharge: 10,
                                    dropOffChargeOffhour: 20,
                                    dropOffChargeWeekend: 30,
                                    dropOffChargeHoliday: 40
                                }, {
                                    label:"E",
                                    minCharge:35,
                                    dropOffCharge: 10,
                                    dropOffChargeOffhour: 20,
                                    dropOffChargeWeekend: 30,
                                    dropOffChargeHoliday: 40
                                }]
                        },
                        flatRates: [
                            {
                                tier:"1",
                                ranges: [0,1000],
                                rates:[
                                    {zone: "A", rate:55},
                                    {zone: "B", rate:60},
                                    {zone: "C", rate:65},
                                    {zone: "D", rate:70},
                                    {zone: "E", rate:80}
                                ]},
                            {
                                tier: "2",
                                ranges: [1001, 2000],
                                rates:[
                                    {zone: "A", rate:60},
                                    {zone: "B", rate:65},
                                    {zone: "C", rate:70},
                                    {zone: "D", rate:75},
                                    {zone: "E", rate:80}
                                ]}
                        ],

                        weightRates: [
                            {
                                tier:"3",
                                ranges: [2001,4000],
                                rates:[
                                    {zone: "A", rate:5.5},
                                    {zone: "B", rate:6.0},
                                    {zone: "C", rate:6.5},
                                    {zone: "D", rate:7.5},
                                    {zone: "E", rate:8.0}
                                ]},
                            {
                                tier: "4",
                                ranges: [4001, 5000],
                                rates:[
                                    {zone: "A", rate:5.0},
                                    {zone: "B", rate:5.5},
                                    {zone: "C", rate:6.0},
                                    {zone: "D", rate:6.5},
                                    {zone: "E", rate:7.5}
                                ]},
                            {
                                tier: "5",
                                ranges: [5001, 6000],
                                rates:[
                                    {zone: "A", rate:4.5},
                                    {zone: "B", rate:5.0},
                                    {zone: "C", rate:5.5},
                                    {zone: "D", rate:6.0},
                                    {zone: "E", rate:6.5}
                                ]}
                        ],
                        rates: [ {
                            state: "CA",
                            city: "Torrance",
                            zipCode: "90501",
                            zone: "A"
                        }, {
                            state: "CA",
                            city: "Torrance",
                            zipCode: "90503",
                            zone: "B"
                        }, {
                            state: "CA",
                            city: "Inglewood",
                            zipCode: "90301",
                            zone: "E"
                        }, {
                            state: "CA",
                            city: "Santa Clara",
                            zipCode: "95050",
                            zone: "C"
                        }]
                    }
                }
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
                fuelSurcharge: 20,
                regions: [
                    {
                        state: "CA",
                        county: "Los Angeles County"
                    }
                ],
                sizeCharges: [
                    { containerSize: "20",
                        weightRanges: [ {limit: 13000, charge: 150}, {limit: 16000, charge: 200}],
                        pierPassFee: 66.50,
                        cleanTruckFee: 35,
                        congestionFee: 150
                    }, {
                        containerSize: "40",
                        weightRanges: [ {limit: 13000, charge: 150}, {limit: 16000, charge: 200}],
                        pierPassFee: 66.50,
                        cleanTruckFee: 35,
                        congestionFee: 150
                    },
                    {
                        containerSize: "45",
                        weightRanges: [ {limit: 13000, charge: 150}, {limit: 16000, charge: 200}],
                        pierPassFee: 66.50,
                        cleanTruckFee: 35,
                        congestionFee: 150
                    }
                ],
                rateDef: {
                    byZipCode: {
                        rates: [
                            {
                                state: "CA",
                                city: "Inglewood",
                                zipCode: "90301",
                                rate: 150,
                                dropOffCharge:50,
                                dropOffChargeOffhour:75,
                                dropOffChargeWeekend:100,
                                dropOffChargeHoliday:125
                            }, {
                                state: "CA",
                                city: "Torrance",
                                zipCode: "90503",
                                rate: 200,
                                dropOffCharge:50,
                                dropOffChargeOffhour:75,
                                dropOffChargeWeekend:100,
                                dropOffChargeHoliday:125
                            }, {
                                state: "CA",
                                city: "Los Angeles",
                                zipCode: "90024",
                                rate: 250,
                                dropOffCharge:50,
                                dropOffChargeOffhour:75,
                                dropOffChargeWeekend:100,
                                dropOffChargeHoliday:125
                            }
                        ]
                    }
                }
            },
            ltl: {
                fuelSurcharge: 20,
                residentialCharge: 60,
                liftGateCharge: 30,
                insideCharge: 15,
                tradeShowCharge: 20,
                additionalCharges: [
                    { name: "Call before delivery", charge: 10 },
                    { name: "Wait time charge (Free wait time 1 hr)", charge: 50 },
                    { name: "Extra stop", charge: 75 },
                    { name: "2 Men delivery", charge: 35 }

                ],
                regions: [ { state: "CA", county: "Los Angeles County" } ],

                rateDef: {
                    byZone: {
                        zoneRateVariables: {
                            weightIncrement: 100,
                            zones: [
                                {
                                    label:"A",
                                    minCharge:35,
                                    dropOffCharge: 10,
                                    dropOffChargeOffhour: 20,
                                    dropOffChargeWeekend: 30,
                                    dropOffChargeHoliday: 40
                                }, {
                                    label:"B",
                                    minCharge:35,
                                    dropOffCharge: 10,
                                    dropOffChargeOffhour: 20,
                                    dropOffChargeWeekend: 30,
                                    dropOffChargeHoliday: 40
                                }, {
                                    label:"C",
                                    minCharge:35,
                                    dropOffCharge: 10,
                                    dropOffChargeOffhour: 20,
                                    dropOffChargeWeekend: 30,
                                    dropOffChargeHoliday: 40
                                }, {
                                    label:"D",
                                    minCharge:35,
                                    dropOffCharge: 10,
                                    dropOffChargeOffhour: 20,
                                    dropOffChargeWeekend: 30,
                                    dropOffChargeHoliday: 40
                                }, {
                                    label:"E",
                                    minCharge:35,
                                    dropOffCharge: 10,
                                    dropOffChargeOffhour: 20,
                                    dropOffChargeWeekend: 30,
                                    dropOffChargeHoliday: 40
                                }]
                        },

                        flatRates: [
                            {
                                tier:"1",
                                ranges: [0,1000],
                                rates:[
                                    {zone: "A", rate:55},
                                    {zone: "B", rate:60},
                                    {zone: "C", rate:65},
                                    {zone: "D", rate:70},
                                    {zone: "E", rate:80}
                                ]},
                            {
                                tier: "2",
                                ranges: [1001, 2000],
                                rates:[
                                    {zone: "A", rate:60},
                                    {zone: "B", rate:65},
                                    {zone: "C", rate:70},
                                    {zone: "D", rate:75},
                                    {zone: "E", rate:80}
                                ]}
                        ],

                        weightRates: [
                            {
                                tier:"3",
                                ranges: [2001,4000],
                                rates:[
                                    {zone: "A", rate:5.5},
                                    {zone: "B", rate:6.0},
                                    {zone: "C", rate:6.5},
                                    {zone: "D", rate:7.5},
                                    {zone: "E", rate:8.0}
                                ]},
                            {
                                tier: "4",
                                ranges: [4001, 5000],
                                rates:[
                                    {zone: "A", rate:5.0},
                                    {zone: "B", rate:5.5},
                                    {zone: "C", rate:6.0},
                                    {zone: "D", rate:6.5},
                                    {zone: "E", rate:7.5}
                                ]},
                            {
                                tier: "5",
                                ranges: [5001, 6000],
                                rates:[
                                    {zone: "A", rate:4.5},
                                    {zone: "B", rate:5.0},
                                    {zone: "C", rate:5.5},
                                    {zone: "D", rate:6.0},
                                    {zone: "E", rate:6.5}
                                ]}
                        ],
                        rates: [ {
                            state: "CA",
                            city: "Torrance",
                            zipCode: "90501",
                            zone: "A"
                        }, {
                            state: "CA",
                            city: "Torrance",
                            zipCode: "90503",
                            zone: "B"
                        }, {
                            state: "CA",
                            city: "Inglewood",
                            zipCode: "90301",
                            zone: "E"
                        }, {
                            state: "CA",
                            city: "Santa Clara",
                            zipCode: "95050",
                            zone: "C"
                        }]
                    }
                }
            },

            air: {

            }
        }
    );
});

Interest.find({}).remove(function() {
    console.log("removed all the Specials");
    Interest.create({
        name: "Aspeed Specials Jan/2016",
        active: true,
        company: null,
        loadTypes:  [ 'FTL', 'LTL', 'AIR'],
        notes: "Note for specials",
        discountsByCity : [
            { discountAmount: 20,
                city: [
                    { city: "Inglewood", county: "Los Angeles County", state: "CA", zip: "90301" },
                    { city: "Torrance", county: "Los Angeles County", state: "CA", zip: "" }
                ]
            }
        ]
    });
});

Counter.find({}).remove(function () {
    console.log("removed all the counters");
});

User.find({}).remove(function () {
    User.create({
            provider: 'local',
            name: 'Test User',
            email: 'test@test.com',
            password: 'test'
        },
        {
            provider: 'local',
            name: 'Operation',
            role: 'operator',
            email: 'operator@test.com',
            password: 'test'
        },

        {
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
