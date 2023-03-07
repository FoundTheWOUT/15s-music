import List from "./list";
import AuthenticationGuard from "@/app/components/authenticationGuard";

async function MusicList() {
  return (
    <AuthenticationGuard>
      {/* @ts-ignore */}
      <List />
    </AuthenticationGuard>
  );
}

export default MusicList;
