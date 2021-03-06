const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const userModelSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true
    }
})

userModelSchema.pre('save', function (next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });

});

userModelSchema.pre('findOneAndUpdate', async function (next) {
    var user = this;

    if (user._update.$set.password) {
        user._update.$set.password = await bcrypt.hash(user._update.$set.password, 8);
    }
    next();

});

userModelSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

userModelSchema.methods.comparePasswordAsync = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
}


module.exports = mongoose.model('UserModel', userModelSchema, "users")
