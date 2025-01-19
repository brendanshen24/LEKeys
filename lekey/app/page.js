'use client'
import Image from "next/image";
import { redirect } from 'next/navigation'

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 p-4 min-h-screen">
            <div
                className="relative w-full max-w-sm bg-white flex flex-col items-center justify-center p-4 rounded-lg shadow-lg">
                <div className="w-full p-4">
                    <div className="flex justify-end items-end">
                        <Image
                            src="/logo.svg"
                            alt="logo"
                            width={44}
                            height={44}
                            className="rounded-full mb-4 block"
                        />
                    </div>

                    <div className="flex flex-col justify-start items-start gap-2 mb-5">
                        <h2 className="text-[17.226px] font-[510] leading-[0.875] text-brandgrey">
                            Welcome Back,
                        </h2>
                        <div className="flex flex-row items-end gap-0.5">
                            <h1 className="text-brandprimary text-[34.453px] leading-[0.875]">
                                Matthew
                            </h1>
                            <div className="w-2 h-2 bg-brandgreen rounded-full self-end"/>
                        </div>
                    </div>

                    <div className="flex flex-row items-center gap-0.5">
                        <div className="text-brandgrey text-xs">
                            Skill Building Activities
                        </div>
                        <div className="flex-1 h-px bg-[#aeaeae]"></div>
                    </div>


                    <div
                        className="flex flex-col justify-center items-center min-w-80 min-h-72 bg-[#f8f8f8] rounded-2xl border border-[#eaeaea] gap-5 overflow-hidden mt-3">
                        <div className="flex flex-col justify-center items-center">
                            <div className="text-brandgreen text-xs">
                                Checkpoint 1
                            </div>
                            <div className="text-lg font-bold text-brandprimary">
                                C Major Scale
                            </div>
                        </div>
                        <div className="flex">
                            <Image
                                src="/piano.svg"
                                alt="piano"
                                width={181.467}
                                height={49.544}
                            />
                        </div>
                        <div className="text-center text-black text-xs font-normal w-56">
                            Practice the most basic chord in piano and unlock new Checkpoints!
                        </div>
                        <button className="pt-3 pb-3 pl-5 pr-5 bg-brandprimary rounded-lg border border-black">
                            Get Started
                        </button>
                    </div>

                    <div className="flex flex-row items-center gap-0.5 mt-5">
                        <div className="text-brandgrey text-xs">
                            Songs
                        </div>
                        <div className="flex-1 h-px bg-[#aeaeae]"></div>
                    </div>

                    <div
                        className="flex flex-col justify-center items-center min-w-80 min-h-72 bg-[#f8f8f8] rounded-2xl border border-[#eaeaea] gap-5 overflow-hidden mt-4">
                        <div className="flex flex-col justify-center items-center">
                            <div className="text-brandgreen text-xs">
                                Easy
                            </div>
                            <div className="text-lg font-bold text-brandprimary">
                                Mary Has a Little Lamb
                            </div>
                        </div>
                        <div className="flex">
                            <Image
                                src="/sheep.svg"
                                alt="sheep"
                                width={181.467}
                                height={49.544}
                            />
                        </div>
                        <button className="pt-3 pb-3 pl-6 pr-6 bg-brandprimary rounded-lg border border-black">
                            Learn
                        </button>
                    </div>

                    <div
                        className="flex flex-col justify-center items-center min-w-80 min-h-72 bg-[#f8f8f8] rounded-2xl border border-[#eaeaea] gap-5 overflow-hidden mt-6">
                        <div className="flex flex-col justify-center items-center">
                            <div className="text-brandgreen text-xs">
                                Medium
                            </div>
                            <div className="text-lg font-bold text-brandprimary text-center justify-center w-40">
                                Twinkle Twinkle Little Star
                            </div>
                        </div>
                        <div className="flex">
                            <Image
                                src="/star.svg"
                                alt="star"
                                width={181.467}
                                height={49.544}
                            />
                        </div>
                        <button className="pt-3 pb-3 pl-6 pr-6 bg-brandprimary rounded-lg border border-black">
                            Learn
                        </button>
                    </div>

                    <div className="flex flex-col justify-center items-center min-w-80 min-h-72 bg-[#f8f8f8] rounded-2xl border border-[#eaeaea] gap-5 overflow-hidden mt-6">
                        <div className="flex flex-col justify-center items-center">
                            <div className="text-brandgreen text-xs">
                                Hard
                            </div>
                            <div className="text-lg font-bold text-brandprimary text-center justify-center w-40">
                                Married Life
                            </div>
                        </div>
                        <div className="flex">
                            <Image
                                src="/star.svg"
                                alt="star"
                                width={181.467}
                                height={49.544}
                            />
                        </div>
                        <div className="flex gap-4">
                            <button className="p-3 bg-secondgreen rounded-lg border border-black flex flex-row gap-2">
                                <Image src="/circlearrow.svg" alt="circlearrow" width={19} height={19} className="mt-1" />
                                <div className="text-brandsecondary">
                                    Review
                                </div>
                            </button>
                            <button className="pt-3 pb-3 pl-5 pr-5 bg-brandprimary rounded-lg border border-black">
                                Play Along
                            </button>
                        </div>
                    </div>

                    {/* Button Section */}
                    {/*<div className="flex flex-col gap-6 mt-4">*/}
                    {/*    <button*/}
                    {/*        className="text-black p-5 flex justify-center items-center bg-gray-200 rounded-lg hover:bg-gray-300 transition"*/}
                    {/*        onClick={callDemo}*/}
                    {/*    >*/}
                    {/*        Play Demo*/}
                    {/*    </button>*/}
                    {/*    <button*/}
                    {/*        className="text-black p-5 flex justify-center items-center bg-gray-200 rounded-lg hover:bg-gray-300 transition"*/}
                    {/*        onClick={callUserInteractive}*/}
                    {/*    >*/}
                    {/*        User Play Along*/}
                    {/*    </button>*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>

    );
}
