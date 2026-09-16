import type { Metadata } from "next";
import { XMLParser } from "fast-xml-parser";
import SectionWrapper from "@/components/section-wrapper";
import { H1, P } from "@/components/text";
import ReleaseDownloadPage from "./ReleaseDownloadPage";
import TipDownloadPage from "./TipDownloadPage";
import s from "./DownloadPage.module.css";

type AppcastItem = {
  "sparkle:version": string;
  "sparkle:shortVersionString": string;
};

type Appcast = {
  rss?: {
    channel?: {
      item?: AppcastItem | AppcastItem[];
    };
  };
};

export const metadata: Metadata = {
  title: "Download Ghostty",
  description:
    "Ghostty is a fast, feature-rich, and cross-platform terminal emulator that uses platform-native UI and GPU acceleration.",
};

async function fetchLatestGhosttyVersion(): Promise<string> {
  const response = await fetch("https://release.files.ghostty.org/appcast.xml", {
    cache: "force-cache",
  });
  if (!response.ok) throw new Error(`Failed to fetch XML: ${response.statusText}`);

  const parsedXml = new XMLParser({ ignoreAttributes: false }).parse(
    await response.text(),
  ) as Appcast;
  const items = parsedXml.rss?.channel?.item;
  if (!items) throw new Error("Failed to parse appcast XML: no items found");

  const itemsArray = Array.isArray(items) ? items : [items];
  const latestItem = itemsArray.reduce((maxItem, currentItem) =>
    Number.parseInt(currentItem["sparkle:version"], 10) >
    Number.parseInt(maxItem["sparkle:version"], 10)
      ? currentItem
      : maxItem,
  );

  return latestItem["sparkle:shortVersionString"];
}

export default async function DownloadPage() {
  const latestVersion = await fetchLatestGhosttyVersion();
  const isTip = process.env.GIT_COMMIT_REF === "tip";

  return (
    <main className={s.downloadPage}>
      <SectionWrapper>
        <div className={s.header}>
          <img src="/ghostty-logo.svg" alt="" width={27} height={32} />
          <H1 className={s.pageTitle}>Download Ghostty</H1>
          {!isTip && (
            <P weight="regular" className={s.versionInfo}>
              Version {latestVersion} -{" "}
              <a href={`/docs/install/release-notes/${latestVersion.replace(/\./g, "-")}`}>
                Release Notes
              </a>
            </P>
          )}
        </div>
        {isTip ? (
          <TipDownloadPage />
        ) : (
          <ReleaseDownloadPage latestVersion={latestVersion} />
        )}
      </SectionWrapper>
    </main>
  );
}
