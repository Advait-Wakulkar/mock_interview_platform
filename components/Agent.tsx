"use client"

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils' // Utility for conditional class names
import { vapi } from '@/lib/vapi.sdk'

enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED"
}

interface AgentProps {
    userName: string;
}

const Agent = ({ userName }: AgentProps) => {
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [messages, setMessages] = useState<string[]>([])

    const lastMessage = messages[messages.length - 1]

    const startCall = async () => {
        try {
            setCallStatus(CallStatus.CONNECTING)
            await vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || undefined)
        } catch (error) {
            console.error(error)
            setCallStatus(CallStatus.INACTIVE)
        }
    }

    const endCall = () => {
        vapi.stop()
        setCallStatus(CallStatus.FINISHED)
    }

    useEffect(() => {
        const handleCallStart = () => setCallStatus(CallStatus.ACTIVE)
        const handleCallEnd = () => setCallStatus(CallStatus.FINISHED)
        const handleSpeechStart = () => setIsSpeaking(true)
        const handleSpeechEnd = () => setIsSpeaking(false)
        const handleMessage = (message: Message) => {
            if (
                message.type === 'transcript' &&
                message.transcriptType === 'final'
            ) {
                setMessages((prev) => [...prev, message.transcript])
            }
            if (message.type === 'function-call') {
                // Handle function-call messages if needed
            }
        }

        vapi.on('call-start', handleCallStart)
        vapi.on('call-end', handleCallEnd)
        vapi.on('speech-start', handleSpeechStart)
        vapi.on('speech-end', handleSpeechEnd)
        vapi.on('message', handleMessage)

        return () => {
            vapi.removeListener('call-start', handleCallStart)
            vapi.removeListener('call-end', handleCallEnd)
            vapi.removeListener('speech-start', handleSpeechStart)
            vapi.removeListener('speech-end', handleSpeechEnd)
            vapi.removeListener('message', handleMessage)
        }
    }, [])
    
    return (
        <>
            <div className='call-view'>
                <div className='card-interviewer'>
                    <div className='avatar'>
                        <Image 
                            src="/ai-avatar.png" 
                            alt="vapi" 
                            width={65} 
                            height={54} 
                            className='object-cover'
                        ></Image>
                        {isSpeaking && <span className='animate-speak'></span>}
                    </div>
                    <h3>AI Interviewer</h3>
                </div>
                <div className='card-border'>
                    <div className='card-content'>
                        <Image 
                            src="/user-avatar.png" 
                            alt="user avatar" 
                            width={540} 
                            height={540} 
                            className='rounded-full object-cover size-[120px]'
                        ></Image>
                        <h3>{userName}</h3>
                    </div>
                </div>
            </div>

            <div>
                {messages.length > 0 && (
                    <div className='transcript-border'>
                        <p key={lastMessage} className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')}>
                            {lastMessage}
                        </p>
                        </div>
                )}
            </div>
            <div className='w-full flex justify-center'>
                {callStatus !== CallStatus.ACTIVE ? (
                    <button onClick={startCall} className='relative'>
                        <span
                            className={cn(
                                'absolute animate-ping rounded-full opacity-75',
                                callStatus !== CallStatus.CONNECTING && 'hidden',
                            )}
                        ></span>
                        <span>
                            {callStatus === CallStatus.INACTIVE ||
                            callStatus === CallStatus.FINISHED
                                ? 'CALL'
                                : '...'}
                        </span>
                    </button>
                ) : (
                    <button onClick={endCall} className='relative btn-call'>
                        End
                    </button>
                )}
            </div>
        </>
    )
}

export default Agent
