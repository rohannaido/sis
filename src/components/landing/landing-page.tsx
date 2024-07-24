export const LandingPage = () => {
  return (
    <main className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <div className="md:text-md mb-4 flex items-center rounded-full border bg-blue-50 px-4 py-2.5 font-sans text-sm font-semibold uppercase text-blue-700 shadow-md md:px-5">
          <div className="mr-2 h-5 w-5" />
          #1 sis platform
        </div>

        <h1 className="mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-center text-4xl text-transparent md:mb-4 md:text-6xl">
          Edocate
        </h1>

        <div className="w-fit px-4 pb-4 text-center text-3xl text-neutral-800 dark:text-neutral-200 md:text-6xl">
          Because school can be fun!
        </div>

        <div className="mx-auto mt-4 max-w-sm px-2 text-center text-sm text-neutral-400 dark:text-neutral-500 md:max-w-2xl md:text-xl">
          A Platform to make your school life fun!
        </div>
      </div>
    </main>
  );
};
