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

export const getStaticPaths: GetStaticPaths = async () => {
  const client = ExperimentalGetTinaClient();
  const campaignsListData = await client.getCampaignsList();

  return {
    paths: campaignsListData.data.getCampaignsList.edges.map((page) => ({
      params: { campaign: [page.node.sys.filename] },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const client = ExperimentalGetTinaClient();
  const tinaProps = await client.getCampaignsDocument({
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
  const d = props.data.getCampaignsDocument.data;
  return (
    <div className="mx-10">
      {d.hero && (
        <div>
          <h1 className="text-5xl font-semibold mb-2">{d.hero.title}</h1>
          <TinaMarkdown content={d.hero.text} />
        </div>
      )}
      {d.blocks?.map((block) => {
        return (
          <section className="my-5">
            <h2 className="text-3xl font-semibold mb-2">{block.title}</h2>
            <TinaMarkdown content={block.text} />
          </section>
        );
      })}
    </div>
  );
};
export default Campaign;
