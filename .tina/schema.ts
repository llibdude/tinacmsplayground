import { defineSchema, TinaTemplate } from "@tinacms/cli";

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
      label: "Blog",
      name: "blog",
      format: "mdx",
      path: "content/blog",
      fields: [
        {
          type: "string",
          name: "title",
          label: "Title",
        },
      ],
    },
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
