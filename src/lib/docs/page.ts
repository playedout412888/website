import matter from "gray-matter";
import { promises as fs } from "node:fs";
import { createElement, type ComponentType, type ReactNode } from "react";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import slugify from "slugify";
import { unified } from "unified";
import type { Node } from "unist";
import { visit } from "unist-util-visit";

const nodePath = require("node:path");

// MDX_EXTENSION is the file extension used for docs page source files.
const MDX_EXTENSION = ".mdx";

export type PageHeader = {
  id: string;
  title: string;
  depth: number;
};

export interface DocsPageData {
  slug: string;
  title: string;
  description: string;
  // There are scenarios in which the GitHub link should
  // not be the website source MDX file, due to the MDX being
  // generated from some upstream source. This is an optional
  // frontmatter that can override the link.
  editOnGithubLink: string | null;
  hideSidecar: boolean;
  content: ReactNode;
  relativeFilePath: string;
  pageHeaders: PageHeader[];
}

// loadDocsPage loads docs page data for a slug, checking direct and index MDX paths.
export async function loadDocsPage(
  docsDirectory: string,
  slug: string,
): Promise<DocsPageData> {
  try {
    return await loadDocsPageFromRelativeFilePath(
      nodePath.join(docsDirectory, slug + MDX_EXTENSION),
    );
  } catch (err) {
    if (!isErrorWithCode(err) || err.code !== "ENOENT") {
      throw err;
    }
  }
  return await loadDocsPageFromRelativeFilePath(
    nodePath.join(docsDirectory, slug, `index${MDX_EXTENSION}`),
  );
}

// loadDocsPageFromRelativeFilePath compiles one MDX file and extracts docs metadata.
async function loadDocsPageFromRelativeFilePath(
  relativeFilePath: string,
): Promise<DocsPageData> {
  const mdxFileContent = matter.read(relativeFilePath);
  const slug = slugFromRelativeFilePath(relativeFilePath);
  const pageHeaders = await extractPageHeaders(mdxFileContent.content);
  const MdxContent = await loadMdxComponent(relativeFilePath);
  return {
    slug,
    relativeFilePath,
    title: mdxFileContent.data.title,
    description: mdxFileContent.data.description,
    editOnGithubLink: mdxFileContent.data.editOnGithubLink
      ? mdxFileContent.data.editOnGithubLink
      : null,
    hideSidecar: Object.prototype.hasOwnProperty.call(
      mdxFileContent.data,
      "hideSidecar",
    )
      ? mdxFileContent.data.hideSidecar
      : false,
    content: createElement(MdxContent),
    pageHeaders,
  };
}

type MdxModule = {
  default: ComponentType;
};

async function loadMdxComponent(
  relativeFilePath: string,
): Promise<ComponentType> {
  const normalizedRelativePath = relativeFilePath
    .replaceAll(nodePath.sep, "/")
    .replace(/^\.\//, "");
  const docsRelativePath = normalizedRelativePath.replace(/^docs\//, "");
  const importPath = `../../../docs/${docsRelativePath}`;
  const mdxModule = (await import(importPath)) as MdxModule;
  return mdxModule.default;
}

async function extractPageHeaders(source: string): Promise<PageHeader[]> {
  const pageHeaders: PageHeader[] = [];
  const processor = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkGfm)
    .use(parseAnchorLinks({ pageHeaders }));
  const tree = processor.parse(source);
  await processor.run(tree);
  return pageHeaders;
}

function parseAnchorLinks({
  pageHeaders,
}: {
  pageHeaders: PageHeader[];
}): () => (node: Node) => void {
  type HeadingNode = {
    type: "heading";
    depth: number;
    children: {
      type: string;
      value: string;
    }[];
    data?: {
      hProperties?: Record<string, unknown>;
    };
  };

  return () => {
    const encounteredIDs = new Map<string, number>();

    return (node: Node) => {
      visit(node, "heading", (visitedNode: Node) => {
        if (visitedNode.type === "heading") {
          const headingNode = visitedNode as HeadingNode;
          if (headingNode.children.length > 0) {
            const text = headingNode.children.map((v) => v.value).join("");
            const baseId = slugify(text.toLowerCase());
            const encounteredCount = (encounteredIDs.get(baseId) || 0) + 1;
            encounteredIDs.set(baseId, encounteredCount);
            if (encounteredCount >= 2) {
              if (!headingNode.data) {
                headingNode.data = {};
              }
              headingNode.data.hProperties = {
                ...headingNode.data.hProperties,
                "data-index": encounteredCount.toString(),
              };
            }
            const resolvedID =
              encounteredCount >= 2 ? `${baseId}-${encounteredCount}` : baseId;

            if (!headingNode.data) {
              headingNode.data = {};
            }
            headingNode.data.hProperties = {
              ...headingNode.data.hProperties,
              id: resolvedID,
            };

            pageHeaders.push({
              depth: headingNode.depth,
              id: resolvedID,
              title: text,
            });
          }
        }
      });
    };
  };
}

export async function loadAllDocsPageSlugs(
  docsDirectory: string,
): Promise<Array<string>> {
  const allPaths = (await collectAllFilesRecursively(docsDirectory)).filter(
    (path) => path.endsWith(MDX_EXTENSION),
  );
  const docsPageSlugs: Set<string> = new Set();
  for (let i = 0; i < allPaths.length; i++) {
    const path = allPaths[i];
    const relativeFilePath = nodePath.relative(docsDirectory, path);
    const slug = slugFromRelativeFilePath(relativeFilePath);
    if (docsPageSlugs.has(slug)) {
      throw new Error(
        `There is a conflict in generating the ${docsDirectory}/${slug} page.\n\nIt is likely that both of these files exist:\n  - ${docsDirectory}/${slug}.mdx\n  - ${docsDirectory}/${slug}/index.mdx\nBoth of these files resolve to the same URL, and will cause an issue.\n\nTo fix this error, delete one of these files.`,
      );
    }
    docsPageSlugs.add(slug);
  }
  return Array.from(docsPageSlugs);
}

const isErrorWithCode = (err: unknown): err is Error & { code: unknown } => {
  return err instanceof Error && typeof err === "object" && "code" in err;
};

function slugFromRelativeFilePath(relativeFilePath: string): string {
  return relativeFilePath
    .replaceAll(MDX_EXTENSION, "")
    .replaceAll(/\/index$/gi, "");
}

async function collectAllFilesRecursively(root: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await fs.readdir(root, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = nodePath.join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectAllFilesRecursively(fullPath)));
      continue;
    }
    files.push(fullPath);
  }

  return files;
}
