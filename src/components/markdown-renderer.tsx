import { ArrowLeftRight, Check, Copy, Loader2, WrapText } from 'lucide-react';
import Image from 'next/image';
import React, { useCallback, useMemo, useState, type JSX } from 'react';
import Marked, { type ReactRenderer } from 'marked-react';
import Latex from 'react-latex-next';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { GeistMono } from 'geist/font/mono';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Link from 'next/link';
import he from 'he';

import { cn } from '@/lib/utils';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import { fetchMetadata } from '@/app/actions';

interface MarkdownRendererProps {
  content: string;
}

interface CitationLink {
  text: string;
  link: string;
}

interface LinkMetadata {
  title: string;
  description: string;
}

const isValidUrl = (str: string) => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
}) => {
  const [metadataCache, setMetadataCache] = useState<
    Record<string, LinkMetadata>
  >({});

  const citationLinks = useMemo<CitationLink[]>(() => {
    return Array.from(content.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)).map(
      ([_, text, link]) => ({ text, link }),
    );
  }, [content]);

  const fetchMetadataWithCache = useCallback(
    async (url: string) => {
      if (metadataCache[url]) {
        return metadataCache[url];
      }
      const metadata = await fetchMetadata(url);
      if (metadata) {
        setMetadataCache((prev) => ({ ...prev, [url]: metadata }));
      }
      return metadata;
    },
    [metadataCache],
  );

  interface CodeBlockProps {
    language: string | undefined;
    children: string;
  }

  const CodeBlock: React.FC<CodeBlockProps> = ({ language, children }) => {
    const [isCopied, setIsCopied] = useState(false);
    const [isWrapped, setIsWrapped] = useState(false);

    const handleCopy = useCallback(async () => {
      await navigator.clipboard.writeText(children);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }, [children]);

    const toggleWrap = useCallback(() => {
      setIsWrapped((prev) => !prev);
    }, []);

    return (
      <div className="group relative">
        <div className="rounded-md overflow-hidden border border-neutral-800 shadow-sm">
          <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
            <div className="px-2 py-0.5 text-xs font-medium text-neutral-400">
              {language || 'text'}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={toggleWrap}
                className={`
                                  px-2 py-1
                                  rounded text-xs font-medium
                                  transition-all duration-200
                                  ${isWrapped ? 'text-primary' : 'text-neutral-400'}
                                  hover:bg-neutral-700
                                  flex items-center gap-1.5
                                `}
                aria-label="Toggle line wrapping"
              >
                {isWrapped ? (
                  <>
                    <ArrowLeftRight className="h-3 w-3" />
                    <span className="hidden sm:inline">Unwrap</span>
                  </>
                ) : (
                  <>
                    <WrapText className="h-3 w-3" />
                    <span className="hidden sm:inline">Wrap</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className={`
                                  px-2 py-1
                                  rounded text-xs font-medium
                                  transition-all duration-200
                                  ${isCopied ? 'text-primary dark:text-primary' : 'text-neutral-400'}
                                  hover:bg-neutral-700
                                  flex items-center gap-1.5
                                `}
                aria-label="Copy code"
              >
                {isCopied ? (
                  <>
                    <Check className="h-3 w-3" />
                    <span className="hidden sm:inline">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span className="hidden sm:inline">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
          <SyntaxHighlighter
            language={language || 'text'}
            style={oneDark}
            customStyle={{
              margin: 0,
              padding: '0.75rem 0.25rem 0.75rem',
              backgroundColor: '#171717',
              borderRadius: 0,
              borderBottomLeftRadius: '0.375rem',
              borderBottomRightRadius: '0.375rem',
              fontFamily: GeistMono.style.fontFamily,
            }}
            showLineNumbers={true}
            lineNumberStyle={{
              textAlign: 'right',
              color: '#6b7280',
              backgroundColor: 'transparent',
              fontStyle: 'normal',
              marginRight: '1em',
              paddingRight: '0.5em',
              fontFamily: GeistMono.style.fontFamily,
              minWidth: '2em',
            }}
            lineNumberContainerStyle={{
              backgroundColor: '#171717',
              float: 'left',
            }}
            wrapLongLines={isWrapped}
            codeTagProps={{
              style: {
                fontFamily: GeistMono.style.fontFamily,
                fontSize: '0.85em',
                whiteSpace: isWrapped ? 'pre-wrap' : 'pre',
                overflowWrap: isWrapped ? 'break-word' : 'normal',
                wordBreak: isWrapped ? 'break-word' : 'keep-all',
              },
            }}
          >
            {children}
          </SyntaxHighlighter>
        </div>
      </div>
    );
  };

  CodeBlock.displayName = 'CodeBlock';

  const LinkPreview = ({ href }: { href: string }) => {
    const [metadata, setMetadata] = useState<LinkMetadata | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    React.useEffect(() => {
      setIsLoading(true);
      fetchMetadataWithCache(href).then((data) => {
        setMetadata(data);
        setIsLoading(false);
      });
    }, [href]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-8">
          <Loader2 className="h-3 w-3 animate-spin text-neutral-500 dark:text-neutral-400" />
        </div>
      );
    }

    const domain = new URL(href).hostname;
    const decodedTitle = metadata?.title ? he.decode(metadata.title) : '';

    return (
      <div className="flex flex-col bg-neutral-800 text-xs m-0">
        <div className="flex items-center h-6 space-x-1.5 px-2 pt-1.5 text-[10px] text-neutral-500 dark:text-neutral-400">
          <Image
            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`}
            alt=""
            width={10}
            height={10}
            className="rounded-sm"
          />
          <span className="truncate">{domain}</span>
        </div>
        {decodedTitle && (
          <div className="px-2 pb-1.5">
            <h3 className="font-medium text-sm m-0 text-neutral-200 line-clamp-2">
              {decodedTitle}
            </h3>
          </div>
        )}
      </div>
    );
  };

  const renderHoverCard = (
    href: string,
    text: React.ReactNode,
    isCitation = false,
  ) => {
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={
              isCitation
                ? 'cursor-pointer text-xs text-primary py-0.5 px-1.5 m-0 bg-primary/10 dark:bg-primary/20 rounded-full no-underline font-medium'
                : 'text-primary-light no-underline hover:underline font-medium'
            }
          >
            {text}
          </Link>
        </HoverCardTrigger>
        <HoverCardContent
          side="top"
          align="start"
          sideOffset={5}
          className="w-48 p-0 shadow-sm border border-neutral-700 rounded-md overflow-hidden"
        >
          <LinkPreview href={href} />
        </HoverCardContent>
      </HoverCard>
    );
  };

  const renderer: Partial<ReactRenderer> = {
    text(text: string) {
      if (!text.includes('$')) return text;
      return (
        <Latex
          delimiters={[
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
          ]}
        >
          {text}
        </Latex>
      );
    },
    paragraph(children) {
      if (typeof children === 'string' && children.includes('$')) {
        return (
          <p className="leading-relaxed text-neutral-300">
            <Latex
              delimiters={[
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false },
              ]}
            >
              {children}
            </Latex>
          </p>
        );
      }
      return <p className="leading-relaxed text-neutral-300">{children}</p>;
    },
    code(children, language) {
      return <CodeBlock language={language}>{String(children)}</CodeBlock>;
    },
    link(href, text) {
      const citationIndex = citationLinks.findIndex(
        (link) => link.link === href,
      );
      if (citationIndex !== -1) {
        return <sup>{renderHoverCard(href, citationIndex + 1, true)}</sup>;
      }
      return isValidUrl(href) ? (
        renderHoverCard(href, text)
      ) : (
        <a
          href={href}
          className="text-primary-foreground hover:underline font-medium"
        >
          {text}
        </a>
      );
    },
    heading(children, level) {
      const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
      const sizeClasses =
        {
          1: 'text-2xl md:text-3xl font-extrabold mt-8 mb-4',
          2: 'text-xl md:text-2xl font-bold mt-7 mb-3',
          3: 'text-lg md:text-xl font-semibold mt-6 mb-3',
          4: 'text-base md:text-lg font-medium mt-5 mb-2',
          5: 'text-sm md:text-base font-medium mt-4 mb-2',
          6: 'text-xs md:text-sm font-medium mt-4 mb-2',
        }[level] || '';

      return (
        <HeadingTag className={`${sizeClasses} text-neutral-50 tracking-tight`}>
          {children}
        </HeadingTag>
      );
    },
    list(children, ordered) {
      const ListTag = ordered ? 'ol' : 'ul';
      return (
        <ListTag
          className={`my-5 pl-6 space-y-2 text-neutral-300 ${ordered ? 'list-decimal' : 'list-disc'}`}
        >
          {children}
        </ListTag>
      );
    },
    listItem(children) {
      return <li className="pl-1 leading-relaxed">{children}</li>;
    },
    blockquote(children) {
      return (
        <blockquote className="my-6 border-l-4 border-primary/20 pl-4 py-1 text-neutral-300 italic bg-neutral-900/50 rounded-r-md">
          {children}
        </blockquote>
      );
    },
    table(children) {
      return (
        <div className="w-full my-8 overflow-hidden">
          <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-900 shadow-sm">
            <table className="w-full border-collapse text-sm m-0">
              {children}
            </table>
          </div>
        </div>
      );
    },
    tableRow(children) {
      return (
        <tr className="border-b border-neutral-800 last:border-0 transition-colors hover:bg-neutral-800/50">
          {children}
        </tr>
      );
    },
    tableCell(children, flags) {
      const align = flags.align ? `text-${flags.align}` : 'text-left';
      const isHeader = flags.header;

      return isHeader ? (
        <th
          className={cn(
            'px-4 py-3 font-semibold text-neutral-100',
            'dark:bg-neutral-800/80',
            'first:pl-6 last:pr-6',
            align,
          )}
        >
          {children}
        </th>
      ) : (
        <td
          className={cn(
            'px-4 py-3 text-neutral-300',
            'first:pl-6 last:pr-6',
            align,
          )}
        >
          {children}
        </td>
      );
    },
    tableHeader(children) {
      return <thead className="border-b border-neutral-800">{children}</thead>;
    },
    tableBody(children) {
      return <tbody className="divide-y divide-neutral-800">{children}</tbody>;
    },
  };

  return (
    <div className="markdown-body prose prose-invert max-w-none text-neutral-200 font-sans">
      <Marked renderer={renderer}>{content}</Marked>
    </div>
  );
};
