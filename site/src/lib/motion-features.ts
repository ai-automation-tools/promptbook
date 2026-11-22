// Loaded after first paint by App's <LazyMotion features>, so the animation engine is not in
// the entry bundle (PB-11). Until it arrives, m.* elements render without animating.
import { domAnimation } from 'motion/react';

export default domAnimation;
