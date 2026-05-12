import { CTASection } from "@/components/cta-section";
import { BlogCard } from "@/components/blog-card";
import { FeatureCard } from "@/components/feature-card";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { InternshipCard } from "@/components/internship-card";
import { JobCard } from "@/components/job-card";
import { Navbar } from "@/components/navbar";
import { PlatformFeatureCard } from "@/components/platform-feature-card";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { features, guides, internships, jobs, platformModules } from "@/data/content";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />

        <section id="features" className="px-6 py-14 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <SectionHeading
                title="Everything you need to launch your career"
                description="From creating polished resumes to landing your first internship, GradBridge gives you practical tools and guidance."
              />
            </Reveal>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Reveal key={feature.title}>
                  <FeatureCard {...feature} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="student-life-platform" className="px-6 py-14 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <SectionHeading
                title="International Student Life Platform"
                description="Discover practical student-life modules that help you save, settle in, and stay financially on track."
              />
            </Reveal>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {platformModules.map((module) => (
                <Reveal key={module.title}>
                  <PlatformFeatureCard {...module} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="jobs" className="px-6 py-14 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <SectionHeading
                title="Student jobs across Australia"
                description="Explore student-friendly opportunities with flexible hours and clear application flows."
              />
            </Reveal>
            <div className="grid gap-5 md:grid-cols-2">
              {jobs.map((job) => (
                <Reveal key={job.role}>
                  <JobCard {...job} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="internships" className="px-6 py-14 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <SectionHeading
                title="Internships that build local experience"
                description="Gain practical experience in your field while studying and strengthen your graduate profile."
              />
            </Reveal>
            <div className="grid gap-5 md:grid-cols-3">
              {internships.map((internship) => (
                <Reveal key={internship.role}>
                  <InternshipCard {...internship} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="guides" className="px-6 py-14 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <SectionHeading
                title="Career guides for international students"
                description="Read practical guides designed for the Australian market and hiring process."
              />
            </Reveal>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {guides.map((guide) => (
                <Reveal key={guide.title}>
                  <BlogCard {...guide} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  );
}
