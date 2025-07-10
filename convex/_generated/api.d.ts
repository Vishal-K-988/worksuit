/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as chatapp from "../chatapp.js";
import type * as fileHandling from "../fileHandling.js";
import type * as http from "../http.js";
import type * as myFunctions from "../myFunctions.js";
import type * as portals from "../portals.js";
import type * as s3Client from "../s3Client.js";
import type * as userLimit from "../userLimit.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  chatapp: typeof chatapp;
  fileHandling: typeof fileHandling;
  http: typeof http;
  myFunctions: typeof myFunctions;
  portals: typeof portals;
  s3Client: typeof s3Client;
  userLimit: typeof userLimit;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
