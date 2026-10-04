import { StoryStudio } from "@/components/studio/story-studio";
export const metadata = {
  title: "Your first chapter",
  robots: { index: false, follow: false },
};
export default function Page() {
  return <StoryStudio />;
}
