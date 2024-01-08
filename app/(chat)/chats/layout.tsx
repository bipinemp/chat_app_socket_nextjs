import getFriends from "@/app/actions/getFriends";
import Sidebar from "@/components/chats/Sidebar";

export default async function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const friends = await getFriends();
  console.log(friends);

  return (
    <div className="flex">
      <Sidebar friends={friends} />
      {children}
    </div>
  );
}
