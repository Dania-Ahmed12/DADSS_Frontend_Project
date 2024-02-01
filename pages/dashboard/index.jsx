import Heading from "../../src/components/title/Heading";
import Dashboard from "../../src/components/dashboard/Index";
const Home = () => {
  return (
    <div className="h-full flex justify-center flex-col ">
      <Heading
        level={3}
        className="whitespace-nowrap p-10"
        text=" Welcome To DADSS Dashboard..."
      />
      <Dashboard />
    </div>
  );
};
export default Home;

export async function getServerSideProps(context) {
  return {
    props: {
      data: {
        title: "Dashboard",
      },
    },
  };
}
