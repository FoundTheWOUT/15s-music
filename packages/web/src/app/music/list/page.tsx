import List from "./list";
import AuthenticationGuard from "../../components/AuthenticationGuard";

async function MusicList() {
  return (
    <AuthenticationGuard>
      {/* @ts-ignore */}
      <List />
    </AuthenticationGuard>
  );
}

export default MusicList;
