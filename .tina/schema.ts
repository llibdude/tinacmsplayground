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

const imageBlockSchema: TinaTemplate = {
  name: "imageMedia",
  label: "Image",
  fields: [
    {
      type: "image",
      name: "featureImage",
      label: "Image",
    },
  ],
};

const mdxBlockSchema: TinaTemplate = {
  name: "mdxMedia",
  label: "MDX",
  fields: [
    {
      type: "rich-text",
      name: "featureMDX",
      label: "MDX",
    },
  ],
};

const youtubeBlockSchema: TinaTemplate = {
  name: "youtubeMedia",
  label: "YouTube",
  fields: [
    {
      type: "string",
      name: "featureYoutube",
      label: "Youtube Video ID",
    },
    {
      type: "string",
      name: "featureYoutubeTitle",
      label: "Youtube Video Title",
      description: "This is for a11y compliance",
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
          fields: [
            {
              type: "object",
              name: "media",
              label: "Media Type",
              list: true,
              ui: {
                visualSelector: true,
              },
              templates: [imageBlockSchema, mdxBlockSchema, youtubeBlockSchema],
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