import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            validate: {
                validator: function (v) {
                  return /^[a-zA-Z0-9\-]+$/.test(v);
                },
                message: (props) => `${props.value} is not a valid name!`,
              }
        },
        type: {
            type: String,
            enum: ["class", "1-on-1", "workshop"],
            required: true
        },
        tags: {
            type: [String],
            required: false
        }
    },
    { timestamps: true }
);

const Location = mongoose.model('Location', locationSchema);
export default Location;
