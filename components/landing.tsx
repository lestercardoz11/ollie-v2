'use client';
import { JwtPayload } from '@supabase/supabase-js';
import Nav from './landing/nav';
import Hero from './landing/hero';
import Problem from './landing/problem';
import Features from './landing/features';
import Testimonials from './landing/testimonials';
import Solution from './landing/solution';
import FAQ from './landing/faq';
import Footer from './landing/footer';
import CTA from './landing/cta';

interface LandingProps {
  user: JwtPayload | null;
}

export default function Landing({ user }: LandingProps) {
  return (
    // Main container must handle scroll because body is overflow-hidden
    <div className='h-screen w-full bg-slate-50 flex flex-col font-sans overflow-y-auto overflow-x-hidden scroll-smooth'>
      <Nav user={user} />

      <main className='flex-1'>
        {/* Hero Section */}
        <Hero user={user} />

        {/* Problem vs Solution */}
        <Problem />

        {/* Feature Grid */}
        <Features />

        {/* How it Works Steps */}
        <Solution />

        {/* Testimonials Section */}
        <Testimonials />

        {/* FAQ Section */}
        <FAQ />

        {/* CTA */}
        {!user && <CTA />}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
