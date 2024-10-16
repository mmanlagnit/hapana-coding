const eventTypeDef = `#graphql
  type Event {
    _id: ID!
    location: Location!
    name: String!
    date: String!
    type: String!
    description: String!
    tags: [String!]
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    events(first: Int, after: String, filter: EventInputFilter, orderBy: EventOrder): [Event!]
    event(id:ID!): Event
    eventsByLocation(id:ID!, first: Int, after: String, filter: EventInputFilter, orderBy: EventOrder): [Event!]
  }

  type Mutation {
    createEvent(input: CreateEventInput!): Event!
    updateEvent(input: UpdateEventInput!): Event!
    deleteEvent(id:ID!): Event!
  }

  input CreateEventInput {
    name: String!
    date: String!
    type: String!
    locationId: ID!
    description: String!
    tags: [String!]
  }

  input UpdateEventInput {
    id: ID!
    name: String
    date: String
    type: String
    description: String
    tags: [String]
  }

  enum SortingOrder { asc desc }
  
  input EventOrder {
    date: SortingOrder
    name: SortingOrder
  }

  input EventInputFilter {
    name: String  
  }
`;

export default eventTypeDef;