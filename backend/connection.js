const mongoose = require("mongoose");

mongoose.connect(
    "mongodb://localhost:27017/dziennik", {
        useNewUrlParser: true,
    },
    (err) => {
        if (!err) {
            console.log("Polaczenie z MongoDB powiodlo sie");
        } else {
            console.log("Problem z polaczeniem z baza danych: " + err);
        }
    }
);