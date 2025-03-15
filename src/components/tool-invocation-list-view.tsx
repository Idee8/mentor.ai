import type { ToolInvocation } from 'ai';
import { memo, useCallback } from 'react';
import { Book, Brain, Calendar, Download, FileText, User2 } from 'lucide-react';
import { motion } from 'motion/react';

import { MessageLoadingState } from './message-loading-state';
import { Card, CardHeader, CardTitle } from './ui/card';
import type { AcademicResult } from '@/lib/types';
import { Button } from './ui/button';
import MemoryManager from './memory-manager';

export const ToolInvocationListView = memo(
  ({
    toolInvocations,
    message,
  }: { toolInvocations: ToolInvocation[]; message: any }) => {
    const renderToolInvocation = useCallback(
      (toolInvocation: ToolInvocation, index: number) => {
        const args = JSON.parse(JSON.stringify(toolInvocation.args));
        const result =
          'result' in toolInvocation
            ? JSON.parse(JSON.stringify(toolInvocation.result))
            : null;

        if (toolInvocation.toolName === 'academicSearch') {
          if (!result) {
            return (
              <MessageLoadingState
                icon={Book}
                text="Search Academic papers"
                color="violet"
              />
            );
          }

          return (
            <Card className="w-full my-4 overflow-hidden">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-600/20 flex items-center justify-center backdrop-blur-sm">
                    <Book className="h-4 w-4 text-violet-400" />
                  </div>
                  <div>
                    <CardTitle>Academic Papers</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Found {result.results.length} papers
                    </p>
                  </div>
                </div>
              </CardHeader>
              <div className="px-4 pb-2">
                <div className="flex overflow-x-auto gap-4 no-scrollbar hover:overflow-x-scroll">
                  {result.results.map(
                    (paper: AcademicResult, index: number) => (
                      <motion.div
                        key={paper.url || index}
                        className="w-[400px] flex-none"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="h-[300px] relative group overflow-y-auto">
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500/20 via-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <div className="h-full relative backdrop-blur-sm bg-neutral-900/95 border border-neutral-800/50 rounded-xl p-4 flex flex-col transition-all duration-500 group-hover:border-violet-500/20">
                            <h3 className="font-semibold text-xl tracking-tight mb-3 line-clamp-2 group-hover:text-violet-400 transition-colors duration-300">
                              {paper.title}
                            </h3>
                            {paper.author && (
                              <div className="mb-3">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-muted-foreground bg-neutral-800 rounded-md">
                                  <User2 className="h-3.5 w-3.5 text-violet-500" />
                                  <span className="line-clamp-1">
                                    {paper.author
                                      .split(';')
                                      .slice(0, 2)
                                      .join(', ') +
                                      (paper.author.split(';').length > 2
                                        ? ' et al.'
                                        : '')}
                                  </span>
                                </div>
                              </div>
                            )}
                            {paper.publishedDate && (
                              <div className="mb-4">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-muted-foreground bg-neutral-800 rounded-md">
                                  <Calendar className="h-3.5 w-3.5 text-violet-500" />
                                  {new Date(
                                    paper.publishedDate,
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                            )}
                            <div className="flex-1 relative mb-4 pl-3">
                              <div className="absolute -left-0 top-1 bottom-1 w-[2px] rounded-full bg-gradient-to-b from-violet-500 via-violet-400 to-transparent opacity-50" />
                              <p className="text-sm text-muted-foreground line-clamp-4">
                                {paper.summary}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant={'ghost'}
                                onClick={() => window.open(paper.url, '_blank')}
                                className="flex-1 bg-neutral-800"
                              >
                                <FileText className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform duration-300" />
                                View Paper
                              </Button>
                              {paper.url.includes('arxiv.org') && (
                                <Button
                                  variant="ghost"
                                  onClick={() =>
                                    window.open(
                                      paper.url.replace('abs', 'pdf'),
                                      '_blank',
                                    )
                                  }
                                  className="bg-neutral-800 hover:bg-violet-900/20 hover:text-violet-400 group/btn"
                                >
                                  <Download className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-300" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ),
                  )}
                </div>
              </div>
            </Card>
          );
        }

        if (toolInvocation.toolName === 'memoryManager') {
          if (!result) {
            return (
              <MessageLoadingState
                icon={Brain}
                text="Managing memories..."
                color="violet"
              />
            );
          }
          return <MemoryManager result={result} />;
        }

        return null;
      },
      [message],
    );

    return (
      <>
        {toolInvocations.map(
          (toolInvocation: ToolInvocation, toolIndex: number) => (
            <div key={`tool-${toolIndex}`}>
              {renderToolInvocation(toolInvocation, toolIndex)}
            </div>
          ),
        )}
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.toolInvocations === nextProps.toolInvocations &&
      prevProps.message === nextProps.message
    );
  },
);
