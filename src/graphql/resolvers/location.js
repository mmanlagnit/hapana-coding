import Location from '../../models/location.js';
import { paginateQuery, buildEventFilter } from '../../utils/queryUtils.js';

const locationResolvers = {
    Query: {
        async locations(_, { first = 10, after, filter, orderBy = "{name: 'asc'}" }) {

            const queryFilter = buildEventFilter(filter);
            const paginatedQuery = await paginateQuery(Location, queryFilter, first, after, orderBy);

            return paginatedQuery;
        },
        async location(_, { id }) {
            return await Location.findById(id);
        }
    },
    Mutation: {
        async createLocation(_, { input }) {
            const location = new Location({ ...input });
            return await location.save();
        },
        async updateLocation(_, { input }) {
            const { id, type, name, tags } = input;
            const location = await Location.findById(id);
            if (!location) {
                throw new Error('Location not found');
            }

            if (type) { location.type = type };
            if (name) { location.name = name };
            if (tags) { location.tags = tags };

            return await location.save();
        },
        async deleteLocation(_, { id }) {
            const location = await Location.findById(id);
            if (!location) {
                throw new Error('Location not found');
            }

            return await Location.findByIdAndDelete(id);
        }
    }
};

export default locationResolvers;
