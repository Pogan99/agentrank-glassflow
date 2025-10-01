import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  heroTitle: string;
  heroSubtitle: string;
}

export const AuthLayout = ({ children, heroTitle, heroSubtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Form */}
      <div className="flex-1 bg-white flex items-center justify-center px-4 py-12 lg:py-0">
        <div className="w-full max-w-[400px]">
          {children}
        </div>
      </div>

      {/* Right Panel - Hero Image */}
      <div className="flex-1 relative bg-cover bg-center min-h-[300px] lg:min-h-screen"
           style={{ backgroundImage: "url('/Loginnewlog.jpg')" }}>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-between p-8 lg:p-12 text-white">
          {/* Hero Text */}
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
              {heroTitle}
            </h2>
            <p className="text-lg lg:text-xl text-white/90 font-light">
              {heroSubtitle}
            </p>
          </div>

          {/* Trust Badge */}
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 self-start">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/80 to-cyan-400/80 border-2 border-white"
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-4 h-4 fill-yellow-400"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-medium">
                4.8 · Small decisions that create big results.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
