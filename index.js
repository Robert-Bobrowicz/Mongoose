const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/mongoose-Ex69', () => console.log('connected to DB'));

const validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
}

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required. Enter name of the user.'],
        minLength: [3, 'Name requires min. 3 characters.']
    },
    email: {
        type: String,
        required: [true, 'E-mail is required.'],
        validate: [validateEmail, 'E-mail is not correct.'],
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required.']
    },
    isAdmin: {
        type: Number,
        default: 0,
        min: 0,
        max: 1
    }
});

const hash = value => '*jawjuoijyyso9suu512assabvl1';
userSchema.path('password').set(value => hash(value));
const User = mongoose.model('User', userSchema);

async function saveUser() {
    const user = new User({
        name: 'Admin',
        email: 'admin@email.com',
        password: 'superpass12345678',
        isAdmin: 1
    });

    try {
        await user.save();
        console.log('User data saved to DB.');
    } catch (err) {
        for (const key in err.errors) {
            console.log(err.errors[key].message)
        }
    };

};

async function getUsers() {
    const users = await User.find({});
    console.log('Users found in DB:');
    console.log(users);
};

async function getUserByEmail(email) {
    const user = await User.findOne({ email });
    if (user) {
        console.log('User with the requested email found in DB:');
        console.log(user);
    } else {
        console.log('Not such a user in DB.')
    }
};

// saveUser();
// getUsers();
getUserByEmail('admin@email.com');