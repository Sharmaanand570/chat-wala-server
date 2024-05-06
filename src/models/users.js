const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedBy: {
        type: String
    },
    deletedAt: {
        type: Date
    }
},
    { timestamps: true }
)

userSchema.index({ name: 'text', email: 'text', phone: 'text', location: "2dsphere" })

module.exports = mongoose.model('Users', userSchema);