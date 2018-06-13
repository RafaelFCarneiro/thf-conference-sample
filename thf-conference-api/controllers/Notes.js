'use strict';

var utils = require('../utils/writer.js');
var Notes = require('../service/NotesService');

module.exports.notesGET = function notesGET (req, res, next) {
  Notes.notesGET()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.notesIdDELETE = function notesIdDELETE (req, res, next) {
  var id = req.swagger.params['id'].value;
  Notes.notesIdDELETE(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      if (response === 404) {
        utils.writeJson(res, "", response);
      } else {
        utils.writeJson(res, response);
      }
    });
};

module.exports.notesIdGET = function notesIdGET (req, res, next) {
  var id = req.swagger.params['id'].value;
  Notes.notesIdGET(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      if (response === 404) {
        utils.writeJson(res, "", response);
      } else {
        utils.writeJson(res, response);
      }
    });
};

module.exports.notesIdPUT = function notesIdPUT (req, res, next) {
  var id = req.swagger.params['id'].value;
  var body = req.swagger.params['body'].value;
  Notes.notesIdPUT(id,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      if (response === 404) {
        utils.writeJson(res, "", response);
      } else {
        utils.writeJson(res, response);
      }
    });
};

module.exports.notesPOST = function notesPOST (req, res, next) {
  var body = req.swagger.params['body'].value;
  Notes.notesPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};