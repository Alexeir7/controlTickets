var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var md5 = require('md5');

function getAPIRoutes(db) {
  var tickets = db.collection('tickets');
  var usuarios = db.collection('usuarios');
  var horarios = db.collection('horarios');

  //funcion registrar
  router.post('/register', function(req, res) {
    if (req.body.reg_clave == req.body.reg_clave_conf) {
      var newUser = {
        identidad: req.body.reg_identidad,
        nombre: req.body.reg_nombre,
        created: Date.now(),
        clave: "",
        failedTries: 0,
        lastlogin: 0,
        lastChangePassword: 0,
        oldPasswords: []
      };
      var saltedPassword = "";
      if (newUser.created % 2 === 0) {
        saltedPassword = newUser.identidad.substring(0, 3) + req.body.reg_clave;
      } else {
        saltedPassword = req.body.reg_clave + newUser.identidad.substring(0, 3);
      }
      newUser.clave = md5(saltedPassword);
      usuarios.insertOne(newUser, function(err, result) {
        if (err) {
          res.status(403).json({
            "error": err
          });
        } else {
          res.status(200).json({
            "ok": true
          });
        }
      });
    } else {
      res.status(403).json({
        "error": "No validado"
      });
    }
  }); //end registrar

  //api de login
  router.post('/login', function(req, res) {
    var user = req.body.lgn_identidad,
      clave = req.body.lgn_clave;

    usuarios.findOne({
      identidad: user
    }, {
      fields: {
        _id: 1,
        identidad: 1,
        clave: 1,
        created: 1
      }
    }, function(err, doc) {
      if (err) {
        res.status(401).json({
          "error": "Log In Failed"
        });
      } else {
        if (doc) {
          var saltedPassword = "";
          if (doc.created % 2 === 0) {
            saltedPassword = doc.identidad.substring(0, 3) + req.body.lgn_clave;
          } else {
            saltedPassword = req.body.lgn_clave + doc.identidad.substring(0, 3);
          }
          if (doc.clave === md5(saltedPassword)) {
            req.session.identidad = doc.identidad;
            doc.clave = "";
            req.session.userDoc = doc;
            usuarios.updateOne({
              "_id": doc._id
            }, {
              "$set": {
                "lastlogin": Date.now(),
                "failedTries": 0
              }
            });
            res.status(200).json({
              "ok": true
            });
          } else {
            req.session.identidad = "";
            req.session.userDoc = {};
            usuarios.updateOne({
              "_id": doc._id
            }, {
              "$ic": {
                "failedTries": 1
              }
            });
            res.status(401).json({
              "error": "Log In Failed"
            });
          }
        } else {
          res.status(401).json({
            "error": "Log In Failed"
          });
        }
      }
    });
  }); //end login

  //obtener horarios
  router.get('/horarios', function(req, res, next) {
    horarios.aggregate([{
        "$unwind": "$asientos"
      },
      {
        "$match": {
          "asientos": 0
        }
      },
      {
        "$group": {
          "_id": {
            "tanda": "$tanda",
            "_id": "$_id",
            "id": "$id"
          },
          "disponibles": {
            "$sum": 1
          }

        }
      },
      {
        "$sort": {
          "_id.id": 1
        }
      }
    ]).toArray(function(err, horarios) {
      if (err) {
        return res.status(400).json([]);
      }
      res.status(200).json(horarios);
    });
  }); //end horarios

  router.get('/horario/:id', function(req, res, next) {
    var id = ObjectID(req.params.id);
    horarios.findOne({
      "_id": id
    }, function(err, horario) {
      if (err) {
        console.log(err);
        return res.status(400).json({
          "error": "Error al cargar la persona"
        });
      }
      res.status(200).json(horario);
    });
  }); // end horario/:id

  router.put('/reservar/:id/:asiento', function(req, res, next) {
    var query = { "id": req.params.id};
    var seat = "asientos."+ req.params.asiento + ":1";
    var update = {"$set" : {seat}};

    //horarios.update({"id":4}, {"$set" : {"asientos.5" : "1"}});

    res.status(200).json(update);
  });

  return router;

}

module.exports = getAPIRoutes;
