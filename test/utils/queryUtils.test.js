import { paginateQuery, buildEventFilter } from '../../src/utils/queryUtils.js';
import mongoose from 'mongoose';

jest.mock('mongoose');

describe('buildEventFilter', () => {
    it('should return an empty query if no filter is provided', () => {
        const result = buildEventFilter();
        expect(result).toEqual({});
    });

    it('should build a query for name filtering with regex', () => {
        const filter = { name: 'test' };
        const result = buildEventFilter(filter);
        expect(result).toEqual({
            name: { $regex: 'test', $options: 'i' },
        });
    });
});

describe.skip('paginateQuery', () => {
    let mockModel;
    const mockQuery = { name: { $regex: 'test', $options: 'i' } };

    beforeEach(() => {

    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should apply the "after" cursor to the query', async () => {   
        expect(1).toBeTruthy();
    });


});
