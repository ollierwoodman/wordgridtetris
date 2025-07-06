export const About = () => {
  return (
    <div className="space-y-4 text-gray-800 dark:text-gray-300">
      <div>
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
      </div>
      <div>
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
      <div>
        <h3 className="text-lg font-bold dark:text-gray-200">Support</h3>
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
