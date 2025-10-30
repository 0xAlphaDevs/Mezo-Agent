"use client";

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Bitcoin, Bot, Wallet, Github, CheckCircle2, Clock, ArrowUp, ArrowUpRight } from "lucide-react";
import Link from "next/link"
import Image from "next/image";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)

  // Parallax effect for hero section
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return
      const scrollY = window.scrollY
      const heroElement = heroRef.current
      const heroHeight = heroElement.offsetHeight
      const parallaxElements = heroElement.querySelectorAll(".parallax")

      parallaxElements.forEach((el, index) => {
        const element = el as HTMLElement
        const speed = index * 0.2 + 0.5
        const yPos = (-(scrollY * speed) / heroHeight) * 100
        element.style.transform = `translate3d(0, ${yPos}px, 0)`
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  return (
    <div className="bg-black text-white min-h-screen">

      {/* Hero Section */}

      <section ref={heroRef} className="px-4 pt-16 pb-24 md:pt-32 md:pb-32 relative overflow-hidden lg:h-screen">
        {/* Animated background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-900/30 to-transparent parallax" />
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-emerald-600/20 blur-3xl parallax" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-emerald-600/20 blur-3xl parallax" />

          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxMGI5ODEiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djI2aDI0di0yNkgzNnpNMCAzNHYyNmgyNHYtMjZIMHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30 parallax" />

          {/* Animated dots */}
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-emerald-500/30"
                style={{
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10 md:pt-16">

          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Mezo{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
                Agent
              </span>
            </h1>

            <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 to-emerald-700 mx-auto rounded-full"></div>
          </div>

          <p className="text-lg text-gray-300 md:text-xl max-w-2xl mx-auto leading-relaxed">
            An AI agent that uses chain signatures to interact with Bitcoin L1 and Mezo.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row justify-center pt-4">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-xl font-bold group relative overflow-hidden"
              onClick={() => window.open("https://bitte.ai/agents/", "_blank")}
            >
              <span className="relative z-10 flex items-center">
                Launch Agent
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-700 group-hover:opacity-0 transition-opacity"></span>
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-emerald-800 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-emerald-600 text-emerald-500 hover:bg-emerald-950 hover:text-white text-xl font-bold"
              asChild
            >
              <Link href="/dashboard">
                <span className="flex items-center">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Floating Bitcoin icon */}
        <div className="absolute bottom-10 right-10 md:bottom-20 md:right-20 opacity-20 hidden md:block">
          <Bitcoin className="w-24 h-24 text-emerald-500" />
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 md:py-24 border-t border-emerald-900/50 bg-black/80">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Key Features</h2>
          <p className="text-emerald-400 text-center mb-12 max-w-2xl mx-auto">
            Powerful tools to revolutionize your Bitcoin experience
          </p>

          <div className="grid gap-8 md:grid-cols-3 px-4 md:px-8">
            <Card className="border-emerald-900/50 bg-black/60 backdrop-blur-sm hover:border-emerald-700/70 transition-all duration-300">
              <CardContent className="pt-6">
                <div className="rounded-full bg-emerald-900/30 w-12 h-12 flex items-center justify-center mb-6">
                  <Wallet className="h-6 w-6 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Chain Signatures</h3>
                <p className="text-gray-400">
                  Create and sign Bitcoin transactions using chain signatures.
                </p>
              </CardContent>
            </Card>

            <Card className="border-emerald-900/50 bg-black/60 backdrop-blur-sm hover:border-emerald-700/70 transition-all duration-300">
              <CardContent className="pt-6">
                <div className="rounded-full bg-emerald-900/30 w-12 h-12 flex items-center justify-center mb-6">
                  <Bitcoin className="h-6 w-6 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Create BTC Transaction</h3>
                <p className="text-gray-400">
                  Generate BTC transactions with this agent and send them directly to Bitcoin mainnet.
                </p>
              </CardContent>
            </Card>

            <Card className="border-emerald-900/50 bg-black/60 backdrop-blur-sm hover:border-emerald-700/70 transition-all duration-300">
              <CardContent className="pt-6">
                <div className="rounded-full bg-emerald-900/30 w-12 h-12 flex items-center justify-center mb-6">
                  <Bot className="h-6 w-6 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Bitte AI Agent</h3>
                <p className="text-gray-400">
                  An advanced AI agent running on NEAR mainnet powered by Bitte.ai runtime.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* Roadmap Section */}


      {/* Footer */}
      <footer className="border-t border-emerald-900/50 py-8 bg-black">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between gap-8">
            {/* Logo and Copyright */}
            <div className="flex flex-col">
              <h3 className="text-xl font-bold mb-4">
                Mezo <span className="text-emerald-500">Agent</span>
              </h3>
              <a href="https://www.alphadevs.dev/" target="_blank" rel="noreferrer" className="text-gray-400 text-sm">
                © Team AlphaDevs
              </a>

            </div>

            {/* Social Links */}
            <div className="flex flex-col">
              <h3 className="text-lg font-bold mb-4">Connect With Us</h3>
              <div className="flex gap-4">
                <Link
                  href="https://x.com/0xAlphaDevs"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-emerald-500 transition-colors"
                >
                  <Image src="/x.png" alt="X" width={26} height={26} />
                </Link>
                <Link
                  href="https://github.com/0xAlphaDevs"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-400 hover:text-emerald-500 transition-colors"
                >
                  <Github className="h-5 w-5 " />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div >
  );
}
