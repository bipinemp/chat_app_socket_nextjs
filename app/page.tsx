import Container from "@/components/Container";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export default async function Home() {
  const data = await getServerSession(authOptions);
  console.log(data);

  return (
    <main className="mt-10 flex flex-col gap-4">
      <Container>
        <h2 className="font-semibold">
          Hello, {data?.user?.username && data?.user?.username}
        </h2>
        <p>{data?.user.email && data?.user.email}</p>
      </Container>
    </main>
  );
}
