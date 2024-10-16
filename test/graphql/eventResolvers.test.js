import eventResolvers from '../../src/graphql/resolvers/event.js';
import Location from '../../src/models/location.js';
import Event from '../../src/models/event.js';
import { paginateQuery, buildEventFilter } from '../../src/utils/queryUtils.js';

jest.mock('../../src/models/location.js');
jest.mock('../../src/models/event.js');
jest.mock('../../src/utils/queryUtils.js');

const mockLocation = {
    id: '1',
    name: 'WorkshopMock',
    type: 'workshop',
    tags: ['testTag']
};

const mockEvent = {
    name: 'Test-Event',
    date: '2023-10-11T12:55:28.064Z',
    type: 'workshop',
    location: mockLocation.id,
    description: 'testEvent',
    tags: ['testTag'],
};

describe('Event Resolvers', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Query', () => {
        it('should return paginated events', async () => {
            const mockPaginatedQuery = { events: [mockEvent] };
            paginateQuery.mockResolvedValue(mockPaginatedQuery);
            buildEventFilter.mockReturnValue({});

            const result = await eventResolvers.Query.events(null, { first: 10, after: "abc", filter: "{name: 'test'}", orderBy: "{date: 'asc'}" });

            expect(buildEventFilter).toHaveBeenCalledWith("{name: 'test'}");
            expect(paginateQuery).toHaveBeenCalledWith(Event, {}, 10, "abc", "{date: 'asc'}", "location");
            expect(result).toEqual(mockPaginatedQuery);
        });

        it('should return an event by id', async () => {
            const mockEvent = { _id: '1', name: 'EventTest', location: 'locTest' };

            Event.findById = jest.fn().mockImplementation(() => ({
                populate: jest.fn().mockReturnValue(mockEvent),
            }));

            const result = await eventResolvers.Query.event(null, { id: '1' });

            expect(Event.findById).toHaveBeenCalledWith('1');
            expect(result).toEqual(mockEvent);
        });
    });

    describe('Mutation: createEvent', () => {
        it('should create a new event', async () => {
            const mockLocation = { _id: 'locationId1', name: 'location1' };
            const mockEvent = { _id: '1', name: 'event1', date: new Date(), location: 'locationId1' };

            Location.findById.mockResolvedValue(mockLocation);
            Event.prototype.save = jest.fn().mockResolvedValue(mockEvent);

            const input = {
                name: 'event1',
                date: '16-10-2025',
                locationId: 'locationId1',
                description: 'Test',
                tags: ['test'],
                type: '1-on-1',
            };

            const result = await eventResolvers.Mutation.createEvent(null, { input });

            expect(Location.findById).toHaveBeenCalledWith('locationId1');
            expect(Event.prototype.save).toHaveBeenCalled();
            expect(result).toEqual(mockEvent);
        });

        it('should throw an error if location is not found', async () => {
            Location.findById.mockResolvedValue(null);

            const input = {
                name: 'event1',
                date: '2023-10-11T12:55:28.064Z',
                locationId: 'locationId1',
                description: 'Test',
                tags: ['test'],
                type: '1-on-1',
            };

            await expect(eventResolvers.Mutation.createEvent(null, { input }))
                .rejects.toThrow('Location not found');
        });
    });

    describe('Mutation: updateEvent', () => {
        it.skip('should update an existing event', async () => {
            const mockEvent = { _id: '1', name: 'event1', date: new Date('2023-10-11T12:55:28.064Z') };

            Event.findById.mockResolvedValue(mockEvent);
            Event.prototype.save = jest.fn().mockResolvedValue({ ...mockEvent, name: 'updatedEvent' });
           
            const input = {
                id: '1',
                name: 'updatedEvent',
            };

            const result = await eventResolvers.Mutation.updateEvent(null, { input });

            expect(Event.findById).toHaveBeenCalledWith('1');
            expect(mockEvent.name).toBe('updatedEvent');
            expect(result.name).toBe('updatedEvent');
        });

        it('should throw an error if event is not found', async () => {
            Event.findById.mockResolvedValue(null);

            const input = {
                id: '1',
                name: 'updatedEvent',
            };

            await expect(eventResolvers.Mutation.updateEvent(null, { input }))
                .rejects.toThrow('Event not found');
        });

        it.skip('should throw an error if trying to update past event', async () => {
            const mockEvent = { _id: '1', name: 'event1', date: new Date('2023-10-11T12:55:28.064Z') };

            Event.findById.mockResolvedValue(mockEvent);

            const input = {
                id: '1',
                name: 'updatedEvent',
            };

            await expect(eventResolvers.Mutation.updateEvent(null, { input }))
                .rejects.toThrow('Cannot update an event after the date/time has passed');
        });
    });

    describe('Mutation: deleteEvent', () => {
        it('should delete an event', async () => {
            const mockEvent = { _id: '1', name: 'event1', date: new Date('2025-10-11T12:55:28.064Z') };

            Event.findById.mockResolvedValue(mockEvent);
            Event.findByIdAndDelete.mockResolvedValue(true);

            const result = await eventResolvers.Mutation.deleteEvent(null, { id: '1' });

            expect(Event.findById).toHaveBeenCalledWith('1');
            expect(Event.findByIdAndDelete).toHaveBeenCalledWith('1');
            expect(result).toBe(true);
        });

        it('should throw an error if event is not found', async () => {
            Event.findById.mockResolvedValue(null);

            await expect(eventResolvers.Mutation.deleteEvent(null, { id: '1' }))
                .rejects.toThrow('Event not found');
        });

        it('should throw an error if trying to delete a past event', async () => {
            const mockEvent = { _id: '1', name: 'event1', date: new Date('2023-10-11T12:55:28.064Z') };

            Event.findById.mockResolvedValue(mockEvent);

            await expect(eventResolvers.Mutation.deleteEvent(null, { id: '1' }))
                .rejects.toThrow('Cannot delete an event after the date/time has passed');
        });
    });

});