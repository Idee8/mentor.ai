import { NotebookText, Telescope } from 'lucide-react';

export function Features() {
  return (
    <div
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 my-8"
      id="features"
    >
      <div className="flex flex-col items-center gap-4 mb-6">
        <p className="uppercase text-primary">Powerful features</p>
        <h2 className="sm:text-5xl text-4xl font-serif text-balance text-center">
          Document, Understand, and Explore
        </h2>
        <p className="sm:text-xl text-lg text-center">
          Features built to enhance your understanding and coding capabilities
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 sm:px-10 px-3 py-10">
        <div className="border border-border p-4 space-y-2 rounded-md">
          <Telescope className="h-10 w-10 text-primary/80" />
          <p className="font-serif text-2xl font-medium">Understand</p>
          <p className="text-base">
            Connect to repositories on Github and Mentor will provide you with
            clear explanations and teachings about code functionality. It
            analyzes repositories, suggests improvements, and teaches coding
            concepts
          </p>
        </div>
        <div className="border border-border p-4 space-y-2 rounded-md">
          <NotebookText className="h-10 w-10 text-primary/80" />
          <p className="font-serif text-2xl font-medium">Document</p>
          <p className="text-base">
            Documents your findings when enabled, and enhances team
            collaboration through sharing of the docs with the whole team.Get
            meaningful comments for complex code sections, project overviews,
            and usage instructions.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 sm:px-10 px-3">
        <div className="p-4 space-y-2">
          <p className="font-serif text-2xl font-medium">
            Chat to Your Codebase
          </p>
          <p className="text-base text-muted-foreground">
            Quickly understand and explore your codebase with our AI chat
            assistant
          </p>
        </div>
        <div className="p-4 space-y-2">
          <p className="font-serif text-2xl font-medium">
            Multilangual Support
          </p>
          <p className="text-base text-muted-foreground">
            Mentor can understand more than 30 popular programming languages
          </p>
        </div>
        <div className="p-4 space-y-2 border-t border-border">
          <p className="font-serif text-2xl font-medium">
            Reference Management
          </p>
          <p className="text-base text-muted-foreground">
            Save and manage learnings in your library. Easily reference learning
            in any codebase, fast and easy.
          </p>
        </div>
        <div className="p-4 space-y-2 border-t border-border">
          <p className="font-serif text-2xl font-medium">Dark mode</p>
          <p className="text-base text-muted-foreground">
            Conducting late night research? Full dark mode support helps reduce
            eye strain
          </p>
        </div>
      </div>
    </div>
  );
}
