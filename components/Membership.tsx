import React from 'react';
import Button from './ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/Card';
import { cn } from '../lib/utils';

const membershipTiers = [
  {
    name: 'Creator',
    description: 'The essential Cabana experience.',
    features: [
      'Access to all club spaces',
      'Priority event invitations',
      'Creator networking portal',
      'Complimentary welcome beverage',
    ],
    cta: 'Select Creator',
    glowClasses: 'from-amber-400 to-yellow-600',
  },
  {
    name: 'Icon',
    description: 'Unparalleled luxury and access.',
    features: [
      'All Creator benefits',
      'Exclusive VIP lounge access',
      'Private concierge service',
      'Guaranteed reservations',
    ],
    cta: 'Become an Icon',
    glowClasses: 'from-[var(--brand-red)] to-fuchsia-600',
  },
];

const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-[var(--brand-red)]">
        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" />
    </svg>
);

const Membership: React.FC = () => {
  return (
    <section className="py-20 sm:py-32 px-4 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Choose Your Experience
          </h2>
          <p className="mt-4 text-lg text-neutral-400">
            Join a curated community of creators and connoisseurs at the heart of nightlife innovation.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {membershipTiers.map((tier) => (
            <div key={tier.name} className="group relative">
                <div className={cn(
                    "absolute -inset-0.5 bg-gradient-to-r rounded-2xl blur opacity-20 group-hover:opacity-75 transition duration-1000 group-hover:duration-200",
                    tier.glowClasses
                )}></div>
                <Card className="relative h-full flex flex-col transition-all duration-300 group-hover:scale-101">
                <CardHeader>
                    <CardTitle>{tier.name}</CardTitle>
                    <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    <ul className="space-y-3 text-neutral-300">
                    {tier.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                            <CheckIcon />
                            <span>{feature}</span>
                        </li>
                    ))}
                    </ul>
                </CardContent>
                <CardFooter>
                    <Button variant="primary" className="w-full">
                    {tier.cta}
                    </Button>
                </CardFooter>
                </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Membership;