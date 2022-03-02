import "../styles/globals.css";
import dynamic from "next/dynamic";
import { RouteMappingPlugin } from "tinacms";
import { TinaEditProvider } from "tinacms/dist/edit-state";
const TinaCMS = dynamic(() => import("tinacms"), { ssr: false });

const branch = process.env.NEXT_PUBLIC_EDIT_BRANCH || "main";

const App = ({ Component, pageProps }) => {
  return (
    <TinaEditProvider
      showEditButton={true}
      editMode={
        <TinaCMS
          branch={branch}
          isLocalClient={true}
          documentCreatorCallback={{
            /**
             * After a new document is created, redirect to its location
             */
            onNewDocument: ({ collection: { slug }, breadcrumbs }) => {
              const relativeUrl = `/${slug}/${breadcrumbs.join("/")}`;
              return (window.location.href = relativeUrl);
            },
          }}
          cmsCallback={(cms) => {
            // Use the new experimental admin
            cms.flags.set("tina-admin", true);
            // Experimental branch switcher
            cms.flags.set("branch-switcher", true);

            import("react-tinacms-editor").then((field) => {
              cms.plugins.add(field.MarkdownFieldPlugin);
            });

            const RouteMapping = new RouteMappingPlugin(
              (collection, document) => {
                if (collection.name === "campaigns") {
                  return `/${document.sys.relativePath.slice(
                    0,
                    document.sys.extension.length * -1
                  )}`;
                }

                return `/${collection.name}/${document.sys.filename}`;
              }
            );

            /**
             * 2. Add the `RouteMappingPlugin` to the `cms`.
             **/
            cms.plugins.add(RouteMapping);
            return cms;
          }}
          {...pageProps}
        >
          {(livePageProps) => {
            return <Component {...livePageProps} />;
          }}
        </TinaCMS>
      }
    >
      <Component {...pageProps} />
    </TinaEditProvider>
  );
};

export default App;
