const router = require("express").Router();
const User = require("../models/User");

// creating user
router.post("/", async(req, res) => {
    try {
        const { name, secondName, email, password, picture, role } = req.body;
        console.log(req.body);
        const user = await User.create({
            name,
            secondName,
            email,
            password,
            picture,
            role,
        });
        res.status(201);
    } catch (e) {
        let msg;
        if (e.code === 11000) {
            msg = "Email jest zajęty";
        } else {
            msg = e.message;
        }
        console.log(e);
        res.status(400).json(msg);
    }
});

// login user

router.post("/login", async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password);
        user.status = "online";
        const token = await user.generateAuthToken();
        await user.save();
        const role = await User.findUserRole(email, password);
        res.status(200).json(user);
    } catch (e) {
        res.status(400).json(e);
    }
});

router.get("/admin", async(req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (e) {
        res.status(400).json(e.message);
    }
});

router.delete("/:id", async(req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
        return res.status(400).json("Nie znaleziono użytkownika");
    }
    res.status(200).json("Użytkownik usunięty!");
});

router.patch("/:id", async(req, res) => {
    const id = { _id: req.params.id };
    const update = req.body;
    try {
        let user = await User.findById(id);
        if (user.email === update.email) {
            res.status(400).send("Podano taki sam email");
        } else {
            user = await User.updateOne(id, update);
            res.status(200).send();
        }
    } catch (e) {
        let msg;
        if (e.code === 11000) {
            msg = "Email jest zajęty";
        } else {
            msg = e.message;
        }
        console.log(e);
        res.status(400).json(msg);
    }
});

module.exports = router;