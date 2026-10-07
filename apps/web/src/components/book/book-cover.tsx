import Image from "next/image";
export function BookCover({
  className = "",
  coverColor,
}: {
  className?: string;
  coverColor?: string;
}) {
  return (
    <div
      className={"book-cover " + className}
      style={coverColor ? { backgroundColor: coverColor } : undefined}
    >
      <div className="book-cover-inner">
        <span className="book-imprint">M E M O R A</span>
        <p className="book-cover-title">
          the days
          <br />
          <i>between.</i>
        </p>
        <div className="book-cover-photo">
          <Image
            src="/images/coast.jpg"
            alt=""
            fill
            sizes="(max-width: 600px) 230px, 320px"
            priority
          />
        </div>
        <span className="book-cover-edition">OUR SUMMER · VOLUME 01</span>
        <span className="book-cover-year">2026</span>
      </div>
    </div>
  );
}
