import classNames from "classnames";

interface HeroTransitionProps {
  redirect: boolean;
}
export default function HeroTransition({ redirect }: HeroTransitionProps) {
  return (
    <div className="relative w-full z-50 flex flex-col justify-center ">
      <div
        id="targetDiv"
        className={classNames(
          "w-full flex flex-col justify-start gap-4 h-[100vh] px-14 py-[3.25rem] md:py-14 absolute bottom-0 bg-zinc-900 backdrop-blur-sm snap-center opacity-0 transition-opacity duration-1000 ",
          {
            "opacity-100": redirect,
          }
        )}
      />
    </div>
  );
}
