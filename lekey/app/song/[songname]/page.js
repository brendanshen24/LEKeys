"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function SongPlayer({ params }) {
    const [songname, setSongname] = useState("");

    useEffect(() => {
        async function unwrapParams() {
            const resolvedParams = await params;
            setSongname(resolvedParams.songname);
        }
        unwrapParams();
    }, [params]);

    const [progress, setProgress] = useState(1);

    const handleIncrease = () => {
        setProgress((prev) => (prev < 8 ? prev + 1 : prev));
    };

    const callDemo = async () => {
        try {
            const response = await fetch('http://localhost:3001/rundemo', {
                method: 'GET',
            });
        } catch (error) {
            console.error("Error making get request:", error);
        }
    };

    const callUserInteractive = async () => {
        try {
            const response = await fetch('http://localhost:3001/runuserinteractive', {
                method: 'GET',
            });
        } catch (error) {
            console.error("Error making get request:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 p-4">
            <div className="min-h-screen w-full max-w-sm bg-white flex flex-col items-center p-4 rounded-lg shadow-lg">
                <div className="w-full p-4">
                    <div className="flex justify-between items-end">
                        <button>
                            <Image
                                src="/backicon.svg"
                                alt="back"
                                width={50}
                                height={50}
                                className="mb-4 block"
                            />
                        </button>

                        <Image
                            src="/logo.svg"
                            alt="logo"
                            width={44}
                            height={44}
                            className="rounded-full mb-4 block"
                        />
                    </div>

                    <div
                        className="flex flex-col justify-center items-center min-w-80 min-h-96 bg-[#f8f8f8] rounded-2xl border border-[#eaeaea] pt-10 pb-10 pr-5 pl-5 gap-5 overflow-hidden mt-6">
                        <div className="flex flex-col justify-center items-center">
                            <div className="text-brandgreen text-xs">
                                Step 1
                            </div>
                            <div className="text-lg font-bold text-brandprimary text-center justify-center w-40">
                                Listen and Watch
                            </div>
                        </div>
                        <div className="flex">
                            <Image
                                src="/pianogif.gif"
                                alt="piano"
                                width={181.467}
                                height={49.544}
                            />
                        </div>
                        <div className="text-center text-black text-xs font-normal w-56">
                            Look at your keyboard and watch the demo of this track. Pay attention to the rhythm, beats,
                            and overall composition.
                        </div>
                        <button className="pt-3 pb-3 pl-6 pr-6 bg-brandprimary rounded-lg border border-black">
                            Start
                        </button>
                    </div>


                    <div
                        className="flex flex-col justify-center items-center min-w-80 min-h-96 bg-[#f8f8f8] rounded-2xl border border-[#eaeaea] pt-10 pb-10 pr-5 pl-5 gap-5 overflow-hidden mt-6">
                        <div className="flex">
                            <Image
                                src="/eyes.gif"
                                alt="eyes"
                                width={181.467}
                                height={49.544}
                            />
                        </div>

                        <div className="flex flex-col justify-center items-center gap-3">
                            <div className="text-center text-black text-xs font-normal w-56">
                                Look at your piano
                            </div>
                            <Image
                                src="/downarrrow.svg"
                                alt="down"
                                width={10}
                                height={10}
                            />
                        </div>

                    </div>


                    <div
                        className="flex flex-col justify-center items-center min-w-80 min-h-96 bg-[#f8f8f8] rounded-2xl border border-[#eaeaea] pt-10 pb-10 pr-5 pl-5 gap-5 overflow-hidden mt-6">
                        <div className="flex flex-col justify-center items-center">
                            <div className="text-brandgreen text-xs">
                                Step 1 Completed
                            </div>
                            <div className="text-lg font-bold text-brandprimary text-center justify-center w-40">
                                Awesome Job!
                            </div>
                        </div>
                        <div className="flex">
                            <Image
                                src="/eyes.gif"
                                alt="eyes"
                                width={181.467}
                                height={49.544}
                            />
                        </div>
                        <div className="flex gap-4">
                            <button className="p-3 bg-secondgreen rounded-lg border border-black flex flex-row gap-2">
                                <Image src="/circlearrow.svg" alt="circlearrow" width={19} height={19}
                                       className="mt-1"/>
                                <div className="text-brandsecondary">
                                    Watch Again
                                </div>
                            </button>
                            <button className="pt-3 pb-3 pl-5 pr-5 bg-brandprimary rounded-lg border border-black">
                                Next Step
                            </button>
                        </div>
                    </div>

                    <div
                        className="flex flex-col justify-center items-center min-w-80 min-h-96 bg-[#f8f8f8] rounded-2xl border border-[#eaeaea] pt-10 pb-10 pr-5 pl-5 gap-5 overflow-hidden mt-6">
                        <div className="flex flex-col justify-center items-center">
                            <div className="text-brandgreen text-xs">
                                Step 2
                            </div>
                            <div className="text-lg font-bold text-brandprimary text-center justify-center w-40">
                                Play Along
                            </div>
                        </div>
                        <div className="flex">
                            <Image
                                src="/movingpiano.gif"
                                alt="moving piano"
                                width={181.467}
                                height={49.544}
                            />
                        </div>
                        <div className="text-center text-black text-xs font-normal w-56">
                            Now it is your turn! Look at your keyboard and play along where the keys light up. Pause and
                            go at your own pace.
                        </div>
                        <button className="pt-3 pb-3 pl-6 pr-6 bg-brandprimary rounded-lg border border-black">
                            Start
                        </button>
                    </div>

                    <div
                        className="flex flex-col justify-center items-center min-w-80 min-h-96 bg-[#f8f8f8] rounded-2xl border border-[#eaeaea] pt-10 pb-10 pr-5 pl-5 gap-5 overflow-hidden mt-6">
                        <div className="flex">
                            <Image
                                src="/eyes.gif"
                                alt="eyes"
                                width={181.467}
                                height={49.544}
                            />
                        </div>

                        <div className="flex flex-col justify-center items-center gap-3">
                            <div className="text-center text-black text-xs font-normal w-56">
                                Look at your piano
                            </div>
                            <Image
                                src="/downarrrow.svg"
                                alt="down"
                                width={10}
                                height={10}
                            />
                        </div>

                    </div>

                    <div
                        className="flex flex-col justify-center items-center min-w-80 min-h-96 bg-[#f8f8f8] rounded-2xl border border-[#eaeaea] pt-10 pb-10 pr-5 pl-5 gap-5 overflow-hidden mt-6">
                        <div className="flex flex-col justify-center items-center">
                            <div className="text-brandgreen text-xs">
                                Step 2 Completed
                            </div>
                            <div className="text-lg font-bold text-brandprimary text-center justify-center w-40">
                                You're Doing Great!
                            </div>
                        </div>
                        <div className="flex">
                            <Image
                                src="/eyes.gif"
                                alt="eyes"
                                width={181.467}
                                height={49.544}
                            />
                        </div>
                        <div className="flex gap-4">
                            <button className="p-3 bg-secondgreen rounded-lg border border-black flex flex-row gap-2">
                                <Image src="/circlearrow.svg" alt="circlearrow" width={19} height={19} className="mt-1"/>
                                <div className="text-brandsecondary">
                                    Watch Again
                                </div>
                            </button>
                            <button className="pt-3 pb-3 pl-5 pr-5 bg-brandprimary rounded-lg border border-black">
                                Next Step
                            </button>
                        </div>
                    </div>

                    <div
                        className="flex flex-col justify-center items-center min-w-80 min-h-96 bg-[#f8f8f8] rounded-2xl border border-[#eaeaea] pt-10 pb-10 pr-5 pl-5 gap-5 overflow-hidden mt-6">
                        <div className="flex flex-col justify-center items-center">
                            <div className="text-brandgreen text-xs">
                                Step 3
                            </div>
                            <div className="text-lg font-bold text-brandprimary text-center justify-center w-40">
                                Show Us What You Know
                            </div>
                        </div>
                        <div className="flex">
                            <Image
                                src="/movingpiano.gif"
                                alt="moving piano"
                                width={181.467}
                                height={49.544}
                            />
                        </div>
                        <div className="text-center text-black text-xs font-normal w-56">
                            Based on what you learned, try your best to play the song. It’s okay to make mistakes, you
                            can always check back again with the guided playthrough.
                        </div>
                        <button className="pt-3 pb-3 pl-6 pr-6 bg-brandprimary rounded-lg border border-black">
                            Start
                        </button>
                    </div>

                    <div
                        className="flex flex-col justify-center items-center min-w-80 min-h-96 bg-[#f8f8f8] rounded-2xl border border-[#eaeaea] pt-10 pb-10 pr-5 pl-5 gap-5 overflow-hidden mt-6">

                        <div className="flex gap-4">
                            <button className="p-3 bg-secondgreen rounded-lg border border-black flex flex-row gap-2">
                                <Image src="/circlearrow.svg" alt="circlearrow" width={19} height={19}
                                       className="mt-1"/>
                                <div className="text-brandsecondary">
                                    Watch Again
                                </div>
                            </button>
                            <button className="pt-3 pb-3 pl-5 pr-5 bg-brandprimary rounded-lg border border-black text-xs">
                                Next Step
                            </button>
                        </div>

                        <div className="flex">
                            <Image
                                src="/eyes.gif"
                                alt="eyes"
                                width={181.467}
                                height={49.544}
                            />
                        </div>

                        <div className="flex flex-col justify-center items-center gap-3">
                            <div className="text-center text-black text-xs font-normal w-56">
                                Look at your piano
                            </div>
                            <Image
                                src="/downarrrow.svg"
                                alt="down"
                                width={10}
                                height={10}
                            />
                        </div>

                    </div>


                    <div className="flex flex-col items-center space-y-4 mt-40">
                        <div
                            className="flex items-center w-[346px] h-8 border border-[#EAEAEA] rounded-lg overflow-hidden">
                            {[...Array(8)].map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-full flex-1 ${
                                        index === 0
                                            ? 'rounded-l-lg' // Round the first block on the left
                                            : index === 7
                                                ? 'rounded-r-lg' // Round the last block on the right
                                                : ''
                                    } ${index < progress ? 'bg-brandgreen' : 'bg-gray-300'} transition-all duration-300 border-r ${
                                        index < 7 ? 'border-[#EAEAEA]' : 'border-transparent'
                                    }`}
                                ></div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
