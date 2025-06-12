import LeftPanel from "../components/LeftPanel";
import RightPanel from "../components/forgot-right";
const forgotPasswordPage=()=>{
  return(
  <div className="flex h-screen">
    <LeftPanel />
    <RightPanel />
  </div>
  );
};
export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../messages/${locale}.json`)).default
    }
  };
}
export default forgotPasswordPage;