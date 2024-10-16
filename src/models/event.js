import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
    {
        location: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Location",
            required: true,
        },
        name: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        tags: {
            type: [String],
            required: true
        },
    },
    { timestamps: true }
);

//TODO
/**
eventSchema.pre('save', function (next) {
    const now = new Date();
    this.
    if (this.is .isModified('date') && this.date <= now) {
        return next(new Error('Cannot create or update an event after the date/time has passed'));
    }
    next();
});

eventSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    if (update.location) {
        return next(new Error('Location cannot be updated after it\'s been created'));
    }
    next();
});

eventSchema.pre('findByIdAndDelete', function (next) {
    const now = new Date();
    this.
    if (this.isModified('date') && this.date <= now) {
        return next(new Error('Cannot delete an event after the date/time has passed'));
    }
    next();
});*/

const Event = mongoose.model('Event', eventSchema);
export default Event;
