import HarContainer from "./components/har/har-container";

export default function Home() {
  /*
   * We keep the main component in /components/har to make it compatible with
   * the Toolbox project layout.
   */
  return (
    <div className="min-h-screen p-8">
      <HarContainer />
    </div>
  );
}
