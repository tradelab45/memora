export const memories = [
  {
    id: "coast",
    image: "/images/coast.jpg",
    alt: "A quiet coastline with soft waves and warm light",
    date: "JUNE 14, 2026",
    title: "The long way home.",
    person: "Dad",
    caption: "We missed the turn and found our favourite place.",
  },
  {
    id: "mountains",
    image: "/images/mountains.jpg",
    alt: "Mountain peaks under a pale summer sky",
    date: "JUNE 22, 2026",
    title: "A little further.",
    person: "Arjun",
    caption: "One more hill, he said. It was never just one more.",
  },
  {
    id: "flowers",
    image: "/images/flowers.jpg",
    alt: "Soft pink blossoms on sunlit branches",
    date: "JUNE 28, 2026",
    title: "Ordinary, wonderful.",
    person: "Mom",
    caption: "She stopped to show me the flowers. I am glad I stopped too.",
  },
] as const;
export const people = [
  { name: "Mom", initial: "M", detail: "The little things.", color: "rose" },
  { name: "Dad", initial: "D", detail: "The long way home.", color: "sage" },
  { name: "Arjun", initial: "A", detail: "Every adventure.", color: "ochre" },
] as const;
