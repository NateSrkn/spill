export default function Header() {
  return (
    <header className="text-center flex flex-col items-center gap-4 py-8">
      <div className="text-sm tonal mix-blend-multiply inline-block w-max rounded-[16px] py-[.15em] px-2 ">
        Work In Progress
      </div>
      <h2 className="text-purple-900 font-semibold text-3xl">
        Introducing Spill
      </h2>
      <p className="text text-purple-800">
        Spill is the easiest way to <br /> split the bill with your friends
      </p>
    </header>
  );
}
