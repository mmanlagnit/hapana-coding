import Location from '../../src/models/location.js';
import locationResolvers from '../../src/graphql/resolvers/location.js';
import { paginateQuery, buildEventFilter } from '../../src/utils/queryUtils.js';

jest.mock('../../src/models/location.js');
jest.mock('../../src/utils/queryUtils.js');

describe('Location Resolvers', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Query', () => {
        it('should return paginated locations', async () => {
            const mockLocations = [{ _id: '1', name: 'loc1' }, { _id: '2', name: 'loc2' }];
            buildEventFilter.mockReturnValue({});
            paginateQuery.mockResolvedValueOnce(mockLocations);

            const result = await locationResolvers.Query.locations(null, { first: 2 });

            expect(buildEventFilter).toHaveBeenCalled();
            expect(paginateQuery).toHaveBeenCalledWith(Location, {}, 2, undefined, "{name: 'asc'}");
            expect(result).toEqual(mockLocations);
        });

        it('should return a specific location by ID', async () => {
            const mockLocation = { _id: '1', name: 'test' };
            Location.findById.mockResolvedValueOnce(mockLocation);

            const result = await locationResolvers.Query.location(null, { id: '1' });

            expect(Location.findById).toHaveBeenCalledWith('1');
            expect(result).toEqual(mockLocation);
        });
    });

    describe('Mutation: CreateLocation', () => {
        it('should create a new location', async () => {
            const mockInput = { name: 'newLoc', type: 'class', tags: ['tag1'] };
            const mockLocation = { _id: '1', ...mockInput, save: jest.fn().mockResolvedValueOnce(mockInput) };

            Location.mockImplementationOnce(() => mockLocation);

            const result = await locationResolvers.Mutation.createLocation(null, { input: mockInput });

            expect(Location).toHaveBeenCalledWith(mockInput);
            expect(mockLocation.save).toHaveBeenCalled();
            expect(result).toEqual(mockInput);
        });
        
    });

    describe('Mutation: UpdateLocation', () => {
        it('should update an existing location', async () => {
            const mockLocation = {
                _id: '1',
                name: 'name',
                type: 'class',
                tags: ['rg'],
                save: jest.fn().mockResolvedValueOnce({
                    _id: '1',
                    name: 'updatedName',
                    type: 'workshop',
                    tags: ['fd', 'v'],
                }),
            };
            Location.findById.mockResolvedValueOnce(mockLocation);
            const input = { id: '1', name: 'updatedName', type: 'workshop', tags: ['fd', 'v'] };
            const result = await locationResolvers.Mutation.updateLocation(null, { input });

            expect(Location.findById).toHaveBeenCalledWith('1');
            expect(mockLocation.save).toHaveBeenCalled();
            expect(result).toEqual({
                _id: '1',
                name: 'updatedName',
                type: 'workshop',
                tags: ['fd', 'v'],
            });
        });

        it('should throw an error if location to update is not found', async () => {
            Location.findById.mockResolvedValueOnce(null);

            const input = { id: 'none', name: 'newName', type: 'class' };

            await expect(locationResolvers.Mutation.updateLocation(null, { input }))
                .rejects
                .toThrow('Location not found');

            expect(Location.findById).toHaveBeenCalledWith('none');
        });
    });

    describe('Mutation: DeleteLocation', () => {
        it('should delete an existing location', async () => {
            const mockLocation = { _id: '1', name: 'loc' };
            Location.findById.mockResolvedValueOnce(mockLocation);
            Location.findByIdAndDelete.mockResolvedValueOnce(mockLocation);

            const result = await locationResolvers.Mutation.deleteLocation(null, { id: '1' });

            expect(Location.findById).toHaveBeenCalledWith('1');
            expect(Location.findByIdAndDelete).toHaveBeenCalledWith('1');
            expect(result).toEqual(mockLocation);
        });

        it('should throw an error if location to delete is not found', async () => {
            Location.findById.mockResolvedValueOnce(null);

            await expect(locationResolvers.Mutation.deleteLocation(null, { id: 'none' }))
                .rejects
                .toThrow('Location not found');

            expect(Location.findById).toHaveBeenCalledWith('none');
            expect(Location.findByIdAndDelete).not.toHaveBeenCalled();
        });
    });
});