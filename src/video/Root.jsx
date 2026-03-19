import { registerRoot, Composition } from 'remotion';
import { VideoPitchComposition } from './VideoPitchComposition';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="video-pitch-juan"
        component={VideoPitchComposition}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};

registerRoot(RemotionRoot);
