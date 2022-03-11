// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
var express = require('express');
var model = require('../model');
const ConnectPage = model.ConnectPage;
const Scenario = model.Scenario;
const Variable = model.Variable;
const Api = model.Api;
const BotMessage = model.BotMessage;
const EfoCv = model.EfoCv;
const EfoUserProfile = model.EfoUserProfile;
const Zipcode = model.Zipcode;
const CustomDrillQuestionSet2 = model.CustomDrillQuestionSet2;
const CustomDrillUser = model.CustomDrillUser;
const EfoMessageVariable = model.EfoMessageVariable;



function checkQueryConnectPage2(){

    Scenario.find({}).count(function (err, count) {
        console.log("Scenario", count);
    });

    BotMessage.find({}).count(function (err, count) {
        console.log("BotMessage", count);
    });

    Api.find({}).count(function (err, count) {
        console.log("Api", count);
    });

    Variable.find({}).count(function (err, count) {
        console.log("Variable", count);
    });

    ConnectPage.find({}).count(function (err, count) {
        console.log("ConnectPage", count);
    });

    EfoUserProfile.find({}).count(function (err, count) {
        console.log("EfoUserProfile", count);
    });

    EfoCv.find({}).count(function (err, count) {
        console.log("EfoCv", count);
    });

    EfoMessageVariable.find({}).count(function (err, count) {
        console.log("EfoMessageVariable", count);
    });

    Zipcode.find({}).count(function (err, count) {
        console.log("Zipcode", count);
    });


    CustomDrillQuestionSet2.find({}).count(function (err, count) {
        console.log("CustomDrillQuestionSet2", count);
    });

    CustomDrillUser.find({}).count(function (err, count) {
        console.log("CustomDrillUser", count);
    });

}

setTimeout(function(){
    checkQueryConnectPage2();
}, 2000);


