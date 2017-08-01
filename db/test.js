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
