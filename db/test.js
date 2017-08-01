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

db.horarios.update({"id":4}, {"$set" : {"asientos.5" : "1"}});
