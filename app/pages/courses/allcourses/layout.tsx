export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <nav className="flex flex-row justify-center pt-5">Search Bar</nav>
      {children}
    </>
  );
}
