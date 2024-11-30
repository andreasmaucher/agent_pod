import { Loader2, Send } from "lucide-react";

type TProps = {
  onClick: () => Promise<void>;
  status: "idle" | "pending" | "error";
};

export const SubmitButton = ({ onClick, status }: TProps) => {
  return (
    <button
      onClick={onClick}
      disabled={status === "pending"}
      className={`
        relative
        overflow-hidden
        bg-stone-800
        text-white
        text-sm
        transition-all
        duration-500
        ease-in-out
        transform
        hover:bg-stone-900
        focus:outline-none
        focus:ring-2
        focus:ring-stone-600
        focus:ring-offset-2
        disabled:opacity-70
        h-10
        w-10
        rounded-full
      `}
    >
      <div
        className={`
          absolute
          inset-0
          flex
          items-center
          justify-center
          w-full
          transition-all
          duration-500
          ease-in-out
          transform
          ${
            status === "pending"
              ? "opacity-0 scale-75"
              : "opacity-100 scale-100"
          }
        `}
      >
        <Send className="w-5 h-5" />
      </div>

      <div
        className={`
          absolute
          inset-0
          flex
          items-center
          justify-center
          transition-all
          duration-500
          ease-in-out
          transform
          ${
            status === "pending"
              ? "opacity-100 scale-100"
              : "opacity-0 scale-75"
          }
        `}
      >
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    </button>
  );
};
