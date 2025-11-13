interface WeatherAnimationProps {
  status?: string | null;
}

export const WeatherAnimation = ({ status }: WeatherAnimationProps) => {
  // Safely handle status
  const getWeatherType = (status: string | null | undefined) => {
    if (!status) return 'clear';
    return String(status).toLowerCase().trim();
  };

  const weatherType = getWeatherType(status);
  console.log("WeathAnime status:", status);

  if (weatherType.includes('snow')) {
    return <SnowAnimation />;
  }
  if (weatherType.includes('rain') || weatherType.includes('drizzle')) {
    return <RainAnimation />;
  }
  if (weatherType.includes('cloud')) {
    return <CloudAnimation />;
  }
  if (weatherType.includes('clear') || weatherType.includes('sun')) {
    return <SunAnimation />;
  }
  if (weatherType.includes('mist') || weatherType.includes('fog') || weatherType.includes('haze')) {
    return <FogAnimation />;
  }

  return <CloudAnimation />;  // Default fallback
};

const SunAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/3 right-1/4 w-40 h-40">
        <div className="absolute inset-0 bg-yellow-300/30 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
        <div className="absolute inset-3 bg-yellow-200/25 rounded-full animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.3s' }}></div>
        <div className="absolute inset-6 bg-yellow-100/20 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '0.6s' }}></div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-yellow-200/40 rounded-full blur-xl animate-pulse" style={{ animationDuration: '2s' }}></div>
        </div>
      </div>

      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute top-1/3 right-1/4 w-1.5 h-20 bg-gradient-to-b from-yellow-300/50 via-yellow-200/30 to-transparent origin-bottom"
          style={{
            transform: `rotate(${i * 30}deg) translateY(-70px)`,
            animation: `sunRay 4s ease-in-out infinite`,
            animationDelay: `${i * 0.15}s`,
            left: '50%',
            top: '50%'
          }}
        ></div>
      ))}

      {[...Array(6)].map((_, i) => (
        <div
          key={`sparkle-${i}`}
          className="absolute w-2 h-2 bg-yellow-200/60 rounded-full"
          style={{
            top: `${20 + Math.random() * 60}%`,
            right: `${10 + Math.random() * 40}%`,
            animation: `sparkle ${2 + Math.random() * 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`
          }}
        ></div>
      ))}
    </div>
  );
};

const SnowAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(35)].map((_, i) => {
        const size = Math.random() * 6 + 3;
        const duration = Math.random() * 4 + 5;
        const delay = Math.random() * 8;

        return (
          <div
            key={i}
            className="absolute"
            style={{
              width: size + 'px',
              height: size + 'px',
              left: Math.random() * 100 + '%',
              top: -20 + 'px',
              animation: `snowfall ${duration}s linear infinite`,
              animationDelay: `${delay}s`
            }}
          >
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-white rounded-full opacity-90"></div>
              <div className="absolute inset-0 bg-white rounded-full blur-sm opacity-70"></div>
              <div className="absolute -inset-1 bg-blue-100/30 rounded-full blur-md"></div>
            </div>
          </div>
        );
      })}

      {[...Array(8)].map((_, i) => (
        <div
          key={`snowflake-${i}`}
          className="absolute text-white/40 text-xl"
          style={{
            left: Math.random() * 100 + '%',
            animation: `snowfallSpin ${Math.random() * 5 + 6}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
            top: -30 + 'px'
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
};

const RainAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(50)].map((_, i) => {
        const height = Math.random() * 25 + 20;
        const speed = Math.random() * 0.4 + 0.5;

        return (
          <div
            key={i}
            className="absolute w-0.5 bg-gradient-to-b from-blue-100/70 via-blue-200/50 to-transparent"
            style={{
              height: height + 'px',
              left: Math.random() * 100 + '%',
              top: -30 + 'px',
              animation: `rainfall ${speed}s linear infinite`,
              animationDelay: `${Math.random() * 2}s`,
              boxShadow: '0 0 1px rgba(147, 197, 253, 0.5)'
            }}
          ></div>
        );
      })}

      {[...Array(12)].map((_, i) => (
        <div
          key={`splash-${i}`}
          className="absolute w-1 h-1 bg-blue-200/40 rounded-full"
          style={{
            bottom: '10%',
            left: Math.random() * 100 + '%',
            animation: `rainsplash ${Math.random() * 1 + 1.5}s ease-out infinite`,
            animationDelay: `${Math.random() * 3}s`
          }}
        ></div>
      ))}
    </div>
  );
};

const CloudAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: `${10 + i * 18}%`,
            animation: `cloudFloat ${18 + i * 4}s ease-in-out infinite`,
            animationDelay: `${i * 2.5}s`,
            opacity: 0.6 - i * 0.08
          }}
        >
          <div className="flex items-center relative">
            <div className="w-20 h-20 bg-white/15 rounded-full blur-2xl"></div>
            <div className="w-28 h-28 bg-white/20 rounded-full blur-2xl -ml-10"></div>
            <div className="w-24 h-24 bg-white/15 rounded-full blur-2xl -ml-12"></div>
            <div className="w-16 h-16 bg-white/10 rounded-full blur-2xl -ml-8"></div>
          </div>
        </div>
      ))}

      {[...Array(3)].map((_, i) => (
        <div
          key={`small-cloud-${i}`}
          className="absolute"
          style={{
            top: `${25 + i * 25}%`,
            animation: `cloudFloat ${12 + i * 3}s ease-in-out infinite`,
            animationDelay: `${i * 4}s`,
            opacity: 0.4
          }}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white/10 rounded-full blur-xl"></div>
            <div className="w-16 h-16 bg-white/12 rounded-full blur-xl -ml-6"></div>
            <div className="w-10 h-10 bg-white/8 rounded-full blur-xl -ml-5"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const FogAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-full bg-gradient-to-r from-transparent via-white/8 to-transparent blur-2xl"
          style={{
            height: '100px',
            top: `${i * 18}%`,
            animation: `fogDrift ${12 + i * 2}s ease-in-out infinite`,
            animationDelay: `${i * 1.5}s`,
            opacity: 0.5 - i * 0.05
          }}
        ></div>
      ))}

      {[...Array(8)].map((_, i) => (
        <div
          key={`mist-${i}`}
          className="absolute bg-white/5 rounded-full blur-3xl"
          style={{
            width: `${120 + Math.random() * 80}px`,
            height: `${60 + Math.random() * 40}px`,
            top: `${Math.random() * 100}%`,
            left: `-${Math.random() * 50}%`,
            animation: `mistFloat ${15 + Math.random() * 10}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`
          }}
        ></div>
      ))}
    </div>
  );
};
