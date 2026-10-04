export type { paths, components, operations } from "./api";
export type Person = import("./api").components["schemas"]["Person"];
export type Memory = import("./api").components["schemas"]["Memory"];
export type Book = import("./api").components["schemas"]["Book"];
