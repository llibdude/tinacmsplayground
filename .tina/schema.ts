// @ts-nocheck
import { TinaTemplate } from "@tinacms/cli";
import { defineSchema, defineConfig, RouteMappingPlugin } from "tinacms";

const genericFeatureBlockSchema: TinaTemplate = {
  name: "genericFeature",
  label: "Generic Feature",
  ui: {
    defaultItem: {
      title: "Title placeholder",
      text: "Phasellus scelerisque, libero eu finibus rutrum, risus risus accumsan libero, nec molestie urna dui a leo.",
    },
  },
  fields: [
    {
      type: "string",
      label: "Title",
      name: "title",
    },
    {
      type: "rich-text",
      label: "Text",
      name: "text",
    },
  ],
};

export default defineSchema({
  collections: [
    {
      label: "Campaigns",
      name: "campaigns",
      format: "mdx",
      path: "campaigns",
      fields: [
        {
          type: "object",
          name: "hero",
          label: "Hero",
          ui: {
            defaultItem: {
              title: "Title placeholder",
              text: "Phasellus scelerisque, libero eu finibus rutrum, risus risus accumsan libero, nec molestie urna dui a leo.",
            },
          },
          fields: [
            {
              type: "object",
              name: "media",
              label: "Media Type",
              list: true,
              ui: {
                visualSelector: true,
              },
              templates: [genericFeatureBlockSchema],
            },
            {
              type: "string",
              label: "Title",
              name: "title",
            },
            {
              type: "rich-text",
              label: "Text",
              name: "text",
            },
          ],
        },
        {
          type: "object",
          list: true,
          name: "blocks",
          label: "Sections",
          ui: {
            visualSelector: true,
          },
          templates: [genericFeatureBlockSchema],
        },
      ],
    },
  ],
});

const branch = "main";
const apiURL =
  process.env.NODE_ENV == "development"
    ? "http://localhost:4001/graphql"
    : `https://content.tinajs.io/content/${process.env.NEXT_PUBLIC_TINA_CLIENT_ID}/github/${branch}`;

export const tinaConfig = defineConfig({
  apiURL,
  cmsCallback: (cms) => {
    // Use the new experimental admin
    cms.flags.set("tina-admin", true);
    // Experimental branch switcher
    cms.flags.set("branch-switcher", true);

    const RouteMapping = new RouteMappingPlugin((collection, document) => {
      if (collection.name === "campaigns") {
        return `/${document.sys.relativePath.slice(
          0,
          document.sys.extension.length * -1
        )}`;
      }

      return `/${collection.name}/${document.sys.filename}`;
    });

    /**
     * 2. Add the `RouteMappingPlugin` to the `cms`.
     **/
    cms.plugins.add(RouteMapping);
    return cms;
  },
});
