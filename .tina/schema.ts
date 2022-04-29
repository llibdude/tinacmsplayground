import { defineConfig, defineSchema, TinaCloudSchema } from "tinacms";
type TinaFieldInner = TinaCloudSchema["collections"][0]["fields"][0];

const SEO: TinaFieldInner = {
  type: "object",
  label: "SEO",
  name: "seo",
  fields: [
    {
      type: "string",
      label: "Title",
      name: "title",
      required: true,
    },
    {
      type: "string",
      label: "Description",
      name: "description",
    },
    {
      type: "image",
      label: "Social Image",
      name: "socialImage",
    },
  ],
};

export default defineSchema({
  collections: [
    {
      label: "Globals",
      name: "globals",
      path: "content/globals",
      fields: [
        {
          type: "image",
          label: "Logo",
          name: "logo",
          required: true,
        },
        {
          type: "image",
          label: "Icon",
          name: "icon",
          required: true,
        },
        {
          type: "object",
          label: "Nav Items",
          name: "navItems",
          list: true,
          ui: {
            itemProps: (item) => ({
              label: item?.text,
            }),
          },
          fields: [
            {
              type: "string",
              label: "Text",
              name: "text",
              required: true,
            },
            {
              type: "string",
              label: "URL",
              name: "url",
              required: true,
            },
            {
              type: "boolean",
              label: "Button Mode?",
              name: "button",
            },
          ],
        },
        {
          type: "object",
          label: "Footer",
          name: "footer",
          fields: [
            {
              type: "image",
              label: "Logo",
              name: "logo",
              required: true,
            },
            {
              type: "object",
              label: "Contact Form Text",
              name: "contactFormText",
              fields: [
                {
                  type: "string",
                  label: "Title",
                  name: "title",
                },
                {
                  type: "string",
                  label: "Short Text",
                  name: "shortText",
                },
              ],
            },
            {
              type: "string",
              label: "Contact Details",
              name: "contactDetails",
              ui: {
                component: "textarea",
              },
            },
          ],
        },
        {
          type: "object",
          label: "Brand",
          name: "brand",
          fields: [
            {
              type: "object",
              label: "Colours",
              name: "colours",
              fields: [
                {
                  type: "string",
                  label: "Primary",
                  name: "primary",
                  ui: {
                    defaultValue: "#009C84",
                    component: "color",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      label: "Projects",
      name: "projects",
      path: "content/projects",
      fields: [
        SEO,
        {
          type: "string",
          label: "Title",
          name: "title",
          required: true,
        },
        {
          type: "string",
          label: "Background Image",
          name: "backgroundImage",
          options: ["1", "2", "3"],
          required: true,
        },
        {
          type: "image",
          label: "Main Image",
          name: "mainImage",
          // required: true,
        },
        {
          type: "datetime",
          label: "Completion Date",
          name: "completionDate",
          required: true,
        },
        {
          type: "rich-text",
          label: "Project Description",
          name: "projectDescription",
          isBody: true,
        },
      ],
    },
    {
      label: "Home",
      name: "home",
      path: "content/home",
      fields: [
        SEO,
        {
          type: "object",
          label: "Hero",
          name: "hero",
          fields: [
            {
              type: "string",
              label: "Title",
              name: "title",
              required: true,
            },
            {
              type: "string",
              label: "Subtitle",
              name: "subtitle",
              required: true,
            },
            {
              type: "image",
              label: "Image",
              name: "image",
              required: true,
            },
          ],
        },
        {
          type: "object",
          label: "Featured Projects",
          name: "featuredProjects",
          fields: [
            {
              type: "reference",
              label: "Featured Project 1",
              name: "project1",
              collections: ["projects"],
            },
            {
              type: "reference",
              label: "Featured Project 2",
              name: "project2",
              collections: ["projects"],
            },
            {
              type: "reference",
              label: "Featured Project 3",
              name: "project3",
              collections: ["projects"],
            },
          ],
        },
      ],
    },
  ],
});

// Your tina config
// ==============
const branch = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF || "main";
// When working locally, hit our local filesystem.
// On a Vercel deployment, hit the Tina Cloud API
const apiURL =
  process.env.NODE_ENV == "development"
    ? "http://localhost:4001/graphql"
    : `https://content.tinajs.io/content/${process.env.NEXT_PUBLIC_TINA_CLIENT_ID}/github/${branch}`;

export const tinaConfig = defineConfig({
  apiURL,
  cmsCallback: (cms) => {
    //  add your CMS callback code here (if you want)

    // The Route Mapper
    /**
     * 1. Import `tinacms` and `RouteMappingPlugin`
     **/
    import("tinacms").then(({ RouteMappingPlugin }) => {
      /**
       * 2. Define the `RouteMappingPlugin` see https://tina.io/docs/tinacms-context/#the-routemappingplugin for more details
       **/
      const RouteMapping = new RouteMappingPlugin((collection, document) => {
        if (collection.name === "globals") {
          return undefined;
        }
        if (collection.name === "home") {
          return undefined;
        }
        return `/${collection.name}/${document.sys.filename}`;
      });
      /**
       * 3. Add the `RouteMappingPlugin` to the `cms`.
       **/
      cms.plugins.add(RouteMapping);
    });

    return cms;
  },
  mediaStore: async () => {
    // Load media store dynamically so it only loads in edit mode
    const pack = await import("next-tinacms-cloudinary");
    return pack.TinaCloudCloudinaryMediaStore;
  },
});
