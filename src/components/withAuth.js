import { useSelector } from "react-redux";
import { Result } from "antd";
import Link from "next/link";
export const withAuth = (WrappedComponent) => {
  const Wrapper = (props) => {
    const { isLoggedIn } = useSelector((store) => store.loginAuth);
    if (isLoggedIn) {
      return <WrappedComponent {...props} />;
    } else {
      return (
        <div className="h-screen flex justify-center items-center">
          <Result
            status="404"
            title="404"
            subTitle="Sorry, you're not an authorized user."
            extra={<Link href={"/"}>Back to Login</Link>}
          />
        </div>
      );
    }
  };

  return Wrapper;
};
