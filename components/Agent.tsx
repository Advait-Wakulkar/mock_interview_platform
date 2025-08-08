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
    const isSpeaking = true
    const messages = ["What's Your Name",
        "My name is John Doe, nice to meet you."
    ]
    const lastMessage = messages[messages.length - 1]

    useEffect(() => {
        const handleCallStart = () => setCallStatus(CallStatus.ACTIVE)
        const handleCallEnd = () => setCallStatus(CallStatus.FINISHED)

        vapi.on('call-start', handleCallStart)
        vapi.on('call-end', handleCallEnd)

        return () => {
            vapi.removeListener('call-start', handleCallStart)
            vapi.removeListener('call-end', handleCallEnd)
        }
    }, [])

    const handleCallToggle = async () => {
        if (callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED) {
            setCallStatus(CallStatus.CONNECTING)
            try {
                await vapi.start()
            } catch (error) {
                console.error(error)
                setCallStatus(CallStatus.INACTIVE)
            }
        } else if (callStatus === CallStatus.ACTIVE) {
            vapi.stop()
            setCallStatus(CallStatus.FINISHED)
        }
    }
    
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
                    <button className='relative' onClick={handleCallToggle}>
                        <span className={cn('absolute animate-ping rounded-full opacity-75',
                            callStatus !== "CONNECTING" && 'hidden'
                        )}>
                        </span>
                        <span>
                            {callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED ? "CALL" : "..."}
                        </span>
                    </button>
                ) : (
                    <button className='relative btn-call' onClick={handleCallToggle}>
                        End
                    </button>
                )}
            </div>
        </>
    )
}

export default Agent
