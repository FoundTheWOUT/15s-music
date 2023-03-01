import { useAuthentication } from "@/hooks";
import TokenInput from "../components/Token";

async function MusicList() {
  //   const { data } = useAuthentication();

  const data = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATE}/music/list`
  ).then((res) => res.text());

  console.log(data);

  //   if (data.role !== "master") {
  //     return <TokenInput />;
  //   }

  return <>{data}</>;
}

export default MusicList;
