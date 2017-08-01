use controltickets;
data =[
  {
    "id":1,
    "tanda" : "7:30am"
    , "asientos" : [
                0 ,
       0, 0, 0, 0 ,
       0, 0, 0, 0 ,
       0, 0, 0, 0 ,
       0, 0, 0, 0 ,
       0, 0, 0, 0 ,
       0, 0, 0, 0 ,
       0, 0, 0 ,0, 0
     ]
  },
  {
    "id":2,
    "tanda" : "9:00am",
    "asientos" : [
                0 ,
       0, 0, 0, 0 ,
       0, 0, 0, 0 ,
       0, 0, 0, 0 ,
       0, 0, 0, 0 ,
       0, 0, 0, 0 ,
       0, 0, 0, 0 ,
       0, 0, 0 ,0, 0
     ]
  },
  {
    "id":3,
    "tanda" : "10:30am",
    "asientos" : [
                0 ,
       0, 0, 0, 0 ,
       0, 0, 0, 0 ,
       0, 0, 0, 0 ,
       0, 0, 0, 0 ,
       0, 0, 0, 0 ,
       0, 0, 0, 0 ,
       0, 0, 0 ,0, 0
     ]
  },
  {
    "id":4,
    "tanda" : "12:00pm",
    "asientos" : [
                0 ,
       0, 0, 0, 0 ,
       0, 0, 0, 0 ,
       0, 0, 0, 0 ,
       0, 0, 0, 0 ,
       0, 0, 0, 0 ,
       0, 0, 0, 0 ,
       0, 0, 0 ,0, 0
     ]
  },
  {
    "id":5,
    "tanda" : "1:30pm",
    "asientos" : [
                0 ,
       0, 0, 0, 0 ,
       0, 0, 0, 0 ,
       0, 0, 0, 0 ,
       0, 0, 0, 0 ,
       0, 0, 0, 0 ,
       0, 0, 0, 0 ,
       0, 0, 0 ,0, 0
     ]
  },
  {
    "id":6,
    "tanda" : "3:00pm",
    "asientos" : [
                0 ,
       0, 0, 0, 0 ,
       0, 0, 0, 0 ,
       0, 0, 0, 0 ,
       0, 0, 0, 0 ,
       0, 0, 0, 0 ,
       0, 0, 0, 0 ,
       0, 0, 0 ,0, 0
     ]
  },
  {
    "id":7,
    "tanda" : "5:00pm",
    "asientos" : [
                0 ,
       0, 0, 0, 0 ,
       0, 0, 0, 0 ,
       0, 0, 0, 0 ,
       0, 0, 0, 0 ,
       0, 0, 0, 0 ,
       0, 0, 0, 0 ,
       0, 0, 0 ,0, 0
     ]
  }
]
db.horarios.insert(data);

db.horarios.aggregate(
    [
        { "$unwind": "$asientos" },
        {
          "$match": {
                "asientos": 0
          }
        },
        { "$group": {
            "_id": {
                "tanda": "$tanda"
            },
            "count": { "$sum": 1 }
        }},
        {$sort:{"_id.a":1}}
    ]
);

db.horarios.update(
   { _id: 1, grades: 80 },
   { $set: { "grades.$" : 82 } }
)

db.horarios.update(
    {"_id": 59801574148e25d2582e8caf},
    {"$set": {
        "asientos.1.$": "new_value"
    }}
);

db.horarios.update({"id":4}, {"$set" : {"asientos.5" : "blah"}});

db.horarios.update({"_id": ObjectID("59801574148e25d2582e8caf")}, {"$set" : {"asientos.5" : 0}});
