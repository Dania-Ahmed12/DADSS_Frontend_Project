import Heading from "../../src/components/title/Heading";
import Dashboard from "../../src/components/dashboard/Index";
const Home = () => {
  return (
    <div className="h-full flex justify-center flex-col ">
      <Heading
        level={3}
        className="whitespace-nowrap p-0 ml-5 mb-5"
        text=" Welcome To DADSS Dashboard"
      />
      <Dashboard />
    </div>
  );
};
export default Home;
