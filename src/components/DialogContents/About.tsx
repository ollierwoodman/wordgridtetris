export const About = () => {
  return (
    <div className="space-y-4 text-gray-800 dark:text-gray-300">
      <div className="space-y-2">
        <h3 className="text-lg font-bold dark:text-gray-200">Author</h3>
        <p>
          This game was created with ❤️ by{" "}
          <a
            href="https://card.ollierwoodman.com/en"
            className="underline hover:opacity-80"
          >
            Ollie
          </a>
        </p>
        <p>
          You can support me via the link below:
        </p>
        <a href="https://www.buymeacoffee.com/ooodman" className="flex items-center justify-center bg-purple-500 text-lg text-white font-bold px-4 py-2 gap-4 rounded-full shadow-lg hover:opacity-80">Buy me a boba tea <span className="text-2xl bg-white rounded-full rotate-12 p-1">🧋</span></a>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-bold dark:text-gray-200">Code</h3>
        <p>
          You can find the source code for this game on{" "}
          <a
            href="https://github.com/ollierwoodman/wordgridtetris"
            className="underline hover:opacity-80"
          >
            GitHub
          </a>
        </p>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-bold dark:text-gray-200">Report an issue</h3>
        <p>
          To report a problem or suggest a feature, submit an issue on{" "}
          <a
            href="https://github.com/ollierwoodman/wordgridtetris/issues"
            className="underline hover:opacity-80"
          >
            GitHub
          </a>
        </p>
      </div>
    </div>
  );
};
