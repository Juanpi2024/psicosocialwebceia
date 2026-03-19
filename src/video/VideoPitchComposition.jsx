import React from 'react';
import { 
  AbsoluteFill, 
  interpolate, 
  useCurrentFrame, 
  useVideoConfig,
  Sequence,
  random,
  Audio
} from 'remotion';
import { Rocket, Code2, Sparkles, HeartPulse } from 'lucide-react';

const GalaxyBackground = () => {
    const frame = useCurrentFrame();
    const { height, width } = useVideoConfig();
    return (
        <AbsoluteFill style={{ 
            background: 'radial-gradient(circle at center, #1a1b26 0%, #0a0b12 100%)',
            overflow: 'hidden'
        }}>
            {[...Array(60)].map((_, i) => {
                const seed = i * 123;
                const x = random(seed) * width;
                const y = random(seed + 1) * height;
                const size = random(seed + 2) * 4;
                const opacity = interpolate(frame, [i, i + 30], [0, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
                return (
                    <div key={i} style={{ 
                        position: 'absolute', 
                        left: x, 
                        top: y, 
                        width: size, 
                        height: size, 
                        backgroundColor: '#fff', 
                        borderRadius: '50%',
                        opacity: opacity,
                        boxShadow: '0 0 10px rgba(255,255,255,0.4)'
                    }} />
                );
            })}
        </AbsoluteFill>
    );
}

const Slide = ({ title, subtitle, info, icon: Icon, color }) => {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
    const scale = interpolate(frame, [0, 15], [0.9, 1], { extrapolateRight: 'clamp' });
    const translateY = interpolate(frame, [0, 15], [20, 0], { extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            padding: '4rem',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <div style={{
                opacity,
                transform: `scale(${scale}) translateY(${translateY}px)`,
                textAlign: 'center',
                color: '#fff',
                width: '100%',
                maxWidth: '950px'
            }}>
                <div style={{ marginBottom: '2.5rem', display: 'inline-flex', padding: '2rem', borderRadius: '50%', background: `rgba(${color}, 0.1)`, border: `2px solid rgba(${color}, 0.3)`, boxShadow: `0 0 40px rgba(${color}, 0.2)` }}>
                    <Icon size={120} style={{ color: `rgb(${color})` }} />
                </div>
                <h1 style={{ fontSize: '100px', fontWeight: '900', textShadow: '0 0 30px rgba(255,255,255,0.3)', marginBottom: '1rem', letterSpacing: '-4px', lineHeight: 1 }}>
                    {title}
                </h1>
                <h2 style={{ fontSize: '40px', color: `rgb(${color})`, letterSpacing: '8px', marginBottom: '3rem', opacity: 0.9, fontWeight: 'bold' }}>
                    {subtitle}
                </h2>
                <p style={{ fontSize: '32px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.4', maxWidth: '850px', margin: '0 auto' }}>
                    {info}
                </p>
            </div>
        </AbsoluteFill>
    );
}

export const VideoPitchComposition = () => {
    const { fps } = useVideoConfig();
    return (
        <AbsoluteFill style={{ background: '#000' }}>
            <GalaxyBackground />
            
            {/* PISTA DE PODER TOTAL: Energía ROCK / SKA Infalible */}
            <Audio 
                src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" 
                volume={0.8}
            />

            <Sequence durationInFrames={fps * 4}>
                <Slide 
                    title="JUAN P. RAMÍREZ" 
                    subtitle="INNOVACIÓN EDUCATIVA" 
                    info="Transformando la administración escolar en una maquinaria de alta precisión."
                    icon={Rocket}
                    color="100, 255, 218"
                />
            </Sequence>

            <Sequence from={fps * 4} durationInFrames={fps * 4}>
                <Slide 
                    title="COSTO CERO" 
                    subtitle="INGENIERÍA INTELIGENTE" 
                    info="Uso estratégico de Cloud y Google Apps Script para eliminar la burocracia."
                    icon={Code2}
                    color="0, 210, 255"
                />
            </Sequence>

            <Sequence from={fps * 8} durationInFrames={fps * 4}>
                <Slide 
                    title="+$77.000.000" 
                    subtitle="GESTIÓN FINANCIERA" 
                    info="Adjudicación y ejecución de proyectos impecables sin observaciones fiscales."
                    icon={Sparkles}
                    color="255, 0, 127"
                />
            </Sequence>

            <Sequence from={fps * 12} durationInFrames={fps * 4}>
                <Slide 
                    title="IA MULTIMODAL" 
                    subtitle="VOZ E IMAGEN" 
                    info="Modelos de corrección masiva (SIMCE 2026) que erradican el agobio docente."
                    icon={Sparkles}
                    color="245, 158, 11"
                />
            </Sequence>

            <Sequence from={fps * 16} durationInFrames={fps * 5}>
                <Slide 
                    title="EL NEXO TECH" 
                    subtitle="SÍGUEME EL RITMO" 
                    info="Diseño de ecosistemas donde la tecnología impulsa el éxito institucional."
                    icon={HeartPulse}
                    color="52, 211, 153"
                />
            </Sequence>
        </AbsoluteFill>
    );
};
