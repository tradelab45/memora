"use client";
import dynamic from "next/dynamic";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
const Lottie = dynamic(
  () => import("lottie-react").then((module) => module.Lottie),
  { ssr: false },
);
const Rive = dynamic(() => import("./rive-player"), { ssr: false });
type Props = { label: string; poster: React.ReactNode } & (
  | { kind: "rive"; src: string; stateMachine?: string }
  | { kind: "lottie"; animationData: object }
);
// Supply self-hosted, licensed assets. Static artwork is used for reduced motion.
export function VectorAnimation(props: Props) {
  const reduced = useReducedMotion();
  return (
    <div role="img" aria-label={props.label}>
      {reduced ? (
        props.poster
      ) : props.kind === "rive" ? (
        <Rive src={props.src} stateMachine={props.stateMachine} />
      ) : (
        <Lottie src={props.animationData} autoplay loop={false} />
      )}
    </div>
  );
}
