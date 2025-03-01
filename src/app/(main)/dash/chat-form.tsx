'use client';
import React, {
  useState,
  useRef,
  useEffect,
  type FormEvent,
  type ChangeEvent,
} from 'react';

import { FileScript, Github } from '@/components/icons';

interface ChatFormProps {
  onSubmit?: (message: string, options: ChatOptions) => void;
}

interface ChatOptions {
  deepSearch: boolean;
  think: boolean;
  model: string;
}

export const ChatForm: React.FC<ChatFormProps> = () => {
  const [message, setMessage] = useState<string>('');
  const [isModelMenuOpen, setIsModelMenuOpen] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modelMenuRef = useRef<HTMLDivElement>(null);

  // Close the model menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modelMenuRef.current &&
        !modelMenuRef.current.contains(event.target as Node)
      ) {
        setIsModelMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Adjust textarea height on input
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '44px';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim()) {
      // Call the onSubmit callback if provided

      // Reset the form
      setMessage('');
    }
  };

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    // Handle file upload logic here
    console.log('Files selected:', files);
  };

  const toggleModelMenu = () => {
    setIsModelMenuOpen(!isModelMenuOpen);
  };

  return (
    <form
      className="bottom-0 w-full text-base flex flex-col gap-2 items-center justify-center relative z-10 mt-2"
      onSubmit={handleSubmit}
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
              {!message && 'What do you want to know?'}
            </span>
            <textarea
              dir="auto"
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              className="w-full px-2 @[480px]/input:px-3 bg-transparent focus:outline-none text-primary-foreground align-bottom min-h-14 pt-5 my-0 mb-5"
              style={{ resize: 'none' }}
            />
          </div>

          <div className="flex gap-1.5 absolute inset-x-0 bottom-0 border-2 border-transparent p-2 @[480px]/input:p-3 max-w-full">
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium leading-[normal] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-default [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:-mx-0.5 h-9 rounded-full py-2 relative px-2 transition-all duration-150 bg-neutral-800 border w-9 aspect-square border-toggle-border text-secondary-foreground hover:text-primary hover:bg-toggle-hover"
              type="button"
              onClick={handleFileButtonClick}
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
              style={{ transform: 'none', opacity: 1 }}
            >
              {/* TODO: Model selector */}
              <div className="flex items-center relative" ref={modelMenuRef}>
                <button
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium leading-[normal] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-default [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:-mx-0.5 text-primary hover:bg-button-ghost-hover rounded-full px-3.5 py-2 flex-row pl-3 pr-2.5 h-9 sm:px-3 border border-button-outline-border sm:border-0"
                  type="button"
                  onClick={toggleModelMenu}
                  aria-haspopup="menu"
                  aria-expanded={isModelMenuOpen}
                >
                  <span className="inline-block text-primary-foreground text-xs @[400px]/input:text-sm">
                    Gemini 2.0
                  </span>
                </button>

                {/* TODO: Modal Selector here */}
              </div>
            </div>

            {/* Submit button */}
            <div className="ml-auto flex flex-row items-end gap-1">
              <button
                className="group flex flex-col justify-center rounded-full focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                type="submit"
                disabled={!message.trim()}
                style={{ opacity: message.trim() ? 1 : 0.5 }}
              >
                <div
                  className={`h-9 relative aspect-square flex flex-col items-center justify-center rounded-full ring-inset before:absolute before:inset-0 before:rounded-full before:bg-neutral-600 before:ring-0 before:transition-all duration-500 bg-neutral-700 text-secondary-foreground before:[clip-path:circle(0%_at_50%_50%)] ${message.trim() ? 'hover:before:[clip-path:circle(100%_at_50%_50%)] hover:text-white' : ''} ring-0`}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-[2] relative"
                  >
                    <path
                      d="M5 11L12 4M12 4L19 11M12 4V21"
                      stroke="currentColor"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
