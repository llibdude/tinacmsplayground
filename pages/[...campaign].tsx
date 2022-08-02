/*
 * [...campaign].tsx
 * This page uses a dynamic catch all page to catch all routes to pages that aren't defined already in the pages.
 * It then takes the url path, queries the 'campaigns' in sanity based on the url, and renders the campaign if one is found.
 * Otherwise, 404.
 */

import React from "react";

import { GetStaticProps, GetStaticPaths } from "next";
import { TinaMarkdown } from "tinacms/dist/rich-text";

import { ExperimentalGetTinaClient } from "../.tina/__generated__/types";
import { useTina } from "tinacms/dist/edit-state";

export const getStaticPaths: GetStaticPaths = async () => {
  const client = ExperimentalGetTinaClient();
  const campaignsListData = await client.campaignsConnection();

  return {
    paths: campaignsListData.data.campaignsConnection.edges.map((page) => ({
      params: { campaign: [page.node._sys.filename] },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const client = ExperimentalGetTinaClient();
  const tinaProps = await client.campaigns({
    relativePath: String(`${(params.campaign as string[]).join("/")}.mdx`),
  });

  // This page does not exist so 404
  if (!tinaProps) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...tinaProps,
      // TODO: Once TinaCMS implements read-only tokens we can have the pages build/rebuld at runtime
      // Incremental static regeneration so we can preview new blogs in sanity and not need to rebuild on every edit
      // revalidate: 60
    },
  };
};

const Campaign: React.FC<any> = (props) => {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const d = data.campaigns;

  return (
    <div className="mx-10">
      {d.hero && (
        <div data-tinafield="hero">
          <h1
            className="mb-2 text-5xl font-semibold"
            data-tinafield="hero.title"
          >
            {d.hero.title}
          </h1>
          <div data-tinafield="hero.text">
            <TinaMarkdown content={d.hero.text} />
          </div>
        </div>
      )}
      {d.blocks?.map((block, index) => {
        return (
          <section className="my-5" key={index}>
            <h2
              className="mb-2 text-3xl font-semibold"
              data-tinafield="hero.title"
            >
              {block.title}
            </h2>
            <TinaMarkdown content={block.text} />
          </section>
        );
      })}
    </div>
  );
};
export default Campaign;
