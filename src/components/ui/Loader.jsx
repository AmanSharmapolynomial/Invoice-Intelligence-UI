export default function Loader() {
  return (
    <div className="relative w-16 h-16">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="absolute w-full h-full border-8 rounded-full animate-spin"
          style={{
            borderColor: "transparent transparent transparent #348355",
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
  );
}
