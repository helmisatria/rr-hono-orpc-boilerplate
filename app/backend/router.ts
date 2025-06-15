import { ORPCError, os } from "@orpc/server";
import { z } from "zod";

const PlanetSchema = z.object({
  id: z.number().int().min(1),
  name: z.string(),
  description: z.string().optional(),
});

export const listPlanet = os
  .$context<{ headers: Headers; KV: KVNamespace }>()
  .input(
    z.object({
      limit: z.number().int().min(1).max(100).optional(),
      cursor: z.number().int().min(0).default(0),
    })
  )
  .output(z.array(PlanetSchema))
  .handler(async ({ input, context }) => {
    // your list code here
    return (await context.KV.get("planets", { type: "json" })) || [];
  });

export const findPlanet = os
  .$context<{ headers: Headers; KV: KVNamespace }>()
  .input(PlanetSchema.pick({ id: true }))
  .handler(async ({ input, context }) => {
    // your find code here
    const planets = ((await context.KV.get("planets", { type: "json" })) as any[]) || [];
    const planet = planets?.find((p: any) => p.id === input.id);

    if (!planet) {
      throw new ORPCError("NOT_FOUND", { message: "Planet not found" });
    }

    return planet;
  });

export const createPlanet = os
  .$context<{ headers: Headers; KV: KVNamespace }>()
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
    const planets = ((await context.KV.get("planets", { type: "json" })) as any[]) || [];
    const newPlanet = { id: planets.length + 1, name: input.name };
    await context.KV.put("planets", JSON.stringify([...planets, newPlanet]));
    return newPlanet;
  });

export const router = {
  planet: {
    list: listPlanet,
    find: findPlanet,
    create: createPlanet,
  },
};
