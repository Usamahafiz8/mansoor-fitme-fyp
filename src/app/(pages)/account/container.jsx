import clsx from "clsx";

export default function Container({ children, heading, type }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {heading && (
        <h1 className="text-3xl font-extrabold text-gray-900 my-4">
          {heading}
        </h1>
      )}
      <div
        className={clsx(
          "bg-white rounded-lg shadow-md",
          type === "page" && "p-6"
        )}>
        {children}
      </div>
    </div>
  );
}
