export function buildEventFilter(filter) {
    const query = {};
  
    if (filter) {
      if (filter.name) {
        query.name = { $regex: filter.name, $options: 'i' };
      }

      // add more filter options
    }
  
    return query;
  };

  // TODO: implement pageInfo and edge
  // also to remove extra calls to find queries
 export async function paginateQuery(model, query = {}, first, after, orderBy, ref=null) {
   
    if (after) {
        const lastEvent = await model.findById(after);
        if (lastEvent) {
            query._id = { $gt: after };
        }
    }

    const events = await model.find(query)
        .sort(orderBy)
        .limit(first)
        .populate(ref); 

    return events;
}