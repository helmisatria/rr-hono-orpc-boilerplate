import { onError } from "@orpc/server";
import { router } from "./router";
import { ZodSmartCoercionPlugin, ZodToJsonSchemaConverter } from "@orpc/zod";

import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";

export const openApiHandler = new OpenAPIHandler(router, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
  plugins: [
    new ZodSmartCoercionPlugin(),
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
      specGenerateOptions: {
        info: {
          title: "ORPC Playground",
          version: "1.0.0",
        },
        // commonSchemas: {
        //   NewUser: { schema: NewUserSchema },
        //   User: { schema: UserSchema },
        //   Credential: { schema: CredentialSchema },
        //   Token: { schema: TokenSchema },
        //   NewPlanet: { schema: NewPlanetSchema },
        //   UpdatePlanet: { schema: UpdatePlanetSchema },
        //   Planet: { schema: PlanetSchema },
        // },
        security: [{ bearerAuth: [] }],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
            },
          },
        },
      },
      docsConfig: {
        authentication: {
          securitySchemes: {
            bearerAuth: {
              token: "default-token",
            },
          },
        },
      },
    }),
  ],
});
