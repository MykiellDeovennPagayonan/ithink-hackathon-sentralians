"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedTheme = "light" } = useTheme();

  const toastBg =
    resolvedTheme === "dark"
      ? "bg-green-900 text-green-100 border-green-700"
      : "bg-green-200 text-green-900 border-green-400";

  return (
    <Sonner
      theme={resolvedTheme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: `
            group toast
            ${toastBg}
            border
            shadow-lg ring-1 ring-green-400/30
            backdrop-blur-md rounded-lg
            animate-[pulse_8s_ease-in-out_infinite]
          `,
          description: `
            ${resolvedTheme === "dark" ? "text-green-200" : "text-green-800"}
          `,
          actionButton: `
            ${
              resolvedTheme === "dark"
                ? "bg-green-600 text-white hover:bg-green-500"
                : "bg-green-500 text-white hover:bg-green-400"
            }
            font-bold transition-all duration-300
          `,
          cancelButton: `
            ${
              resolvedTheme === "dark"
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-200 text-black hover:bg-gray-300"
            }
            transition-all duration-300
          `,
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
