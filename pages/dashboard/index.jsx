import Heading from "../../src/components/title/Heading";
import Dashboard from "../../src/components/dashboard/Index";
const Home = () => {
  return (
    <div className="h-full flex justify-center flex-col ">
      <Heading
        level={2}
        className="p-0 ml-5 mb-5"
        text=" DADSS Dashboard"
      />
      <Dashboard />
    </div>
  );
};
export default Home;
