const locationTypeDef = `#graphql
  type Location {
    _id: ID!
    type: String!
    name: String!
    tags: [String]
  }

  type Query {
    locations(first: Int, after: String, filter: LocationInputFilter, orderBy: LocationOrder): [Location!]
    location(id:ID!): Location
  }

  type Mutation {
    createLocation(input: CreateLocationInput!): Location!
    updateLocation(input: UpdateLocationInput!): Location! 
    deleteLocation(id:ID!): Location!
  }

  input CreateLocationInput {
    type: String!
    name: String!
    tags: [String]
  }

  input UpdateLocationInput {
    id: ID!
    type: String
    name: String
    tags: [String]
  }

  enum SortingOrder { asc desc }
  
  input LocationOrder {
    name: SortingOrder
  }

  input LocationInputFilter {
    name: String  
  }
`;
// TODO: do we need updateLocation and deleteLocation?
export default locationTypeDef;