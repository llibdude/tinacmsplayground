import { TinaTemplate } from "tinacms";
import { baseFeatureFields } from ".";

const importedGenericFeatureBlockSchema: TinaTemplate = {
  name: "importedGenericFeature",
  label: "Imported Generic Feature",
  ui: {
    defaultItem: {
      title: "Title placeholder",
      text: "Phasellus scelerisque, libero eu finibus rutrum, risus risus accumsan libero, nec molestie urna dui a leo.",
    },
  },
  fields: [
    ...baseFeatureFields,
    {
      type: "string",
      label: "Some other field",
      name: "someotherfield",
    },
  ],
};

export default importedGenericFeatureBlockSchema;
