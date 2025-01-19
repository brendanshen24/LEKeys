import Image from "next/image";

export default function Home() {
  return (
      <div className="flex flex-col items-center justify-between min-h-screen bg-neutral-900 p-4">
          <div className="relative w-full aspect-[3/4] max-w-sm min-h-screen bg-white">
              <div>
                  <header className="text-black p-5 flex justify-center items-center">
                      hello world
                  </header>
              </div>
          </div>
      </div>
  );
}
