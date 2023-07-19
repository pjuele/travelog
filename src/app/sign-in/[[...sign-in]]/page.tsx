import Image from 'next/image'
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="w-screen h-screen flex items-center justify-around text-white">
        <div className="flex flex-col items-center">
            <h1>Welcome to Travelog</h1>
            <Image
                src="/icon.png"
                width={500}
                height={500}
                alt="Travelog map logo"
                />
            <p>&copy;2023 Picop Trocs | WDPJ</p>
        </div>
        <SignIn />
    </main>
  )
}