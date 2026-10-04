"use client";
import { useRive } from "@rive-app/react-canvas";
export default function RivePlayer({
  src,
  stateMachine,
}: {
  src: string;
  stateMachine?: string;
}) {
  const { RiveComponent } = useRive({
    src,
    stateMachines: stateMachine,
    autoplay: true,
  });
  return <RiveComponent style={{ width: "100%", height: "100%" }} />;
}
