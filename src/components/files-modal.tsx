'use client';

import useSWR from 'swr';
import { type Dispatch, type SetStateAction, useRef, useState } from 'react';
import * as motion from 'motion/react-client';
import { useOnClickOutside, useWindowSize } from 'usehooks-ts';
import { cn, fetcher } from '@/lib/utils';
import {
  InfoIcon,
  LoaderIcon,
  TrashIcon,
  UnlockKeyholeIcon,
  UploadIcon,
} from 'lucide-react';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import { programmingFileExtensions } from '@/lib/constants';

export const Files = ({
  selectedFilePathnames,
  setSelectedFilePathnames,
  setIsFilesVisible,
}: {
  selectedFilePathnames: string[];
  setSelectedFilePathnames: Dispatch<SetStateAction<string[]>>;
  setIsFilesVisible: Dispatch<SetStateAction<boolean>>;
}) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);
  const [deleteQueue, setDeleteQueue] = useState<Array<string>>([]);
  const {
    data: files,
    mutate,
    isLoading,
  } = useSWR<
    Array<{
      pathname: string;
    }>
  >('api/files/list', fetcher, {
    fallbackData: [],
  });

  const { width } = useWindowSize();
  const isDesktop = width > 768;

  const drawerRef = useRef<any>(null);
  useOnClickOutside([drawerRef], () => {
    setIsFilesVisible(false);
  });

  const handleFilesUpload = async (fileList: FileList) => {
    const filesToUpload = Array.from(fileList);

    // Add all files to upload queue
    const newFilenames = filesToUpload.map((file) => file.name);
    setUploadQueue((currentQueue) => [...currentQueue, ...newFilenames]);

    // Upload files sequentially to avoid overwhelming the server
    for (const file of filesToUpload) {
      try {
        await fetch(`/api/files/upload?filename=${file.name}`, {
          method: 'POST',
          body: file,
        });

        // Remove from queue after successful upload
        setUploadQueue((currentQueue) =>
          currentQueue.filter((filename) => filename !== file.name),
        );

        // Add to file list
        mutate([...(files || []), { pathname: file.name }]);
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);

        // Remove from queue even if failed
        setUploadQueue((currentQueue) =>
          currentQueue.filter((filename) => filename !== file.name),
        );
      }
    }
  };

  return (
    <motion.div
      className="fixed bg-neutral-900/50 h-dvh w-dvw top-0 left-0 z-40 flex flex-row justify-center items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={cn(
          'fixed p-4 flex flex-col gap-4 bg-neutral-800 z-30',
          { 'w-dvw h-96 bottom-0 right-0': !isDesktop },
          { 'w-[600px] h-96 rounded-lg': isDesktop },
        )}
        initial={{
          y: '100%',
          scale: isDesktop ? 0.9 : 1,
          opacity: isDesktop ? 0 : 1,
        }}
        animate={{ y: '0%', scale: 1, opacity: 1 }}
        exit={{
          y: '100%',
          scale: isDesktop ? 0.9 : 1,
          opacity: isDesktop ? 0 : 1,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
        ref={drawerRef}
      >
        <div className="flex flex-row justify-between items-center">
          <div className="text-sm flex flex-row gap-3">
            <div className="text-neutral-100">Manage Local Files</div>
          </div>

          <input
            name="file"
            ref={inputFileRef}
            type="file"
            required
            className="opacity-0 pointer-events-none w-1"
            accept={programmingFileExtensions.join(',')}
            multiple={true} // Enable multiple file selection
            onChange={async (event) => {
              const files = event.target.files;
              if (files && files.length > 0) {
                await handleFilesUpload(files);
              }
            }}
          />

          <div
            className="bg-neutral-900 text-neutral-50 hover:bg-neutral-700 flex flex-row gap-2 items-center text-sm rounded-md p-1 px-2 cursor-pointer"
            onClick={() => {
              inputFileRef.current?.click();
            }}
          >
            <UploadIcon />
            <div>Upload files</div>
          </div>
        </div>

        <div className="flex flex-col h-full overflow-y-scroll">
          {isLoading ? (
            <div className="flex flex-col">
              {[44, 32, 52].map((item) => (
                <div
                  key={item}
                  className="flex flex-row gap-4 p-2 border-b border-neutral-700 items-center"
                >
                  <div className="size-4 bg-neutral-600 animate-pulse" />
                  <div
                    className={`w-${item} h-4 bg-neutral-600 animate-pulse`}
                  />
                  <div className="h-[24px] w-1" />
                </div>
              ))}
            </div>
          ) : null}

          {!isLoading &&
          files?.length === 0 &&
          uploadQueue.length === 0 &&
          deleteQueue.length === 0 ? (
            <div className="flex flex-col gap-4 items-center justify-center h-full">
              <div className="flex flex-row gap-2 items-center text-neutral-400 text-sm">
                <InfoIcon />
                <div>No files found</div>
              </div>
            </div>
          ) : null}

          {files?.map((file: any) => (
            <div
              key={file.pathname}
              className={`flex flex-row p-2 border-b border-neutral-700 ${
                selectedFilePathnames.includes(file.pathname)
                  ? 'bg-neutral-700 border-neutral-600'
                  : ''
              }`}
            >
              <div
                className="flex flex-row items-center justify-between w-full gap-4"
                onClick={() => {
                  setSelectedFilePathnames((currentSelections) => {
                    if (currentSelections.includes(file.pathname)) {
                      return currentSelections.filter(
                        (path) => path !== file.pathname,
                      );
                    } else {
                      return [...currentSelections, file.pathname];
                    }
                  });
                }}
              >
                <div
                  className={cn(
                    'cursor-pointer',
                    selectedFilePathnames.includes(file.pathname) &&
                      !deleteQueue.includes(file.pathname)
                      ? 'text-blue-400 dark:text-neutral-50'
                      : 'text-neutral-500',
                  )}
                >
                  {deleteQueue.includes(file.pathname) ? (
                    <div className="animate-spin">
                      <LoaderIcon />
                    </div>
                  ) : selectedFilePathnames.includes(file.pathname) ? (
                    <CheckCircledIcon />
                  ) : (
                    <UnlockKeyholeIcon />
                  )}
                </div>

                <div className="flex flex-row justify-between w-full">
                  <div className="text-sm text-neutral-400">
                    {file.pathname}
                  </div>
                </div>
              </div>

              <div
                className="text-neutral-500 hover:bg-neutral-700 hover:text-red-400 p-1 px-2 cursor-pointer rounded-md"
                onClick={async () => {
                  setDeleteQueue((currentQueue) => [
                    ...currentQueue,
                    file.pathname,
                  ]);

                  await fetch(`/api/files/delete?fileurl=${file.url}`, {
                    method: 'DELETE',
                  });

                  setDeleteQueue((currentQueue) =>
                    currentQueue.filter(
                      (filename) => filename !== file.pathname,
                    ),
                  );

                  setSelectedFilePathnames((currentSelections) =>
                    currentSelections.filter((path) => path !== file.pathname),
                  );

                  mutate(files.filter((f) => f.pathname !== file.pathname));
                }}
              >
                <TrashIcon />
              </div>
            </div>
          ))}

          {uploadQueue.map((fileName) => (
            <div
              key={fileName}
              className="flex flex-row justify-between p-2 gap-4 items-center"
            >
              <div className="text-neutral-500">
                <div className="animate-spin">
                  <LoaderIcon />
                </div>
              </div>

              <div className="flex flex-row justify-between w-full">
                <div className="text-sm text-neutral-400">{fileName}</div>
              </div>

              <div className="h-[24px] w-2" />
            </div>
          ))}
        </div>

        <div className="flex flex-row justify-between items-center">
          <div className="text-neutral-400 text-sm">
            {uploadQueue.length > 0
              ? `Uploading ${uploadQueue.length} file(s)...`
              : ''}
          </div>
          <div className="text-neutral-400 text-sm">
            {`${selectedFilePathnames.length}/${files?.length}`} Selected
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
