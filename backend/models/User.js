const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Pole nie może być puste"],
    },
    secondName: {
        type: String,
        required: [true, "Pole nie może być puste"],
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "Pole nie może być puste"],
        validate: [isEmail, "Niepoprawny email"],
        index: true,
    },
    password: {
        type: String,
        match: [
            /(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/,
            "Minimum 8 znaków, jedna litera i jedna cyfra",
        ],
        required: [true, "Pole nie może być puste"],
    },
    role: {
        type: String,
        default: "student",
    },
    picture: {
        type: String,
    },
    tokens: [],
    newMessages: {
        type: Object,
        default: {},
    },
    status: {
        type: String,
        default: "offline",
    },
}, { minimize: false });

UserSchema.pre("save", function(next) {
    const user = this;
    if (!user.isModified("password")) return next();

    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
};

UserSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, "appSecret");
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};

UserSchema.statics.findByCredentials = async function(email, password) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("invalid email or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("invalid email or password");
    return user;
};

UserSchema.statics.findUserRole = async function(email, password) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Nieprawidłowy adres email lub hasło");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Nieprawidłowy adres email lub hasło");
    //console.log(user.role)
    return user.role;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;