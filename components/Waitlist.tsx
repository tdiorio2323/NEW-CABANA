import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Label from './ui/Label';
import Textarea from './ui/Textarea';

const Waitlist: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [reason, setReason] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [error, setError] = useState('');
    const nameInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email) {
            setStatus('error');
            setError('Please fill in your name and email.');
            return;
        }
        setStatus('submitting');
        setError('');

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        console.log('Waitlist submission:', { name, email, reason });

        setStatus('success');
    };

    const handleCardClick = () => {
        if (status !== 'success' && nameInputRef.current) {
            nameInputRef.current.focus();
        }
    };

    return (
        <section id="waitlist-section" className="py-20 sm:py-32 px-4 bg-[#0A0A0A]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                        Join The Waitlist
                    </h2>
                    <p className="mt-4 text-lg text-neutral-400">
                        Be the first to know when memberships become available. Secure your spot in the future of nightlife.
                    </p>
                </div>

                <div className="mt-16 max-w-2xl mx-auto">
                     <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--brand-red)] to-fuchsia-600 rounded-2xl blur opacity-20 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                        <Card 
                            className="relative min-h-[540px] flex items-center justify-center overflow-hidden transition-all"
                            onClick={handleCardClick}
                            style={{ cursor: status !== 'success' ? 'text' : 'default' }}
                        >
                            {/* Success View */}
                            <div className={`absolute inset-0 flex flex-col items-center justify-center text-center p-8 transition-opacity duration-700 ease-in-out ${status === 'success' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                                <div 
                                    className="holographic-logo mb-6"
                                    style={{
                                        width: '150px',
                                        height: '150px',
                                    }}
                                ></div>
                                <h3 className="text-3xl font-bold text-white mb-2">Thank You!</h3>
                                <p className="text-neutral-300">
                                    You've been added to the waitlist. We'll be in touch soon.
                                </p>
                            </div>

                            {/* Form View */}
                            <div className={`w-full transition-opacity duration-700 ease-in-out ${status === 'success' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                                <form onSubmit={handleSubmit}>
                                    <CardHeader>
                                        <CardTitle>Reserve Your Place</CardTitle>
                                        <CardDescription>
                                            An exclusive invitation awaits. Provide your details below.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid w-full items-center gap-1.5">
                                            <Label htmlFor="name">Name</Label>
                                            <Input ref={nameInputRef} id="name" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} required disabled={status === 'submitting'} />
                                        </div>
                                        <div className="grid w-full items-center gap-1.5">
                                            <Label htmlFor="email">Email</Label>
                                            <Input type="email" id="email" placeholder="Your primary email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={status === 'submitting'} />
                                        </div>
                                        <div className="grid w-full items-center gap-1.5">
                                            <Label htmlFor="reason">Reason for joining (Optional)</Label>
                                            <Textarea id="reason" placeholder="Tell us why you'd be a great fit for Cabana..." value={reason} onChange={(e) => setReason(e.target.value)} disabled={status === 'submitting'} />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex-col items-start gap-4">
                                        <Button type="submit" variant="primary" className="w-full" disabled={status === 'submitting'}>
                                            {status === 'submitting' ? 'Submitting...' : 'Join Now'}
                                        </Button>
                                        {error && (
                                            <p className="text-sm text-red-400">
                                                {error}
                                            </p>
                                        )}
                                    </CardFooter>
                                </form>
                            </div>
                        </Card>
                     </div>
                </div>
            </div>
        </section>
    );
};

export default Waitlist;