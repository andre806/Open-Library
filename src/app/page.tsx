import Explore from "./components/Explore";

export default function Home() {
  return (
    <div>
      <a href="/pages/register">register</a><br />
      <a href="/pages/login">login</a><br />
      <a href="/pages/upload">upload</a><br />
      <a href="/pages/feedback">feedback</a>
      <Explore />
    </div>
  );
}