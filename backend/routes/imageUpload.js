const router = require("express").Router();
const bodyParser = require("body-parser");
const multer = require("multer");

router.use(bodyParser.json());
var fileName = "";

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "../frontend/public/uploads");
    },
    filename: function(req, file, cb) {
        fileName = Date.now() + "-" + file.originalname;
        cb(null, fileName);
    },
});
var upload = multer({ storage: storage });

router.post("/", upload.single("image"), async(req, res) => {
    const image = req.image;
    await res.send(apiResponse({ message: fileName }));
});

function apiResponse(results) {
    return JSON.stringify({ status: 200, error: null, response: results });
}

module.exports = router;