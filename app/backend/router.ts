import { ORPCError, os } from "@orpc/server";
import { z } from "zod";

const PlanetSchema = z.object({
  id: z.number().int().min(1),
  name: z.string(),
  description: z.string().optional(),
});

const planets = [
  { id: 1, name: "name" },
  { id: 2, name: "name2" },
];

export const listPlanet = os
  .input(
    z.object({
      limit: z.number().int().min(1).max(100).optional(),
      cursor: z.number().int().min(0).default(0),
    })
  )
  .handler(async ({ input }) => {
    // your list code here
    return planets;
  });

export const findPlanet = os.input(PlanetSchema.pick({ id: true })).handler(async ({ input }) => {
  // your find code here
  return planets.find((planet) => planet.id === input.id);
});

export const createPlanet = os
  .$context<{ headers: Headers }>()
  .use(({ context, next }) => {
    // const user = parseJWT(context.headers.authorization?.split(" ")[1]);
    // if (user) {
    //   return next({ context: { user } });
    // }
    // throw new ORPCError("UNAUTHORIZED");
    return next();
  })
  .input(PlanetSchema.omit({ id: true }))
  .handler(async ({ input, context }) => {
    // your create code here
    const newPlanet = { id: planets.length + 1, name: input.name };
    planets.push(newPlanet);
    return newPlanet;
  });

export const router = {
  planet: {
    list: listPlanet,
    find: findPlanet,
    create: createPlanet,
  },
};
