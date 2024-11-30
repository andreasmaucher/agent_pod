import {
  TransferButtonEVM,
  TransferButtonSolana,
} from "@/components/TransferButton";

export function Form() {
  return (
    <form className="w-full space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-2">
        <textarea
          className="flex min-h-[100px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="Enter your voice prompt to convince the hosts..."
        />
      </div>

      <div className="z-10 flex min-h-30 items-center justify-center">
        <TransferButtonEVM />
        <TransferButtonSolana />
      </div>
    </form>
  );
}
