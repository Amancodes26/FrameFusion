"use client"
import React from 'react'
// import Image from 'next/image'
import { Github, Mail, Globe } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AboutPage() {
  return (
    <div className="min-h-screen py-16 px-4 bg-gradient-to-b from-gray-900 to-black">
      {/* Developer Profile Section */}
      <div className="max-w-6xl mx-auto">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {/* <Image
                src="https://avatars.githubusercontent.com/u/155221533?v=4"
                alt="Aman Singh"
                width={150}
                height={150}
                className="rounded-full border-4 border-blue-500"
              /> */}
            </div>
            <CardTitle className="text-3xl font-bold text-white mb-2">
              Aman Singh
            </CardTitle>
            <CardDescription className="text-gray-400 text-lg">
              Full Stack Developer | Open Source Enthusiast
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-4 mb-6">
              <Link href="https://github.com/Amancodes26" target="_blank"
                className="flex items-center gap-2 text-gray-300 hover:text-blue-500 transition">
                <Github /> GitHub
              </Link>
              <Link href="https://cal.com/devaman26" target="_blank"
                className="flex items-center gap-2 text-gray-300 hover:text-blue-500 transition">
                <Mail /> Contact
              </Link>
              <Link href="https://portfolio-amancodes26s-projects.vercel.app/" target="_blank"
                className="flex items-center gap-2 text-gray-300 hover:text-blue-500 transition">
                <Globe /> Portfolio
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* FrameFusion Project Info */}
        <div className="mt-16">
          <h2 className="text-4xl font-bold text-center text-white mb-8">
            About FrameFusion
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl text-white">
                  What is FrameFusion?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                <p>
                  FrameFusion is an advanced AI-powered image processing platform that 
                  combines cutting-edge artificial intelligence with intuitive design. 
                  It offers powerful tools for image enhancement, restoration, and transformation,
                  making professional-grade image processing accessible to everyone.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl text-white">
                  Key Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-300">
                  <li>• AI-Powered Image Enhancement</li>
                  <li>• Smart Object Removal</li>
                  <li>• Background Transformation</li>
                  <li>• Advanced Color Correction</li>
                  <li>• Real-time Processing</li>
                  <li>• Cloud Storage Integration</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 md:col-span-2">
              <CardHeader>
                <CardTitle className="text-2xl text-white">
                  Technology Stack
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-300">
                  <div className="flex flex-col items-center">
                    <span className="font-semibold">Frontend</span>
                    <span>Next.js 13, React, TypeScript</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-semibold">Styling</span>
                    <span>Tailwind CSS, Shadcn/ui</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-semibold">Backend</span>
                    <span>Node.js, Prisma</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-semibold">Mobile Dev</span>
                    <span>React Native</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
