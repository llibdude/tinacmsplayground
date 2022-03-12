import { TinaFieldInner } from "tinacms/dist/types";

export const baseFeatureFields: TinaFieldInner<false>[] = [
  // TODO: Could be nice to make this a dropdown of predefined options
  {
    type: "string",
    name: "iconName",
    label: "Feature Icon Name",
    description:
      "Must be a preexesting icon defined here https://github.com/planetscale/planetscale.com-v2/blob/main/components/Icon.tsx#L6",
  },
  {
    type: "string",
    label: "Title",
    name: "title",
  },
  {
    type: "string",
    label: "Header",
    name: "header",
  },
  {
    type: "rich-text",
    label: "Text",
    name: "text",
  },
];

export { default as importedGenericFeature } from "./genericFeature";
