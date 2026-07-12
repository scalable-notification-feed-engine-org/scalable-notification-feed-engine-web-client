'use client'

export default function AuthWaveform() {
    const heights = [40, 70, 100, 65, 90, 45, 80, 55, 95, 60, 75, 50];

    return (
        <div className="flex items-end gap-0.75 h-24" aria-hidden="true">
            {heights.map((h, i) => (
                <span
                    key={i}
                    className="w-0.75 rounded-full bg-[#7C5CFC]/70 animate-voxa-wave"
                    style={{
                        height: `${h}%`,
                        animationDelay: `${i * 90}ms`,
                        animationDuration: `${1400 + (i % 4) * 220}ms`,
                    }}
                />
            ))}
        </div>
    );
}