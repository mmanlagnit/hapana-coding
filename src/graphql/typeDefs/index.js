import eventTypeDef from "./event.js";
import locationTypeDef from "./location.js";

const typeDefs = `#graphql
  ${eventTypeDef}
  ${locationTypeDef}
`;

export default typeDefs;