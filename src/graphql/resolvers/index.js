import { mergeResolvers } from "@graphql-tools/merge";

import eventResolver from "./event.js";
import locationResolver from "./location.js";

const resolvers = mergeResolvers([eventResolver, locationResolver]);

export default resolvers;