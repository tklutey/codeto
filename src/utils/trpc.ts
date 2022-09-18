import { createReactQueryHooks } from '@trpc/react';
import { AppRouter } from 'pages/api/trpc/[trpc]';
import { inferProcedureInput, inferProcedureOutput } from '@trpc/server';

export const trpc = createReactQueryHooks<AppRouter>();

/**
 * Enum containing all api query paths
 */
export type TQuery = keyof AppRouter['_def']['queries'];

/**
 * This is a helper method to infer the output of a query resolver
 * @example type HelloOutput = InferQueryOutput<'hello'>
 */
export type InferQueryOutput<TRouteKey extends TQuery> = inferProcedureOutput<AppRouter['_def']['queries'][TRouteKey]>;
/**
 * This is a helper method to infer the input of a query resolver
 * @example type HelloInput = InferQueryInput<'hello'>
 */
export type InferQueryInput<TRouteKey extends TQuery> = inferProcedureInput<AppRouter['_def']['queries'][TRouteKey]>;
