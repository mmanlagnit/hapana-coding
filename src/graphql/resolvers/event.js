import Location from '../../models/location.js';
import Event from '../../models/event.js';
import { paginateQuery, buildEventFilter } from '../../utils/queryUtils.js';

const eventResolvers = {
    Query: {
        async events(_, { first = 10, after, filter, orderBy = "{date: 'asc'}" }) {
            const queryFilter = buildEventFilter(filter);
            const paginatedQuery = await paginateQuery(Event, queryFilter, first, after, orderBy, 'location');

            return paginatedQuery;
        },

        async event(_, { id }){
            return await Event.findById(id).populate('location');
        },

        async eventsByLocation(_, { id, first = 10, after, filter, orderBy = "{date: 'asc'}" }) {
            const location = await Location.findById(id);
            if (!location) {
                throw new Error('Location not found');
            }
            const query = { ...buildEventFilter(filter), location: location._id }
            const paginatedQuery = await paginateQuery(Event, query, first, after, orderBy, 'location');

            return paginatedQuery;
        }
    },

    Mutation: {
        async createEvent(_, { input }) {
            const { locationId, date, ...eventInput } = input;
            const location = await Location.findById(locationId);
            if (!location) {
                throw new Error('Location not found');
            }
            const event = new Event({
                ...eventInput,
                date: new Date(date),
                location: location._id
            });

            return await event.save();
        },

        async updateEvent(_, { input }) {
            const { id, name, date, type, description, tags } = input;
            const event = await Event.findById(id);
            if (!event) {
                throw new Error('Event not found');
            }

            const now = new Date();
            if (event.date <= now) {
                throw new Error('Cannot update an event after the date/time has passed');
            }

            if (date && new Date(date) <= now) {
                throw new Error('Cannot update event date to a past date');
            }

            if (name) { event.name = name };
            if (date) { event.date = new Date(date) };
            if (type) { event.type = type };
            if (description) { event.description = description };
            if (tags) { event.tags = tags };

            return await event.save();
        },

        async deleteEvent(_, { id }) {
            const event = await Event.findById(id);
            if (!event) {
                throw new Error('Event not found');
            }

            const now = new Date();
            if (event.date <= now) {
                throw new Error('Cannot delete an event after the date/time has passed');
            }
            return await Event.findByIdAndDelete(id);
        }
    },

    Event: {
        async location(event){
            return await Location.findById(event.location); // location Id
        }
    }
};
export default eventResolvers;
