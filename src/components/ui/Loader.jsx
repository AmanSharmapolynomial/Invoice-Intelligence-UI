export default function Loader({className}) {
  return (
    <div className={''}>
      <div className={`${className} relative w-6 h-6`}>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="absolute w-full h-full border-4 rounded-full  animate-spin"
          style={{
            borderColor: "transparent transparent transparent #1E7944",
            animation: `spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite`,
            animationDelay: `${-i * 0.2}s`,
            opacity: Math.max(0.5, 1 - i * 0.2)
          }}
        />
      ))}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
    </div>
  );
}
