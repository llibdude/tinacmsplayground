import React from "react";

import { GetStaticProps, GetStaticPaths } from "next";
import { ExperimentalGetTinaClient } from "../../.tina/__generated__/types";

const getOtherCMSPaths: any = async () => {
  return new Promise((resolve) => resolve([{ params: { slug: "test" } }]));
};
const getTinaPaths = async () => {
  const client = ExperimentalGetTinaClient();
  const blogListData = await client.getBlogList();

  if (!blogListData.data.getBlogList.edges) return [];

  return blogListData.data.getBlogList.edges
    .filter((blog) => blog?.node)
    .map((blog) => {
      return {
        params: { slug: blog.node.sys.filename },
      };
    });
};

export const getStaticPaths: GetStaticPaths = async () => {
  const [otherCMSPaths, tinaPaths] = await Promise.all([
    getOtherCMSPaths(),
    getTinaPaths(),
  ]);

  const paths = [...otherCMSPaths, ...tinaPaths];

  return {
    paths: paths,
    fallback: "blocking",
  };
};

const getStaticPropsOtherCMS = async () => {};

const getStaticPropsTina = async (params) => {
  const client = ExperimentalGetTinaClient();
  const relativePath = String(`${params.slug}.mdx`);

  /* My Scenario
   * I have an older CMS hosting blogs and I would like Tina to host new ones.  My intermediate
   * strategy is to check both CMS's for existence of the blog, use the data from whichever CMS
   * actually has the blog.  I request existence from both at the same time.
   *
   * Problem:
   * In this particular code, `getStaticPaths` is returning a `test` path from the 'other' CMS.
   * AFAIK I can't denote ahead of time which CMS this document lives on so I must check both.
   * When I fetch the document for Tina, it won't exist but i'd expect a graceful catchable error,
   * instead I see
   * Error: Export encountered errors on following paths:
   * /blog/[slug]: /blog/test
   */
  let blogDocument;
  try {
    console.log("BEFORE ATTEMPT");
    blogDocument = await client.getBlogDocument({ relativePath });
  } catch (err) {
    console.log("CATCHHHHHHH", err);
  }

  return {};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  let otherProps: any, tinaProps: any;
  try {
    [otherProps, tinaProps] = await Promise.all([
      getStaticPropsOtherCMS(),
      getStaticPropsTina(params),
    ]);
  } catch {
    console.log("caught");
  }

  return {
    props: { otherProps, tinaProps },
    revalidate: 5,
  };
};

const SpecificBlog: React.FC<any> = ({ otherProps, tinaProps }) => {
  return <div>Stuff</div>;
};

export default SpecificBlog;
