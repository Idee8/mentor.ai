"use client";

import type {
  Attachment,
  ChatRequestOptions,
  CreateMessage,
  Message,
} from "ai";
import type React from "react";
import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type Dispatch,
  type SetStateAction,
  type ChangeEvent,
  memo,
} from "react";
import { toast } from "sonner";
import { useLocalStorage, useWindowSize } from "usehooks-ts";

import { sanitizeUIMessages } from "@/lib/utils";

import { FileScript, Github } from "@/components/icons";
import equal from "fast-deep-equal";
import { ArrowUpIcon, StopIcon } from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";

export interface ChatFormProps {
  chatId: string;
  input?: string;
  setInput?: (value: string) => void;
  isLoading?: boolean;
  stop?: () => void;
  attachments?: Array<Attachment>;
  setAttachments?: Dispatch<SetStateAction<Array<Attachment>>>;
  messages?: Array<Message>;
  setMessages?: Dispatch<SetStateAction<Array<Message>>>;
  append?: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  handleSubmit?: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions
  ) => void;
  className?: string;
}

function PureChatForm({
  chatId,
  input = "",
  setInput = () => {},
  isLoading = false,
  stop = () => {},
  attachments = [],
  setAttachments = () => {},
  messages = [],
  setMessages = () => {},
  append = async () => null,
  handleSubmit = () => {},
  className,
}: ChatFormProps) {
  const pathname = usePathname();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();
  const [isModelMenuOpen, setIsModelMenuOpen] = useState<boolean>(false);
  const modelMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modelMenuRef.current &&
        !modelMenuRef.current.contains(event.target as Node)
      ) {
        setIsModelMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  };

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = "44px";
    }
  };

  const [localStorageInput, setLocalStorageInput] = useLocalStorage(
    "input",
    ""
  );

  useEffect(() => {
    if (textareaRef.current) {
      const domValue = textareaRef.current.value;
      // Prefer DOM value over localStorage to handle hydration
      const finalValue = domValue || localStorageInput || "";
      setInput(finalValue);
      adjustHeight();
    }
    // Only run once after hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLocalStorageInput(input);
  }, [input, setLocalStorageInput]);

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, [input]);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    adjustHeight();
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);

  const submitForm = useCallback(() => {
    // Only update the URL without full navigation
    if (pathname !== `/chat/${chatId}`) {
      window.history.pushState({}, "", `/chat/${chatId}`);
    }

    handleSubmit(undefined, {
      experimental_attachments: attachments,
    });

    setAttachments([]);
    setLocalStorageInput("");
    resetHeight();

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [
    attachments,
    handleSubmit,
    setAttachments,
    setLocalStorageInput,
    width,
    chatId,
    pathname,
  ]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const { url, pathname, contentType } = data;

        return {
          url,
          name: pathname,
          contentType: contentType,
        };
      }
      const { error } = await response.json();
      toast.error(error);
    } catch (error) {
      toast.error("Failed to upload file, please try again!");
    }
  };

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);

      setUploadQueue(files.map((file) => file.name));

      try {
        const uploadPromises = files.map((file) => uploadFile(file));
        const uploadedAttachments = await Promise.all(uploadPromises);
        const successfullyUploadedAttachments = uploadedAttachments.filter(
          (attachment) => attachment !== undefined
        );

        setAttachments((currentAttachments) => [
          ...currentAttachments,
          ...successfullyUploadedAttachments,
        ]);
      } catch (error) {
        console.error("Error uploading files!", error);
      } finally {
        setUploadQueue([]);
      }
    },
    [setAttachments]
  );

  const toggleModelMenu = () => {
    setIsModelMenuOpen(!isModelMenuOpen);
  };

  return (
    <form
      className="bottom-0 w-full text-base flex flex-col gap-2 items-center justify-center relative z-10 mt-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (input.trim()) {
          submitForm();
        }
      }}
    >
      <div className="flex flex-row gap-2 justify-center w-full relative lg:w-4/5">
        <input
          className="hidden"
          multiple
          type="file"
          name="files"
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        <div className="duration-100 relative w-full max-w-[50rem] ring-2 ring-border ring-inset overflow-hidden bg-sidebar @container/input hover:ring-card-border-focus hover:bg-input-hover focus-within:ring-1 focus-within:ring-input-border-focus hover:focus-within:ring-input-border-focus pb-12 px-2 @[480px]/input:px-3 rounded-2xl">
          <div className="relative z-10">
            <span className="absolute px-2 @[480px]/input:px-3 py-5 text-neutral-300 pointer-events-none">
              {!input && "What do you want to know?"}
            </span>
            <textarea
              dir="auto"
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              className="w-full px-2 @[480px]/input:px-3 bg-transparent focus:outline-none text-primary-foreground align-bottom min-h-14 pt-5 my-0 mb-5"
              style={{ resize: "none" }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();

                  if (isLoading) {
                    toast.error(
                      "Please wait for the model to finish its response!"
                    );
                  } else if (input.trim()) {
                    submitForm();
                  }
                }
              }}
            />
          </div>

          <div className="flex gap-1.5 absolute inset-x-0 bottom-0 border-2 border-transparent p-2 @[480px]/input:p-3 max-w-full">
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium leading-[normal] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-default [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:-mx-0.5 h-9 rounded-full py-2 relative px-2 transition-all duration-150 bg-neutral-800 border w-9 aspect-square border-toggle-border text-secondary-foreground hover:text-primary hover:bg-toggle-hover"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <FileScript className="h-5 w-5" />
            </button>

            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium leading-[normal] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-default [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:-mx-0.5 h-9 rounded-full py-2 relative px-2 transition-all duration-150 bg-neutral-800 border w-9 aspect-square border-toggle-border text-secondary-foreground hover:text-primary hover:bg-toggle-hover"
              type="button"
              disabled
            >
              <Github />
            </button>

            <div
              className="flex grow gap-1.5 max-w-full justify-end"
              style={{ transform: "none", opacity: 1 }}
            >
              <div className="flex items-center relative" ref={modelMenuRef}>
                <button
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium leading-[normal] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-default [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:-mx-0.5 text-primary hover:bg-button-ghost-hover rounded-full px-3.5 py-2 flex-row pl-3 pr-2.5 h-9 sm:px-3 border border-button-outline-border sm:border-0"
                  type="button"
                  onClick={toggleModelMenu}
                  aria-haspopup="menu"
                  aria-expanded={isModelMenuOpen}
                >
                  <span className="inline-block text-primary-foreground text-xs @[400px]/input:text-sm">
                    Gemini 2.0 Flash
                  </span>
                </button>
              </div>
            </div>

            <div className="ml-auto flex flex-row items-end gap-1">
              {isLoading ? (
                <button
                  className="group flex flex-col justify-center rounded-full focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    stop();
                    setMessages((messages) => sanitizeUIMessages(messages));
                  }}
                >
                  <div className="h-9 relative aspect-square flex flex-col items-center justify-center rounded-full ring-inset before:absolute before:inset-0 before:rounded-full before:bg-neutral-600 before:ring-0 before:transition-all duration-500 bg-neutral-700 text-secondary-foreground before:[clip-path:circle(0%_at_50%_50%)] hover:before:[clip-path:circle(100%_at_50%_50%)] hover:text-white ring-0">
                    <StopIcon className="h-5 w-5" />
                  </div>
                </button>
              ) : (
                <button
                  className="group flex flex-col justify-center rounded-full focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  type="submit"
                  disabled={!input.trim() || uploadQueue.length > 0}
                  style={{
                    opacity: input.trim() && uploadQueue.length === 0 ? 1 : 0.5,
                  }}
                >
                  <div
                    className={`h-9 relative aspect-square flex flex-col items-center justify-center rounded-full ring-inset before:absolute before:inset-0 before:rounded-full before:bg-neutral-600 before:ring-0 before:transition-all duration-500 bg-neutral-700 text-secondary-foreground before:[clip-path:circle(0%_at_50%_50%)] ${
                      input.trim() && uploadQueue.length === 0
                        ? "hover:before:[clip-path:circle(100%_at_50%_50%)] hover:text-white"
                        : ""
                    } ring-0`}
                  >
                    <ArrowUpIcon className="h-5 w-5" />
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export const ChatForm = memo(PureChatForm, (prevProps, nextProps) => {
  if (prevProps.input !== nextProps.input) return false;
  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (!equal(prevProps.attachments, nextProps.attachments)) return false;

  return true;
});
