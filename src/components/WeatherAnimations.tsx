interface WeatherAnimationProps {
  status: string;
}

export const WeatherAnimation = ({ status }: WeatherAnimationProps) => {
  const statusLower = status.toLowerCase();

  if (statusLower.includes('clear') || statusLower.includes('sun')) {
    return <SunAnimation />;
  }
  if (statusLower.includes('snow')) {
    return <SnowAnimation />;
  }
  if (statusLower.includes('rain') || statusLower.includes('drizzle')) {
    return <RainAnimation />;
  }
  if (statusLower.includes('cloud')) {
    return <CloudAnimation />;
  }
  if (statusLower.includes('mist') || statusLower.includes('fog') || statusLower.includes('haze')) {
    return <FogAnimation />;
  }

  return null;
};

const SunAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 right-1/4 w-32 h-32 animate-pulse">
        <div className="absolute inset-0 bg-yellow-300/20 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
        <div className="absolute inset-2 bg-yellow-200/15 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }}></div>
      </div>
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute top-1/4 right-1/4 w-1 h-16 bg-gradient-to-b from-yellow-200/40 to-transparent origin-bottom"
          style={{
            transform: `rotate(${i * 45}deg) translateY(-60px)`,
            animation: `sunRay 3s ease-in-out infinite`,
            animationDelay: `${i * 0.2}s`
          }}
        ></div>
      ))}
    </div>
  );
};

const SnowAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full opacity-80"
          style={{
            width: Math.random() * 8 + 4 + 'px',
            height: Math.random() * 8 + 4 + 'px',
            left: Math.random() * 100 + '%',
            top: -20 + 'px',
            animation: `snowfall ${Math.random() * 3 + 4}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`
          }}
        >
          <div className="absolute inset-0 bg-white rounded-full blur-sm"></div>
        </div>
      ))}
    </div>
  );
};

const RainAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute w-0.5 bg-gradient-to-b from-blue-200/60 to-transparent"
          style={{
            height: Math.random() * 20 + 15 + 'px',
            left: Math.random() * 100 + '%',
            top: -30 + 'px',
            animation: `rainfall ${Math.random() * 0.5 + 0.5}s linear infinite`,
            animationDelay: `${Math.random() * 2}s`
          }}
        ></div>
      ))}
    </div>
  );
};

const CloudAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: `${20 + i * 15}%`,
            animation: `cloudFloat ${15 + i * 5}s ease-in-out infinite`,
            animationDelay: `${i * 3}s`
          }}
        >
          <div className="flex items-center">
            <div className="w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
            <div className="w-20 h-20 bg-white/15 rounded-full blur-xl -ml-8"></div>
            <div className="w-14 h-14 bg-white/10 rounded-full blur-xl -ml-6"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const FogAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="absolute w-full bg-white/5 blur-2xl"
          style={{
            height: '80px',
            top: `${i * 25}%`,
            animation: `fogDrift ${10 + i * 3}s ease-in-out infinite`,
            animationDelay: `${i * 2}s`
          }}
        ></div>
      ))}
    </div>
  );
};
